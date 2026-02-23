"use client"

import Link from "next/link"
import { useFavoritesStore } from "@/store/favorites-store"
import { useAuth } from "@/store/auth-store"
import { AuthModal } from "@/components/auth/auth-modal"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const { slugs, remove } = useFavoritesStore()
  const { isAuthenticated } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background">
      <div className="pt-14 lg:pt-[104px] px-4 sm:px-6 lg:px-8 py-12 max-w-4xl mx-auto">
        <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-6">
          Избранное
        </h1>

        {!isAuthenticated && (
          <div className="mb-8 p-6 rounded-2xl border border-border bg-muted/30">
            <p className="text-sm text-muted-foreground mb-4">
              Войдите в аккаунт, чтобы сохранять избранное на всех устройствах.
            </p>
            <Button onClick={() => setAuthOpen(true)} className="rounded-full">
              Войти по телефону
            </Button>
          </div>
        )}

        {slugs.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground mb-4">
              Пока ничего нет. Добавляйте товары в избранное, нажимая на сердечко.
            </p>
            <Button asChild className="rounded-full">
              <Link href="/catalog">В каталог</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {slugs.map((slug) => (
              <div
                key={slug}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-card"
              >
                <Link
                  href={`/item/${slug}`}
                  className="font-medium text-primary hover:underline"
                >
                  /item/{slug}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(slug)}
                  className="text-muted-foreground"
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        )}

        <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
      </div>
    </main>
  )
}
