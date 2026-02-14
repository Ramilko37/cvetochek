import type { Product } from "@/types/product"

/**
 * Извлекает основу слова для гибкого поиска по русским множественным формам.
 * "розы" -> "роз" (совпадёт с "роза"), "тюльпаны" -> "тюльпан"
 */
function getSearchStems(q: string): string[] {
  const stems: string[] = [q]
  if (q.length >= 3) {
    const trimmed1 = q.slice(0, -1)
    if (trimmed1.length >= 2) stems.push(trimmed1)
    const trimmed2 = q.slice(0, -2)
    if (trimmed2.length >= 2) stems.push(trimmed2)
  }
  return stems
}

/**
 * Проверяет, совпадает ли запрос с названием цветка.
 * Учитывает множественное число: "розы" найдёт "Роза кустовая", "Роза Эквадор".
 */
function matchFlower(flower: string, stems: string[]): boolean {
  const flowerLower = flower.toLowerCase()
  return stems.some((stem) => flowerLower.includes(stem) || flowerLower.startsWith(stem))
}

/**
 * Проверяет, подходит ли продукт под поисковый запрос.
 * Ищет по: названию, цветам в составе, категории, артикулу.
 */
export function productMatchesSearch(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true

  const stems = getSearchStems(q)

  const matchName = product.name.toLowerCase().includes(q) || stems.some((s) => product.name.toLowerCase().includes(s))
  if (matchName) return true

  const flowers = product.composition?.flowers ?? []
  const matchFlowers = flowers.some((f) => matchFlower(f, stems))
  if (matchFlowers) return true

  const matchCategory = product.category?.name?.toLowerCase().includes(q)
  if (matchCategory) return true

  const matchSku = product.sku?.toLowerCase().includes(q)
  if (matchSku) return true

  return false
}
