"use client"

import { ProductInfo } from "@/components/product/product-info"
import { useCart } from "@/store/cart-store"
import type { Product } from "@/types/product"

interface ProductInfoWithCartProps {
  product: Product
}

export function ProductInfoWithCart({ product }: ProductInfoWithCartProps) {
  const { addItem } = useCart()

  const handleAddToCart = (productId: string, sizeId?: string) => {
    const size = product.sizes?.find((s) => s.id === sizeId)
    const price = size?.price ?? product.price
    addItem({
      slug: product.slug,
      name: product.name,
      price,
      image: product.images?.[0] ?? "/placeholder.svg",
      sizeId: size?.id,
      sizeLabel: size?.label,
    })
  }

  return <ProductInfo product={product} onAddToCart={handleAddToCart} />
}
