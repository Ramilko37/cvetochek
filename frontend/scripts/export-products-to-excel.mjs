#!/usr/bin/env node
/**
 * Экспорт продуктов из products.json в CSV (открывается в Excel).
 * Запуск: node scripts/export-products-to-excel.mjs
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const productsPath = path.join(root, "lib/data/products.json")
const outputPath = path.join(root, "products-catalog.csv")

function escapeCsv(value) {
  if (value == null || value === "") return ""
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function main() {
  const raw = fs.readFileSync(productsPath, "utf-8")
  const products = JSON.parse(raw)

  const headers = [
    "№",
    "Название",
    "Тип",
    "Цена (₽)",
    "Размер",
    "Состав",
    "Упаковка",
    "Описание",
    "Тег",
    "Варианты",
  ]

  const rows = products.map((p, i) => {
    let price = p.price ?? ""
    let size = p.size ?? ""
    let variants = ""

    if (p.variants && Array.isArray(p.variants)) {
      variants = p.variants
        .map((v) => `${v.flowers ?? ""} шт. — ${v.price ?? ""} ₽ (${v.size ?? ""})`)
        .join("; ")
      if (!price) price = p.variants[0]?.price ?? ""
      if (!size) size = p.variants.map((v) => v.size).filter(Boolean).join("; ")
    }

    return [
      i + 1,
      escapeCsv(p.name),
      escapeCsv(p.type),
      price,
      escapeCsv(size),
      escapeCsv(p.composition),
      escapeCsv(p.packaging),
      escapeCsv(p.description),
      escapeCsv(p.tag ?? ""),
      escapeCsv(variants),
    ]
  })

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
  const bom = "\uFEFF"
  fs.writeFileSync(outputPath, bom + csvContent, "utf-8")

  console.log(`Экспортировано ${products.length} продуктов в ${outputPath}`)
}

main()
