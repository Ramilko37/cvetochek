"use client"

import { useState } from "react"
import { ValentineProductCard } from "@/components/valentine-product-card"
import { QuickOrderDialog } from "@/components/quick-order-dialog"
import type { QuickOrderProduct } from "@/components/quick-order-dialog"
import type { TelegramProduct } from "@/lib/telegram-products"

interface ValentinesDayGridProps {
  products: { product: TelegramProduct; index: number }[]
}

export function ValentinesDayGrid({ products }: ValentinesDayGridProps) {
  const [quickOrderProduct, setQuickOrderProduct] = useState<QuickOrderProduct | null>(null)
  const [quickOrderOpen, setQuickOrderOpen] = useState(false)

  const handleQuickOrder = (payload: QuickOrderProduct) => {
    setQuickOrderProduct(payload)
    setQuickOrderOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map(({ product, index }) => (
          <ValentineProductCard
            key={index}
            product={product}
            href={`/valentines-day/${index}`}
            onQuickOrder={handleQuickOrder}
          />
        ))}
      </div>
      <QuickOrderDialog
        open={quickOrderOpen}
        onOpenChange={setQuickOrderOpen}
        product={quickOrderProduct}
      />
    </>
  )
}
