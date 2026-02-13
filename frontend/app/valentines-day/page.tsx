import type { Metadata } from "next"
import { ValentinesDayContent } from "@/components/valentines-day-content"
import { ScrollToProduct } from "@/components/scroll-to-product"

export const metadata: Metadata = {
  title: "День всех влюблённых — букеты с доставкой | Цветочек в Горшочек",
  description:
    "Романтичные букеты и композиции к 14 февраля. Розы, тюльпаны, авторские букеты с доставкой по Москве.",
}

export default function ValentinesDayPage() {
  return (
    <main className="min-h-screen bg-background">
      <ScrollToProduct />
      <section className="pt-14 lg:pt-[140px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl text-foreground text-balance">
            День всех влюблённых
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">
            Розы и романтика для двоих. Букеты и композиции к 14 февраля с доставкой по Москве.
          </p>
        </div>

        <ValentinesDayContent />
      </section>
    </main>
  )
}
