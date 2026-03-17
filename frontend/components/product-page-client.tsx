"use client"

import { useEffect } from "react"
import { notFound, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductBreadcrumbs, ProductTabs } from "@/components/product"
import { ProductGalleryAb } from "@/components/product/product-gallery-ab"
import { ProductInfoWithCartAb } from "@/components/product/product-info-with-cart-ab"
import { useProductsContext } from "@/components/products-provider"
import { getProductBySlug } from "@/hooks/use-products"
import { AnalyticsEvent, analytics } from "@/lib/analytics"

interface ProductPageClientProps {
  slug: string
}

const LEGACY_BLOG_SLUG_REDIRECTS: Record<string, string> = {
  "tg-17": "/catalog/compositions",
  "tg-21": "/catalog/bouquets",
  "tg-23": "/catalog/bouquets",
  "tg-37": "/catalog/bouquets",
}

export function ProductPageClient({ slug }: ProductPageClientProps) {
  const router = useRouter()
  const { products, isLoading, error } = useProductsContext()
  const product = getProductBySlug(products, slug)
  const isLegacyTelegramSlug = /^tg-\d+$/.test(slug)
  const legacyRedirectTarget =
    LEGACY_BLOG_SLUG_REDIRECTS[slug] ?? (isLegacyTelegramSlug ? "/catalog" : null)

  useEffect(() => {
    if (error) {
      console.error("[ProductPage] Failed to load products:", error)
    }
  }, [error])

  useEffect(() => {
    if (!product || isLoading || error) return
    analytics.track(AnalyticsEvent.ProductViewed, {
      product_slug: product.slug,
      product_name: product.name,
      product_price: product.price,
      category_slug: product.category.slug,
      category_name: product.category.name,
      in_stock: product.inStock,
      source_path: `/item/${product.slug}`,
    })
  }, [product, isLoading, error])

  useEffect(() => {
    if (isLoading || error || product || !legacyRedirectTarget) return
    router.replace(legacyRedirectTarget)
  }, [isLoading, error, product, legacyRedirectTarget, router])

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

  if (!product) {
    if (legacyRedirectTarget) {
      return (
        <main className="min-h-screen bg-background">
          <div className="pt-14 lg:pt-[104px] flex items-center justify-center min-h-[50vh]">
            <p className="text-muted-foreground">Перенаправляем в актуальный каталог…</p>
          </div>
        </main>
      )
    }
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-14 lg:pt-[104px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 hover:bg-transparent text-muted-foreground hover:text-foreground"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </Button>

          <ProductBreadcrumbs product={product} />

          <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_460px] xl:grid-cols-[minmax(0,1fr)_500px] gap-8 lg:gap-12 xl:gap-16 items-start lg:py-2">
            <div className="min-w-0">
              <ProductGalleryAb images={product.images} name={product.name} />
            </div>
            <div className="space-y-6">
              <ProductInfoWithCartAb product={product} />
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
