"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, ShoppingBag, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { AnalyticsEvent, analytics } from "@/lib/analytics"
import { cn } from "@/lib/utils"

const SCROLL_TO_PRODUCT_KEY = "scrollToProduct"
const SCROLL_TO_PRODUCT_FROM_KEY = "scrollToProductFrom"

export interface ProductCardQuickOrderPayload {
  name: string
  price: number
  image: string
  composition?: string
  slug?: string
}

export interface ProductCardAddToCartPayload {
  slug: string
  name: string
  price: number
  image: string
  composition?: string
}

interface ProductCardProps {
  name: string
  price: number
  originalPrice?: number
  image: string
  inStock?: boolean
  tag?: "hit" | "new" | "sale"
  flowers?: string
  href?: string
  slug?: string
  onAddToCart?: (payload: ProductCardAddToCartPayload) => void
  onQuickOrder?: (payload: ProductCardQuickOrderPayload) => void
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  inStock = true,
  tag,
  flowers,
  href,
  slug,
  onAddToCart,
  onQuickOrder,
}: ProductCardProps) {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  const saveScrollTarget = () => {
    if (slug && typeof window !== "undefined") {
      sessionStorage.setItem(SCROLL_TO_PRODUCT_KEY, slug)
      sessionStorage.setItem(SCROLL_TO_PRODUCT_FROM_KEY, pathname ?? "")
    }

    analytics.track(AnalyticsEvent.ProductCardClicked, {
      product_slug: slug,
      product_name: name,
      source_path: pathname || "",
      destination: href,
    })
  }

  const tagLabels: Record<"hit" | "new" | "sale", string> = {
    hit: "Хит",
    new: "Новинка",
    sale: "Скидка",
  }

  const content = (
    <>
      <div className="relative aspect-3/4 rounded-2xl overflow-hidden bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Tag */}
        {tag && (
          <span
            className={cn(
              "absolute top-3 left-3 px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-full font-medium",
              tag === "hit" && "bg-primary text-primary-foreground",
              tag === "new" && "bg-[#f0e6dc] text-foreground border border-border/60",
              tag === "sale" && "bg-[#c9a9a9] text-white"
            )}
          >
            {tagLabels[tag]}
          </span>
        )}

        {/* Quick actions overlay — только на десктопе, на мобильном не рендерим кнопки чтобы не перехватывали тап */}
        {!isMobile && (
          <>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
            {/* Action buttons — клик не проваливается в Link */}
            <div
              className="absolute bottom-3 left-3 right-3 flex flex-col gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <div className="flex gap-2">
                {inStock ? (
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 bg-white/95 hover:bg-white text-foreground rounded-full text-xs h-9"
                    onClick={() =>
                      slug && onAddToCart?.({ slug, name, price, image, composition: flowers })
                    }
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                    В корзину
                  </Button>
                ) : (
                  <div className="flex-1 bg-white/95 text-foreground rounded-full text-xs h-9 px-3 inline-flex items-center justify-center">
                    Под заказ
                  </div>
                )}
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
                onClick={() =>
                  onQuickOrder?.({ name, price, image, composition: flowers, slug })
                }
              >
                <Zap className="h-3.5 w-3.5 mr-1.5" />
                Быстрый заказ
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Product info */}
      <div className="mt-4 space-y-1">
        {flowers && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {flowers}
          </p>
        )}
        <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-foreground font-medium">
            {price.toLocaleString("ru-RU")} ₽
          </span>
          {typeof originalPrice === "number" && originalPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              {originalPrice.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {inStock ? "В наличии" : "Под заказ"}
        </p>
      </div>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="group block"
        data-product-slug={slug ?? undefined}
        onClick={saveScrollTarget}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="group" data-product-slug={slug ?? undefined}>
      {content}
    </div>
  )
}
