import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "О магазине | Цветочек в Горшочек",
  description:
    "О цветочном магазине Цветочек в Горшочек: философия, форматы букетов и сервис доставки по Москве.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">О магазине</h1>
        <p className="mt-4 text-muted-foreground max-w-3xl">
          «Цветочек в Горшочек» с 2015 года собирает букеты и композиции для
          подарков, событий и повседневных поводов. Мы работаем с сезонной
          срезкой, аккуратной упаковкой и внимательным сервисом доставки.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-medium text-foreground">Что делаем</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Авторские букеты, композиции в коробках и корзинах, индивидуальные
              заказы и корпоративная флористика.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-medium text-foreground">Как работаем</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Подбираем состав под повод и бюджет, согласуем детали, отправляем
              фото перед доставкой и остаёмся на связи до вручения.
            </p>
          </article>
          <article className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-medium text-foreground">Где находимся</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Москва, ул. Тайнинская, 15 к 1, 26.
              <br />
              Телефон: +7 (926) 470-55-45.
            </p>
          </article>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/catalog" className="text-primary hover:underline font-medium">
            Перейти в каталог
          </Link>
          <Link href="/contacts" className="text-primary hover:underline font-medium">
            Контакты
          </Link>
          <Link href="/legal" className="text-primary hover:underline font-medium">
            Юридическая информация
          </Link>
        </div>
      </section>
    </main>
  )
}
