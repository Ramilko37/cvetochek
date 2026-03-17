import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CheckoutStatusTracker } from "@/components/checkout-status-tracker"
import { formatInvIdForDisplay, formatOrderIdForDisplay } from "@/lib/order-id"

export const metadata: Metadata = {
  title: "Оплата успешна | Цветочек в Горшочек",
  description: "Оплата заказа прошла успешно.",
}

type SearchParams = {
  status?: string
  invId?: string
  outSum?: string
  orderId?: string
  orderLabel?: string
}

interface CheckoutSuccessPageProps {
  searchParams: Promise<SearchParams>
}

function formatAmount(amount?: string) {
  if (!amount) return null
  const value = Number(amount)
  if (!Number.isFinite(value)) return amount
  return `${value.toLocaleString("ru-RU")} ₽`
}

function safeDecode(value?: string) {
  if (!value) return null
  try {
    return decodeURIComponent(value).trim()
  } catch {
    return value.trim()
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const query = await searchParams
  const amount = formatAmount(query.outSum)
  const orderId = formatOrderIdForDisplay(query.orderId)
  const invId = formatInvIdForDisplay(query.invId)
  const orderLabel = safeDecode(query.orderLabel)

  return (
    <main className="min-h-screen bg-background">
      <CheckoutStatusTracker
        status="success"
        orderId={orderId}
        invId={invId}
        amount={query.outSum}
        orderLabel={orderLabel}
      />
      <section className="pt-24 lg:pt-[132px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </div>
          <h1 className="mt-6 font-serif text-3xl md:text-4xl text-foreground">
            Оплата прошла успешно
          </h1>
          <p className="mt-3 text-muted-foreground">
            Спасибо за оплату. Заказ передан флористу в работу.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-left text-sm">
            {orderLabel && <p><span className="text-muted-foreground">Заказ:</span> {orderLabel}</p>}
            {orderId && <p><span className="text-muted-foreground">Номер заказа:</span> {orderId}</p>}
            {invId && <p><span className="text-muted-foreground">Платёж:</span> {invId}</p>}
            {amount && <p><span className="text-muted-foreground">Сумма:</span> {amount}</p>}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="rounded-full px-6">
              <Link href="/catalog">В каталог</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/">На главную</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
