"use client"

import { useEffect, useState } from "react"
import { parseRawProducts, type RawProduct } from "@/lib/telegram-products"
import { getImagePath } from "@/lib/utils"
import type { Product } from "@/types/product"
import type { TelegramProduct } from "@/lib/telegram-products"

const PRODUCTS_JSON_URL = "/images/telegram-products/products.json"

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

/** Клиентская загрузка продуктов из JSON. */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
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
        const tg = parseRawProducts(raw)
        setProducts(telegramProductsToProducts(tg))
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

/** Возвращает продукт по slug (требует загрузки продуктов через useProducts). */
export function getProductBySlug(products: Product[], slug: string): Product | undefined {
  const match = slug.match(/^tg-(\d+)$/)
  if (!match) return undefined
  const index = parseInt(match[1], 10)
  return products[index] ?? undefined
}
