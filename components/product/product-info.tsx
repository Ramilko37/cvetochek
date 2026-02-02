"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { QuickOrderDialog } from "@/components/quick-order-dialog"
import { cn } from "@/lib/utils"
import type { Product, ProductSize } from "@/types/product"

interface ProductInfoProps {
  product: Product
  onAddToCart?: (productId: string, sizeId?: string) => void
  onQuickOrder?: (productId: string) => void
}

export function ProductInfo({
  product,
  onAddToCart,
  onQuickOrder,
}: ProductInfoProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    product.sizes?.[0] ?? null,
  )
  const [isFavorite, setIsFavorite] = useState(false)
  const [quickOrderOpen, setQuickOrderOpen] = useState(false)

  const displayPrice = selectedSize?.price ?? product.price

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          {product.name}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Артикул: {product.sku}
        </p>
      </div>

      {/* Stock status */}
      <div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm",
            product.inStock ? "text-foreground" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              product.inStock ? "bg-primary" : "bg-muted-foreground",
            )}
          />
          {product.inStock ? "В наличии" : "Под заказ"}
        </span>
      </div>

      {/* Size selector */}
      {product.sizes && product.sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-foreground mb-2">Размер</p>
          <div className="flex gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSize(size)}
                disabled={!size.available}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer",
                  "border border-border",
                  selectedSize?.id === size.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted",
                  !size.available && "opacity-50 cursor-not-allowed",
                )}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-2xl md:text-3xl text-foreground">
          {displayPrice.toLocaleString("ru-RU")} ₽
        </span>
        {product.originalPrice && product.originalPrice > displayPrice && (
          <span className="text-muted-foreground line-through">
            {product.originalPrice.toLocaleString("ru-RU")} ₽
          </span>
        )}
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          className="rounded-full flex-1 h-12"
          onClick={() => onAddToCart?.(product.id, selectedSize?.id)}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          В корзину
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 shrink-0"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label="В избранное"
        >
          <Heart
            className={cn("h-5 w-5", isFavorite && "fill-current")}
          />
        </Button>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full rounded-full h-11"
        onClick={() => {
          onQuickOrder?.(product.id)
          setQuickOrderOpen(true)
        }}
      >
        <Zap className="h-4 w-4 mr-2" />
        Быстрый заказ
      </Button>

      <QuickOrderDialog
        open={quickOrderOpen}
        onOpenChange={setQuickOrderOpen}
        product={{
          name: product.name,
          price: displayPrice,
          image: product.images?.[0] ?? "/placeholder.svg",
        }}
      />

      <p className="text-xs text-muted-foreground">
        Бесплатная доставка по Москве при заказе от 4 500 ₽
      </p>
    </div>
  )
}
