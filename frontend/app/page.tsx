import { HeroSlider } from "@/components/hero-slider"
import { Categories } from "@/components/categories"
import { ProductsSection } from "@/components/products-section"
import { CustomOrder } from "@/components/custom-order"
import { BlogSection } from "@/components/blog-section"
import { ReviewsSection } from "@/components/reviews-section"
import { Benefits } from "@/components/benefits"
import { ContactBlocks } from "@/components/contact-blocks"
import { FaqSection } from "@/components/faq-section"
import { ScrollToProduct } from "@/components/scroll-to-product"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <ScrollToProduct />
      <div className="pt-14 lg:pt-[104px]">
        <HeroSlider />
        <Categories />
        <Benefits />
        <ProductsSection />
        <CustomOrder />
        <BlogSection />
        <ReviewsSection />
        {/* <AppPromo /> */}
        <ContactBlocks />
        <FaqSection />
      </div>
    </main>
  )
}
