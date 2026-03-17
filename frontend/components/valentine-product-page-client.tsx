"use client"

import { useEffect } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ValentineProductDetail } from "@/components/valentine-product-detail"
import { useTelegramProducts } from "@/hooks/use-products"
import { AnalyticsEvent, analytics } from "@/lib/analytics"

interface ValentineProductPageClientProps {
  id: string
}

export function ValentineProductPageClient({ id }: ValentineProductPageClientProps) {
  const { products, isLoading, error } = useTelegramProducts()
  const index = parseInt(id, 10)
  const product = Number.isNaN(index) ? null : products[index]

  useEffect(() => {
    if (!product || isLoading || error) return
    analytics.track(AnalyticsEvent.ProductViewed, {
      product_slug: `/valentines-day/${id}`,
      product_name: product.name ?? "Букет",
      product_price: product.sizes?.[0]?.price ?? product.price ?? 0,
      category_slug: "valentines-day",
      category_name: "День всех влюблённых",
      in_stock: product.inStock ?? true,
      source_path: `/valentines-day/${id}`,
    })
  }, [product, id, isLoading, error])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-14 lg:pt-[104px]">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
            <div className="animate-pulse space-y-6">
              <div className="h-5 w-32 rounded bg-muted" />
              <div className="aspect-square max-w-xl rounded-2xl bg-muted" />
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
          <p className="text-muted-foreground">
            Не удалось загрузить товар. Попробуйте обновить страницу.
          </p>
        </div>
      </main>
    )
  }

  if (!product || isNaN(index) || index < 0 || index >= products.length) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-14 lg:pt-[104px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          <Link
            href="/valentines-day"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            День всех влюблённых
          </Link>

          <ValentineProductDetail product={product} productId={id} />
        </div>
      </div>
    </main>
  )
}
