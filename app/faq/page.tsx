import type { Metadata } from "next"
import { FaqSection } from "@/components/faq-section"

export const metadata: Metadata = {
  title: "Вопрос-ответ | Цветочек в Горшочек",
  description: "Частые вопросы о доставке букетов, оплате и заказе. Цветочек в Горшочек — Москва.",
}

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] max-w-7xl mx-auto">
        <FaqSection isFullPage />
      </section>
    </main>
  )
}
