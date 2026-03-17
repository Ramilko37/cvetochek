"use client"

import mixpanel from "mixpanel-browser"

type AnalyticsPrimitive = string | number | boolean | null
export type AnalyticsProperties = Record<string, AnalyticsPrimitive | undefined>

export const AnalyticsEvent = {
  CatalogViewed: "Catalog Viewed",
  ProductCardClicked: "Product Card Clicked",
  ProductViewed: "Product Viewed",
  ProductAddedToCart: "Product Added To Cart",
  CartOpened: "Cart Opened",
  CartViewed: "Cart Viewed",
  CartItemRemoved: "Cart Item Removed",
  CartItemQuantityChanged: "Cart Item Quantity Changed",
  CartCleared: "Cart Cleared",
  CheckoutStarted: "Checkout Started",
  CheckoutViewed: "Checkout Viewed",
  CheckoutSubmitted: "Checkout Submitted",
  CheckoutValidationFailed: "Checkout Validation Failed",
  CheckoutFailed: "Checkout Failed",
  PaymentRedirected: "Payment Redirected",
  PaymentRedirectFailed: "Payment Redirect Failed",
  PaymentSucceeded: "Payment Succeeded",
  PaymentFailed: "Payment Failed",
  QuickOrderOpened: "Quick Order Opened",
  QuickOrderSubmitted: "Quick Order Submitted",
  QuickOrderFailed: "Quick Order Failed",
  FavoriteAdded: "Favorite Added",
  FavoriteRemoved: "Favorite Removed",
  UserSignedIn: "User Signed In",
  UserSignedOut: "User Signed Out",
} as const

type AnalyticsEventName = (typeof AnalyticsEvent)[keyof typeof AnalyticsEvent]

const FALLBACK_MIXPANEL_TOKEN = "99c5d1a1e66a8bc1fb990161dd1ae4c5"
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || FALLBACK_MIXPANEL_TOKEN
const MIXPANEL_API_HOST = process.env.NEXT_PUBLIC_MIXPANEL_API_HOST || "https://api-eu.mixpanel.com"

class Analytics {
  private static instance: Analytics | null = null
  private initialized = false

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  init() {
    if (this.initialized || typeof window === "undefined" || !MIXPANEL_TOKEN) {
      return
    }

    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: true,
      record_sessions_percent: 100,
      api_host: MIXPANEL_API_HOST,
      track_pageview: true,
    })

    this.initialized = true
  }

  identify(userId: string | number, properties: AnalyticsProperties = {}) {
    if (typeof window === "undefined") return
    this.init()
    mixpanel.identify(String(userId))
    const cleaned = this.cleanProperties(properties)
    if (Object.keys(cleaned).length > 0) {
      mixpanel.people.set(cleaned)
    }
  }

  reset() {
    if (typeof window === "undefined") return
    this.init()
    mixpanel.reset()
  }

  track(event: AnalyticsEventName | string, properties: AnalyticsProperties = {}) {
    if (typeof window === "undefined") return
    this.init()
    mixpanel.track(event, this.cleanProperties(properties))
  }

  private cleanProperties(properties: AnalyticsProperties): Record<string, AnalyticsPrimitive> {
    const cleaned: Record<string, AnalyticsPrimitive> = {}

    for (const [key, value] of Object.entries(properties)) {
      if (value !== undefined) {
        cleaned[key] = value
      }
    }

    return cleaned
  }
}

export const analytics = Analytics.getInstance()
