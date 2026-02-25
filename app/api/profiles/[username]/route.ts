import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/profiles/[username]
 * Fetch user profile by username
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        artworks: {
          where: {
            status: 'APPROVED',
          },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      username: user.username,
      profile: user.profile,
      artworks: user.artworks,
    })
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}