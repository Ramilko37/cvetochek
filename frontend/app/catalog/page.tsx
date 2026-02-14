import type { Metadata } from "next"
import { CatalogWithProducts } from "@/components/catalog/catalog-with-products"
import { ScrollToProduct } from "@/components/scroll-to-product"

export const metadata: Metadata = {
  title: "Каталог — букеты и композиции с доставкой | Цветочек в Горшочек",
  description:
    "Изысканные букеты, корзины с цветами и композиции с доставкой по Москве. Авторские и сезонные букеты от Цветочек в Горшочек.",
}

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-background">
      <ScrollToProduct />
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-5 md:px-7 lg:px-10 max-w-7xl mx-auto">
        <CatalogWithProducts />
      </section>
    </main>
  )
}
