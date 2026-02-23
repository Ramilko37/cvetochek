"use client"

import { useAuth } from "@/store/auth-store"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <main className="min-h-screen bg-background">
        <div className="pt-14 lg:pt-[104px] px-4 sm:px-6 lg:px-8 py-12 max-w-xl mx-auto text-center">
          <p className="text-muted-foreground mb-6">
            Войдите в аккаунт, чтобы увидеть профиль.
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
          Профиль
        </h1>
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Телефон</p>
            <p className="font-medium">
            {user.phone.startsWith("7")
              ? "+7 (" + user.phone.slice(1, 4) + ") " + user.phone.slice(4, 7) + "-" + user.phone.slice(7, 9) + "-" + user.phone.slice(9, 11)
              : user.phone}
          </p>
          </div>
        </div>
      </div>
    </main>
  )
}
