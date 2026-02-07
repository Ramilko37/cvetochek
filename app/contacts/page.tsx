import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Контакты | Цветочек в Горшочек",
  description: "Контакты и адреса. Доставка букетов по Москве.",
}

export default function ContactsPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          Контакты
        </h1>
        <p className="mt-4 text-muted-foreground">
          Раздел в разработке.
        </p>
      </section>
    </main>
  )
}
