"use client"

import { ProductGallery } from "@/components/product/product-gallery"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart-store"
import {
  QuickOrderDialog,
  type QuickOrderProduct,
} from "@/components/quick-order-dialog"
import type { TelegramProduct, TelegramProductSize } from "@/lib/telegram-products"
import { ShoppingBag, Zap } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface ValentineProductDetailProps {
  product: TelegramProduct
  productId: string
}

export function ValentineProductDetail({ product, productId }: ValentineProductDetailProps) {
  const { addItem, openCart } = useCart()
  const [quickOrderOpen, setQuickOrderOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState<TelegramProductSize | null>(
    product.sizes?.[0] ?? null
  )

  const name = product.name ?? "Букет"
  const displayPrice = selectedSize?.price ?? product.price ?? 0
  const image = product.images[0] ?? "/placeholder.svg"
  const slug = `/valentines-day/${productId}`

  const quickOrderPayload: QuickOrderProduct = {
    name: selectedSize ? `${name} (${selectedSize.label})` : name,
    price: displayPrice,
    image,
  }

  const handleAddToCart = () => {
    addItem({
      slug,
      name: selectedSize ? `${name} (${selectedSize.label})` : name,
      price: displayPrice,
      image,
      sizeId: selectedSize?.id,
      sizeLabel: selectedSize?.label,
    })
    openCart()
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <div>
          <ProductGallery images={product.images} name={name} />
        </div>

        {/* Info */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">
              {name}
            </h1>
            {displayPrice > 0 && (
              <p className="mt-2 text-xl font-medium text-foreground">
                {displayPrice.toLocaleString("ru-RU")} ₽
              </p>
            )}
          </div>

          {/* Выбор размера */}
          {product.sizes && product.sizes.length > 1 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Размер</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                      "border border-border",
                      selectedSize?.id === size.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted"
                    )}
                  >
                    {size.label} — {size.price.toLocaleString("ru-RU")} ₽
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Описание — форматируем переносы строк */}
          {product.description && (
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {product.description}
              </pre>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleAddToCart}
              className="rounded-full flex-1"
              size="lg"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              В корзину
            </Button>
            <Button
              variant="outline"
              onClick={() => setQuickOrderOpen(true)}
              className="rounded-full flex-1"
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Быстрый заказ
            </Button>
          </div>
        </div>
      </div>

      <QuickOrderDialog
        open={quickOrderOpen}
        onOpenChange={setQuickOrderOpen}
        product={quickOrderPayload}
      />
    </>
  )
}
