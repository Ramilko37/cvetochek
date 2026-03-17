import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Доставка | Цветочек в Горшочек",
  description:
    "Условия и интервалы доставки букетов по Москве и за МКАД. Сроки, стоимость и порядок подтверждения заказа.",
}

const deliveryRows = [
  { type: "Трёхчасовой", moscow: "Бесплатно", outside: "399 ₽ + 40 ₽/км" },
  { type: "Часовой", moscow: "499 ₽", outside: "699 ₽ + 40 ₽/км" },
  { type: "Точное время", moscow: "999 ₽", outside: "1199 ₽ + 40 ₽/км" },
]

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">Доставка</h1>
        <p className="mt-4 text-muted-foreground max-w-3xl">
          Доставляем по Москве и за МКАД ежедневно. После оформления заказа
          менеджер подтверждает интервал и детали вручения по телефону.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="text-left p-4 font-medium">Интервал</th>
                <th className="text-left p-4 font-medium">Москва</th>
                <th className="text-left p-4 font-medium">За МКАД</th>
              </tr>
            </thead>
            <tbody>
              {deliveryRows.map((row) => (
                <tr key={row.type} className="border-t border-border">
                  <td className="p-4">{row.type}</td>
                  <td className="p-4">{row.moscow}</td>
                  <td className="p-4">{row.outside}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 space-y-2 text-sm text-muted-foreground">
          <p>Заказы на текущий день принимаются при наличии свободных слотов.</p>
          <p>Если не удаётся дозвониться для подтверждения, заказ может быть отменён.</p>
          <p>Для срочных случаев рекомендуем связаться с нами по телефону.</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/catalog" className="text-primary hover:underline font-medium">
            Выбрать букет
          </Link>
          <Link href="/payment" className="text-primary hover:underline font-medium">
            Способы оплаты
          </Link>
          <Link href="/return" className="text-primary hover:underline font-medium">
            Условия возврата
          </Link>
        </div>
      </section>
    </main>
  )
}
