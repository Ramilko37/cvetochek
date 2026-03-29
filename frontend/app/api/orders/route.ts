import { NextResponse } from "next/server"
import { z } from "zod"

const orderItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  sizeLabel: z.string().optional(),
  image: z.string().optional(),
  composition: z.string().optional(),
})

const checkoutBodySchema = z.object({
  type: z.literal("checkout"),
  items: z.array(orderItemSchema).min(1, "Корзина пуста"),
  totalPrice: z.number(),
  name: z.string().min(2, "Укажите имя"),
  phone: z.string().min(10, "Укажите телефон"),
  personalDataConsent: z
    .boolean({ required_error: "Нужно согласие на обработку персональных данных" })
    .refine((value) => value, "Нужно согласие на обработку персональных данных"),
  userId: z.number().optional(),
  comment: z.string().optional(),
  deliveryDate: z.string().min(1, "Укажите дату доставки"),
  deliverySlot: z.string().min(1, "Укажите интервал доставки"),
  address: z.object({
    street: z.string().min(1, "Укажите улицу"),
    building: z.string().min(1, "Укажите дом"),
    apartment: z.string().optional(),
    entrance: z.string().optional(),
    floor: z.string().optional(),
  }),
  recipientName: z.string().optional(),
  websiteHp: z.string().max(0).optional(), // honeypot
})

const quickOrderBodySchema = z.object({
  type: z.literal("quick"),
  items: z.array(orderItemSchema).min(1),
  totalPrice: z.number(),
  name: z.string().min(2),
  phone: z.string().min(10),
  personalDataConsent: z
    .boolean({ required_error: "Нужно согласие на обработку персональных данных" })
    .refine((value) => value, "Нужно согласие на обработку персональных данных"),
  comment: z.string().optional(),
  websiteHp: z.string().max(0).optional(),
  userId: z.number().optional(),
})

const bodySchema = z.discriminatedUnion("type", [
  checkoutBodySchema,
  quickOrderBodySchema,
])

type ParsedOrder = z.infer<typeof bodySchema>

function resolveSiteUrl(requestUrl?: string): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL
  if (envUrl?.trim()) return envUrl.trim().replace(/\/$/, "")
  if (requestUrl) {
    try {
      return new URL(requestUrl).origin.replace(/\/$/, "")
    } catch {
      // no-op
    }
  }
  return "https://cvetipolubvi.ru"
}

function normalizePathWithBasePath(rawPath: string): string {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || "").trim().replace(/\/$/, "")
  const normalizedBasePath = basePath
    ? basePath.startsWith("/")
      ? basePath
      : `/${basePath}`
    : ""
  const normalizedPath = rawPath.startsWith("/") ? rawPath : `/${rawPath}`

  if (!normalizedBasePath) return normalizedPath
  if (normalizedPath === normalizedBasePath || normalizedPath.startsWith(`${normalizedBasePath}/`)) {
    return normalizedPath
  }
  return `${normalizedBasePath}${normalizedPath}`
}

function resolveTelegramPhotoUrl(image?: string, requestUrl?: string): string | null {
  if (!image?.trim()) return null
  const raw = image.trim()
  if (/^https?:\/\//i.test(raw)) return raw
  if (/^\/\//.test(raw)) return `https:${raw}`

  // Strapi иногда отдает медиа как относительный /uploads/... путь.
  if (raw.startsWith("/uploads/")) {
    const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL?.trim().replace(/\/$/, "")
    if (strapiBase) return `${strapiBase}${raw}`
  }

  const siteUrl = resolveSiteUrl(requestUrl)
  const path = normalizePathWithBasePath(raw)
  return `${siteUrl}${path}`
}

function truncateCaption(text: string, limit = 900): string {
  const value = text.trim()
  if (value.length <= limit) return value
  return `${value.slice(0, limit - 1)}…`
}

function itemTitle(item: ParsedOrder["items"][number]): string {
  const size = item.sizeLabel ? ` (${item.sizeLabel})` : ""
  return `${item.name}${size}`
}

function itemComposition(item: ParsedOrder["items"][number]): string {
  return item.composition?.trim() || "не указан"
}

function itemSum(item: ParsedOrder["items"][number]): string {
  return (item.price * item.quantity).toLocaleString("ru-RU")
}

function formatOrderForTelegram(
  data: ParsedOrder,
  requestUrl?: string
): { text: string; firstPhotoUrl: string | null } {
  const lines: string[] = []
  const isQuick = data.type === "quick"
  let firstPhotoUrl: string | null = null

  lines.push(isQuick ? "🌸 БЫСТРЫЙ ЗАКАЗ" : "🌸 НОВЫЙ ЗАКАЗ")
  lines.push("")
  if ("userId" in data && data.userId) {
    lines.push(`🆔 ID пользователя: ${data.userId}`)
  }
  lines.push(`👤 ${data.name}`)
  lines.push(`📞 ${data.phone}`)
  if (data.comment) lines.push(`💬 ${data.comment}`)
  lines.push("")

  lines.push("📦 Фактура:")
  data.items.forEach((item, index) => {
    const photoUrl = resolveTelegramPhotoUrl(item.image, requestUrl)
    if (!firstPhotoUrl && photoUrl) {
      firstPhotoUrl = photoUrl
    }
    lines.push(`${index + 1}. Название: ${itemTitle(item)}`)
    lines.push(`   Состав: ${itemComposition(item)}`)
    lines.push(`   Количество: ${item.quantity}`)
    lines.push(`   Сумма: ${itemSum(item)} ₽`)
    lines.push("")
  })

  if (data.items.length === 0) {
    lines.push("—")
    lines.push("")
  }

  lines.push(`🖼️ Фото: ${firstPhotoUrl ? "прикреплено к сообщению (1 шт.)" : "нет фото"}`)
  lines.push("")
  lines.push(`💰 Итого: ${data.totalPrice.toLocaleString("ru-RU")} ₽`)
  lines.push("")

  if (data.type === "checkout") {
    lines.push(`📅 ${data.deliveryDate} ${data.deliverySlot}`)
    const addr = [
      data.address.street,
      data.address.building,
      data.address.apartment && `кв. ${data.address.apartment}`,
      data.address.entrance && `подъезд ${data.address.entrance}`,
      data.address.floor && `${data.address.floor} этаж`,
    ]
      .filter(Boolean)
      .join(", ")
    lines.push(`📍 ${addr}`)
    if (data.recipientName) lines.push(`🎁 Получатель: ${data.recipientName}`)
  } else {
    lines.push("⚠️ Нужно уточнить адрес и дату доставки по телефону.")
  }

  return { text: lines.join("\n"), firstPhotoUrl }
}

async function sendToTelegram(
  text: string,
  firstPhotoUrl: string | null
): Promise<{ ok: boolean; reason?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()
  if (!token || !chatId) {
    const reason = "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы в .env.local"
    console.error("[orders]", reason)
    return { ok: false, reason }
  }
  try {
    const chatIdParam = /^-?\d+$/.test(chatId) ? Number(chatId) : chatId
    if (firstPhotoUrl) {
      const photoRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatIdParam,
          photo: firstPhotoUrl,
          caption: truncateCaption(text, 1000),
        }),
      })

      if (!photoRes.ok) {
        const body = await photoRes.text().catch(() => "")
        const reason = `Telegram API sendPhoto failed: ${photoRes.status} ${body}`
        console.error("[orders]", reason)

        // Fallback: одно текстовое сообщение со ссылкой на фото.
        const fallbackRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatIdParam,
            text: `${text}\n\nФото: ${firstPhotoUrl}`,
          }),
        })

        if (!fallbackRes.ok) {
          const fallbackBody = await fallbackRes.text().catch(() => "")
          return {
            ok: false,
            reason: `Fallback sendMessage failed: ${fallbackRes.status} ${fallbackBody}`,
          }
        }
      }

      return { ok: true }
    }

    const textRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatIdParam,
        text,
      }),
    })
    if (!textRes.ok) {
      const body = await textRes.text().catch(() => "")
      const reason = `Telegram API sendMessage failed: ${textRes.status} ${body}`
      console.error("[orders]", reason)
      return { ok: false, reason }
    }

    return { ok: true }
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e)
    console.error("[orders] sendToTelegram throw:", reason)
    return { ok: false, reason }
  }
}

/** GET — проверка, что роут доступен (для отладки). В браузере открой /api/orders */
export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "orders API",
    env: {
      hasToken: Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim()),
      hasChatId: Boolean(process.env.TELEGRAM_CHAT_ID?.trim()),
    },
  })
}

export async function POST(request: Request) {
  try {
    const raw = await request.json()

    // Honeypot: если заполнено — молча игнорируем
    if (raw?.websiteHp && String(raw.websiteHp).length > 0) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const parsed = bodySchema.safeParse(raw)
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors
      const message = Object.values(first).flat().join(" ") || "Неверные данные"
      return NextResponse.json({ error: message }, { status: 400 })
    }

    const { text, firstPhotoUrl } = formatOrderForTelegram(parsed.data, request.url)
    const result = await sendToTelegram(text, firstPhotoUrl)

    if (!result.ok) {
      if (result.reason) console.error("[orders] 502 причина:", result.reason)
      return NextResponse.json(
        {
          error: "Не удалось отправить заказ. Попробуйте позже или позвоните нам.",
          reason: result.reason,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[orders] POST error:", e)
    return NextResponse.json(
      { error: "Произошла ошибка. Попробуйте позже." },
      { status: 500 }
    )
  }
}
