import { HeroSlider } from "@/components/hero-slider"
import { Categories } from "@/components/categories"
import { ProductsSection } from "@/components/products-section"
import { CustomOrder } from "@/components/custom-order"
import { BlogSection } from "@/components/blog-section"
import { Benefits } from "@/components/benefits"
import { ContactBlocks } from "@/components/contact-blocks"
import { FaqSection } from "@/components/faq-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className="pt-14 lg:pt-[104px]">
        <HeroSlider />
        <Categories />
        <Benefits />
        <ProductsSection />
        <CustomOrder />
        <BlogSection />
        {/* <AppPromo /> */}
        <ContactBlocks />
        <FaqSection />
      </div>
    </main>
  )
}
