"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

const FAVORITES_STORAGE_KEY = "cvetochek-favorites"

interface FavoritesState {
  slugs: string[]
  add: (slug: string) => void
  remove: (slug: string) => void
  toggle: (slug: string) => void
  has: (slug: string) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      slugs: [],

      add: (slug) =>
        set((state) =>
          state.slugs.includes(slug) ? state : { slugs: [...state.slugs, slug] }
        ),

      remove: (slug) =>
        set((state) => ({
          slugs: state.slugs.filter((s) => s !== slug),
        })),

      toggle: (slug) =>
        set((state) =>
          state.slugs.includes(slug)
            ? { slugs: state.slugs.filter((s) => s !== slug) }
            : { slugs: [...state.slugs, slug] }
        ),

      has: (slug) => get().slugs.includes(slug),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      partialize: (state) => ({ slugs: state.slugs }),
    }
  )
)
