"use client"

import { useState } from "react"
import { ProductInfoAb } from "@/components/product/product-info-ab"
import { useCart } from "@/store/cart-store"
import type { Product } from "@/types/product"

interface ProductInfoWithCartAbProps {
  product: Product
}

export function ProductInfoWithCartAb({ product }: ProductInfoWithCartAbProps) {
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
      composition: product.composition.flowers.join(", "),
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
    <ProductInfoAb
      product={product}
      selectedOptionIds={selectedOptionIds}
      onOptionChange={handleOptionChange}
      onAddToCart={handleAddToCart}
    />
  )
}
