import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Инструкция по свежести | Цветочек в Горшочек",
  description: "Как сохранить букет свежим. Советы по уходу за цветами.",
}

export default function CarePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-24 lg:pt-[132px] pb-16 md:pb-24 px-5 md:px-7 lg:px-10 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          Инструкция по свежести
        </h1>
        <p className="mt-4 text-muted-foreground">
          Раздел в разработке.
        </p>
      </section>
    </main>
  )
}
