"use client"

import { useEffect, useState } from "react"
import Turnstile from "react-turnstile"

interface TurnstileWidgetProps {
  onVerify: (token: string) => void
  onError?: (error: any) => void
  onExpire?: () => void
}

export function TurnstileWidget({ onVerify, onError, onExpire }: TurnstileWidgetProps) {
  const [siteKey, setSiteKey] = useState<string>("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Only load the widget on the client side
    setMounted(true)
    const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    if (key) {
      setSiteKey(key)
    } else {
      console.warn("Turnstile site key not found in environment variables")
    }
  }, [])

  if (!mounted || !siteKey) {
    return <div className="h-[65px] w-full bg-transparent" /> // Placeholder to prevent layout shift
  }

  return (
    <div className="w-full flex justify-center my-4">
      <Turnstile
        sitekey={siteKey}
        onVerify={onVerify}
        onError={(err) => {
          console.error("Turnstile error:", err)
          if (onError) onError(err)
        }}
        onExpire={() => {
          console.warn("Turnstile expired")
          if (onExpire) onExpire()
        }}
        theme="auto"
        appearance="always" // Use 'always' to ensure visibility in managed mode when challenge is required
      />
    </div>
  )
}
