import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Юридическая информация | Цветочек в Горшочек",
  description: "Юридическая информация и реквизиты ИП Шалит П.В.",
}

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground">
          Юридическая информация
        </h1>
        <p className="mt-4 text-muted-foreground">
          Реквизиты интернет-магазина «Цветочек в Горшочек».
        </p>

        <div className="mt-12 space-y-6 max-w-2xl">
          <div>
            <h2 className="font-medium text-foreground mb-2">Продавец</h2>
            <p className="text-muted-foreground">
              Индивидуальный предприниматель Шалит П.В.
            </p>
          </div>
          <div>
            <h2 className="font-medium text-foreground mb-2">ИНН</h2>
            <p className="text-muted-foreground">771676692207</p>
          </div>
          <div>
            <h2 className="font-medium text-foreground mb-2">ОГРН</h2>
            <p className="text-muted-foreground">318774600303847</p>
          </div>
          <div>
            <h2 className="font-medium text-foreground mb-2">Юридический адрес</h2>
            <p className="text-muted-foreground">
              Москва, ул. Тайнинская, 15 к 1, 26
            </p>
          </div>
          <div>
            <h2 className="font-medium text-foreground mb-2">Контакты</h2>
            <p className="text-muted-foreground">
              Телефон:{" "}
              <a href="tel:+79264705545" className="text-primary hover:underline">
                8 (926) 470 55 45
              </a>
              <br />
              E-mail:{" "}
              <a
                href="mailto:Cveto4ek_v_gorsho4ek@list.ru"
                className="text-primary hover:underline"
              >
                Cveto4ek_v_gorsho4ek@list.ru
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12">
          <Link
            href="/offer"
            className="text-primary hover:underline font-medium"
          >
            Публичная оферта
          </Link>
        </div>
      </section>
    </main>
  )
}
