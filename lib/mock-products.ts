import { getImagePath } from "./utils"
import type { Product } from "@/types/product"

const IMG = (path: string) => getImagePath(path)

export const mockProducts: Product[] = [
  {
    id: "20242688",
    slug: "20242688_mono_155",
    name: "Mono 155",
    sku: "20242688",
    price: 7_990,
    inStock: true,
    images: [
      IMG("/images/photo_2026-01-31_18-58-06.jpg"),
      IMG("/images/photo_2026-01-31_18-58-08.jpg"),
      IMG("/images/photo_2026-01-31_18-58-10.jpg"),
      IMG("/images/photo_2026-01-31_18-58-11.jpg"),
      IMG("/images/photo_2026-01-31_18-58-13.jpg"),
      IMG("/images/photo_2026-01-31_18-58-14.jpg"),
      IMG("/images/photo_2026-01-31_18-58-16.jpg"),
      IMG("/images/photo_2026-01-31_18-58-46.jpg"),
    ],
    sizes: [
      { id: "d12", label: "d12", price: 6_490, available: true },
      { id: "d15", label: "d15", price: 7_990, available: true },
      { id: "d17", label: "d17", price: 9_490, available: true },
    ],
    category: { name: "Монобукеты", slug: "mono" },
    description:
      "Яркий весенний букет из 29 пионовидных тюльпанов сорта Коламбус. Букет упакован в плотную бумагу белого цвета и перевязан декоративными лентами.\n\nС букетом вы получите конверт с открыткой, в которой мы напечатаем любое пожелание, инструкцию свежести и средство для продления жизни срезанных цветов.",
    composition: {
      flowers: ["Тюльпан пионовидный"],
      packaging: ["Крафт-бумага", "Ленты"],
      height: "около 40 см",
      diameter: "около 20 см",
    },
    delivery: {
      intervals: [
        { label: "Трёхчасовой", moscow: "Бесплатно", outsideMkad: "399 + 40 ₽/км" },
        { label: "Часовой", moscow: "499 ₽", outsideMkad: "699 + 40 ₽/км" },
        { label: "Точное время", moscow: "999 ₽", outsideMkad: "1199 + 40 ₽/км" },
      ],
    },
    careInstructions:
      "Перед тем, как поставить цветок в воду, обрежьте 2-3 см стебля под углом 45 градусов. Подрезайте стебли при каждой замене воды. Ежедневно меняйте воду и мойте вазу. Найдите для вазы прохладное место вдали от отопительных приборов и прямых солнечных лучей. Доливайте воду по мере поглощения.",
    options: [
      { id: "vase", name: "Ваза", price: 899, description: "Стеклянная ваза к букету" },
      { id: "card", name: "Открытка", price: 0, description: "С поздравлением в фирменном конверте" },
    ],
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((p) => p.slug === slug)
}
