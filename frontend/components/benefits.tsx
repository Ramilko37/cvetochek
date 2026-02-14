import { Truck, Calendar, Flower2, Percent } from "lucide-react"

const benefits = [
  {
    icon: Flower2,
    title: "200+",
    description: "вариантов букетов",
  },
  {
    icon: Truck,
    title: "Гибкие условия",
    description: "доставки",
  },
  {
    icon: Calendar,
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
    <section className="py-12 px-5 md:px-7 lg:px-10 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl md:text-3xl text-foreground">
          Наши преимущества
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {benefits.map((benefit) => (
          <div
            key={benefit.title}
            className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-muted/50"
          >
            <div className="shrink-0 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <benefit.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground text-sm md:text-base">
                {benefit.title}
              </p>
              <p className="text-xs md:text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
