interface TurnstileVerifyResponse {
  success: boolean
  "error-codes"?: string[]
  challenge_ts?: string
  hostname?: string
}

export async function verifyTurnstile(token: string): Promise<boolean> {
  // Fail-open if secrets are missing (e.g. local dev)
  if (!process.env.TURNSTILE_SECRET_KEY) {
    console.warn("Turnstile verification disabled: Missing secret key")
    return true
  }

  try {
    const formData = new FormData()
    formData.append("secret", process.env.TURNSTILE_SECRET_KEY)
    formData.append("response", token)

    const result = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: formData,
    })

    const outcome: TurnstileVerifyResponse = await result.json()

    if (!outcome.success) {
      console.error("Turnstile verification failed:", outcome["error-codes"])
      return false
    }

    return true
  } catch (error) {
    console.error("Turnstile verification error:", error)
    // Fail-closed on API error to prevent bot spam during outages,
    // or Fail-open depending on business risk tolerance.
    // Choosing fail-open here to match the rate-limit strategy:
    return true
  }
}
