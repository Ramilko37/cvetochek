"use client"

import { useProductsContext } from "@/components/products-provider"
import { CatalogContent } from "./catalog-content"

const CatalogFallback = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-10 w-64 rounded-full bg-muted" />
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[3/4] rounded-2xl bg-muted" />
      ))}
    </div>
  </div>
)

interface CatalogWithProductsProps {
  /** slug категории для /catalog/[slug] — фильтрует товары */
  categorySlug?: string
  /** Заголовок страницы (для /catalog/[slug]) */
  pageTitle?: string
}

export function CatalogWithProducts({ categorySlug, pageTitle }: CatalogWithProductsProps) {
  const { products, isLoading, error } = useProductsContext()

  if (isLoading) return <CatalogFallback />
  if (error) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p>Не удалось загрузить товары. Попробуйте обновить страницу.</p>
      </div>
    )
  }

  const filtered =
    categorySlug != null ? products.filter((p) => p.category.slug === categorySlug) : products

  return <CatalogContent products={filtered} pageTitle={pageTitle} />
}
