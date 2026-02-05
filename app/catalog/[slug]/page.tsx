import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { CatalogContent } from "@/components/catalog/catalog-content"
import { getCategoryTitle, isAllowedCatalogSlug } from "@/lib/catalog-routes"
import { mockProducts } from "@/lib/mock-products"

interface CatalogSlugPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = [...new Set(mockProducts.map((p) => p.category.slug))]
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: CatalogSlugPageProps): Promise<Metadata> {
  const { slug } = await params
  const title = getCategoryTitle(slug)
  if (!title) return { title: "Каталог | Цветочек в Горшочек" }
  return {
    title: `${title} — каталог с доставкой | Цветочек в Горшочек`,
    description: `Купить ${title.toLowerCase()} с доставкой по Москве. Изысканные букеты и композиции от Цветочек в Горшочек.`,
  }
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

export default async function CatalogSlugPage({ params }: CatalogSlugPageProps) {
  const { slug } = await params
  const filtered = mockProducts.filter((p) => p.category.slug === slug)

  if (filtered.length === 0 || !isAllowedCatalogSlug(slug)) {
    notFound()
  }

  const pageTitle = getCategoryTitle(slug) ?? "Каталог"

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <Suspense fallback={<CatalogFallback />}>
          <CatalogContent products={filtered} pageTitle={pageTitle} />
        </Suspense>
      </section>
    </main>
  )
}
