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
type TelegramOrderPhoto = {
  url: string
  caption: string
}

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

function buildPhotoCaption(item: ParsedOrder["items"][number]): string {
  return truncateCaption(
    [
      `📷 ${itemTitle(item)}`,
      `Состав: ${itemComposition(item)}`,
      `Количество: ${item.quantity}`,
      `Сумма: ${itemSum(item)} ₽`,
    ].join("\n")
  )
}

function formatOrderForTelegram(
  data: ParsedOrder,
  requestUrl?: string
): { text: string; photos: TelegramOrderPhoto[] } {
  const lines: string[] = []
  const isQuick = data.type === "quick"
  const photos: TelegramOrderPhoto[] = []

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
    lines.push(`${index + 1}. Название: ${itemTitle(item)}`)
    lines.push(`   Состав: ${itemComposition(item)}`)
    lines.push(`   Количество: ${item.quantity}`)
    lines.push(`   Сумма: ${itemSum(item)} ₽`)
    lines.push(`   Фото: ${photoUrl ? "см. фото ниже" : "нет фото"}`)
    lines.push("")

    if (photoUrl) {
      photos.push({
        url: photoUrl,
        caption: buildPhotoCaption(item),
      })
    }
  })

  if (data.items.length === 0) {
    lines.push("—")
    lines.push("")
  }

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
    lines.push("")
    lines.push("💵 Оплата: при получении (наличными)")
  } else {
    lines.push("💵 Оплата: при получении (наличными)")
    lines.push("⚠️ Нужно уточнить адрес и дату доставки по телефону.")
  }

  return { text: lines.join("\n"), photos }
}

async function sendToTelegram(
  text: string,
  photos: TelegramOrderPhoto[]
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
      const reason = `Telegram API: ${textRes.status} ${body}`
      console.error("[orders]", reason)
      return { ok: false, reason }
    }

    for (const photo of photos) {
      const photoRes = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatIdParam,
          photo: photo.url,
          caption: photo.caption,
        }),
      })

      if (!photoRes.ok) {
        const body = await photoRes.text().catch(() => "")
        const reason = `sendPhoto failed: ${photoRes.status} ${body}`
        console.error("[orders]", reason)

        // Fallback: чтобы фото все равно можно было открыть, отправим ссылку.
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatIdParam,
            text: `${photo.caption}\nФото: ${photo.url}`,
          }),
        }).catch(() => null)
      }
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

    const { text, photos } = formatOrderForTelegram(parsed.data, request.url)
    const result = await sendToTelegram(text, photos)

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
