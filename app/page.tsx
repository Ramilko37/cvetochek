import { Header } from "@/components/header"
import { HeroSlider } from "@/components/hero-slider"
import { Categories } from "@/components/categories"
import { ProductsSection } from "@/components/products-section"
import { CustomOrder } from "@/components/custom-order"
import { BlogSection } from "@/components/blog-section"
import { Benefits } from "@/components/benefits"
import { ContactBlocks } from "@/components/contact-blocks"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-[104px]">
        <HeroSlider />
        <Categories />
        <ProductsSection />
        <CustomOrder />
        <BlogSection />
        {/* <AppPromo /> */}
        <Benefits />
        <ContactBlocks />
        <FaqSection />
      </div>
      <Footer />
    </main>
  )
}
