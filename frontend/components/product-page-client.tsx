"use client"

import { useEffect } from "react"
import { notFound } from "next/navigation"
import {
  ProductBreadcrumbs,
  ProductGallery,
  ProductInfoWithCart,
  ProductTabs,
} from "@/components/product"
import { useProductsContext } from "@/components/products-provider"
import { getProductBySlug } from "@/hooks/use-products"

interface ProductPageClientProps {
  slug: string
}

export function ProductPageClient({ slug }: ProductPageClientProps) {
  const { products, isLoading, error } = useProductsContext()

  useEffect(() => {
    if (error) {
      console.error("[ProductPage] Failed to load products:", error)
    }
  }, [error])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-14 lg:pt-[104px]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
            <div className="animate-pulse space-y-8">
              <div className="h-5 w-48 rounded bg-muted" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="aspect-square rounded-2xl bg-muted" />
                <div className="space-y-4">
                  <div className="h-10 w-3/4 rounded bg-muted" />
                  <div className="h-6 w-1/3 rounded bg-muted" />
                  <div className="h-32 rounded bg-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !products.length) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-14 lg:pt-[104px] flex items-center justify-center min-h-[50vh]">
          <p className="text-muted-foreground">Не удалось загрузить товар. Попробуйте обновить страницу.</p>
        </div>
      </main>
    )
  }

  const product = getProductBySlug(products, slug)
  if (!product) notFound()

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-14 lg:pt-[104px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <ProductBreadcrumbs product={product} />

          <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <ProductGallery images={product.images} name={product.name} />
            </div>
            <div className="space-y-6">
              <ProductInfoWithCart product={product} />
            </div>
          </div>

          <div className="mt-12 md:mt-16 pt-8 border-t border-border">
            <ProductTabs product={product} />
          </div>
        </div>
      </div>
    </main>
  )
}
