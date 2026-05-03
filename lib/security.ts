import { createHash, randomBytes } from 'node:crypto'

type RateLimitEntry = {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export const PASSWORD_RESET_TOKEN_TTL_MINUTES = 30

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function normalizeUsername(username: string): string {
  return username.trim()
}

export function validateEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateUsername(username: string): string | null {
  if (username.length < 3 || username.length > 30) {
    return 'Username must be 3-30 characters.'
  }

  if (!/^\w+$/.test(username)) {
    return 'Username can only include letters, numbers, and underscores.'
  }

  return null
}

export function validatePasswordStrength(password: string): string | null {
  if (password.length < 12) {
    return 'Password must be at least 12 characters long.'
  }

  if (password.length > 128) {
    return 'Password must be 128 characters or fewer.'
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must include at least one uppercase letter.'
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must include at least one lowercase letter.'
  }

  if (!/\d/.test(password)) {
    return 'Password must include at least one number.'
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return 'Password must include at least one special character.'
  }

  return null
}

export function generateRawToken(bytes = 32): string {
  return randomBytes(bytes).toString('hex')
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get('x-forwarded-for')
  if (!xForwardedFor) {
    return 'unknown'
  }

  return xForwardedFor.split(',')[0]?.trim() || 'unknown'
}

export function isRateLimited(params: {
  key: string
  limit: number
  windowMs: number
}): boolean {
  const now = Date.now()
  const existing = rateLimitStore.get(params.key)

  if (!existing || now > existing.resetAt) {
    rateLimitStore.set(params.key, {
      count: 1,
      resetAt: now + params.windowMs,
    })
    return false
  }

  if (existing.count >= params.limit) {
    return true
  }

  existing.count += 1
  return false
}

export function sanitizeText(text: string, maxLength: number): string {
  return text.trim().slice(0, maxLength)
}
