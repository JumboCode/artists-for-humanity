import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import {
  getClientIp,
  hashToken,
  isRateLimited,
  validatePasswordStrength,
} from '@/lib/security'

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const rateLimited = isRateLimited({
      key: `reset-password:${ip}`,
      limit: 8,
      windowMs: 15 * 60 * 1000,
    })

    if (rateLimited) {
      return NextResponse.json(
        { error: 'Too many reset attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const token = String(body?.token || '')
    const password = String(body?.password || '')

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required.' },
        { status: 400 }
      )
    }

    const passwordError = validatePasswordStrength(password)
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 })
    }

    const tokenHash = hashToken(token)
    const now = new Date()

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        token_hash: tokenHash,
        used_at: null,
        expires_at: {
          gt: now,
        },
      },
      select: {
        id: true,
        user_id: true,
      },
    })

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token.' },
        { status: 400 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: resetToken.user_id },
        data: { password_hash: passwordHash },
      })

      await tx.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { used_at: now },
      })

      await tx.passwordResetToken.deleteMany({
        where: {
          user_id: resetToken.user_id,
          id: { not: resetToken.id },
        },
      })
    })

    return NextResponse.json({ message: 'Password has been reset successfully.' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to reset password. Please request a new reset link.' },
      { status: 500 }
    )
  }
}
