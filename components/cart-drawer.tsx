"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useCart } from "@/store/cart-store"

export function CartDrawer() {
  const { items, totalItems, totalPrice, isOpen, closeCart } = useCart()

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md rounded-l-2xl border-l"
      >
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="font-serif text-xl">
            Корзина
            {totalItems > 0 && (
              <span className="ml-2 text-muted-foreground font-sans font-normal">
                {totalItems}{" "}
                {totalItems === 1 ? "товар" : totalItems < 5 ? "товара" : "товаров"}
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Корзина пуста</p>
            <p className="text-sm text-muted-foreground">
              Добавьте букет или композицию — они порадуют вас или близких
            </p>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={closeCart}
            >
              Продолжить покупки
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto px-4">
              <ul className="py-4 space-y-4">
                {items.map((item) => (
                  <CartDrawerItem key={item.id} item={item} />
                ))}
              </ul>
            </div>

            <div className="shrink-0 border-t border-border bg-background px-4 pt-4 pb-6 space-y-4">
              <div className="flex items-center justify-between text-lg font-medium">
                <span>Итого</span>
                <span>{totalPrice.toLocaleString("ru-RU")} ₽</span>
              </div>
              <Button
                asChild
                className="w-full rounded-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Link href="/cart" onClick={closeCart}>
                  Оформить заказ
                </Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function CartDrawerItem({
  item,
}: {
  item: {
    id: string
    slug: string
    name: string
    price: number
    image: string
    quantity: number
    sizeLabel?: string
  }
}) {
  const { removeItem, updateQuantity, closeCart } = useCart()
  const lineTotal = item.price * item.quantity

  return (
    <li className="flex gap-4 rounded-xl border border-border bg-card p-3">
      <Link
        href={`/item/${item.slug}`}
        onClick={closeCart}
        className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted"
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
          onClick={closeCart}
          className="font-medium text-foreground hover:text-primary line-clamp-2"
        >
          {item.name}
        </Link>
        {item.sizeLabel && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Размер: {item.sizeLabel}
          </p>
        )}
        <p className="mt-1 text-sm text-muted-foreground">
          {item.price.toLocaleString("ru-RU")} ₽
          {item.quantity > 1 && (
            <span className="text-foreground"> × {item.quantity}</span>
          )}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1">
          <div className="flex items-center rounded-full border border-border bg-muted/50">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              aria-label="Уменьшить"
            >
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="min-w-6 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              aria-label="Увеличить"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => removeItem(item.id)}
            aria-label="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm font-medium tabular-nums">
          {lineTotal.toLocaleString("ru-RU")} ₽
        </p>
      </div>
    </li>
  )
}
