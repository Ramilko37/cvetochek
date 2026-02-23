"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { cn } from "@/lib/utils"
import { formatPhoneMask, isValidRussianPhone } from "@/lib/phone"
import { useAuth } from "@/store/auth-store"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

interface LoginFormProps {
  /** Без карточки — для встраивания в модалку */
  embedded?: boolean
  onSuccess?: () => void
}

type Step = "phone" | "otp"

export function LoginForm({ embedded, onSuccess }: LoginFormProps) {
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login } = useAuth()

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneMask(e.target.value))
    setError(null)
  }

  const handlePhoneFocus = () => {
    if (!phone.trim()) setPhone("+7")
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!isValidRussianPhone(phone)) {
      setError("Введите корректный российский номер")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${STRAPI_URL}/api/phone-auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Ошибка отправки")
      }
      setStep("otp")
      setOtp("")
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (otp.length !== 4) {
      setError("Введите код из SMS")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`${STRAPI_URL}/api/phone-auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code: otp }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Ошибка входа")
      }
      login(data.jwt, {
        id: data.user.id,
        phone: data.user.phone,
        username: data.user.username,
      })
      onSuccess?.()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setStep("phone")
    setOtp("")
    setError(null)
  }

  return (
    <form
      onSubmit={step === "phone" ? handleSendOtp : handleVerifyOtp}
      className={cn(
        "space-y-5",
        !embedded && "rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
      )}
    >
      {step === "phone" ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="login-phone">Номер телефона</Label>
            <Input
              id="login-phone"
              type="tel"
              placeholder="+7 (999) 123-45-67"
              value={phone}
              onChange={handlePhoneChange}
              onFocus={handlePhoneFocus}
              className="rounded-lg h-11"
              required
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "Отправка…" : "Получить код"}
          </Button>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label>Код из SMS на {phone}</Label>
            <div className="flex justify-center">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={setOtp}
                disabled={isLoading}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading || otp.length !== 4}
          >
            {isLoading ? "Проверка…" : "Войти"}
          </Button>
          <button
            type="button"
            onClick={handleBack}
            className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Изменить номер
          </button>
        </>
      )}
    </form>
  )
}
