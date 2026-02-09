"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type LoginView = "login" | "forgot"

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [loginView, setLoginView] = useState<LoginView>("login")
  const [forgotEmail, setForgotEmail] = useState("")

  useEffect(() => {
    if (open) setLoginView("login")
  }, [open])

  const handleOpenChange = (next: boolean) => {
    if (!next) setLoginView("login")
    onOpenChange(next)
  }

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // UI only — без API
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl gap-6">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl md:text-2xl text-center">
            Вход в аккаунт
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full rounded-full bg-muted p-1 h-11">
            <TabsTrigger
              value="login"
              className="flex-1 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
              onClick={() => setLoginView("login")}
            >
              Вход
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="flex-1 rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Регистрация
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-6 outline-none">
            {loginView === "login" ? (
              <>
                <LoginForm
                  embedded
                  onForgotPassword={() => setLoginView("forgot")}
                />
              </>
            ) : (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">
                  Введите email — мы отправим ссылку для сброса пароля
                </p>
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="auth-forgot-email">Email</Label>
                    <Input
                      id="auth-forgot-email"
                      type="email"
                      placeholder="example@mail.ru"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="rounded-lg h-11"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Отправить ссылку
                  </Button>
                </form>
                <button
                  type="button"
                  onClick={() => setLoginView("login")}
                  className="w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Назад к входу
                </button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="register" className="mt-6 outline-none">
            <RegisterForm embedded />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
