"use client"

import { useState } from "react"
import { Heart, ShoppingBag, Zap } from "lucide-react"
import { useFavoritesStore } from "@/store/favorites-store"
import { Button } from "@/components/ui/button"
import { QuickOrderDialog } from "@/components/quick-order-dialog"
import { ProductOptions } from "@/components/product/product-options"
import { cn } from "@/lib/utils"
import type { Product, ProductSize } from "@/types/product"

interface ProductInfoAbProps {
  product: Product
  selectedOptionIds?: string[]
  onOptionChange?: (optionId: string, checked: boolean) => void
  onAddToCart?: (productId: string, sizeId?: string, selectedOptionIds?: string[]) => void
  onQuickOrder?: (productId: string) => void
}

export function ProductInfoAb({
  product,
  selectedOptionIds = [],
  onOptionChange,
  onAddToCart,
  onQuickOrder,
}: ProductInfoAbProps) {
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
    product.sizes?.[0] ?? null,
  )
  const [quickOrderOpen, setQuickOrderOpen] = useState(false)
  const { has: isFavorite, toggle: toggleFavorite } = useFavoritesStore()

  const basePrice = selectedSize?.price ?? product.price
  const optionsTotal =
    product.options?.filter((o) => selectedOptionIds.includes(o.id)).reduce((sum, o) => sum + o.price, 0) ?? 0
  const displayPrice = basePrice + optionsTotal
  const canAddToCart = product.inStock
  const composition = product.composition.flowers.join(", ")

  return (
    <div className="space-y-8">
      <div className="space-y-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <h1 className="font-serif text-3xl md:text-4xl leading-tight text-foreground min-w-0">
            {product.name}
          </h1>
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 text-sm",
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
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-3xl md:text-4xl leading-none text-foreground">
            {displayPrice.toLocaleString("ru-RU")} ₽
          </span>
          {product.originalPrice && product.originalPrice > displayPrice && (
            <span className="text-lg text-muted-foreground line-through">
              {product.originalPrice.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>
      </div>

      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Размер</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                type="button"
                onClick={() => setSelectedSize(size)}
                disabled={!size.available}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-14",
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

      <section className="rounded-2xl border border-border bg-secondary/20 p-4 md:p-5">
        <dl className="space-y-2 text-sm">
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">Состав</dt>
            <dd className="text-right text-foreground">
              {product.composition.flowers.join(", ")}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">Упаковка</dt>
            <dd className="text-right text-foreground">
              {product.composition.packaging.join(", ")}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">Высота</dt>
            <dd className="text-foreground">{product.composition.height}</dd>
          </div>
          <div className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">Диаметр</dt>
            <dd className="text-foreground">{product.composition.diameter}</dd>
          </div>
        </dl>
      </section>

      {product.options && product.options.length > 0 && (
        <section className="space-y-3">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Добавить к заказу
          </p>
          <ProductOptions
            options={product.options}
            selected={selectedOptionIds}
            onChange={onOptionChange}
          />
        </section>
      )}

      <div className="flex items-center gap-3">
        <Button
          type="button"
          className="rounded-full flex-1 h-12"
          onClick={() => canAddToCart && onAddToCart?.(product.id, selectedSize?.id, selectedOptionIds)}
          disabled={!canAddToCart}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          {canAddToCart ? "В корзину" : "Только под заказ"}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-12 w-12 shrink-0"
          onClick={() => toggleFavorite(product.slug)}
          aria-label="В избранное"
        >
          <Heart
            className={cn("h-5 w-5", isFavorite(product.slug) && "fill-current")}
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

      <p className="text-xs text-muted-foreground">
        <span className="block leading-relaxed">
          Бесплатная доставка по Москве от 4 500 ₽
        </span>
      </p>

      <QuickOrderDialog
        open={quickOrderOpen}
        onOpenChange={setQuickOrderOpen}
        product={{
          name: product.name,
          price: displayPrice,
          image: product.images?.[0] ?? "/placeholder.svg",
          composition,
          slug: product.slug,
        }}
      />
    </div>
  )
}
