"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart-store"

export function CartPageContent() {
  const { items, totalItems, totalPrice, removeItem, updateQuantity } =
    useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center rounded-2xl bg-muted/30 border border-border">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl text-foreground">
              Корзина пуста
            </h1>
            <p className="mt-2 text-muted-foreground">
              Добавьте букет или композицию — они порадуют вас или близких
            </p>
          </div>
          <Button asChild className="rounded-full h-12 px-8">
            <Link href="/#products">Перейти в каталог</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-serif text-2xl md:text-3xl text-foreground mb-8">
        Корзина
        <span className="ml-2 text-muted-foreground font-sans font-normal text-lg">
          {totalItems}{" "}
          {totalItems === 1 ? "товар" : totalItems < 5 ? "товара" : "товаров"}
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Список товаров */}
        <ul className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
            >
              <Link
                href={`/item/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/item/${item.slug}`}
                  className="font-medium text-foreground hover:text-primary line-clamp-2"
                >
                  {item.name}
                </Link>
                {item.sizeLabel && (
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Размер: {item.sizeLabel}
                  </p>
                )}
                <p className="mt-1 font-medium">
                  {item.price.toLocaleString("ru-RU")} ₽
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center rounded-full border border-border bg-muted/50">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      aria-label="Уменьшить"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="min-w-8 text-center text-sm">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      aria-label="Увеличить"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    aria-label="Удалить"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-medium">
                  {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                </p>
              </div>
            </li>
          ))}
        </ul>

        {/* Итого и оформление */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 p-6 rounded-2xl bg-card border border-border space-y-6">
            <div className="flex items-center justify-between text-lg font-medium">
              <span>Итого</span>
              <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Бесплатная доставка по Москве при заказе от 4 500 ₽
            </p>
            <Button
              asChild
              className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/checkout">Оформить заказ</Link>
            </Button>
            <Link
              href="/#products"
              className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Продолжить покупки
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
