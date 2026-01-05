const ratelimit = new Map<string, { count: number; expires: number }>()

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const record = ratelimit.get(key)

  if (!record || now > record.expires) {
    ratelimit.set(key, { count: 1, expires: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count += 1
  return true
}
