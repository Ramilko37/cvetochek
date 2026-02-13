import { ProductPageClient } from "@/components/product-page-client"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  return <ProductPageClient slug={slug} />
}
