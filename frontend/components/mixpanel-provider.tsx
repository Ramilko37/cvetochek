"use client"

import { useEffect } from "react"
import { analytics } from "@/lib/analytics"

export function MixpanelProvider() {
  useEffect(() => {
    analytics.init()
  }, [])

  return null
}
