import { notFound } from "next/navigation"
import {
  ProductBreadcrumbs,
  ProductGallery,
  ProductInfoWithCart,
  ProductTabs,
} from "@/components/product"
import { getProductBySlug } from "@/lib/mock-products"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { mockProducts } = await import("@/lib/mock-products")
  return mockProducts.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) notFound()

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-14 lg:pt-[104px]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumbs */}
          <ProductBreadcrumbs product={product} />

          {/* Product layout */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery */}
            <div>
              <ProductGallery images={product.images} name={product.name} />
            </div>

            {/* Info */}
            <div className="space-y-6">
              <ProductInfoWithCart product={product} />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-border">
            <ProductTabs product={product} />
          </div>
        </div>
      </div>
    </main>
  )
}
