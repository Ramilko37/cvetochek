#!/usr/bin/env node
/**
 * Выгружает товары (фото + описание) из Telegram-чата или канала.
 * Берёт сообщения с фото за сегодня, начиная с 19:15.
 * ДОПОЛНЯЕТ существующие данные — не перезатирает.
 *
 * Требуется:
 * 1. API ключи с https://my.telegram.org (API development tools)
 * 2. Аккаунт должен состоять в чате / быть подписан на канал
 *
 * Переменные окружения (или .env в корне frontend/):
 *   TELEGRAM_API_ID    — число (api_id)
 *   TELEGRAM_API_HASH  — строка (api_hash)
 *   TELEGRAM_CHAT_ID   — ID чата (для группы: -1001234567890)
 *     ИЛИ TELEGRAM_CHANNEL — username канала/супергруппы без @
 *   TELEGRAM_SESSION   — (опционально) сохранённая сессия после первого входа
 *
 * Формат вывода: { images: ["/path/to/image"], description: string }
 */

import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions/index.js"
import { Api } from "telegram"
import input from "input"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")

// Загрузка .env и .env.local из frontend/
function loadEnv() {
  for (const name of [".env", ".env.local"]) {
    const envPath = path.join(root, name)
    if (!fs.existsSync(envPath)) continue
    const content = fs.readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/)
      if (m) {
        const val = m[2].trim().replace(/^["']|["']$/g, "")
        process.env[m[1]] = val
      }
    }
  }
}
loadEnv()

const apiId = parseInt(process.env.TELEGRAM_API_ID || "0", 10)
const apiHash = process.env.TELEGRAM_API_HASH || ""
const chatIdRaw = process.env.TELEGRAM_CHAT_ID || ""
const channel = (process.env.TELEGRAM_CHANNEL || "").replace(/^@/, "")
const sessionStr = process.env.TELEGRAM_SESSION || ""

// Чат: ID (например -1001234567890) или канал: username
const entity = chatIdRaw ? BigInt(chatIdRaw) : channel
const hasEntity = chatIdRaw || channel

const outputDir = path.join(root, "public", "images", "telegram-products")
const productsPath = path.join(outputDir, "products.json")
function loadExistingProducts() {
  try {
    const raw = fs.readFileSync(productsPath, "utf8")
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function getMaxProductIndex(products) {
  let max = -1
  for (const p of products) {
    for (const img of p.images || []) {
      const m = img.match(/product_(\d+)_\d+\.jpg/)
      if (m) max = Math.max(max, parseInt(m[1], 10))
    }
  }
  return max
}

if (!apiId || !apiHash || !hasEntity) {
  console.error(`
Ошибка: задайте переменные окружения.

Создайте файл frontend/.env со строками:
  TELEGRAM_API_ID=123456
  TELEGRAM_API_HASH=ваш_api_hash

Для чата (группы):
  TELEGRAM_CHAT_ID=-1001234567890

Для канала (с username):
  TELEGRAM_CHANNEL=username_канала

Ключи получите на https://my.telegram.org → API development tools
`)
  process.exit(1)
}

async function main() {
  console.log("Подключение к Telegram...")
  const client = new TelegramClient(
    new StringSession(sessionStr),
    apiId,
    apiHash,
    { connectionRetries: 5 }
  )

  await client.start({
    phoneNumber: async () => await input.text("Введите номер телефона (например +79991234567): "),
    password: async () => await input.text("Пароль 2FA (если есть, иначе Enter): "),
    phoneCode: async () => await input.text("Код из Telegram: "),
    onError: (err) => console.error(err),
  })

  const session = client.session.save()
  if (!sessionStr && session) {
    console.log("\nСохраните сессию в .env, чтобы не вводить код при следующих запусках:")
    console.log(`TELEGRAM_SESSION=${session}\n`)
  }

  // Сегодня с 19:15 (локальное время)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const cutoff = new Date(today.getTime() + 19 * 60 * 60 * 1000 + 15 * 60 * 1000)
  const cutoffTs = Math.floor(cutoff.getTime() / 1000)
  const maxTs = Math.floor(now.getTime() / 1000)

  console.log(`Получение сообщений с фото (сегодня с 19:15 до сейчас)...`)
  const messages = []
  for await (const msg of client.iterMessages(entity, {
    filter: Api.InputMessagesFilterPhotos,
  })) {
    const ts = msg.date || 0
    if (ts < cutoffTs) break
    if (ts <= maxTs && msg.media) messages.push(msg)
  }

  // Группируем по grouped_id (альбомы из нескольких фото)
  const groups = new Map()
  for (const msg of messages) {
    if (!msg?.media) continue
    const gid = msg.groupedId ?? `single_${msg.id}`
    if (!groups.has(gid)) groups.set(gid, [])
    groups.get(gid).push(msg)
  }

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  const existingProducts = loadExistingProducts()
  const processedIds = new Set(
    existingProducts.flatMap((p) => (p.telegramMessageId != null ? [String(p.telegramMessageId)] : []))
  )
  const existingDescriptions = new Set(
    existingProducts
      .filter((p) => p.description && p.description.trim())
      .map((p) => p.description.trim())
  )
  const maxIdx = getMaxProductIndex(existingProducts)
  let idx = maxIdx + 1
  const newProducts = []
  let skipped = 0

  for (const [gid, msgs] of groups) {
    msgs.sort((a, b) => (a.id || 0) - (b.id || 0))
    const first = msgs[0]
    const firstId = first?.id ?? first?.groupedId ?? gid
    const idKey = String(firstId)
    if (processedIds.has(idKey)) {
      skipped++
      continue
    }
    const description = (first.text ?? first.message ?? "").trim()
    if (description && existingDescriptions.has(description)) {
      skipped++
      continue
    }
    const images = []

    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i]
      const fileName = `product_${idx}_${i}.jpg`
      const filePath = path.join(outputDir, fileName)

      try {
        await client.downloadMedia(m, { outputFile: filePath })
        if (fs.existsSync(filePath)) {
          images.push(`/images/telegram-products/${fileName}`)
          console.log(`  Скачано: ${fileName}`)
        }
      } catch (e) {
        console.warn(`  Ошибка ${fileName}:`, e.message)
      }
    }

    if (images.length > 0) {
      newProducts.push({
        images,
        description,
        telegramMessageId: first.id ?? firstId,
      })
      processedIds.add(idKey)
      idx++
    }
  }

  const allProducts = [...existingProducts, ...newProducts]
  fs.writeFileSync(productsPath, JSON.stringify(allProducts, null, 2), "utf8")

  console.log(`\nГотово! Добавлено товаров: ${newProducts.length}, всего: ${allProducts.length}`)
  if (skipped > 0) console.log(`Пропущено (уже в базе): ${skipped}`)
  console.log(`Данные: ${productsPath}`)
  console.log(`Фото: ${outputDir}`)

  await client.disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
