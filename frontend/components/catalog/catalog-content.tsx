"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { Filter, Search, SearchX, X } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import {
  QuickOrderDialog,
  type QuickOrderProduct,
} from "@/components/quick-order-dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { productMatchesSearch } from "@/lib/search-products"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useCart } from "@/store/cart-store"
import type { Product } from "@/types/product"
import { getCurrentOccasions } from "@/lib/occasions"
import { CatalogFilters } from "./catalog-filters"
import { cn } from "@/lib/utils"

const ITEMS_PER_PAGE = 12
const SORT_OPTIONS = [
  { value: "default", label: "По умолчанию" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "name-asc", label: "По названию А–Я" },
] as const

export interface CatalogFiltersState {
  categorySlugs: string[]
  occasionSlugs: string[]
  priceMin: number
  priceMax: number
  flowerNames: string[]
}

function defaultFilters(facets: ReturnType<typeof extractFacets>): CatalogFiltersState {
  return {
    categorySlugs: [],
    occasionSlugs: [],
    priceMin: facets.priceMin,
    priceMax: facets.priceMax,
    flowerNames: [],
  }
}

function extractFacets(products: Product[]) {
  const categoriesMap = new Map<string, string>()
  const flowersSet = new Set<string>()
  let priceMin = Infinity
  let priceMax = 0
  for (const p of products) {
    categoriesMap.set(p.category.slug, p.category.name)
    p.composition.flowers.forEach((f) => flowersSet.add(f))
    if (p.price != null) {
      priceMin = Math.min(priceMin, p.price)
      priceMax = Math.max(priceMax, p.price)
    }
  }
  return {
    categories: Array.from(categoriesMap.entries()).map(([slug, name]) => ({ slug, name })),
    occasions: getCurrentOccasions().map((o) => ({ slug: o.slug, name: o.name })),
    flowers: Array.from(flowersSet).sort(),
    priceMin: priceMin === Infinity ? 0 : priceMin,
    priceMax: priceMax || 100000,
  }
}

interface CatalogContentProps {
  products: Product[]
  /** Заголовок страницы (например для /catalog/[slug]). Если не передан — выводится из фильтров или «Все товары». */
  pageTitle?: string
}

function getValidCategorySlugsFromUrl(
  searchParams: ReturnType<typeof useSearchParams>,
  categories: { slug: string }[]
): string[] {
  const slugs = searchParams.getAll("category")
  return slugs.filter((slug) => categories.some((c) => c.slug === slug))
}

function getValidOccasionSlugsFromUrl(
  searchParams: ReturnType<typeof useSearchParams>,
  occasions: { slug: string }[]
): string[] {
  const slugs = searchParams.getAll("occasion")
  return slugs.filter((slug) => occasions.some((o) => o.slug === slug))
}

function getEmptyStateMessage(
  filters: CatalogFiltersState,
  facets: ReturnType<typeof extractFacets>
): { title: string; description: string } {
  const hasOccasion = filters.occasionSlugs.length > 0
  const hasCategory = filters.categorySlugs.length > 0
  if (hasOccasion && filters.occasionSlugs.length === 1) {
    const occ = facets.occasions.find((o) => o.slug === filters.occasionSlugs[0])
    const name = occ?.name ?? ""
    // Форма «свадебных нет» для поводов
    const shortTitle =
      occ?.slug === "wedding"
        ? "Свадебных нет"
        : occ?.slug === "birthday"
          ? "Ко Дню рождения нет"
          : occ?.slug === "march-8"
            ? "К 8 марта нет"
            : `${name} нет`
    return {
      title: shortTitle,
      description: "Но могут подойти другие варианты:",
    }
  }
  if (hasCategory && filters.categorySlugs.length === 1) {
    const cat = facets.categories.find((c) => c.slug === filters.categorySlugs[0])
    const name = cat?.name ?? ""
    return {
      title: `В категории «${name}» ничего не найдено`,
      description: "Но могут подойти другие варианты:",
    }
  }
  return {
    title: "По вашему запросу ничего не найдено",
    description: "Но могут подойти другие варианты:",
  }
}

function buildCatalogSearchParams(filters: CatalogFiltersState, page = 1): string {
  const params = new URLSearchParams()
  filters.categorySlugs.forEach((s) => params.append("category", s))
  filters.occasionSlugs.forEach((s) => params.append("occasion", s))
  if (page > 1) params.set("page", String(page))
  const q = params.toString()
  return q ? `?${q}` : ""
}

export function CatalogContent({ products, pageTitle }: CatalogContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useIsMobile()
  const { addItem, openCart } = useCart()
  const [search, setSearch] = useState("")
  const [quickOrderProduct, setQuickOrderProduct] = useState<QuickOrderProduct | null>(null)
  const [quickOrderOpen, setQuickOrderOpen] = useState(false)
  const [sort, setSort] = useState<string>("default")
  const facets = useMemo(() => extractFacets(products), [products])
  const categorySlugsFromUrl = useMemo(
    () => getValidCategorySlugsFromUrl(searchParams, facets.categories),
    [searchParams, facets.categories]
  )
  const occasionSlugsFromUrl = useMemo(
    () => getValidOccasionSlugsFromUrl(searchParams, facets.occasions),
    [searchParams, facets.occasions]
  )
  const pageFromUrl = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
  const [filters, setFilters] = useState<CatalogFiltersState>(() => {
    const f = extractFacets(products)
    const base = defaultFilters(f)
    const catValid = getValidCategorySlugsFromUrl(searchParams, f.categories)
    const occValid = getValidOccasionSlugsFromUrl(searchParams, f.occasions)
    return {
      ...base,
      categorySlugs: catValid.length > 0 ? catValid : base.categorySlugs,
      occasionSlugs: occValid.length > 0 ? occValid : base.occasionSlugs,
    }
  })
  const [page, setPage] = useState(pageFromUrl)

  // Синхронизация фильтров при изменении URL (клиентская навигация)
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      categorySlugs: categorySlugsFromUrl,
      occasionSlugs: occasionSlugsFromUrl,
    }))
    setPage(1)
    const merged = { ...filters, categorySlugs: categorySlugsFromUrl, occasionSlugs: occasionSlugsFromUrl }
    router.replace(`${pathname}${buildCatalogSearchParams(merged as CatalogFiltersState, 1)}`)
  }, [categorySlugsFromUrl.join(","), occasionSlugsFromUrl.join(",")])

  // Синхронизация страницы из URL (возврат по кнопке «Назад»)
  useEffect(() => {
    const p = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1)
    setPage(p)
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (filters.categorySlugs.length && !filters.categorySlugs.includes(p.category.slug))
        return false
      if (filters.occasionSlugs.length) {
        const productOccasions = p.occasions ?? []
        const hasOccasion = filters.occasionSlugs.some((slug) => productOccasions.includes(slug))
        if (!hasOccasion) return false
      }
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false
      if (filters.flowerNames.length) {
        const hasFlower = p.composition.flowers.some((f) => filters.flowerNames.includes(f))
        if (!hasFlower) return false
      }
      if (search.trim()) {
        if (!productMatchesSearch(p, search.trim())) return false
      }
      return true
    })
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    return list
  }, [products, filters, search, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, page])

  // Альтернативы — когда нет результатов по фильтру: показываем другие букеты без строгих фильтров
  const alternatives = useMemo(() => {
    if (filtered.length > 0) return []
    if (products.length === 0) return []
    // Убираем occasion и category, оставляем цену и цветы — показываем «другие варианты»
    let list = products.filter((p) => {
      if (p.price < filters.priceMin || p.price > filters.priceMax) return false
      if (filters.flowerNames.length) {
        const hasFlower = p.composition.flowers.some((f) => filters.flowerNames.includes(f))
        if (!hasFlower) return false
      }
      if (search.trim()) {
        if (!productMatchesSearch(p, search.trim())) return false
      }
      return true
    })
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price)
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price)
    else if (sort === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    return list.slice(0, ITEMS_PER_PAGE)
  }, [products, filters, search, sort, filtered.length])

  const hasActiveFilters =
    filters.categorySlugs.length > 0 ||
    filters.occasionSlugs.length > 0 ||
    filters.flowerNames.length > 0 ||
    filters.priceMin !== facets.priceMin ||
    filters.priceMax !== facets.priceMax

  const hasPriceFilter =
    filters.priceMin !== facets.priceMin || filters.priceMax !== facets.priceMax

  const resetPriceFilter = () => {
    setFilters((prev) => ({ ...prev, priceMin: facets.priceMin, priceMax: facets.priceMax }))
    setPage(1)
  }

  const syncFiltersToUrl = (next: CatalogFiltersState, pageNum = 1) => {
    const query = buildCatalogSearchParams(next, pageNum)
    router.replace(`${pathname}${query}`)
  }

  const goToPage = (p: number) => {
    const clamped = Math.max(1, Math.min(p, totalPages))
    setPage(clamped)
    syncFiltersToUrl(filters, clamped)
  }

  // Ограничить страницу, если в URL указана несуществующая (после смены фильтров)
  useEffect(() => {
    if (page > totalPages && totalPages >= 1) {
      const clamped = totalPages
      setPage(clamped)
      syncFiltersToUrl(filters, clamped)
    }
  }, [totalPages, page])

  const resetFilters = () => {
    const next = defaultFilters(facets)
    setFilters(next)
    setPage(1)
    syncFiltersToUrl(next)
  }

  const filtersPanel = (
    <CatalogFilters
      facets={facets}
      filters={filters}
      onFiltersChange={(next: CatalogFiltersState) => {
        setFilters(next)
        setPage(1)
        syncFiltersToUrl(next)
      }}
    />
  )

  return (
    <div className="mt-8">
      {/* Заголовок */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
          {pageTitle ??
            (filters.occasionSlugs.length === 1
              ? facets.occasions.find((o) => o.slug === filters.occasionSlugs[0])?.name ?? "Каталог"
              : filters.categorySlugs.length === 1
                ? facets.categories.find((c) => c.slug === filters.categorySlugs[0])?.name ?? "Каталог"
                : "Все товары")}
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Сайдбар фильтров — десктоп: только панель (чипсы вынесены в контент) */}
        {!isMobile && (
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl bg-card p-4 shadow-sm border border-border custom-scrollbar">
              <h2 className="font-serif text-lg text-foreground mb-4">Фильтры</h2>
              {filtersPanel}
            </div>
          </aside>
        )}

        <div className="flex-1 min-w-0">
          {/* Тулбар: поиск, сортировка, фильтры (мобила) */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию или цветам..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-9 rounded-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={sort} onValueChange={(v) => setSort(v)}>
                <SelectTrigger className="w-[180px] rounded-full">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isMobile && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full shrink-0">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85vw] sm:max-w-sm overflow-y-auto p-6">
                    <h2 className="font-serif text-lg text-foreground mb-4">Фильтры</h2>
                    {filtersPanel}
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>

          {/* Статус-бар: Счётчик + Активные фильтры (всегда занимает место, чтобы не прыгало) */}
          <div
            className={cn(
              "mb-6 flex gap-2 items-center min-h-[2.5rem]",
              isMobile
                ? "overflow-x-auto overflow-y-hidden -mx-1 px-1 scrollbar-hide"
                : "flex-wrap"
            )}
          >
            <span className="text-sm text-muted-foreground shrink-0 mr-2">
              Найдено: {filtered.length}
            </span>

            {/* Разделитель (вертикальная черта), если есть фильтры */}
            {hasActiveFilters && (
              <div className="w-px h-4 bg-border shrink-0 mx-1 hidden sm:block" />
            )}

            <div
              className={cn(
                "flex gap-2 items-center",
                isMobile ? "flex-nowrap" : "flex-wrap"
              )}
            >
              {filters.categorySlugs.map((slug) => {
                const cat = facets.categories.find((c) => c.slug === slug)
                return (
                  <span
                    key={`cat-${slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm shrink-0 whitespace-nowrap"
                  >
                    {cat?.name ?? slug}
                    <button
                      type="button"
                      aria-label="Убрать фильтр"
                      onClick={() => {
                        const next = {
                          ...filters,
                          categorySlugs: filters.categorySlugs.filter((s) => s !== slug),
                        }
                        setFilters(next)
                        setPage(1)
                        syncFiltersToUrl(next)
                      }}
                      className="hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )
              })}
              {filters.occasionSlugs.map((slug) => {
                const occ = facets.occasions.find((o) => o.slug === slug)
                return (
                  <span
                    key={`occ-${slug}`}
                    className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm shrink-0 whitespace-nowrap"
                  >
                    {occ?.name ?? slug}
                    <button
                      type="button"
                      aria-label="Убрать фильтр"
                      onClick={() => {
                        const next = {
                          ...filters,
                          occasionSlugs: filters.occasionSlugs.filter((s) => s !== slug),
                        }
                        setFilters(next)
                        setPage(1)
                        syncFiltersToUrl(next)
                      }}
                      className="hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )
              })}
              {filters.flowerNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm shrink-0 whitespace-nowrap"
                >
                  {name}
                  <button
                    type="button"
                    aria-label="Убрать фильтр"
                    onClick={() =>
                      setFilters((prev) => ({
                        ...prev,
                        flowerNames: prev.flowerNames.filter((f) => f !== name),
                      }))
                    }
                    className="hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              {hasPriceFilter && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm shrink-0">
                  {filters.priceMin.toLocaleString("ru-RU")} – {filters.priceMax.toLocaleString("ru-RU")} ₽
                  <button
                    type="button"
                    aria-label="Убрать фильтр по цене"
                    onClick={resetPriceFilter}
                    className="hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              )}
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground hover:text-foreground shrink-0 h-7 px-3"
                  onClick={resetFilters}
                >
                  Сбросить все
                </Button>
              )}
            </div>
          </div>

          {/* Сетка или пустое состояние с альтернативами */}
          {paginated.length === 0 ? (
            <div className="space-y-8">
              <Empty className="border-0 py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                  <SearchX className="size-6" />
                </EmptyMedia>
                  <EmptyTitle>
                    {hasActiveFilters ? getEmptyStateMessage(filters, facets).title : "Ничего не найдено"}
                  </EmptyTitle>
                  <EmptyDescription>
                    {hasActiveFilters
                      ? getEmptyStateMessage(filters, facets).description
                      : "Попробуйте изменить фильтры или поисковый запрос."}
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline" className="rounded-full" onClick={resetFilters}>
                    Сбросить фильтры
                  </Button>
                </EmptyContent>
              </Empty>

              {/* Альтернативные варианты — показываем, когда есть активные фильтры и есть что показать */}
              {alternatives.length > 0 && (
                <>
                  <h2 className="font-serif text-xl text-foreground">Другие варианты</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {alternatives.map((product) => (
                      <ProductCard
                        key={product.id}
                        slug={product.slug}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        image={product.images[0] ?? "/placeholder.svg"}
                        flowers={product.composition.flowers.join(", ")}
                        tag={
                          product.originalPrice != null && product.originalPrice > product.price
                            ? "sale"
                            : undefined
                        }
                        href={`/item/${product.slug}`}
                        onAddToCart={({ slug, name, price, image }) => {
                          addItem({ slug, name, price, image })
                          openCart()
                        }}
                        onQuickOrder={(payload) => {
                          setQuickOrderProduct(payload)
                          setQuickOrderOpen(true)
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {paginated.map((product) => (
                  <ProductCard
                    key={product.id}
                    slug={product.slug}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.images[0] ?? "/placeholder.svg"}
                    flowers={product.composition.flowers.join(", ")}
                    tag={
                      product.originalPrice != null && product.originalPrice > product.price
                        ? "sale"
                        : undefined
                    }
                    href={`/item/${product.slug}`}
                    onAddToCart={({ slug, name, price, image }) => {
                      addItem({ slug, name, price, image })
                      openCart()
                    }}
                    onQuickOrder={(payload) => {
                      setQuickOrderProduct(payload)
                      setQuickOrderOpen(true)
                    }}
                  />
                ))}
              </div>

              {/* Пагинация */}
              {totalPages > 1 && (
                <nav className="mt-10 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href={page > 1 ? `${pathname}${buildCatalogSearchParams(filters, page - 1)}` : "#"}
                          onClick={(e) => {
                            e.preventDefault()
                            if (page > 1) goToPage(page - 1)
                          }}
                          className={cn(page <= 1 && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink
                            href={`${pathname}${buildCatalogSearchParams(filters, p)}`}
                            onClick={(e) => {
                              e.preventDefault()
                              goToPage(p)
                            }}
                            isActive={p === page}
                          >
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          href={page < totalPages ? `${pathname}${buildCatalogSearchParams(filters, page + 1)}` : "#"}
                          onClick={(e) => {
                            e.preventDefault()
                            if (page < totalPages) goToPage(page + 1)
                          }}
                          className={cn(page >= totalPages && "pointer-events-none opacity-50")}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </nav>
              )}
            </>
          )}
        </div>
      </div>

      <QuickOrderDialog
        open={quickOrderOpen}
        onOpenChange={setQuickOrderOpen}
        product={quickOrderProduct}
      />
    </div>
  )
}
