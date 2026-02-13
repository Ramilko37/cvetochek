#!/usr/bin/env node
/**
 * Объединяет альбомы: последовательные объекты с пустым description
 * сливаются с последующим объектом, у которого есть описание.
 * Порядок images: сначала фото с описанием, затем остальные в обратном порядке.
 * Удаляет дубликаты изображений.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsPath = path.join(__dirname, "..", "public", "images", "telegram-products", "products.json")

const data = JSON.parse(fs.readFileSync(productsPath, "utf8"))

const result = []
let pending = []

for (const item of data) {
  if (!item.description || item.description.trim() === "") {
    pending.push(item)
  } else {
    // Объединяем: images с описанием первыми, затем pending в обратном порядке
    const mainImages = item.images || []
    const prevImages = pending.flatMap((p) => p.images || []).reverse()
    const allImages = [...mainImages, ...prevImages]

    // Удаляем дубликаты, сохраняя порядок
    const seen = new Set()
    const uniqueImages = allImages.filter((img) => {
      if (seen.has(img)) return false
      seen.add(img)
      return true
    })

    result.push({
      ...item,
      images: uniqueImages,
      description: item.description.trim(),
    })
    pending = []
  }
}

// Оставшиеся без описания — отбрасываем (часть последнего альбома или мусор)
if (pending.length > 0) {
  console.warn(`Отброшено ${pending.length} объектов без описания в конце`)
}

fs.writeFileSync(productsPath, JSON.stringify(result, null, 2), "utf8")
// Копируем в lib/data для статического импорта (без fs на клиенте)
const libDataPath = path.join(__dirname, "..", "lib", "data", "products.json")
fs.mkdirSync(path.dirname(libDataPath), { recursive: true })
fs.writeFileSync(libDataPath, JSON.stringify(result, null, 2), "utf8")
console.log(`Готово: ${result.length} товаров (было ${data.length}), обновлён lib/data/products.json`)
