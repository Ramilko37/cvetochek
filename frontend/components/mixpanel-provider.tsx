"use client"

import { useEffect } from "react"
import mixpanel from "mixpanel-browser"

const FALLBACK_MIXPANEL_TOKEN = "99c5d1a1e66a8bc1fb990161dd1ae4c5"
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || FALLBACK_MIXPANEL_TOKEN
const MIXPANEL_API_HOST = process.env.NEXT_PUBLIC_MIXPANEL_API_HOST || "https://api-eu.mixpanel.com"

let isMixpanelInitialized = false

export function MixpanelProvider() {
  useEffect(() => {
    if (!MIXPANEL_TOKEN || isMixpanelInitialized) {
      return
    }

    mixpanel.init(MIXPANEL_TOKEN, {
      autocapture: true,
      record_sessions_percent: 100,
      api_host: MIXPANEL_API_HOST,
      track_pageview: true,
    })

    isMixpanelInitialized = true
  }, [])

  return null
}
