export function formatPhoneMask(raw: string): string {
  let digits = raw.replace(/\D/g, "")
  if (digits.startsWith("8")) digits = "7" + digits.slice(1)
  else if (digits.length > 0 && digits[0] !== "7") digits = "7" + digits
  digits = digits.slice(0, 11)
  if (digits.length === 0) return ""
  if (digits.length === 1) return "+7"
  const rest = digits.slice(1)
  let out = "+7 (" + rest.slice(0, 3)
  if (rest.length > 3) out += ") " + rest.slice(3, 6)
  if (rest.length > 6) out += "-" + rest.slice(6, 8)
  if (rest.length > 8) out += "-" + rest.slice(8, 10)
  return out
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("8")) return "7" + digits.slice(1)
  if (digits.length > 0 && digits[0] !== "7") return "7" + digits
  return digits.slice(0, 11)
}

export function isValidRussianPhone(phone: string): boolean {
  const normalized = normalizePhone(phone)
  return normalized.length === 11 && normalized.startsWith("7")
}
