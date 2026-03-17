import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Карта сайта | Цветочек в Горшочек",
  description: "Карта сайта Цветочек в Горшочек.",
}

const sitemapLinks = [
  { title: "Главная", href: "/" },
  { title: "Каталог", href: "/catalog" },
  { title: "Новинки", href: "/new" },
  { title: "Блог", href: "/blog" },
  { title: "Доставка", href: "/delivery" },
  { title: "Контакты", href: "/contacts" },
  { title: "FAQ", href: "/faq" },
  { title: "Индивидуальный заказ", href: "/custom-order" },
  { title: "Подписка", href: "/subscription" },
  { title: "Оплата", href: "/payment" },
  { title: "Возврат", href: "/return" },
  { title: "Юридическая информация", href: "/legal" },
  { title: "Публичная оферта", href: "/offer" },
  { title: "Политика конфиденциальности", href: "/privacy" },
]

export default function SitemapPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          Карта сайта
        </h1>
        <p className="mt-4 text-muted-foreground">Основные разделы сайта:</p>

        <ul className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sitemapLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-xl border border-border bg-card px-4 py-3 text-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
