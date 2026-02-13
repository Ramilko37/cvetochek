#!/usr/bin/env node
/**
 * Обогащает products.json:
 * 1. Добавляет признаки size и price к каждому товару
 * 2. Объединяет одинаковые букеты с разным количеством цветов (по названию)
 *
 * Одинаковые букеты: «Розовая мелодия» на 7, 9, 11, 15, 21 роз — один товар с вариантами.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsPath = path.join(__dirname, "..", "public", "images", "telegram-products", "products.json")
const libDataPath = path.join(__dirname, "..", "lib", "data", "products.json")

/** Извлекает название из **жирного** или «кавычек» */
function parseName(text) {
  const bold = text.match(/\*\*([^*]+)\*\*/)
  if (bold) return bold[1].trim()
  const guillemet = text.match(/«([^»]+)»/)
  if (guillemet) return guillemet[1].trim()
  return undefined
}

/** Извлекает цену (числа 1000–200000, включая 4.200, 5.900) */
function parsePrice(text) {
  // Формат X.XXX или X XXX
  const dotMatch = text.match(/\b(\d{1,2})[.,](\d{3})\b/)
  if (dotMatch) return parseInt(dotMatch[1] + dotMatch[2], 10)
  const plainMatch = text.match(/\b([1-9]\d{3,5})\b/)
  if (!plainMatch) return undefined
  const n = parseInt(plainMatch[1], 10)
  return n >= 1000 && n <= 200000 ? n : undefined
}

/** Извлекает размер (35*50, 15*60, 30/45) */
function parseSize(text) {
  const starMatch = text.match(/(\d+)\s*[*×xX]\s*(\d+)/)
  if (starMatch) return `${starMatch[1]}*${starMatch[2]}`
  const slashMatch = text.match(/(\d+)\s*\/\s*(\d+)/)
  if (slashMatch) return `${slashMatch[1]}*${slashMatch[2]}` // нормализуем в *
  return undefined
}

/** Извлекает количество цветов/роз для варианта */
function parseFlowerCount(text) {
  const roseMatch = text.match(/[Рр]оза[^.]*?\s+(\d+)/i)
  if (roseMatch) return parseInt(roseMatch[1], 10)
  const directMatch = text.match(/(\d+)\s*роз[а-я]*/i)
  if (directMatch) return parseInt(directMatch[1], 10)
  return undefined
}

/** Нормализует имя для группировки */
function normalizeName(name) {
  return (name || "").trim().toLowerCase().replace(/\s+/g, " ")
}

const data = JSON.parse(fs.readFileSync(productsPath, "utf8"))

// Пропускаем уже обогащённые (есть variants или price)
if (data.length > 0 && (data[0].variants || data[0].price != null)) {
  console.log("Данные уже обогащены. Ничего не сделано.")
  process.exit(0)
}

const parsed = data.map((item) => ({
  ...item,
  name: parseName(item.description ?? ""),
  price: parsePrice(item.description ?? ""),
  size: parseSize(item.description ?? ""),
  flowerCount: parseFlowerCount(item.description ?? ""),
}))

// Группируем по нормализованному имени
const byName = new Map()
for (const p of parsed) {
  const key = p.name ? normalizeName(p.name) : `_no_name_${Math.random().toString(36).slice(2)}`
  if (!byName.has(key)) byName.set(key, [])
  byName.get(key).push(p)
}

const result = []

for (const [key, group] of byName) {
  if (key.startsWith("_no_name_")) {
    // Без имени — оставляем как есть, добавляем size/price
    for (const p of group) {
      result.push({
        images: p.images,
        description: p.description,
        size: p.size,
        price: p.price,
      })
    }
    continue
  }

  const withVariants = group.filter((g) => g.flowerCount != null && g.price != null)
  const uniqueFlowerCounts = new Set(withVariants.map((g) => g.flowerCount))

  // Объединяем, если 2+ варианта с разным количеством цветов
  if (uniqueFlowerCounts.size >= 2) {
    const variants = withVariants
      .sort((a, b) => (a.flowerCount ?? 0) - (b.flowerCount ?? 0))
      .map((v) => ({
        size: v.size,
        price: v.price,
        flowers: v.flowerCount,
      }))

    // Берём лучшее описание и объединяем все изображения
    const bestDesc = group[0].description
    const allImages = [...new Set(group.flatMap((g) => g.images ?? []))]

    result.push({
      images: allImages,
      description: bestDesc,
      name: group[0].name,
      variants,
    })
  } else {
    // Один товар — добавляем size и price
    const p = group[0]
    result.push({
      images: p.images,
      description: p.description,
      name: p.name,
      size: p.size,
      price: p.price,
    })
  }
}

fs.writeFileSync(productsPath, JSON.stringify(result, null, 2), "utf8")
fs.mkdirSync(path.dirname(libDataPath), { recursive: true })
fs.writeFileSync(libDataPath, JSON.stringify(result, null, 2), "utf8")

console.log(`Готово: ${result.length} товаров (было ${data.length})`)
console.log("Добавлены size, price; объединены одинаковые букеты с вариантами.")
