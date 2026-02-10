import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout-form"

export const metadata: Metadata = {
  title: "Оформление заказа | Цветочек в Горшочек",
  description:
    "Оформите заказ букетов с доставкой по Москве. Подтверждение по телефону, оплата при получении.",
}

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="pt-14 lg:pt-[104px]">
        <CheckoutForm />
      </div>
    </main>
  )
}
