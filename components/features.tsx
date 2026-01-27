import { Clock, Gift, Leaf, Truck } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "Бесплатная доставка",
    description: "При заказе от 5 000 ₽",
  },
  {
    icon: Clock,
    title: "Экспресс 2ч",
    description: "Быстрая доставка по Москве и СПб",
  },
  {
    icon: Leaf,
    title: "Гарантия свежести",
    description: "7 дней гарантия на все букеты",
  },
  {
    icon: Gift,
    title: "Подарочная упаковка",
    description: "Премиальная упаковка бесплатно",
  },
]

export function Features() {
  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-5 md:p-6 rounded-2xl bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <feature.icon className="h-6 w-6 text-primary mb-4" />
            <h3 className="font-medium text-foreground mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
