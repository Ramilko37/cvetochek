"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/types/cart"
import { getCartItemId } from "@/types/cart"
import { AnalyticsEvent, analytics } from "@/lib/analytics"

const CART_STORAGE_KEY = "cvetochek-cart"

export interface AddToCartPayload {
  slug: string
  name: string
  price: number
  image: string
  sizeId?: string
  sizeLabel?: string
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (payload: AddToCartPayload, quantity?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: (source?: string) => void
  closeCart: () => void
}

function getCartMeta(items: CartItem[]) {
  return {
    cart_items_count: items.reduce((sum, item) => sum + item.quantity, 0),
    cart_total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (payload, quantity = 1) => {
        const id = getCartItemId(payload.slug, payload.sizeId)
        set((state) => {
          const existing = state.items.find((i) => i.id === id)
          const nextItems = existing
            ? state.items.map((i) =>
                i.id === id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [
                ...state.items,
                {
                  id,
                  slug: payload.slug,
                  name: payload.name,
                  price: payload.price,
                  image: payload.image,
                  quantity,
                  sizeId: payload.sizeId,
                  sizeLabel: payload.sizeLabel,
                },
              ]

          const updatedItem = nextItems.find((i) => i.id === id)
          const cartMeta = getCartMeta(nextItems)
          analytics.track(AnalyticsEvent.ProductAddedToCart, {
            product_slug: payload.slug,
            product_name: payload.name,
            product_price: payload.price,
            quantity_added: quantity,
            item_quantity: updatedItem?.quantity ?? quantity,
            size_id: payload.sizeId,
            size_label: payload.sizeLabel,
            ...cartMeta,
          })
          analytics.track(AnalyticsEvent.CartOpened, {
            source: "add_to_cart",
            ...cartMeta,
          })

          if (existing) {
            return {
              items: nextItems,
              isOpen: true,
            }
          }
          return {
            items: nextItems,
            isOpen: true,
          }
        })
      },

      removeItem: (id) =>
        set((state) => {
          const item = state.items.find((i) => i.id === id)
          const nextItems = state.items.filter((i) => i.id !== id)
          if (item) {
            analytics.track(AnalyticsEvent.CartItemRemoved, {
              product_slug: item.slug,
              product_name: item.name,
              item_quantity: item.quantity,
              item_total: item.price * item.quantity,
              ...getCartMeta(nextItems),
            })
          }
          return { items: nextItems }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === id)
          if (!existing) {
            return { items: state.items }
          }

          if (quantity < 1) {
            const nextItems = state.items.filter((i) => i.id !== id)
            analytics.track(AnalyticsEvent.CartItemRemoved, {
              product_slug: existing.slug,
              product_name: existing.name,
              item_quantity: existing.quantity,
              item_total: existing.price * existing.quantity,
              source: "quantity_stepper",
              ...getCartMeta(nextItems),
            })
            return { items: nextItems }
          }

          const nextItems = state.items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          )
          analytics.track(AnalyticsEvent.CartItemQuantityChanged, {
            product_slug: existing.slug,
            product_name: existing.name,
            old_quantity: existing.quantity,
            new_quantity: quantity,
            ...getCartMeta(nextItems),
          })

          return { items: nextItems }
        }),

      clearCart: () =>
        set((state) => {
          if (state.items.length > 0) {
            analytics.track(AnalyticsEvent.CartCleared, {
              ...getCartMeta(state.items),
            })
          }
          return { items: [] }
        }),

      openCart: (source) =>
        set((state) => {
          analytics.track(AnalyticsEvent.CartOpened, {
            source: source || "manual",
            ...getCartMeta(state.items),
          })
          return { isOpen: true }
        }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: CART_STORAGE_KEY,
      partialize: (state) => ({ items: state.items }),
    }
  )
)

/** Хук с тем же API, что и раньше (удобные производные totalItems, totalPrice) */
export function useCart() {
  const items = useCartStore((s) => s.items)
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  return {
    items,
    totalItems,
    totalPrice,
    isOpen: useCartStore((s) => s.isOpen),
    openCart: useCartStore((s) => s.openCart),
    closeCart: useCartStore((s) => s.closeCart),
    addItem: useCartStore((s) => s.addItem),
    removeItem: useCartStore((s) => s.removeItem),
    updateQuantity: useCartStore((s) => s.updateQuantity),
    clearCart: useCartStore((s) => s.clearCart),
  }
}
