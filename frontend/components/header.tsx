"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { Menu, ShoppingBag, User, Phone, MapPin, ArrowRight, ExternalLink } from "lucide-react"
import { ReviewsMarquee } from "@/components/reviews-marquee"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SearchDropdown } from "@/components/search-dropdown"
import { useCart } from "@/store/cart-store"
import { cn, getImagePath } from "@/lib/utils"

const navigation = [
  { name: "Все товары", href: "/catalog" },
  { name: "Новинки", href: "/new" },
  { name: "Индив. заказ", href: "/custom-order" },
  { name: "Подписка", href: "/subscription" },
]

/** Доп. пункты для мобильного меню (как в футере: О магазине и др.) */
const mobileMenuExtra = [
  { name: "Вопрос-ответ", href: "/faq" },
  { name: "Блог", href: "/blog" },
]

/** Контакты в разделе «О магазине» мобильного меню */
const mobileMenuContacts = [
  { name: "+7 926 470 55 45", href: "tel:+79264705545" },
  { name: "info@cvetochek.ru", href: "mailto:info@cvetochek.ru" },
  { name: "Москва", href: "/contacts" },
]

type MegaLink = {
  title: string
  href: string
  description?: string
}

const megaCatalog: Array<{ title: string; items: MegaLink[] }> = [
  {
    title: "Цветы",
    items: [
      { title: "Букеты", href: "/catalog?category=bouquets", description: "Авторские и сезонные композиции" },
      { title: "Моно-букеты", href: "/catalog?category=mono", description: "Один сорт — идеальный акцент" },
      { title: "Композиции", href: "/catalog?category=compositions", description: "В коробках и декоративных формах" },
      { title: "Корзины", href: "/catalog?category=baskets", description: "Пышно, торжественно, на особый случай" },
      { title: "Весенние", href: "/catalog", description: "Тюльпаны и первоцветы для настроения" },
    ],
  },
  {
    title: "Подборки",
    items: [
      { title: "Со скидкой", href: "/catalog", description: "Лучшие предложения недели" },
      { title: "Популярное", href: "/catalog", description: "Часто выбирают для подарка" },
      { title: "Новинки", href: "/catalog", description: "Свежие поступления и коллекции" },
      { title: "Быстрая доставка", href: "/catalog", description: "Поможем выбрать и собрать оперативно" },
      { title: "До 5 000 ₽", href: "/catalog", description: "Нежные варианты в комфортном бюджете" },
    ],
  },
  {
    title: "Подарки",
    items: [
      { title: "Конфеты", href: "/catalog", description: "Маленькое дополнение к букету" },
      { title: "Свечи", href: "/catalog", description: "Ароматы для уютного вечера" },
      { title: "Новый год", href: "/catalog?category=new-year", description: "Еловые ветви и праздничный декор" },
      { title: "Подарочный сертификат", href: "/catalog", description: "Когда хочется дать свободу выбора" },
      { title: "Индивидуальный заказ", href: "/custom-order", description: "Соберём по вашим пожеланиям" },
      { title: "Подписка на цветы", href: "/subscription", description: "Регулярные доставки и приятные поводы" },
    ],
  },
]

/** Ссылка на карту и отзывы магазина в Яндекс.Картах */
const YANDEX_MAPS_STORE_URL = "https://yandex.ru/maps/-/CPQbn4-K"

/** Карта магазина — только на клиенте (react-yandex-maps требует window) */
const StoreMap = dynamic(() => import("@/components/store-map").then((m) => ({ default: m.StoreMap })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[240px] rounded-lg border border-border/50 bg-muted/30 animate-pulse flex items-center justify-center text-sm text-muted-foreground">
      Загрузка карты…
    </div>
  ),
})

const megaPromo = [
  {
    label: "Акция недели",
    title: "Букет недели",
    href: "/catalog",
    image: getImagePath("/images/bouquet-week.jpg"),
    tone: "bg-[#e8d4d4]",
  },
  {
    label: "Особый повод",
    title: "Индивидуальный заказ",
    href: "/custom-order",
    image: getImagePath("/images/cat-compositions.jpg"),
    tone: "bg-[#dde4e8]",
  },
] as const

function MegaMenuLink({ title, href, description }: MegaLink) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "group flex min-h-[100px] flex-col justify-center rounded-xl px-4 py-3 transition-colors",
            "hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
          )}
        >
          <span className="text-base font-medium text-foreground group-hover:text-foreground">
            {title}
          </span>
          {description ? (
            <span className="mt-1 line-clamp-2 text-sm text-muted-foreground leading-snug">
              {description}
            </span>
          ) : null}
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mapDialogOpen, setMapDialogOpen] = useState(false)
  const { totalItems, openCart } = useCart()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      {/* Top bar — только на десктопе, на мобильном один ряд в nav */}
      <div className="hidden lg:block border-b border-border/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12 relative gap-2">
            <div className="flex-1 flex items-center min-w-0 overflow-hidden">
              <button
                type="button"
                onClick={() => setMapDialogOpen(true)}
                className="flex items-center gap-2 text-sm text-muted-foreground min-w-0 hover:text-foreground transition-colors cursor-pointer"
                aria-label="Показать карту магазина и отзывы"
              >
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                <span className="truncate">Доставка по Москве</span>
              </button>
            </div>

            <Dialog open={mapDialogOpen} onOpenChange={setMapDialogOpen}>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-4">
                  <DialogTitle className="font-serif">Магазин на карте</DialogTitle>
                  <DialogDescription>
                    Локация магазина и отзывы на Яндекс.Картах — адрес, режим работы, маршрут и отзывы покупателей.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 min-h-0 flex flex-col gap-4 px-6 pb-2">
                  <div className="relative w-full rounded-lg overflow-hidden border border-border/50 bg-muted/30 aspect-[4/3] min-h-[240px]">
                    <StoreMap />
                  </div>
                </div>

                <div className="mt-2 pb-6">
                  <div className="px-6 mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-medium text-muted-foreground">Отзывы покупателей</h4>
                    <a
                      href={YANDEX_MAPS_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      Читать все на Яндекс.Картах
                    </a>
                  </div>

                  <ReviewsMarquee />

                  <div className="px-6 mt-4">
                    <Button asChild className="w-full">
                      <a
                        href={YANDEX_MAPS_STORE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2"
                      >
                        Открыть в Яндекс.Картах
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Link
              href="/"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-lg text-foreground hover:text-foreground/90 transition-colors whitespace-nowrap z-10 px-2"
            >
              Цветочек в Горшочек
            </Link>

            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-4 min-w-0 shrink-0">
              <Link 
                href="tel:+79264705545" 
                className="hidden md:flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>+7 926 470 55 45</span>
              </Link>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
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
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 relative">
          {/* Mobile menu button */}
          <div className="flex lg:hidden shrink-0 w-10 justify-start">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full max-w-sm p-0 gap-0 flex flex-col h-full overflow-hidden"
              >
                <SheetHeader className="border-b border-border/50 p-6 shrink-0">
                  <SheetTitle className="font-serif text-lg">
                    Цветочек в Горшочек
                  </SheetTitle>
                  <p className="text-sm text-muted-foreground">
                    Выберите раздел — и мы поможем найти идеальный букет.
                  </p>
                </SheetHeader>

                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                <div className="p-6">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                    Каталог
                  </p>

                  <Accordion type="multiple" className="w-full">
                    {megaCatalog.map((section) => (
                      <AccordionItem key={section.title} value={section.title}>
                        <AccordionTrigger className="py-3 text-base no-underline hover:no-underline">
                          {section.title}
                        </AccordionTrigger>
                        <AccordionContent className="pb-3">
                          <div className="space-y-1">
                            {section.items.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                className="block rounded-xl px-3 py-2 text-base text-foreground hover:bg-secondary transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <div className="font-medium">{item.title}</div>
                                {item.description ? (
                                  <div className="text-sm text-muted-foreground mt-0.5">
                                    {item.description}
                                  </div>
                                ) : null}
                              </Link>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>

                  <div className="mt-8">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                      Меню
                    </p>
                    <div className="space-y-2">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block rounded-xl px-3 py-2 text-base text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
                      О магазине
                    </p>
                    <div className="space-y-2">
                      {mobileMenuExtra.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block rounded-xl px-3 py-2 text-base text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                      <p className="text-xs uppercase tracking-wider text-muted-foreground mt-4 mb-2 pt-2 border-t border-border/50">
                        Контакты
                      </p>
                      {mobileMenuContacts.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block rounded-xl px-3 py-2 text-base text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                </div>

                <div className="mt-auto shrink-0 border-t border-border/50 p-6">
                  <Link
                    href="tel:+79264705545"
                    className="flex items-center gap-2 text-foreground"
                  >
                    <Phone className="h-4 w-4" />
                    <span>+7 926 470 55 45</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Логотип по центру на мобильном — баланс нав-бара */}
          <Link
            href="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-base sm:text-lg text-foreground hover:text-foreground/90 transition-colors lg:hidden z-10 text-center max-w-[70vw] leading-tight"
          >
            Цветочек в Горшочек
          </Link>

          {/* Иконки справа на мобильном: пользователь и корзина */}
          <div className="flex lg:hidden items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <User className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground relative"
              onClick={openCart}
              aria-label="Корзина"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            </Button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {/* Catalog mega menu */}
            <NavigationMenu
              viewport={false}
              className="z-50 w-full max-w-none justify-start"
            >
              <NavigationMenuList className="gap-2 justify-start">
                <NavigationMenuItem
                  onPointerMove={(event) => event.preventDefault()}
                  onPointerLeave={(event) => event.preventDefault()}
                >
                  <NavigationMenuTrigger
                    className={cn(
                      "h-9 rounded-full bg-transparent px-3 py-2 text-sm font-medium",
                      "hover:bg-secondary/60 hover:text-foreground",
                      "data-[state=open]:bg-secondary/70 data-[state=open]:text-foreground",
                      "focus-visible:ring-2 focus-visible:ring-ring/40",
                    )}
                    onPointerMove={(event) => event.preventDefault()}
                    onPointerLeave={(event) => event.preventDefault()}
                  >
                    Каталог
                  </NavigationMenuTrigger>

                  <NavigationMenuContent
                    className={cn(
                      "w-[1100px] max-w-[calc(100vw-2rem)] md:w-[1100px]",
                      "!w-[1100px] !max-w-[calc(100vw-2rem)]",
                      "rounded-2xl border border-border/60 bg-background/95 backdrop-blur-md shadow-xl",
                      "p-0 overflow-hidden mt-3",
                    )}
                    onPointerMove={(event) => event.preventDefault()}
                    onPointerLeave={(event) => event.preventDefault()}
                  >
                    <div className="grid grid-cols-4 gap-6 p-6">
                      {megaCatalog.map((section) => (
                        <div key={section.title} className="min-w-0">
                          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 pl-3">
                            {section.title}
                          </p>
                          <ul className="space-y-1">
                            {section.items.map((item) => (
                              <MegaMenuLink key={item.title} {...item} />
                            ))}
                          </ul>
                        </div>
                      ))}

                      <div className="min-w-0">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3 pl-1">
                          Рекомендуем
                        </p>
                        <div className="space-y-4">
                          {megaPromo.map((card) => (
                            <Link
                              key={card.title}
                              href={card.href}
                              className={cn(
                                "group block rounded-2xl overflow-hidden border border-border/50 bg-card",
                                "transition-transform duration-300 hover:scale-[1.01] hover:shadow-sm",
                              )}
                            >
                              <div className="relative h-28 overflow-hidden">
                                <Image
                                  src={card.image}
                                  alt={card.title}
                                  fill
                                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-foreground">
                                  {card.label}
                                </div>
                              </div>
                              <div className="px-4 py-3">
                                <p className="font-serif text-base text-foreground leading-snug">
                                  {card.title}
                                </p>
                                <div className="mt-3 flex items-center text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary">
                                  Смотреть
                                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border/40 bg-muted/40 px-6 py-4 flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Нужен совет? Подскажем состав, упаковку и доставку.
                      </p>
                      <Button asChild className="rounded-full h-10 px-6">
                        <Link href="/custom-order">Оформить индивидуальный заказ</Link>
                      </Button>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

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

          {/* Поиск — выпадашка с полосками карточек товаров */}
          <div className="hidden lg:flex lg:items-center">
            <SearchDropdown />
          </div>
        </div>
      </nav>
    </header>
  )
}
