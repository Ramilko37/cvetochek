import type { Metadata } from "next"
import Link from "next/link"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Оплата не завершена | Цветочек в Горшочек",
  description: "Оплата заказа не была завершена.",
}

type SearchParams = {
  status?: string
  invId?: string
  outSum?: string
  orderId?: string
}

interface CheckoutFailPageProps {
  searchParams: Promise<SearchParams>
}

function formatAmount(amount?: string) {
  if (!amount) return null
  const value = Number(amount)
  if (!Number.isFinite(value)) return amount
  return `${value.toLocaleString("ru-RU")} ₽`
}

export default async function CheckoutFailPage({
  searchParams,
}: CheckoutFailPageProps) {
  const query = await searchParams
  const amount = formatAmount(query.outSum)

  return (
    <main className="min-h-screen bg-background">
      <section className="pt-24 lg:pt-[132px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-9 w-9 text-destructive" />
          </div>
          <h1 className="mt-6 font-serif text-3xl md:text-4xl text-foreground">
            Оплата не завершена
          </h1>
          <p className="mt-3 text-muted-foreground">
            Платеж был отменен или не прошел. Вы можете попробовать снова.
          </p>

          <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4 text-left text-sm">
            {query.orderId && <p><span className="text-muted-foreground">Заказ:</span> {query.orderId}</p>}
            {query.invId && <p><span className="text-muted-foreground">InvId:</span> {query.invId}</p>}
            {amount && <p><span className="text-muted-foreground">Сумма:</span> {amount}</p>}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild className="rounded-full px-6">
              <Link href="/checkout">Вернуться к оплате</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full px-6">
              <Link href="/catalog">В каталог</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
