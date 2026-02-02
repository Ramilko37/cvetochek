"use client"

import { useState } from "react"
import Link from "next/link"
import { ProductCard } from "@/components/product-card"
import {
  QuickOrderDialog,
  type QuickOrderProduct,
} from "@/components/quick-order-dialog"
import { useCart } from "@/store/cart-store"
import { cn, getImagePath } from "@/lib/utils"

const tabs = ["Со скидкой", "Популярное", "Новинки"]

const products = {
  "Со скидкой": [
    {
      slug: "20242688_mono_155",
      name: "Букет 027",
      price: 6790,
      originalPrice: 7988,
      image: getImagePath("/images/product-1.jpg"),
      tag: "sale" as const,
      flowers: "Кустовая роза, Гвоздика, Роза, Эустома, Пион",
    },
    {
      slug: "20242688_mono_155",
      name: "Бокс 051",
      price: 8090,
      originalPrice: 9518,
      image: getImagePath("/images/product-2.jpg"),
      tag: "sale" as const,
      flowers: "Кустовая роза, Гвоздика, Роза, Хлопок, Эустома",
    },
    {
      slug: "20242688_mono_155",
      name: "Моно 019",
      price: 6690,
      originalPrice: 7871,
      image: getImagePath("/images/product-3.jpg"),
      tag: "sale" as const,
      flowers: "Кустовая роза",
    },
    {
      slug: "20242688_mono_155",
      name: "Моно 030",
      price: 14990,
      originalPrice: 17635,
      image: getImagePath("/images/product-4.jpg"),
      tag: "sale" as const,
      flowers: "Гортензия",
    },
  ],
  "Популярное": [
    {
      slug: "20242688_mono_155",
      name: "Моно 056",
      price: 9190,
      image: getImagePath("/images/product-5.jpg"),
      tag: "hit" as const,
      flowers: "Пион",
    },
    {
      slug: "20242688_mono_155",
      name: "Моно 026",
      price: 14290,
      image: getImagePath("/images/product-6.jpg"),
      tag: "hit" as const,
      flowers: "Пион",
    },
    {
      slug: "20242688_mono_155",
      name: "Букет 089",
      price: 12490,
      image: getImagePath("/images/product-7.jpg"),
      tag: "hit" as const,
      flowers: "Роза, Ранункулюс, Эвкалипт",
    },
    {
      slug: "20242688_mono_155",
      name: "Композиция 012",
      price: 18990,
      image: getImagePath("/images/product-8.jpg"),
      tag: "hit" as const,
      flowers: "Сезонные цветы",
    },
  ],
  "Новинки": [
    {
      slug: "20242688_mono_155",
      name: "Букет 102",
      price: 7890,
      image: getImagePath("/images/product-9.jpg"),
      tag: "new" as const,
      flowers: "Садовая роза, Астильба, Зелень",
    },
    {
      slug: "20242688_mono_155",
      name: "Бокс 067",
      price: 11290,
      image: getImagePath("/images/product-10.jpg"),
      tag: "new" as const,
      flowers: "Пион, Кустовая роза, Маттиола",
    },
    {
      slug: "20242688_mono_155",
      name: "Моно 078",
      price: 5490,
      image: getImagePath("/images/product-11.jpg"),
      tag: "new" as const,
      flowers: "Тюльпан",
    },
    {
      slug: "20242688_mono_155",
      name: "Корзина 023",
      price: 21990,
      image: getImagePath("/images/product-12.jpg"),
      tag: "new" as const,
      flowers: "Премиум цветы микс",
    },
  ],
}

export function ProductsSection() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [quickOrderProduct, setQuickOrderProduct] =
    useState<QuickOrderProduct | null>(null)
  const [quickOrderOpen, setQuickOrderOpen] = useState(false)
  const { addItem } = useCart()

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
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Смотреть все →
        </Link>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products[activeTab as keyof typeof products].map((product) => (
          <ProductCard
            key={product.name}
            {...product}
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
