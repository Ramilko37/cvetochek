import type { Metadata } from "next"
import { Suspense } from "react"
import { CatalogContent } from "@/components/catalog/catalog-content"
import { mockProducts } from "@/lib/mock-products"

export const metadata: Metadata = {
  title: "Каталог — букеты и композиции с доставкой | Цветочек в Горшочек",
  description:
    "Изысканные букеты, корзины с цветами и композиции с доставкой по Москве. Авторские и сезонные букеты от Цветочек в Горшочек.",
}

function CatalogFallback() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 w-64 rounded-full bg-muted" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default function CatalogPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <Suspense fallback={<CatalogFallback />}>
          <CatalogContent products={mockProducts} />
        </Suspense>
      </section>
    </main>
  )
}
