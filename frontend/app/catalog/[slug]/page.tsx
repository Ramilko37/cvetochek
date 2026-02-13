import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CatalogWithProducts } from "@/components/catalog/catalog-with-products"
import { getCategoryTitle, isAllowedCatalogSlug } from "@/lib/catalog-routes"

interface CatalogSlugPageProps {
  params: Promise<{ slug: string }>
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

export default async function CatalogSlugPage({ params }: CatalogSlugPageProps) {
  const { slug } = await params

  if (!isAllowedCatalogSlug(slug)) {
    notFound()
  }

  const pageTitle = getCategoryTitle(slug) ?? "Каталог"

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <CatalogWithProducts categorySlug={slug} pageTitle={pageTitle} />
      </section>
    </main>
  )
}
