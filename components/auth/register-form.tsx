"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface RegisterFormProps {
  /** Без карточки — для встраивания в модалку */
  embedded?: boolean
}

export function RegisterForm({ embedded }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agree, setAgree] = useState(false)

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
        <Label htmlFor="register-name">Имя</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="Как к вам обращаться"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-lg h-11"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          placeholder="example@mail.ru"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg h-11"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-phone">Телефон</Label>
        <Input
          id="register-phone"
          type="tel"
          placeholder="+7 (999) 123-45-67"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="rounded-lg h-11"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-password">Пароль</Label>
        <Input
          id="register-password"
          type="password"
          placeholder="Не менее 6 символов"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg h-11"
          required
          minLength={6}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="register-confirm">Повторите пароль</Label>
        <Input
          id="register-confirm"
          type="password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="rounded-lg h-11"
          required
        />
      </div>
      <div className="flex items-start gap-2">
        <Checkbox
          id="register-agree"
          checked={agree}
          onCheckedChange={(checked) => setAgree(checked === true)}
        />
        <Label
          htmlFor="register-agree"
          className="text-sm font-normal text-muted-foreground cursor-pointer leading-tight"
        >
          Я соглашаюсь с{" "}
          <Link href="#" className="text-primary hover:underline">
            условиями обработки персональных данных
          </Link>
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        Зарегистрироваться
      </Button>
    </form>
  )
}
