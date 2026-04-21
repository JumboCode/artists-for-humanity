import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

/**
 * GET /api/users/artwork
 * Get current user's artwork (both published and pending approval)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const artworks = await prisma.artwork.findMany({
      where: {
        user_id: session.user.id,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        thumbnail_url: true,
        project_type: true,
        tools_used: true,
        status: true,
        featured: true,
        created_at: true,
        approved_at: true,
        rejection_reason: true,
      },
    })

    // Separate published (approved) from pending approval (pending/rejected)
    const published = artworks.filter(art => art.status === 'APPROVED')
    const pendingApproval = artworks.filter(art => art.status !== 'APPROVED')

    return NextResponse.json(
      {
        published,
        pendingApproval,
        total: artworks.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching user artwork:', error)
    return NextResponse.json(
      { error: 'Failed to fetch artwork' },
      { status: 500 }
    )
  }
}
