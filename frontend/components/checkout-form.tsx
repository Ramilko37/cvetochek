"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/store/cart-store"
import { useAuth } from "@/store/auth-store"
import { generateOrderId } from "@/lib/order-id"
import { AnalyticsEvent, analytics } from "@/lib/analytics"

const PAYMENT_INIT_URL =
  process.env.NEXT_PUBLIC_ROBOKASSA_INIT_URL || "/api/payments/robokassa/init"

const DELIVERY_SLOTS = [
  { value: "09:00–12:00", label: "09:00 – 12:00" },
  { value: "12:00–15:00", label: "12:00 – 15:00" },
  { value: "15:00–18:00", label: "15:00 – 18:00" },
  { value: "18:00–21:00", label: "18:00 – 21:00" },
]

function formatPhoneMask(raw: string): string {
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

function todayISO(): string {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}

function toMoney(value: number): number {
  return Number(value.toFixed(2))
}

function buildRobokassaReceipt(
  cartItems: Array<{ name: string; price: number; quantity: number }>
) {
  return {
    items: cartItems.map((item, index) => {
      const normalizedName =
        item.name.trim().replace(/\s+/g, " ").slice(0, 128) || `Товар ${index + 1}`
      return {
        name: normalizedName,
        quantity: toMoney(item.quantity),
        sum: toMoney(item.price * item.quantity),
      }
    }),
  }
}

function buildOrderLabel(items: Array<{ name: string }>): string {
  if (items.length === 0) return "Заказ"
  const first = items[0]?.name?.trim().replace(/\s+/g, " ") || "Заказ"
  if (items.length === 1) return first.slice(0, 80)
  return `${first.slice(0, 60)} +${items.length - 1}`
}

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [sent, setSent] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [deliveryDate, setDeliveryDate] = useState("")
  const [deliverySlot, setDeliverySlot] = useState("")
  const [street, setStreet] = useState("")
  const [building, setBuilding] = useState("")
  const [apartment, setApartment] = useState("")
  const [entrance, setEntrance] = useState("")
  const [floor, setFloor] = useState("")
  const [recipientName, setRecipientName] = useState("")
  const [comment, setComment] = useState("")
  const [personalDataConsent, setPersonalDataConsent] = useState(false)
  const [websiteHp, setWebsiteHp] = useState("")

  useEffect(() => {
    analytics.track(AnalyticsEvent.CheckoutViewed, {
      cart_items_count: items.reduce((sum, item) => sum + item.quantity, 0),
      cart_total: totalPrice,
      source_path: "/checkout",
    })
  }, [])

  useEffect(() => {
    setDeliveryDate(todayISO())
  }, [])

  useEffect(() => {
    if (isAuthenticated && user?.phone) {
      const digits = user.phone.replace(/\D/g, "")
      const normalized = digits.startsWith("8") ? "7" + digits.slice(1) : digits.length > 0 && digits[0] !== "7" ? "7" + digits : digits
      if (normalized.length >= 11) {
        const rest = normalized.slice(1, 11)
        setPhone("+7 (" + rest.slice(0, 3) + ") " + rest.slice(3, 6) + "-" + rest.slice(6, 8) + "-" + rest.slice(8, 10))
      }
    }
  }, [isAuthenticated, user?.phone])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneMask(e.target.value))
  }

  const handlePhoneFocus = () => {
    if (!phone.trim()) setPhone("+7")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (items.length === 0) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "empty_cart",
      })
      setError("Корзина пуста. Добавьте товары.")
      return
    }
    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "name_too_short",
      })
      setError("Укажите имя (не менее 2 символов).")
      return
    }
    if (!/^[\p{L}\s\-]+$/u.test(trimmedName)) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "name_invalid_symbols",
      })
      setError("Имя может содержать только буквы, пробелы и дефис.")
      return
    }
    const trimmedPhone = phone.replace(/\D/g, "")
    if (trimmedPhone.length < 10) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "phone_invalid",
      })
      setError("Укажите корректный телефон.")
      return
    }
    if (!deliveryDate) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "delivery_date_missing",
      })
      setError("Укажите дату доставки.")
      return
    }
    if (!deliverySlot) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "delivery_slot_missing",
      })
      setError("Выберите интервал доставки.")
      return
    }
    if (!street.trim()) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "street_missing",
      })
      setError("Укажите улицу.")
      return
    }
    if (!building.trim()) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "building_missing",
      })
      setError("Укажите дом.")
      return
    }
    if (!personalDataConsent) {
      analytics.track(AnalyticsEvent.CheckoutValidationFailed, {
        reason: "personal_data_consent_missing",
      })
      setError("Подтвердите согласие на обработку персональных данных.")
      return
    }

    const cartItemsCount = items.reduce((sum, item) => sum + item.quantity, 0)
    setIsSubmitting(true)
    analytics.track(AnalyticsEvent.CheckoutSubmitted, {
      cart_items_count: cartItemsCount,
      cart_total: totalPrice,
      has_comment: Boolean(comment.trim()),
      has_recipient: Boolean(recipientName.trim()),
      has_apartment: Boolean(apartment.trim()),
    })
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "checkout",
          userId: isAuthenticated && user ? user.id : undefined,
          items: items.map((i) => ({
            id: i.id,
            slug: i.slug,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            sizeLabel: i.sizeLabel,
            image: i.image,
            composition: i.composition,
          })),
          totalPrice,
          name: trimmedName,
          phone: trimmedPhone,
          comment: comment.trim() || undefined,
          deliveryDate,
          deliverySlot,
          address: {
            street: street.trim(),
            building: building.trim(),
            apartment: apartment.trim() || undefined,
            entrance: entrance.trim() || undefined,
            floor: floor.trim() || undefined,
          },
          recipientName: recipientName.trim() || undefined,
          personalDataConsent,
          websiteHp: websiteHp || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        analytics.track(AnalyticsEvent.CheckoutFailed, {
          reason: "order_api_error",
          http_status: res.status,
        })
        setError(data.error || "Не удалось отправить заказ. Попробуйте позже.")
        return
      }

      const orderId = generateOrderId()
      const orderLabel = buildOrderLabel(items)
      const receipt = buildRobokassaReceipt(
        items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        }))
      )
      const paymentRes = await fetch(PAYMENT_INIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount: Number(totalPrice).toFixed(2),
          description: `Заказ ${orderId}`,
          receipt,
          shp: { orderId, orderLabel },
        }),
      })
      const paymentData = await paymentRes.json().catch(() => ({}))
      const paymentUrl =
        paymentRes.ok && paymentData?.data?.paymentUrl
          ? String(paymentData.data.paymentUrl)
          : null

      if (paymentUrl) {
        analytics.track(AnalyticsEvent.PaymentRedirected, {
          order_id: orderId,
          payment_url_host: (() => {
            try {
              return new URL(paymentUrl).host
            } catch {
              return "unknown"
            }
          })(),
          cart_items_count: cartItemsCount,
          cart_total: totalPrice,
        })
        clearCart()
        window.location.assign(paymentUrl)
        return
      }

      analytics.track(AnalyticsEvent.PaymentRedirectFailed, {
        reason: "empty_payment_url",
        order_id: orderId,
      })
      setSent(true)
      setError("Заявка отправлена, но не удалось открыть страницу оплаты. Мы свяжемся с вами для подтверждения заказа.")
    } catch {
      analytics.track(AnalyticsEvent.CheckoutFailed, {
        reason: "network_or_runtime_error",
      })
      setError("Ошибка соединения. Проверьте интернет и попробуйте снова.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && !sent) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="rounded-2xl bg-muted/30 border border-border p-8 text-center">
          <p className="font-serif text-xl text-foreground">Корзина пуста</p>
          <p className="mt-2 text-muted-foreground">
            Добавьте букеты или композиции в корзину, чтобы оформить заказ.
          </p>
          <Button asChild className="mt-6 rounded-full h-11 px-8">
            <Link href="/#products">Перейти в каталог</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (sent) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-lg mx-auto rounded-2xl bg-card border border-border p-8 md:p-10 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-9 w-9 text-primary" />
            </div>
          </div>
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mt-6">
            Заявка принята
          </h2>
          <p className="mt-3 text-muted-foreground">
            Мы перезвоним вам в течение 15 минут для подтверждения заказа и
            уточнения деталей. Если не дозвонимся — заказ может быть отменён.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Обычно после отправки заявки мы сразу перенаправляем на страницу оплаты.
          </p>
          {error && (
            <p className="mt-3 text-sm text-destructive">{error}</p>
          )}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/">На главную</Link>
            </Button>
            <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/catalog">В каталог</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
        Оформление заказа
      </h1>
      <p className="text-muted-foreground mb-8">
        Подтвердим заказ по телефону в течение 15 минут. Если не дозвонимся —
        заказ может быть отменён.
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg text-foreground">Контактные данные</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-name">Ваше имя *</Label>
              <Input
                id="checkout-name"
                placeholder="Как к вам обращаться"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg"
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-phone">Телефон *</Label>
              <Input
                id="checkout-phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={handlePhoneChange}
                onFocus={handlePhoneFocus}
                className="rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
          <h2 className="font-serif text-lg text-foreground">Доставка</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-date">Дата доставки *</Label>
              <Input
                id="checkout-date"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={todayISO()}
                className="rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-slot">Интервал *</Label>
              <select
                id="checkout-slot"
                value={deliverySlot}
                onChange={(e) => setDeliverySlot(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                required
              >
                <option value="">Выберите интервал</option>
                {DELIVERY_SLOTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-street">Улица *</Label>
            <Input
              id="checkout-street"
              placeholder="Улица"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkout-building">Дом *</Label>
              <Input
                id="checkout-building"
                placeholder="1"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-apartment">Квартира</Label>
              <Input
                id="checkout-apartment"
                placeholder="12"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-entrance">Подъезд</Label>
              <Input
                id="checkout-entrance"
                placeholder="2"
                value={entrance}
                onChange={(e) => setEntrance(e.target.value)}
                className="rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkout-floor">Этаж</Label>
              <Input
                id="checkout-floor"
                placeholder="3"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout-recipient">Имя получателя (если другой человек)</Label>
            <Input
              id="checkout-recipient"
              placeholder="Кому передать букет"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="rounded-2xl bg-card border border-border p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="checkout-comment">Комментарий к заказу</Label>
            <Input
              id="checkout-comment"
              placeholder="Пожелания по букету, открытке, доставке"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-lg"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          После отправки заявки откроется страница оплаты заказа.
        </p>
        <div className="flex items-start gap-2">
          <Checkbox
            id="checkout-consent"
            checked={personalDataConsent}
            onCheckedChange={(checked) => setPersonalDataConsent(checked === true)}
            className="mt-0.5"
          />
          <Label
            htmlFor="checkout-consent"
            className="text-sm font-normal text-muted-foreground cursor-pointer leading-snug"
          >
            Я соглашаюсь на обработку персональных данных в соответствии с{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              политикой конфиденциальности
            </Link>
            .
          </Label>
        </div>

        {/* Honeypot */}
        <div className="absolute -left-[9999px] top-0" aria-hidden="true">
          <label htmlFor="checkout-hp">Не заполняйте</label>
          <input
            id="checkout-hp"
            tabIndex={-1}
            autoComplete="off"
            value={websiteHp}
            onChange={(e) => setWebsiteHp(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive font-medium">{error}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-lg font-medium">
            Итого: {totalPrice.toLocaleString("ru-RU")} ₽
          </p>
          <Button
            type="submit"
            className="w-full sm:w-auto rounded-full h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка…" : "Оплатить"}
          </Button>
        </div>
      </form>
    </div>
  )
}
