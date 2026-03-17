"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AnalyticsEvent, analytics } from "@/lib/analytics"

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
        set((state) => {
          if (state.slugs.includes(slug)) return state
          analytics.track(AnalyticsEvent.FavoriteAdded, { product_slug: slug })
          return { slugs: [...state.slugs, slug] }
        }),

      remove: (slug) =>
        set((state) => {
          if (state.slugs.includes(slug)) {
            analytics.track(AnalyticsEvent.FavoriteRemoved, { product_slug: slug })
          }
          return {
            slugs: state.slugs.filter((s) => s !== slug),
          }
        }),

      toggle: (slug) =>
        set((state) => {
          if (state.slugs.includes(slug)) {
            analytics.track(AnalyticsEvent.FavoriteRemoved, { product_slug: slug })
            return { slugs: state.slugs.filter((s) => s !== slug) }
          }

          analytics.track(AnalyticsEvent.FavoriteAdded, { product_slug: slug })
          return { slugs: [...state.slugs, slug] }
        }),

      has: (slug) => get().slugs.includes(slug),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      partialize: (state) => ({ slugs: state.slugs }),
    }
  )
)
