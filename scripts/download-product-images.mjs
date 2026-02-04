#!/usr/bin/env node
/**
 * Скачивает фото товаров из Google Sheets URL в public/images/products/.
 * Читает lib/mock-products.ts, извлекает пары (slug, url), качает и обновляет файл.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const mockPath = path.join(root, "lib", "mock-products.ts")
const outDir = path.join(root, "public", "images", "products")

const content = fs.readFileSync(mockPath, "utf8")

// Извлекаем блоки товаров (между "  }," и следующим "  {")
const blocks = content.split(/\n  \},?\n/).filter(Boolean)
const pairs = []

for (const block of blocks) {
  const slugMatch = block.match(/slug:\s*"(gs-\d+)"/)
  const urlMatch = block.match(/"https:\/\/docs\.google\.com\/sheets-images-rt\/[^"]+"/)
  if (slugMatch && urlMatch) {
    const url = urlMatch[0].slice(1, -1) // убрать кавычки
    pairs.push({ slug: slugMatch[1], url })
  }
}

console.log(`Найдено ${pairs.length} картинок для скачивания.`)

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://docs.google.com/",
}

let ok = 0
let fail = 0

for (const { slug, url } of pairs) {
  const outPath = path.join(outDir, `${slug}.jpg`)
  try {
    const res = await fetch(url, { headers })
    if (!res.ok) {
      console.warn(`[${slug}] HTTP ${res.status}`)
      fail++
      continue
    }
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length < 100) {
      console.warn(`[${slug}] слишком маленький ответ (${buf.length} bytes)`)
      fail++
      continue
    }
    fs.writeFileSync(outPath, buf)
    console.log(`[${slug}] OK`)
    ok++
  } catch (e) {
    console.warn(`[${slug}] ${e.message}`)
    fail++
  }
}

console.log(`\nГотово: ${ok} скачано, ${fail} ошибок.`)

// Обновляем mock-products.ts: заменяем каждый URL на локальный путь
let newContent = content
for (const { slug, url } of pairs) {
  const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const replacement = `IMG("/images/products/${slug}.jpg")`
  newContent = newContent.replace(new RegExp(`"${escaped}"`), replacement)
}

fs.writeFileSync(mockPath, newContent)
console.log("mock-products.ts обновлён: все URL заменены на локальные пути.")
