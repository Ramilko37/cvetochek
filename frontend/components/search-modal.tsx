"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search as SearchIcon, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useProductsContext } from "@/components/products-provider"
import { productMatchesSearch } from "@/lib/search-products"

const RECENTS_KEY = "cvetochek-recent-searches"

const POPULAR_QUERIES = [
  "Пионы",
  "Розы",
  "Букеты",
  "Композиции",
  "Корзины",
  "Моно",
  "Свечи",
  "Конфеты",
  "Еловые ветви",
  "Новый год",
]

function loadRecents(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(RECENTS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : []
  } catch {
    return []
  }
}

function saveRecents(items: string[]) {
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

interface SearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [recents, setRecents] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    setRecents(loadRecents())
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  const normalized = query.trim().toLowerCase()
  const { products } = useProductsContext()

  const results = useMemo(() => {
    if (!normalized) return []
    return products
      .filter((p) => productMatchesSearch(p, normalized))
      .slice(0, 6)
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        image: p.images?.[0] ?? "/placeholder.svg",
        price: p.price,
        category: p.category?.name,
      }))
  }, [normalized, products])

  const commitQuery = (value: string) => {
    const v = value.trim()
    if (!v) return
    setRecents((prev) => {
      const next = [v, ...prev.filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 8)
      saveRecents(next)
      return next
    })
  }

  const handleClose = () => {
    setQuery("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (next ? onOpenChange(true) : handleClose())}>
      <DialogContent className="sm:max-w-xl rounded-2xl gap-5">
        <DialogHeader className="space-y-2">
          <DialogTitle className="font-serif text-xl md:text-2xl text-center">
            Поиск
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Название букета, цветы (розы, тюльпаны...), категория"
            className="h-11 rounded-full pl-10 pr-10"
            aria-label="Поиск"
          />
          {query.trim().length > 0 && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setQuery("")}
              aria-label="Очистить"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {!normalized ? (
          <div className="space-y-5">
            {recents.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Недавно искали
                </p>
                <div className="flex flex-wrap gap-2">
                  {recents.map((q) => (
                    <Button
                      key={q}
                      type="button"
                      variant="outline"
                      className="rounded-full h-9 whitespace-nowrap shrink-0"
                      onClick={() => setQuery(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Популярные запросы
              </p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_QUERIES.map((q) => (
                  <Button
                    key={q}
                    type="button"
                    variant="secondary"
                    className="rounded-full h-9 bg-muted hover:bg-accent text-foreground whitespace-nowrap shrink-0"
                    onClick={() => setQuery(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Результаты
            </p>
            {results.length === 0 ? (
              <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center">
                <p className="font-medium text-foreground">Ничего не найдено</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Попробуйте изменить запрос или выберите популярную категорию
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-border overflow-hidden">
                <ul className="divide-y divide-border">
                  {results.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/item/${r.slug}`}
                        className={cn(
                          "flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                        )}
                        onClick={() => {
                          commitQuery(query)
                          handleClose()
                        }}
                      >
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <Image
                            src={r.image}
                            alt={r.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-foreground truncate">
                            {r.name}
                          </p>
                          {r.category && (
                            <p className="text-xs text-muted-foreground truncate">
                              {r.category}
                            </p>
                          )}
                        </div>
                        <div className="text-sm font-medium tabular-nums text-foreground">
                          {r.price.toLocaleString("ru-RU")} ₽
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Нажмите Enter, чтобы сохранить запрос
          </p>
          <Button variant="outline" className="rounded-full" onClick={handleClose}>
            Закрыть
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

