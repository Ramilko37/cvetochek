import { getImagePath } from "./utils"

export interface Occasion {
  slug: string
  name: string
  description?: string
  href: string
  image?: string
  /** Месяцы, когда повод актуален (1–12). Пустой массив = круглый год. */
  relevantMonths?: number[]
}

/** Поводы для подарка — используются в каталоге, фильтрах, на главной */
export const OCCASIONS: Occasion[] = [
  { slug: "valentines-day", name: "День всех влюблённых", description: "Розы и романтика для двоих", href: "/valentines-day", image: getImagePath("/images/cat-roses.webp"), relevantMonths: [2] },
  { slug: "family-day", name: "День семьи, любви и верности", description: "Тёплые букеты для близких", href: "/catalog?occasion=family-day", image: getImagePath("/images/cat-bouquets.webp"), relevantMonths: [7] },
  { slug: "mothers-day", name: "День матери", description: "Нежные букеты для мамы", href: "/catalog?occasion=mothers-day", image: getImagePath("/images/cat-peonies.webp"), relevantMonths: [11] },
  { slug: "march-8", name: "8 марта", description: "Весенние букеты и тюльпаны", href: "/catalog?occasion=march-8", image: getImagePath("/images/cat-peonies.webp"), relevantMonths: [3] },
  { slug: "new-year", name: "Новый год", description: "Еловые ветви и праздничный декор", href: "/catalog?occasion=new-year", image: getImagePath("/images/cat-newyear.webp"), relevantMonths: [12, 1] },
  { slug: "easter", name: "Пасха", description: "Светлые весенние букеты", href: "/catalog?occasion=easter", image: getImagePath("/images/cat-bouquets.webp"), relevantMonths: [3, 4] },
  { slug: "birthday", name: "День рождения", description: "Яркие букеты для именинника", href: "/catalog?occasion=birthday", image: getImagePath("/images/cat-bouquets.webp") },
  { slug: "graduation", name: "Выпускной", description: "Элегантные композиции", href: "/catalog?occasion=graduation", image: getImagePath("/images/cat-compositions.webp"), relevantMonths: [5, 6] },
  { slug: "september-1", name: "1 сентября", description: "Скромные букеты для школьников", href: "/catalog?occasion=september-1", image: getImagePath("/images/cat-mono.webp"), relevantMonths: [8, 9] },
  { slug: "wedding", name: "Свадебные букеты", description: "Белоснежные розы и композиции", href: "/catalog?occasion=wedding", image: getImagePath("/images/products/balosnejnaya_klassika_02.webp") },
  { slug: "home", name: "Цветы для дома", description: "Композиции для интерьера", href: "/catalog?occasion=home", image: getImagePath("/images/cat-compositions.webp") },
  { slug: "just-because", name: "Просто, по любви", description: "Букеты без особого повода", href: "/catalog?occasion=just-because", image: getImagePath("/images/cat-bouquets.webp") },
]

/** Поводы, актуальные в указанный месяц (1–12). Без relevantMonths = круглый год. */
export function getOccasionsForMonth(month: number): Occasion[] {
  return OCCASIONS.filter(
    (o) => !o.relevantMonths || o.relevantMonths.length === 0 || o.relevantMonths.includes(month)
  )
}

/** Поводы для текущего месяца (используется на главной, в меню, в фильтрах) */
export function getCurrentOccasions(): Occasion[] {
  return getOccasionsForMonth(new Date().getMonth() + 1)
}

export function getOccasionBySlug(slug: string): Occasion | undefined {
  return OCCASIONS.find((o) => o.slug === slug)
}

export function isAllowedOccasionSlug(slug: string): boolean {
  return OCCASIONS.some((o) => o.slug === slug)
}
