import type { Metadata } from "next"
import { CatalogContent } from "@/components/catalog/catalog-content"
import { mockProducts } from "@/lib/mock-products"

export const metadata: Metadata = {
  title: "Каталог — букеты и композиции с доставкой | Цветочек в Горшочек",
  description:
    "Изысканные букеты, корзины с цветами и композиции с доставкой по Москве. Авторские и сезонные букеты от Цветочек в Горшочек.",
}

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <CatalogContent products={mockProducts} />
      </section>
    </main>
  )
}
