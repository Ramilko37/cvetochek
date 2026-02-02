"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem } from "@/types/cart"
import { getCartItemId } from "@/types/cart"

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
  openCart: () => void
  closeCart: () => void
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
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [
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
            ],
            isOpen: true,
          }
        })
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => {
          if (quantity < 1) {
            return { items: state.items.filter((i) => i.id !== id) }
          }
          return {
            items: state.items.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          }
        }),

      openCart: () => set({ isOpen: true }),
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
  }
}
