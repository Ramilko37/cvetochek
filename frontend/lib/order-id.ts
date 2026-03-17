function pad2(value: number): string {
  return String(value).padStart(2, "0")
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value).trim()
  } catch {
    return value.trim()
  }
}

export function generateOrderId(now = new Date()): string {
  const yy = pad2(now.getFullYear() % 100)
  const mm = pad2(now.getMonth() + 1)
  const dd = pad2(now.getDate())
  const hh = pad2(now.getHours())
  const min = pad2(now.getMinutes())
  const ss = pad2(now.getSeconds())
  const random = String(Math.floor(Math.random() * 10000)).padStart(4, "0")

  return `CV-${yy}${mm}${dd}-${hh}${min}${ss}-${random}`
}

export function formatOrderIdForDisplay(orderId?: string | null): string | null {
  if (!orderId) return null
  const raw = safeDecode(orderId)

  if (raw.startsWith("CV-")) return raw

  const legacy = raw.match(/^checkout-(\d{13})$/)
  if (legacy) {
    const timestamp = Number(legacy[1])
    if (Number.isFinite(timestamp)) {
      const date = new Date(timestamp)
      const yy = pad2(date.getFullYear() % 100)
      const mm = pad2(date.getMonth() + 1)
      const dd = pad2(date.getDate())
      const hh = pad2(date.getHours())
      const min = pad2(date.getMinutes())
      const ss = pad2(date.getSeconds())
      const short = legacy[1].slice(-4)
      return `CV-${yy}${mm}${dd}-${hh}${min}${ss}-${short}`
    }
  }

  return raw
}

export function formatInvIdForDisplay(invId?: string | null): string | null {
  if (!invId) return null
  const raw = safeDecode(invId)
  if (raw.length <= 10) return raw
  return `${raw.slice(0, 4)}…${raw.slice(-4)}`
}
