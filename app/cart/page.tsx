import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CartPageContent } from "@/components/cart-page-content"

export default function CartPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-[104px]">
        <CartPageContent />
      </div>
      <Footer />
    </main>
  )
}
