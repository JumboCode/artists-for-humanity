import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import {
  PASSWORD_RESET_TOKEN_TTL_MINUTES,
  generateRawToken,
  getClientIp,
  hashToken,
  isRateLimited,
  normalizeEmail,
  validateEmailFormat,
} from '@/lib/security'

const GENERIC_FORGOT_RESPONSE = {
  message: 'If that email exists, a reset link has been sent.',
}

function resolveResetOrigin(req: Request): string {
  // In production, prefer configured canonical URL.
  if (process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // In local/dev, always use the current request origin.
  return new URL(req.url).origin
}

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rateLimited = isRateLimited({
      key: `forgot-password:${ip}`,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    })

    if (rateLimited) {
      return NextResponse.json(GENERIC_FORGOT_RESPONSE, { status: 200 })
    }

    const body = await req.json()
    const email = normalizeEmail(String(body?.email || ''))

    if (!email || !validateEmailFormat(email)) {
      return NextResponse.json(GENERIC_FORGOT_RESPONSE, { status: 200 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(GENERIC_FORGOT_RESPONSE, { status: 200 })
    }

    const rawToken = generateRawToken(32)
    const tokenHash = hashToken(rawToken)
    const expiresAt = new Date(Date.now() + PASSWORD_RESET_TOKEN_TTL_MINUTES * 60 * 1000)

    await prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.deleteMany({
        where: {
          user_id: user.id,
          used_at: null,
        },
      })

      await tx.passwordResetToken.create({
        data: {
          user_id: user.id,
          token_hash: tokenHash,
          expires_at: expiresAt,
        },
      })
    })

    const origin = resolveResetOrigin(req)
    const resetUrl = `${origin}/reset-password?token=${encodeURIComponent(rawToken)}`

    try {
      await sendPasswordResetEmail(email, resetUrl)
    } catch (emailErr) {
      // Log but do NOT expose email errors to the client
      console.error('Failed to send password reset email:', emailErr)
    }

    return NextResponse.json(GENERIC_FORGOT_RESPONSE)
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(GENERIC_FORGOT_RESPONSE, { status: 200 })
  }
}
