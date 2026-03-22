"use client"

import { useEffect, useState } from "react"
import { parseRawProducts, type RawProduct } from "@/lib/telegram-products"
import { getImagePath } from "@/lib/utils"
import type { Product } from "@/types/product"
import type { TelegramProduct } from "@/lib/telegram-products"

const PRODUCTS_JSON_URL = "/images/telegram-products/products.json"
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "")
const CATALOG_PUBLIC_URL =
  process.env.NEXT_PUBLIC_CATALOG_PUBLIC_URL ||
  (STRAPI_URL ? `${STRAPI_URL}/api/catalog/public` : null)

export interface UseTelegramProductsResult {
  products: TelegramProduct[]
  isLoading: boolean
  error: string | null
}

/** Клиентская загрузка TelegramProduct[] (для valentines-day и др.). */
export function useTelegramProducts(): UseTelegramProductsResult {
  const [products, setProducts] = useState<TelegramProduct[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch(PRODUCTS_JSON_URL)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const raw: RawProduct[] = await res.json()
        if (!Array.isArray(raw)) throw new Error("Invalid products data")
        if (cancelled) return
        setProducts(parseRawProducts(raw))
        setError(null)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Не удалось загрузить товары")
          setProducts([])
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { products, isLoading, error }
}

const DEFAULT_DELIVERY: Product["delivery"] = {
  intervals: [
    { label: "Трёхчасовой", moscow: "Бесплатно", outsideMkad: "399 + 40 ₽/км" },
    { label: "Часовой", moscow: "499 ₽", outsideMkad: "699 + 40 ₽/км" },
    { label: "Точное время", moscow: "999 ₽", outsideMkad: "1199 + 40 ₽/км" },
  ],
}

const DEFAULT_CARE =
  "Перед тем, как поставить цветок в воду, обрежьте 2-3 см стебля под углом 45 градусов. Подрезайте стебли при каждой замене воды. Ежедневно меняйте воду и мойте вазу. Найдите для вазы прохладное место вдали от отопительных приборов и прямых солнечных лучей. Доливайте воду по мере поглощения."

const DEFAULT_COMPOSITION: Product["composition"] = {
  flowers: ["Сезонные цветы"],
  packaging: ["Дизайнерская упаковка", "Лента"],
  height: "около 40 см",
  diameter: "около 25 см",
}

const DEFAULT_CATEGORY: Product["category"] = { name: "Букеты", slug: "bouquets" }
const MONO_CATEGORY: Product["category"] = { name: "Монобукеты", slug: "mono" }

const CATEGORY_BY_TYPE: Record<string, Product["category"]> = {
  букет: DEFAULT_CATEGORY,
  композиция: { name: "Композиции", slug: "compositions" },
  корзина: { name: "Корзины", slug: "baskets" },
  коробка: { name: "Коробочки", slug: "boxes" },
}

type AnyRecord = Record<string, unknown>

type PublicCatalogResponse = {
  ok?: boolean
  data?: {
    products?: unknown[]
  }
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.map((item) => String(item)).filter(Boolean)
}

function toDelivery(value: unknown): Product["delivery"] {
  const maybeDelivery = value && typeof value === "object" ? (value as AnyRecord) : null
  const intervals = maybeDelivery?.intervals
  if (!Array.isArray(intervals) || intervals.length === 0) return DEFAULT_DELIVERY

  const normalized = intervals
    .map((interval) => {
      const row = interval && typeof interval === "object" ? (interval as AnyRecord) : null
      if (!row) return null
      const label = String(row.label ?? "").trim()
      const moscow = String(row.moscow ?? "").trim()
      const outsideMkad =
        typeof row.outsideMkad === "string" && row.outsideMkad.trim()
          ? row.outsideMkad.trim()
          : undefined
      if (!label || !moscow) return null
      return { label, moscow, outsideMkad }
    })
    .filter((row): row is { label: string; moscow: string; outsideMkad?: string } => Boolean(row))

  return normalized.length > 0 ? { intervals: normalized } : DEFAULT_DELIVERY
}

function normalizeCatalogProduct(value: unknown, index: number): Product | null {
  if (!value || typeof value !== "object") return null
  const row = value as AnyRecord

  const id = String(row.id ?? row.documentId ?? `catalog-${index}`)
  const slug = String(row.slug ?? "").trim() || id
  const name = String(row.name ?? "").trim()
  const sku = String(row.sku ?? "").trim() || `CAT-${String(index).padStart(4, "0")}`
  const originalPrice = toNumber(row.originalPrice, NaN)

  if (!name) return null

  const categoryValue = row.category && typeof row.category === "object" ? (row.category as AnyRecord) : null
  const category = {
    name: String(categoryValue?.name ?? "").trim() || DEFAULT_CATEGORY.name,
    slug: String(categoryValue?.slug ?? "").trim() || DEFAULT_CATEGORY.slug,
  }

  const images = Array.isArray(row.images)
    ? row.images.map((image) => String(image)).filter(Boolean)
    : []

  const sizes = Array.isArray(row.sizes)
    ? row.sizes
        .map((size, sizeIndex) => {
          const sizeRow = size && typeof size === "object" ? (size as AnyRecord) : null
          if (!sizeRow) return null
          const label = String(sizeRow.label ?? "").trim()
          if (!label) return null
          return {
            id: String(sizeRow.id ?? `${slug}-size-${sizeIndex}`),
            label,
            price: toNumber(sizeRow.price),
            available: Boolean(sizeRow.available ?? true),
          }
        })
        .filter((size): size is NonNullable<typeof size> => Boolean(size))
    : undefined

  const options = Array.isArray(row.options)
    ? row.options
        .map((option, optionIndex) => {
          const optionRow = option && typeof option === "object" ? (option as AnyRecord) : null
          if (!optionRow) return null
          const optionName = String(optionRow.name ?? "").trim()
          if (!optionName) return null
          const description =
            typeof optionRow.description === "string" && optionRow.description.trim()
              ? optionRow.description.trim()
              : undefined
          return {
            id: String(optionRow.id ?? `${slug}-option-${optionIndex}`),
            name: optionName,
            price: toNumber(optionRow.price),
            description,
          }
        })
        .filter((option): option is NonNullable<typeof option> => Boolean(option))
    : undefined

  const compositionValue =
    row.composition && typeof row.composition === "object" ? (row.composition as AnyRecord) : null
  const composition: Product["composition"] = {
    flowers: toStringArray(compositionValue?.flowers),
    packaging: toStringArray(compositionValue?.packaging),
    height: String(compositionValue?.height ?? "").trim() || DEFAULT_COMPOSITION.height,
    diameter: String(compositionValue?.diameter ?? "").trim() || DEFAULT_COMPOSITION.diameter,
  }
  if (composition.flowers.length === 0) composition.flowers = DEFAULT_COMPOSITION.flowers
  if (composition.packaging.length === 0) composition.packaging = DEFAULT_COMPOSITION.packaging

  return {
    id,
    slug,
    name,
    sku,
    price: toNumber(row.price),
    ...(Number.isFinite(originalPrice) ? { originalPrice } : {}),
    inStock: Boolean(row.inStock ?? true),
    images: images.length > 0 ? images : [getImagePath("/placeholder.webp")],
    sizes: sizes && sizes.length > 0 ? sizes : undefined,
    category,
    description: String(row.description ?? "").trim(),
    composition,
    delivery: toDelivery(row.delivery),
    careInstructions:
      String(row.careInstructions ?? "").trim() || DEFAULT_CARE,
    options: options && options.length > 0 ? options : undefined,
    occasions: toStringArray(row.occasions),
  }
}

async function loadProductsFromCatalogApi(): Promise<Product[]> {
  if (!CATALOG_PUBLIC_URL) return []
  const response = await fetch(CATALOG_PUBLIC_URL)
  if (!response.ok) {
    throw new Error(`Catalog API HTTP ${response.status}`)
  }

  const payload = (await response.json()) as PublicCatalogResponse
  const rawProducts = payload?.data?.products
  if (!Array.isArray(rawProducts)) return []

  const normalized = rawProducts
    .map((product, index) => normalizeCatalogProduct(product, index))
    .filter((product): product is Product => Boolean(product))

  return normalized
}

async function loadTelegramProductsFromJson(): Promise<Product[]> {
  const res = await fetch(PRODUCTS_JSON_URL)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const raw: RawProduct[] = await res.json()
  if (!Array.isArray(raw)) throw new Error("Invalid products data")
  const tg = parseRawProducts(raw)
  return telegramProductsToProducts(tg)
}

function normalizeType(type?: string): string {
  return (type ?? "").trim().toLowerCase()
}

function splitCsvField(value?: string): string[] {
  if (!value) return []
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
}

function normalizeFlowerEntry(entry: string): string {
  return entry.replace(/\s*[-–—]?\s*\d+\s*$/, "").trim()
}

function getCompositionFlowers(composition?: string): string[] {
  return splitCsvField(composition).map(normalizeFlowerEntry).filter(Boolean)
}

function isMonoBouquetByComposition(tg: TelegramProduct): boolean {
  if (normalizeType(tg.type) !== "букет") return false
  return splitCsvField(tg.composition).length === 1
}

function resolveCategory(tg: TelegramProduct): Product["category"] {
  if (isMonoBouquetByComposition(tg)) return MONO_CATEGORY
  return CATEGORY_BY_TYPE[normalizeType(tg.type)] ?? DEFAULT_CATEGORY
}

function telegramToProduct(tg: TelegramProduct, index: number): Product {
  const slug = `tg-${index}`
  const price = tg.sizes?.[0]?.price ?? tg.price ?? 0
  const flowers = getCompositionFlowers(tg.composition)
  const packaging = splitCsvField(tg.packaging)
  const occasions: string[] = ["birthday", "just-because"]
  if (tg.tag === "#14февраля") occasions.push("valentines-day")
  return {
    id: slug,
    slug,
    name: tg.name ?? "Букет",
    sku: `TG-${String(index).padStart(4, "0")}`,
    price,
    inStock: tg.inStock ?? true,
    images: tg.images.map((p) => getImagePath(p)),
    sizes: tg.sizes?.map((s) => ({
      id: s.id,
      label: s.label,
      price: s.price,
      available: s.available,
    })),
    category: resolveCategory(tg),
    description: tg.description ?? "",
    composition: {
      flowers: flowers.length > 0 ? flowers : DEFAULT_COMPOSITION.flowers,
      packaging: packaging.length > 0 ? packaging : DEFAULT_COMPOSITION.packaging,
      height: DEFAULT_COMPOSITION.height,
      diameter: DEFAULT_COMPOSITION.diameter,
    },
    delivery: DEFAULT_DELIVERY,
    careInstructions: DEFAULT_CARE,
    occasions,
  }
}

export function telegramProductsToProducts(tg: TelegramProduct[]): Product[] {
  return tg.map((p, i) => telegramToProduct(p, i))
}

export interface UseProductsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
}

function mergeCatalogWithLegacyProducts(legacy: Product[], catalog: Product[]): Product[] {
  if (legacy.length === 0) return catalog
  if (catalog.length === 0) return legacy

  const seen = new Set<string>()
  const result: Product[] = []

  const pushUnique = (product: Product) => {
    const key = product.slug || product.id
    if (!key || seen.has(key)) return
    seen.add(key)
    result.push(product)
  }

  // Keep legacy catalog as baseline and append CMS-only products.
  legacy.forEach(pushUnique)
  catalog.forEach(pushUnique)

  return result
}

/** Клиентская загрузка продуктов из JSON. */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      let legacyError: unknown = null
      let catalogError: unknown = null
      let hasAnyProducts = false
      let legacyProducts: Product[] = []

      try {
        legacyProducts = await loadTelegramProductsFromJson()
        if (cancelled) return
        if (legacyProducts.length > 0) {
          setProducts(legacyProducts)
          setError(null)
          hasAnyProducts = true
        }
      } catch (e) {
        legacyError = e
      }

      if (CATALOG_PUBLIC_URL) {
        try {
          const catalogProducts = await loadProductsFromCatalogApi()
          if (cancelled) return
          if (catalogProducts.length > 0) {
            setProducts(mergeCatalogWithLegacyProducts(legacyProducts, catalogProducts))
            setError(null)
            hasAnyProducts = true
          }
        } catch (e) {
          catalogError = e
        }
      }

      if (!cancelled) {
        if (!hasAnyProducts) {
          const legacyMessage =
            legacyError instanceof Error ? legacyError.message : "Не удалось загрузить товары"
          const catalogMessage =
            catalogError instanceof Error ? ` (catalog: ${catalogError.message})` : ""
          setError(`${legacyMessage}${catalogMessage}`)
          setProducts([])
        }
        setIsLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return { products, isLoading, error }
}

/** Возвращает продукт по slug (требует загрузки продуктов через useProducts). */
export function getProductBySlug(products: Product[], slug: string): Product | undefined {
  const bySlug = products.find((product) => product.slug === slug)
  if (bySlug) return bySlug

  const isLegacyTelegramList =
    products.length > 0 &&
    products.every((product) => /^tg-\d+$/.test(product.slug))
  if (!isLegacyTelegramList) return undefined

  const match = slug.match(/^tg-(\d+)$/)
  if (!match) return undefined
  const index = parseInt(match[1], 10)
  return products[index] ?? undefined
}
