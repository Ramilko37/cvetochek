import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CustomOrderForm } from "@/components/custom-order-form"
import { Button } from "@/components/ui/button"
import { ArrowRight, Info } from "lucide-react"
import { getImagePath } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Индивидуальный заказ | Цветочек в Горшочек",
  description: "Создадим букет вашей мечты по вашим пожеланиям. Срезка и горшечные растения. Доставка по Москве.",
}

const steps = [
  {
    title: "Ваша идея",
    content:
      "Поделитесь задумкой: цветовая гамма, форма букета или конкретные предпочтения. Классика — премиальные розы, или экзотика.",
  },
  {
    title: "Срезка или горшечные",
    content:
      "Букет или растение в кашпо: Монстера, Фикус лирата, Стрелиция, Мирт — подберём под интерьер.",
  },
  {
    title: "Бюджет и состав",
    content:
      "Флорист свяжется и предложит лучшие сезонные варианты в обозначенную сумму.",
  },
  {
    title: "Фотоконтроль",
    content:
      "Перед отправкой пришлём фото готовой композиции с нескольких ракурсов. Внесём правки при необходимости.",
  },
  {
    title: "Доставка",
    content:
      "Надёжная упаковка с учётом погоды и аккуратная передача получателю в нужное время.",
  },
]

export default function CustomOrderPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero: фото на всю ширину — на мобильном первым */}
      <section className="pt-24 lg:pt-[132px] pb-8 md:pb-12">
        <div className="relative aspect-[21/9] md:aspect-[3/1] lg:aspect-[3/0.8] w-full overflow-hidden">
          <Image
            src={getImagePath("/images/cat-compositions.webp")}
            alt="Индивидуальные композиции"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          {/* <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-white">
              Индивидуальный заказ: создадим букет вашей мечты
            </h1>
          </div> */}
        </div>
      </section>

      {/* Текст под hero — 80vw ширины */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-6 pb-8">
        <p className="w-full text-left text-muted-foreground text-lg leading-relaxed">
          Иногда для идеального подарка нужен особенный подход. Не нашли подходящую композицию в каталоге? Есть референс или хотите передать определённое настроение? Наша мастерская соберёт уникальный букет или подберёт растение по вашим пожеланиям и комфортному бюджету.
        </p>
      </div>

      {/* Единая карточка: форма слева (темнее фон), буллеты справа (светлее) */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-16 md:pb-24">
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2">
            {/* Левая часть — форма, темнее фон. На мобилке внизу (order-2) */}
            <div className="order-2 lg:order-1 p-6 md:p-8 bg-muted">
              <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6">
                Расскажите, что бы вы хотели?
              </h2>
              <CustomOrderForm />
            </div>

            {/* Правая часть — буллеты, светлее фон. На мобилке сверху (order-1) */}
            <div className="min-w-0 order-1 lg:order-2 p-6 md:p-8 bg-background">
              <h2 className="font-serif text-xl md:text-2xl text-foreground mb-6">
                Как мы работаем
              </h2>
              <ol className="space-y-6">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary font-semibold text-sm flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-medium text-foreground">{step.title}</h3>
                      <p className="mt-1 text-muted-foreground">{step.content}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex gap-3 p-4 rounded-2xl bg-muted/50 border border-border mt-10">
                <Info className="h-5 w-5 shrink-0 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Для сложных композиций или редких сортов может потребоваться больше времени на закупку. Рекомендуем оставлять заявку за 2–3 дня до нужной даты.
                </p>
              </div>

             
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
