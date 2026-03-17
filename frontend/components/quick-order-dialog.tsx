"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Zap } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { AnalyticsEvent, analytics } from "@/lib/analytics"

export interface QuickOrderProduct {
  name: string
  price: number
  image: string
  /** для отправки в API (если есть) */
  slug?: string
}

interface QuickOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: QuickOrderProduct | null
}

export function QuickOrderDialog({
  open,
  onOpenChange,
  product,
}: QuickOrderDialogProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [comment, setComment] = useState("")
  const [personalDataConsent, setPersonalDataConsent] = useState(false)
  const [websiteHp, setWebsiteHp] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setName("")
    setPhone("")
    setComment("")
    setPersonalDataConsent(false)
    setWebsiteHp("")
    setIsSubmitting(false)
  }

  /** Маска +7 (XXX) XXX-XX-XX */
  const formatPhoneMask = (raw: string): string => {
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneMask(e.target.value))
  }

  const handlePhoneFocus = () => {
    if (!phone.trim()) setPhone("+7")
  }

  useEffect(() => {
    if (!open) resetForm()
  }, [open])

  useEffect(() => {
    if (!open || !product) return
    analytics.track(AnalyticsEvent.QuickOrderOpened, {
      product_name: product.name,
      product_slug: product.slug,
      product_price: product.price,
    })
  }, [open, product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      analytics.track(AnalyticsEvent.QuickOrderFailed, {
        reason: "name_too_short",
        product_name: product.name,
        product_slug: product.slug,
      })
      toast({
        title: "Укажите имя",
        description: "Введите имя не короче двух символов.",
        variant: "destructive",
      })
      return
    }
    if (!/^[\p{L}\s\-]+$/u.test(trimmedName)) {
      analytics.track(AnalyticsEvent.QuickOrderFailed, {
        reason: "name_invalid_symbols",
        product_name: product.name,
        product_slug: product.slug,
      })
      toast({
        title: "Некорректное имя",
        description: "Имя может содержать только буквы, пробелы и дефис.",
        variant: "destructive",
      })
      return
    }

    const trimmedPhone = phone.replace(/\D/g, "")
    if (trimmedPhone.length < 10) {
      analytics.track(AnalyticsEvent.QuickOrderFailed, {
        reason: "phone_invalid",
        product_name: product.name,
        product_slug: product.slug,
      })
      toast({
        title: "Укажите телефон",
        description: "Введите корректный номер телефона для связи.",
        variant: "destructive",
      })
      return
    }
    if (!personalDataConsent) {
      analytics.track(AnalyticsEvent.QuickOrderFailed, {
        reason: "personal_data_consent_missing",
        product_name: product.name,
        product_slug: product.slug,
      })
      toast({
        title: "Требуется согласие",
        description: "Подтвердите согласие на обработку персональных данных.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const itemId = product.slug ?? `quick-${product.name.replace(/\s+/g, "-").toLowerCase()}`
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "quick",
          items: [
            {
              id: itemId,
              slug: itemId,
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          ],
          totalPrice: product.price,
          name: trimmedName,
          phone: trimmedPhone,
          comment: comment.trim() || undefined,
          personalDataConsent,
          websiteHp: websiteHp || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        analytics.track(AnalyticsEvent.QuickOrderFailed, {
          reason: "order_api_error",
          http_status: res.status,
          product_name: product.name,
          product_slug: product.slug,
        })
        toast({
          title: "Ошибка",
          description: data.error ?? "Не удалось отправить заявку. Попробуйте позже.",
          variant: "destructive",
        })
        return
      }
      analytics.track(AnalyticsEvent.QuickOrderSubmitted, {
        product_name: product.name,
        product_slug: product.slug,
        product_price: product.price,
      })
      toast({
        title: "Заявка принята",
        description: `Мы перезвоним вам в ближайшее время по поводу «${product.name}».`,
      })
      onOpenChange(false)
    } catch {
      analytics.track(AnalyticsEvent.QuickOrderFailed, {
        reason: "network_or_runtime_error",
        product_name: product.name,
        product_slug: product.slug,
      })
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заявку. Попробуйте позже.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!product) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Быстрый заказ
          </DialogTitle>
        </DialogHeader>

        {/* Превью товара */}
        <div className="flex gap-4 p-3 rounded-xl bg-muted/50">
          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-muted">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-foreground truncate">{product.name}</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {product.price.toLocaleString("ru-RU")} ₽
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quick-order-name">Ваше имя</Label>
            <Input
              id="quick-order-name"
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
            <Label htmlFor="quick-order-phone">Телефон</Label>
            <Input
              id="quick-order-phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              className="rounded-lg"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quick-order-comment">Комментарий (необязательно)</Label>
            <Input
              id="quick-order-comment"
              placeholder="Пожелания по заказу или доставке"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="rounded-lg"
            />
          </div>
          <div className="flex items-start gap-2">
            <Checkbox
              id="quick-order-consent"
              checked={personalDataConsent}
              onCheckedChange={(checked) => setPersonalDataConsent(checked === true)}
              className="mt-0.5"
            />
            <Label
              htmlFor="quick-order-consent"
              className="text-sm font-normal text-muted-foreground cursor-pointer leading-snug"
            >
              Я соглашаюсь на обработку персональных данных в соответствии с{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                политикой конфиденциальности
              </Link>
              .
            </Label>
          </div>
          <div className="absolute -left-[9999px] top-0" aria-hidden="true">
            <label htmlFor="quick-order-hp">Не заполняйте</label>
            <input
              id="quick-order-hp"
              tabIndex={-1}
              autoComplete="off"
              value={websiteHp}
              onChange={(e) => setWebsiteHp(e.target.value)}
            />
          </div>
          <Button
            type="submit"
            className="w-full rounded-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка…" : "Оставить заявку"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
