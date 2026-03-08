import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

/**
 * GET /api/artworks/claim
 * Check for unclaimed guest uploads matching authenticated user's email
 */
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return NextResponse.json(
      { message: 'Unauthorized - Must be logged in' },
      { status: 401 }
    )
  }

  try {
    // Find guest artwork with matching email
    const unclaimedArtwork = await prisma.artwork.findMany({
      where: {
        submitted_by_email: session.user.email,
        user_id: null, // Guest uploads only
      },
      select: {
        id: true,
        title: true,
        image_url: true,
        status: true,
        created_at: true,
      },
    })

    return NextResponse.json({
      count: unclaimedArtwork.length,
      artwork: unclaimedArtwork,
    })
  } catch (error: any) {
    console.error('Error checking unclaimed artwork:', error)
    return NextResponse.json(
      { message: 'Failed to check for unclaimed artwork' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/artworks/claim
 * Claim all guest uploads matching authenticated user's email
 */
export async function POST() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json(
      { message: 'Unauthorized - Must be logged in' },
      { status: 401 }
    )
  }

  try {
    // Claim all matching guest artwork
    const result = await prisma.artwork.updateMany({
      where: {
        submitted_by_email: session.user.email,
        user_id: null, // Only unclaimed guest uploads
      },
      data: {
        user_id: session.user.id,
        // Optionally clear guest fields after claiming
        // submitted_by_name: null,
        // submitted_by_email: null,
      },
    })

    return NextResponse.json({
      message: 'Artwork claimed successfully',
      count: result.count,
    })
  } catch (error: any) {
    console.error('Error claiming artwork:', error)
    return NextResponse.json(
      { message: 'Failed to claim artwork' },
      { status: 500 }
    )
  }
}
