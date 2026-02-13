"use client"

import Link from "next/link"
import { ValentinesDayGrid } from "@/components/valentines-day-grid"
import { useTelegramProducts } from "@/hooks/use-products"
import { ScrollToProduct } from "@/components/scroll-to-product"

export function ValentinesDayContent() {
  const { products, isLoading, error } = useTelegramProducts()

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-64 rounded-full bg-muted" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  const valentinesProducts = products
    .map((p, index) => ({ product: p, index }))
    .filter(({ product }) => product.tag === "#14февраля")

  if (error || valentinesProducts.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p>Товары скоро появятся. Следите за обновлениями в нашем Telegram.</p>
        <Link href="/catalog" className="mt-4 inline-block text-primary hover:underline">
          Перейти в каталог
        </Link>
      </div>
    )
  }

  return <ValentinesDayGrid products={valentinesProducts} />
}
