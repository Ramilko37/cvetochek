import { Truck, Clock, CreditCard, Gift, Sparkles, Percent } from "lucide-react"

const benefits = [
  {
    icon: Sparkles,
    title: "200+",
    description: "вариантов букетов",
  },
  {
    icon: Truck,
    title: "Гибкие условия",
    description: "доставки",
  },
  {
    icon: Gift,
    title: "Бесплатная",
    description: "доставка по Москве",
  },
  {
    icon: CreditCard,
    title: "Безнал",
    description: "для юр. лиц",
  },
  {
    icon: Clock,
    title: "Сезонные",
    description: "коллекции",
  },
  {
    icon: Percent,
    title: "Система",
    description: "скидок",
  },
]

export function Benefits() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="font-serif text-2xl md:text-3xl text-foreground text-center mb-12">
        Преимущества Цветочек в Горшочек
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {benefits.map((benefit) => (
          <div 
            key={benefit.title} 
            className="text-center p-4"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
              <benefit.icon className="h-6 w-6 text-primary" />
            </div>
            <p className="font-medium text-foreground mb-1">
              {benefit.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
