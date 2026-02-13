"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { useCart } from "@/store/cart-store"
import type { QuickOrderProduct } from "@/components/quick-order-dialog"
import type { TelegramProduct } from "@/lib/telegram-products"

interface ValentineProductCardProps {
  product: TelegramProduct
  href: string
  onQuickOrder?: (payload: QuickOrderProduct) => void
}

export function ValentineProductCard({ product, href, onQuickOrder }: ValentineProductCardProps) {
  const isMobile = useIsMobile()
  const { addItem, openCart } = useCart()

  const name = product.name ?? "Букет"
  const price = product.sizes?.[0]?.price ?? product.price ?? 0
  const image = product.images[0] ?? "/placeholder.svg"
  const hasSizes = product.sizes && product.sizes.length > 1

  const quickOrderPayload: QuickOrderProduct = {
    name,
    price,
    image,
  }

  const content = (
    <>
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {!isMobile && (
          <>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            <div
              className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1 bg-white/95 hover:bg-white text-foreground rounded-full text-xs h-9"
                  onClick={() => {
                    const size = product.sizes?.[0]
                    addItem({
                      slug: href,
                      name,
                      price,
                      image,
                      sizeId: size?.id,
                      sizeLabel: size?.label,
                    })
                    openCart()
                  }}
                >
                  <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                  В корзину
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="bg-white/95 hover:bg-white text-foreground rounded-full h-9 w-9"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full bg-white/95 hover:bg-white text-foreground rounded-full text-xs h-9 border border-border/50"
                onClick={() => onQuickOrder?.(quickOrderPayload)}
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Быстрый заказ
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        {price > 0 && (
          <span className="text-foreground font-medium">
            {hasSizes ? "от " : ""}
            {price.toLocaleString("ru-RU")} ₽
          </span>
        )}
      </div>
    </>
  )

  return (
    <Link href={href} className="group block">
      {content}
    </Link>
  )
}
