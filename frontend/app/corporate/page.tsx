import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Флористическое сопровождение | Цветочек в Горшочек",
  description: "Оформление мероприятий, корпоративная флористика, интерьерное озеленение. Комплексные решения для бизнеса.",
}

const services = [
  {
    title: "Оформление мероприятий",
    description: "Свадьбы, презентации, корпоративы. От небольших настольных композиций до масштабных фотозон.",
  },
  {
    title: "Корпоративная флористика",
    description: "Регулярная доставка свежих композиций на ресепшен, в кабинеты руководителей или переговорные комнаты (оформляем подписку).",
  },
  {
    title: "Интерьерное озеленение",
    description: "Подбор горшечных растений с учетом освещенности и микроклимата вашего офиса, ресторана или салона красоты. Включает пересадку в стильные кашпо и подробную инструкцию по уходу.",
  },
]

export default function CorporatePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 lg:pt-[104px] pb-16 md:pb-24 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl lg:text-4xl text-foreground">
          Стиль и эстетика для вашего бизнеса и мероприятий
        </h1>

        <p className="mt-6 text-muted-foreground text-lg leading-relaxed max-w-3xl">
          Живые растения и цветы — это визитная карточка любого пространства. Команда нашей мастерской предлагает комплексные решения по озеленению и цветочному оформлению:
        </p>

        <ul className="mt-10 space-y-6">
          {services.map((service, i) => (
            <li key={i} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-medium flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <div>
                <h2 className="font-medium text-foreground">{service.title}</h2>
                <p className="mt-1 text-muted-foreground">{service.description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 p-6 rounded-2xl bg-secondary/50 border border-border">
          <p className="text-foreground mb-6">
            Оставьте заявку, и наш флорист-декоратор свяжется с вами для бесплатной консультации и составления предварительной сметы.
          </p>
          <Button asChild className="rounded-full px-8 py-6 text-base">
            <Link href="/custom-order">
              Оставить заявку
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
