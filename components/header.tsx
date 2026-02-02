"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User, X, MapPin, Phone, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart-drawer"
import { AuthModal } from "@/components/auth/auth-modal"
import { SearchModal } from "@/components/search-modal"
import { useCart } from "@/store/cart-store"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Все товары", href: "#products" },
  { name: "Новинки", href: "#new" },
  { name: "Индив. заказ", href: "#custom" },
  { name: "Подписка", href: "#subscription" },
]

const catalogItems = [
  { name: "Букеты", href: "#bouquets" },
  { name: "Композиции", href: "#compositions" },
  { name: "Корзины", href: "#baskets" },
  { name: "Моно-букеты", href: "#mono" },
  { name: "Новый год", href: "#newyear" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { totalItems, openCart } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      {/* Top bar */}
      <div className="border-b border-border/30">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Address */}
            <button
              type="button"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <MapPin className="h-4 w-4" />
              <span>Москва</span>
              <ChevronDown className="h-3 w-3" />
            </button>

            {/* Logo center */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="font-serif text-lg text-foreground">Цветочек в Горшочек</span>
            </Link>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <Link
                href="tel:+74951207722"
                className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>8 (495) 120-77-22</span>
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-9 w-9"
                onClick={() => setAuthModalOpen(true)}
                aria-label="Войти"
              >
                <User className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground relative"
                onClick={openCart}
                aria-label="Корзина"
              >
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center min-w-4">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {/* Catalog dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setCatalogOpen(!catalogOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Каталог
                <ChevronDown className={cn("h-4 w-4 transition-transform", catalogOpen && "rotate-180")} />
              </button>

              {catalogOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setCatalogOpen(false)} />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background rounded-xl shadow-lg border border-border py-2 z-20">
                    {catalogItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        onClick={() => setCatalogOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search */}
          <div className="hidden lg:flex lg:items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
              aria-label="Поиск"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 z-50 transition-opacity duration-300",
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        <div
          className={cn(
            "fixed inset-y-0 left-0 w-full max-w-sm bg-background px-6 py-6 shadow-xl transition-transform duration-300",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-serif text-lg text-foreground">Цветочек в Горшочек</span>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-8">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Каталог</p>
            <div className="space-y-3 mb-8">
              {catalogItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-lg text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">Меню</p>
            <div className="space-y-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-lg text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <button
                type="button"
                className="block w-full text-left text-lg font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setAuthModalOpen(true)
                }}
              >
                Войти
              </button>
            </div>

            <div className="mt-3">
              <button
                type="button"
                className="flex w-full items-center gap-2 text-left text-lg font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => {
                  setMobileMenuOpen(false)
                  setSearchOpen(true)
                }}
              >
                <Search className="h-5 w-5" />
                Поиск
              </button>
            </div>
          </div>

          <div className="absolute bottom-8 left-6 right-6">
            <Link
              href="tel:+74951207722"
              className="flex items-center gap-2 text-foreground"
            >
              <Phone className="h-4 w-4" />
              <span>8 (495) 120-77-22</span>
            </Link>
          </div>
        </div>
      </div>

      <CartDrawer />
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}
