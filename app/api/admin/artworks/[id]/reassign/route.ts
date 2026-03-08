import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

/**
 * PATCH /api/admin/artworks/[id]/reassign
 * Admin action: reassign artwork to a different user
 * Used for guest uploads that need to be assigned to registered users
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Check if user is authenticated and is an admin
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403 }
    )
  }

  try {
    const body = await req.json()
    const { newUserId } = body

    // Validate newUserId
    if (!newUserId || typeof newUserId !== 'string') {
      return NextResponse.json(
        { message: 'newUserId is required and must be a string' },
        { status: 400 }
      )
    }

    // Check if the new user exists
    const newUser = await prisma.user.findUnique({
      where: { id: newUserId },
      select: { id: true, username: true },
    })

    if (!newUser) {
      return NextResponse.json(
        { message: 'Target user not found' },
        { status: 404 }
      )
    }

    // Get current artwork to capture old user_id
    const currentArtwork = await prisma.artwork.findUnique({
      where: { id },
      select: { id: true, user_id: true },
    })

    if (!currentArtwork) {
      return NextResponse.json(
        { message: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Reassign artwork using transaction
    const result = await prisma.$transaction(async tx => {
      // Update artwork user_id
      const artwork = await tx.artwork.update({
        where: { id },
        data: { user_id: newUserId },
      })

      // Log admin action
      await tx.adminAction.create({
        data: {
          action_type: 'USER_EDITED',
          admin_id: session.user.id,
          artwork_id: id,
          metadata: {
            oldUserId: currentArtwork.user_id,
            newUserId: newUserId,
            reassigned_at: new Date().toISOString(),
          },
        },
      })

      return artwork
    })

    return NextResponse.json({
      message: 'Artwork reassigned successfully',
      artwork: result,
    })
  } catch (error: any) {
    console.error('Error reassigning artwork:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to reassign artwork' },
      { status: 500 }
    )
  }
}
