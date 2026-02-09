#!/usr/bin/env node
/**
 * Копирует первые 37 IMG_*.webp (по алфавиту) в gs-0002.webp, gs-0003.webp, ...
 * чтобы пути в mock-products (gs-*.webp) находили файлы.
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const productsDir = path.join(__dirname, "..", "public", "images", "products")

const SLUGS = [
  "gs-0002", "gs-0003", "gs-0005", "gs-0006", "gs-0007", "gs-0008", "gs-0009",
  "gs-0010", "gs-0011", "gs-0012", "gs-0013", "gs-0014", "gs-0015", "gs-0016",
  "gs-0017", "gs-0018", "gs-0019", "gs-0020", "gs-0021", "gs-0022", "gs-0023",
  "gs-0024", "gs-0025", "gs-0026", "gs-0027", "gs-0028", "gs-0029", "gs-0031",
  "gs-0032", "gs-0033", "gs-0034", "gs-0035", "gs-0036", "gs-0037", "gs-0038",
  "gs-0039", "gs-0046",
]

const webps = fs.readdirSync(productsDir).filter((f) => f.endsWith(".webp")).sort()

for (let i = 0; i < SLUGS.length; i++) {
  const src = path.join(productsDir, webps[i])
  const dest = path.join(productsDir, `${SLUGS[i]}.webp`)
  fs.copyFileSync(src, dest)
  console.log(`  ${webps[i]} → ${SLUGS[i]}.webp`)
}

console.log(`\nСоздано ${SLUGS.length} файлов gs-*.webp.`)
