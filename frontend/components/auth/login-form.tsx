"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface LoginFormProps {
  /** Без карточки — для встраивания в модалку */
  embedded?: boolean
  onForgotPassword?: () => void
}

export function LoginForm({ embedded, onForgotPassword }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // UI only — без API
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-5",
        !embedded && "rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm"
      )}
    >
      <div className="space-y-2">
        <Label htmlFor="login-email">Email или телефон</Label>
        <Input
          id="login-email"
          type="text"
          placeholder="example@mail.ru или +7 (999) 123-45-67"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg h-11"
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="login-password">Пароль</Label>
          {onForgotPassword ? (
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Забыли пароль?
            </button>
          ) : (
            <a
              href="/auth/forgot-password"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Забыли пароль?
            </a>
          )}
        </div>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg h-11"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="login-remember"
          checked={remember}
          onCheckedChange={(checked) => setRemember(checked === true)}
        />
        <Label
          htmlFor="login-remember"
          className="text-sm font-normal text-muted-foreground cursor-pointer"
        >
          Запомнить меня
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Войти
      </Button>
    </form>
  )
}
