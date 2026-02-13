"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import {
  QuickOrderDialog,
  type QuickOrderProduct,
} from "@/components/quick-order-dialog"
import { useCart } from "@/store/cart-store"
import { useProductsContext } from "@/components/products-provider"
import { cn } from "@/lib/utils"

const tabs = ["Со скидкой", "Популярное", "Новинки"]

const tagByTab = {
  "Со скидкой": "sale",
  "Популярное": "hit",
  "Новинки": "new",
} as const satisfies Record<(typeof tabs)[number], "sale" | "hit" | "new">

export function ProductsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [quickOrderProduct, setQuickOrderProduct] =
    useState<QuickOrderProduct | null>(null)
  const [quickOrderOpen, setQuickOrderOpen] = useState(false)
  const { addItem } = useCart()
  const { products: allProducts } = useProductsContext()

  const products = useMemo(() => {
    if (activeTab === "Со скидкой") {
      const discounted = allProducts.filter(
        (p) => typeof p.originalPrice === "number" && p.originalPrice > p.price,
      )
      return (discounted.length > 0 ? discounted : allProducts).slice(0, 4)
    }
    if (activeTab === "Популярное") return allProducts.slice(4, 8)
    return allProducts.slice(8, 12)
  }, [allProducts, activeTab])

  const handleQuickOrder = (product: QuickOrderProduct) => {
    setQuickOrderProduct(product)
    setQuickOrderOpen(true)
  }

  const handleAddToCart = ({
    slug,
    name,
    price,
    image,
  }: {
    slug: string
    name: string
    price: number
    image: string
  }) => {
    addItem({ slug, name, price, image })
  }

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-full w-fit">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <Link
          href="/catalog"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Смотреть все →
        </Link>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            image={product.images[0] ?? "/placeholder.svg"}
            flowers={product.composition.flowers.join(", ")}
            tag={tagByTab[activeTab as keyof typeof tagByTab]}
            href={`/item/${product.slug}`}
            onAddToCart={handleAddToCart}
            onQuickOrder={handleQuickOrder}
          />
        ))}
      </div>

      <QuickOrderDialog
        open={quickOrderOpen}
        onOpenChange={setQuickOrderOpen}
        product={quickOrderProduct}
      />
    </section>
  )
}
