"use client"

import { useEffect } from "react"
import { AnalyticsEvent, analytics } from "@/lib/analytics"

interface CheckoutStatusTrackerProps {
  status: "success" | "fail"
  orderId?: string | null
  invId?: string | null
  amount?: string | null
  orderLabel?: string | null
}

export function CheckoutStatusTracker({
  status,
  orderId,
  invId,
  amount,
  orderLabel,
}: CheckoutStatusTrackerProps) {
  useEffect(() => {
    const numericAmount = amount ? Number(amount) : null
    const payload = {
      order_id: orderId || undefined,
      invoice_id: invId || undefined,
      amount:
        typeof numericAmount === "number" && Number.isFinite(numericAmount)
          ? numericAmount
          : amount || undefined,
      order_label: orderLabel || undefined,
      source_path: status === "success" ? "/checkout/success" : "/checkout/fail",
    }

    if (status === "success") {
      analytics.track(AnalyticsEvent.PaymentSucceeded, payload)
      return
    }

    analytics.track(AnalyticsEvent.PaymentFailed, payload)
  }, [status, orderId, invId, amount, orderLabel])

  return null
}
