"use client"

import { createContext, useContext } from "react"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/types/product"

type ProductsContextValue = {
  products: Product[]
  isLoading: boolean
  error: string | null
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const value = useProducts()
  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProductsContext(): ProductsContextValue {
  const ctx = useContext(ProductsContext)
  if (!ctx) {
    return {
      products: [],
      isLoading: true,
      error: null,
    }
  }
  return ctx
}
