import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

// Cache the ratelimit instance
let limiter: Ratelimit | null = null

export async function rateLimit(key: string, limit: number = 5, window: number = 60): Promise<boolean> {
  // Fail-open if Redis is not configured (e.g. during build or local dev without keys)
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn("Rate limiting disabled: Missing Upstash credentials")
    return true
  }

  try {
    if (!limiter) {
      limiter = new Ratelimit({
        redis: redis,
        limiter: Ratelimit.slidingWindow(limit, `${window} s`),
        analytics: true,
        timeout: 1000, // 1s timeout for Redis operations
      })
    }

    const { success } = await limiter.limit(key)
    return success
  } catch (error) {
    // Fail-open strategy: If Redis is down or slow, allow the request
    console.error("Rate limit error:", error)
    return true
  }
}
