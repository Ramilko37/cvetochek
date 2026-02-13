export interface RawProductVariant {
  size: string
  price: number
  flowers?: number
}

export interface RawProduct {
  images: string[]
  description: string
  /** Извлечённое название */
  name?: string
  /** Размер (для одиночного товара) */
  size?: string
  /** Цена (для одиночного товара) */
  price?: number
  /** Варианты (объединённые букеты с разным кол-вом цветов) */
  variants?: RawProductVariant[]
  /** Тег (напр. #14февраля) для категорий и фильтров */
  tag?: string
}

export interface TelegramProductSize {
  id: string
  label: string
  price: number
  available: boolean
}

export interface TelegramProduct {
  images: string[]
  description: string
  /** Извлечённое название из «кавычек» или **жирного** */
  name?: string
  /** Базовая цена (минимальная при наличии размеров) */
  price?: number
  /** Варианты размера (кол-во роз и т.п.) */
  sizes?: TelegramProductSize[]
  /** Тег (напр. #14февраля) для категорий и фильтров */
  tag?: string
}

/** Извлекает цену из текста (первое число в диапазоне 1000–200000) */
function parsePrice(text: string): number | undefined {
  const match = text.match(/\b([1-9]\d{3,5})\b/)
  if (!match) return undefined
  const n = parseInt(match[1], 10)
  return n >= 1000 && n <= 200000 ? n : undefined
}

/** Извлекает название из **жирного** или «кавычек» (приоритет у жирного — обычно это имя букета) */
function parseName(text: string): string | undefined {
  const bold = text.match(/\*\*([^*]+)\*\*/)
  if (bold) return bold[1].trim()
  const guillemet = text.match(/«([^»]+)»/)
  if (guillemet) return guillemet[1].trim()
  return undefined
}

/** Склонение: 1 роза, 2-4 розы, 5+ роз */
function roseLabel(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod100 >= 11 && mod100 <= 14) return `${n} роз`
  if (mod10 === 1) return `${n} роза`
  if (mod10 >= 2 && mod10 <= 4) return `${n} розы`
  return `${n} роз`
}

/** Парсит сырые данные в TelegramProduct[] — используется после fetch на клиенте. */
export function parseRawProducts(data: RawProduct[]): TelegramProduct[] {
  try {
    return data.map((item) => {
      const images = item.images ?? []
      const description = item.description ?? ""

      // Новый формат: уже обогащённый (size, price, variants)
      if (item.variants && item.variants.length > 0) {
        const sizes: TelegramProductSize[] = item.variants
          .sort((a, b) => (a.flowers ?? 0) - (b.flowers ?? 0))
          .map((v, i) => ({
            id: `s${i}`,
            label: v.flowers != null ? roseLabel(v.flowers) : v.size,
            price: v.price,
            available: true,
          }))
        return {
          images,
          description,
          name: item.name ?? parseName(description),
          price: Math.min(...sizes.map((s) => s.price)),
          sizes,
          ...(item.tag && { tag: item.tag }),
        }
      }

      // Одиночный товар с полями size/price
      if (item.price != null) {
        return {
          images,
          description,
          name: item.name ?? parseName(description),
          price: item.price,
          ...(item.tag && { tag: item.tag }),
        }
      }

      // Обратная совместимость: парсим из description
      const price = parsePrice(description)
      const name = item.name ?? parseName(description)
      return {
        images,
        description,
        name,
        price,
        ...(item.tag && { tag: item.tag }),
      }
    })
  } catch {
    return []
  }
}
