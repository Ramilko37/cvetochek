import { NextResponse } from "next/server"

function formatCustomOrderForTelegram(data: {
  name: string
  phone: string
  budget: string
  wishes: string
}): string {
  const lines: string[] = []
  lines.push("🌷 ЗАЯВКА НА ИНДИВИДУАЛЬНЫЙ ЗАКАЗ")
  lines.push("")
  lines.push(`👤 ${data.name}`)
  lines.push(`📞 ${data.phone}`)
  lines.push(`💰 Бюджет: ${data.budget}`)
  if (data.wishes) lines.push(`💬 Пожелания: ${data.wishes}`)
  lines.push("")
  return lines.join("\n")
}

async function sendToTelegram(
  text: string,
  photo?: File | Blob
): Promise<{ ok: boolean; reason?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim()
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim()
  if (!token || !chatId) {
    const reason = "TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы в .env.local"
    console.error("[custom-order]", reason)
    return { ok: false, reason }
  }
  const chatIdParam = /^-?\d+$/.test(chatId) ? Number(chatId) : chatId

  try {
    if (photo && photo.size > 0) {
      const formData = new FormData()
      formData.append("chat_id", String(chatIdParam))
      formData.append("photo", photo)
      formData.append("caption", text)

      const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const body = await res.text().catch(() => "")
        const reason = `Telegram API: ${res.status} ${body}`
        console.error("[custom-order]", reason)
        return { ok: false, reason }
      }
      return { ok: true }
    }

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
      console.error("[custom-order]", reason)
      return { ok: false, reason }
    }
    return { ok: true }
  } catch (e) {
    const reason = e instanceof Error ? e.message : String(e)
    console.error("[custom-order] sendToTelegram throw:", reason)
    return { ok: false, reason }
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()

    const websiteHp = formData.get("websiteHp")
    if (websiteHp && String(websiteHp).length > 0) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    const name = String(formData.get("name") || "").trim()
    const phone = String(formData.get("phone") || "").trim()
    const budget = String(formData.get("budget") || "").trim()
    const wishes = String(formData.get("wishes") || "").trim()
    const file = formData.get("file") as File | null

    if (name.length < 2) {
      return NextResponse.json({ error: "Укажите имя" }, { status: 400 })
    }
    if (phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Укажите телефон" }, { status: 400 })
    }

    const text = formatCustomOrderForTelegram({ name, phone, budget, wishes })
    const photo =
      file && file.size > 0 && file.type.startsWith("image/") ? file : undefined

    const result = await sendToTelegram(text, photo)

    if (!result.ok) {
      if (result.reason) console.error("[custom-order] 502 причина:", result.reason)
      return NextResponse.json(
        {
          error: "Не удалось отправить заявку. Попробуйте позже или позвоните нам.",
          reason: result.reason,
        },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("[custom-order] POST error:", e)
    return NextResponse.json(
      { error: "Произошла ошибка. Попробуйте позже." },
      { status: 500 }
    )
  }
}
