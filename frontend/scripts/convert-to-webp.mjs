#!/usr/bin/env node
/**
 * Конвертирует все JPG/JPEG в public/ в WebP (quality 85),
 * сохраняет .webp рядом и удаляет оригиналы. Выводит экономию места.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import sharp from "sharp"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, "..", "public")

const EXT = /\.(jpe?g)$/i

/** Рекурсивно собирает все JPG/JPEG в директории */
function findJpegs(dir, list = []) {
  if (!fs.existsSync(dir)) return list
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      findJpegs(full, list)
    } else if (EXT.test(e.name)) {
      list.push(full)
    }
  }
  return list
}

const files = findJpegs(publicDir)

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

let sizeBefore = 0
for (const file of files) {
  sizeBefore += fs.statSync(file).size
}

console.log(`Найдено ${files.length} JPG/JPEG в public/ для конвертации в WebP.`)
console.log(`Размер до конвертации: ${formatBytes(sizeBefore)}\n`)

let ok = 0
let err = 0
let sizeAfter = 0

for (const src of files) {
  const base = path.basename(src).replace(EXT, "")
  const dir = path.dirname(src)
  const dest = path.join(dir, `${base}.webp`)

  try {
    await sharp(src)
      .webp({ quality: 85 })
      .toFile(dest)
    sizeAfter += fs.statSync(dest).size
    fs.unlinkSync(src)
    const rel = path.relative(publicDir, src)
    console.log(`  ${rel} → ${base}.webp`)
    ok++
  } catch (e) {
    console.warn(`  ${path.relative(publicDir, src)}: ${e.message}`)
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
