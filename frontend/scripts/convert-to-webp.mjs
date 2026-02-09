#!/usr/bin/env node
/**
 * Конвертирует все JPG/PNG в public/images/products/ в WebP (quality 85),
 * сохраняет .webp рядом и удаляет оригиналы. Выводит экономию места.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsDir = path.join(__dirname, "..", "public", "images", "products")

const EXT = /\.(jpe?g|png)$/i

const files = fs.readdirSync(productsDir).filter((f) => EXT.test(f))

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

let sizeBefore = 0
for (const file of files) {
  sizeBefore += fs.statSync(path.join(productsDir, file)).size
}

console.log(`Найдено ${files.length} изображений для конвертации в WebP.`)
console.log(`Размер до конвертации: ${formatBytes(sizeBefore)}\n`)

let ok = 0
let err = 0
let sizeAfter = 0

for (const file of files) {
  const src = path.join(productsDir, file)
  const base = file.replace(EXT, "")
  const dest = path.join(productsDir, `${base}.webp`)

  try {
    await sharp(src)
      .webp({ quality: 85 })
      .toFile(dest)
    sizeAfter += fs.statSync(dest).size
    fs.unlinkSync(src)
    console.log(`  ${file} → ${base}.webp`)
    ok++
  } catch (e) {
    console.warn(`  ${file}: ${e.message}`)
    err++
  }
}

const saved = sizeBefore - sizeAfter
const percent = sizeBefore > 0 ? ((saved / sizeBefore) * 100).toFixed(1) : 0

console.log(`\nГотово: ${ok} конвертировано, ${err} ошибок.`)
console.log(`\n--- Экономия места ---`)
console.log(`  До:    ${formatBytes(sizeBefore)}`)
console.log(`  После: ${formatBytes(sizeAfter)}`)
console.log(`  Сэкономлено: ${formatBytes(saved)} (${percent}%)`)
