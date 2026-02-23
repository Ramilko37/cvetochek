"use client"

import { useAuth } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-14 lg:pt-[104px] px-4 sm:px-6 lg:px-8 py-12 max-w-xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">
            Войдите в аккаунт, чтобы увидеть историю заказов.
          </p>
          <Button asChild className="rounded-full">
            <Link href="/">На главную</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-14 lg:pt-[104px] px-4 sm:px-6 lg:px-8 py-12 max-w-xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
          Мои заказы
        </h1>
        <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
          <p className="text-muted-foreground">
            История заказов будет отображаться здесь после интеграции с backend.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/catalog">В каталог</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
