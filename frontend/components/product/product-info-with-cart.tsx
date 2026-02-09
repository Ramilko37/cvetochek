"use client"

import { useState } from "react"
import { ProductInfo } from "@/components/product/product-info"
import { ProductOptions } from "@/components/product/product-options"
import { useCart } from "@/store/cart-store"
import type { Product } from "@/types/product"

interface ProductInfoWithCartProps {
  product: Product
}

export function ProductInfoWithCart({ product }: ProductInfoWithCartProps) {
  const { addItem } = useCart()
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([])

  const basePrice = (sizeId?: string) => {
    const size = product.sizes?.find((s) => s.id === sizeId)
    return size?.price ?? product.price
  }

  const handleAddToCart = (productId: string, sizeId?: string, optionIds?: string[]) => {
    const totalPrice = basePrice(sizeId) + (product.options?.filter((o) => (optionIds ?? []).includes(o.id)).reduce((s, o) => s + o.price, 0) ?? 0)
    const size = product.sizes?.find((s) => s.id === sizeId)
    addItem({
      slug: product.slug,
      name: product.name,
      price: totalPrice,
      image: product.images?.[0] ?? "/placeholder.svg",
      sizeId: size?.id,
      sizeLabel: size?.label,
    })
  }

  const handleOptionChange = (optionId: string, checked: boolean) => {
    setSelectedOptionIds((prev) =>
      checked ? [...prev, optionId] : prev.filter((id) => id !== optionId)
    )
  }

  return (
    <>
      <ProductInfo
        product={product}
        selectedOptionIds={selectedOptionIds}
        onAddToCart={handleAddToCart}
      />
      {product.options && product.options.length > 0 && (
        <ProductOptions
          options={product.options}
          selected={selectedOptionIds}
          onChange={handleOptionChange}
        />
      )}
    </>
  )
}
