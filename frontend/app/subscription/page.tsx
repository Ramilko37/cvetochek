import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Подписка на цветы | Цветочек в Горшочек",
  description: "Регулярные доставки букетов и приятные поводы. Подписка на цветы с доставкой по Москве.",
}

export default function SubscriptionPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-24 lg:pt-[132px] pb-16 md:pb-24 px-5 md:px-7 lg:px-10 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          Подписка на цветы
        </h1>
        <p className="mt-4 text-muted-foreground">
          Раздел в разработке. Скоро здесь можно будет оформить подписку на регулярные доставки букетов.
        </p>
      </section>
    </main>
  )
}
