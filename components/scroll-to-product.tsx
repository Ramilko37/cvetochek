"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

const SCROLL_TO_PRODUCT_KEY = "scrollToProduct"
const SCROLL_TO_PRODUCT_FROM_KEY = "scrollToProductFrom"

/** При возврате из карточки товара прокручивает страницу к карточке, с которой перешли. */
export function ScrollToProduct() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === "undefined") return

    const slug = sessionStorage.getItem(SCROLL_TO_PRODUCT_KEY)
    const from = sessionStorage.getItem(SCROLL_TO_PRODUCT_FROM_KEY)

    if (!slug || from !== pathname) return

    const scrollToCard = () => {
      const el = document.querySelector(
        `[data-product-slug="${slug}"]`
      ) as HTMLElement | null
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        sessionStorage.removeItem(SCROLL_TO_PRODUCT_KEY)
        sessionStorage.removeItem(SCROLL_TO_PRODUCT_FROM_KEY)
        return true
      }
      return false
    }

    if (scrollToCard()) return

    // Каталог рендерится после Suspense — даём элементу появиться в DOM
    const maxAttempts = 30
    let attempts = 0
    const id = setInterval(() => {
      attempts++
      if (scrollToCard() || attempts >= maxAttempts) {
        clearInterval(id)
      }
    }, 100)

    return () => clearInterval(id)
  }, [pathname])

  return null
}
