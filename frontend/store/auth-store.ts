"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { AnalyticsEvent, analytics } from "@/lib/analytics"

const AUTH_STORAGE_KEY = "cvetochek-auth"

export interface AuthUser {
  id: number
  phone: string
  username?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  login: (token: string, user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,

      login: (token, user) =>
        set(() => {
          analytics.identify(user.id, { phone: user.phone })
          analytics.track(AnalyticsEvent.UserSignedIn, {
            user_id: user.id,
          })
          return { token, user }
        }),

      logout: () =>
        set(() => {
          analytics.track(AnalyticsEvent.UserSignedOut)
          analytics.reset()
          return { token: null, user: null }
        }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
)

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)
  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    login: useAuthStore((s) => s.login),
    logout: useAuthStore((s) => s.logout),
  }
}
