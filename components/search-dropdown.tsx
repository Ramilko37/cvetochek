"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search as SearchIcon, X } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockProducts } from "@/lib/mock-products"

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

export function SearchDropdown() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [recents, setRecents] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    setRecents(loadRecents())
    setQuery("")
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  const normalized = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!normalized) return []
    return mockProducts
      .filter((p) => p.name.toLowerCase().includes(normalized))
      .slice(0, 12)
      .map((p) => ({
        slug: p.slug,
        name: p.name,
        image: p.images?.[0] ?? "/placeholder.svg",
        price: p.price,
        originalPrice: p.originalPrice,
        category: p.category?.name,
      }))
  }, [normalized])

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
    setOpen(false)
  }

  const handleResultClick = () => {
    commitQuery(query)
    handleClose()
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
          aria-label="Поиск"
        >
          <SearchIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(calc(100vw-2rem),420px)] p-0 rounded-2xl border border-border/60 bg-background shadow-xl"
      >
        <div className="p-3 border-b border-border/50">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Название букета, категория..."
              className="h-10 rounded-full pl-10 pr-10 text-sm"
              aria-label="Поиск"
            />
            {query.length > 0 && (
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
        </div>

        <div className="max-h-[min(70vh,420px)] overflow-y-auto">
          {!normalized ? (
            <div className="p-4 space-y-4">
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
                        size="sm"
                        className="rounded-full h-8 text-xs"
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
                      size="sm"
                      className="rounded-full h-8 text-xs bg-muted hover:bg-accent"
                      onClick={() => setQuery(q)}
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center">
              <p className="font-medium text-foreground">Ничего не найдено</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Измените запрос или выберите категорию выше
              </p>
            </div>
          ) : (
            <div className="p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Результаты
              </p>
              <div className="flex flex-col">
                {results.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/item/${r.slug}`}
                    onClick={handleResultClick}
                    className="group flex items-center gap-3 p-2 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={r.image}
                        alt={r.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                        {r.name}
                      </p>
                      {r.category && (
                        <p className="text-xs text-muted-foreground truncate">
                          {r.category}
                        </p>
                      )}
                    </div>
                    <div className="text-sm font-medium tabular-nums text-foreground whitespace-nowrap text-right">
                      {r.price.toLocaleString("ru-RU")} ₽
                      {r.originalPrice != null && r.originalPrice > r.price && (
                        <span className="block text-[10px] text-muted-foreground line-through">
                          {r.originalPrice.toLocaleString("ru-RU")}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
