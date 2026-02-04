#!/usr/bin/env node
/**
 * Конвертирует все JPG/PNG в public/images/products/ в WebP (quality 85),
 * сохраняет .webp рядом и удаляет оригиналы.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsDir = path.join(__dirname, "..", "public", "images", "products")

const EXT = /\.(jpe?g|png)$/i

const files = fs.readdirSync(productsDir).filter((f) => EXT.test(f))

console.log(`Найдено ${files.length} изображений для конвертации в WebP.`)

let ok = 0
let err = 0

for (const file of files) {
  const src = path.join(productsDir, file)
  const base = file.replace(EXT, "")
  const dest = path.join(productsDir, `${base}.webp`)

  try {
    await sharp(src)
      .webp({ quality: 85 })
      .toFile(dest)
    fs.unlinkSync(src)
    console.log(`  ${file} → ${base}.webp`)
    ok++
  } catch (e) {
    console.warn(`  ${file}: ${e.message}`)
    err++
  }
}

console.log(`\nГотово: ${ok} конвертировано, ${err} ошибок.`)
