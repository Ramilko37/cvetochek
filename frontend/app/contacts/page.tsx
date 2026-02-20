import type { Metadata } from "next"
import Link from "next/link"

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
          Свяжитесь с нами удобным способом.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-2xl">
          <div>
            <h2 className="font-medium text-foreground mb-2">Телефон</h2>
            <a
              href="tel:+79264705545"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              8 (926) 470 55 45
            </a>
          </div>
          <div>
            <h2 className="font-medium text-foreground mb-2">E-mail</h2>
            <a
              href="mailto:love@cvetipolubvi.ru"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              love@cvetipolubvi.ru
            </a>
          </div>
          <div>
            <h2 className="font-medium text-foreground mb-2">Адрес</h2>
            <p className="text-muted-foreground">
              Москва, ул. Тайнинская, 15 к 1, 26
            </p>
          </div>
          <div>
            <h2 className="font-medium text-foreground mb-2">Мы в соцсетях</h2>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/cveto4ek_v_gorsho4ek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://vk.com/club229462676"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                ВКонтакте
              </a>
              <a
                href="https://t.me/cvetoc4ek_v_gorsho4ek"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Telegram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/custom-order"
            className="text-primary hover:underline font-medium"
          >
            Оформить индивидуальный заказ
          </Link>
        </div>
      </section>
    </main>
  )
}
