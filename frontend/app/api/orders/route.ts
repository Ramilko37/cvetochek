import { NextResponse } from "next/server"
import { z } from "zod"

const orderItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  sizeLabel: z.string().optional(),
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

function formatOrderForTelegram(data: z.infer<typeof bodySchema>): string {
  const lines: string[] = []
  const isQuick = data.type === "quick"

  lines.push(isQuick ? "🌸 БЫСТРЫЙ ЗАКАЗ" : "🌸 НОВЫЙ ЗАКАЗ")
  lines.push("")
  if ("userId" in data && data.userId) {
    lines.push(`🆔 ID пользователя: ${data.userId}`)
  }
  lines.push(`👤 ${data.name}`)
  lines.push(`📞 ${data.phone}`)
  if (data.comment) lines.push(`💬 ${data.comment}`)
  lines.push("")
  lines.push("📦 Состав:")
  for (const item of data.items) {
    const size = item.sizeLabel ? ` (${item.sizeLabel})` : ""
    lines.push(`  • ${item.name}${size} × ${item.quantity} — ${(item.price * item.quantity).toLocaleString("ru-RU")} ₽`)
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

  return lines.join("\n")
}

async function sendToTelegram(text: string): Promise<{ ok: boolean; reason?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()
  if (!token || !chatId) {
    const reason = "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы в .env.local"
    console.error("[orders]", reason)
    return { ok: false, reason }
  }
  try {
    const chatIdParam = /^-?\d+$/.test(chatId) ? Number(chatId) : chatId
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatIdParam,
        text,
      }),
    })
    if (!res.ok) {
      const body = await res.text().catch(() => "")
      const reason = `Telegram API: ${res.status} ${body}`
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

    const text = formatOrderForTelegram(parsed.data)
    const result = await sendToTelegram(text)

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
