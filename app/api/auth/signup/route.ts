import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import {
  getClientIp,
  isRateLimited,
  normalizeEmail,
  normalizeUsername,
  sanitizeText,
  validateEmailFormat,
  validatePasswordStrength,
  validateUsername,
} from '@/lib/security'

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req)
    const signupRateLimitKey = `signup:${ip}`
    const blocked = isRateLimited({
      key: signupRateLimitKey,
      limit: 5,
      windowMs: 15 * 60 * 1000,
    })

    if (blocked) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { firstName, lastName, email, username, password, bio } = body

    const normalizedEmail = normalizeEmail(String(email || ''))
    const normalizedUsername = normalizeUsername(String(username || ''))
    const safeFirstName = sanitizeText(String(firstName || ''), 80)
    const safeLastName = sanitizeText(String(lastName || ''), 80)
    const safeBio = sanitizeText(String(bio || ''), 800)

    // Validate required fields
    if (
      !safeFirstName ||
      !safeLastName ||
      !normalizedEmail ||
      !normalizedUsername ||
      !password
    ) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!validateEmailFormat(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const usernameError = validateUsername(normalizedUsername)
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 })
    }

    const passwordError = validatePasswordStrength(String(password))
    if (passwordError) {
      return NextResponse.json(
        { error: passwordError },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: normalizedEmail,
          mode: 'insensitive',
        },
      },
    })

    const existingUserByUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: normalizedUsername,
          mode: 'insensitive',
        },
      },
    })

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      )
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12)

    // Create user with profile in a transaction
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        password_hash,
        role: 'STUDENT',
        profile: {
          create: {
            display_name: `${safeFirstName} ${safeLastName}`,
            bio: safeBio || null,
          },
        },
      },
      include: {
        profile: true,
      },
    })

    // Remove password_hash from response
    const { password_hash: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { user: userWithoutPassword, message: 'User created successfully' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    )
  }
}
