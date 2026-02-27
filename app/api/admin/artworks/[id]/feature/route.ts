import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

/**
 * PATCH /api/admin/artworks/[id]/feature
 * Toggle featured status of an artwork
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
    // Toggle featured status using a transaction
    const result = await prisma.$transaction(async tx => {
      // Get current artwork state
      const currentArtwork = await tx.artwork.findUnique({
        where: { id },
        select: { featured: true, status: true },
      })

      if (!currentArtwork) {
        throw new Error('Artwork not found')
      }

      // Only approved artworks can be featured
      if (currentArtwork.status !== 'APPROVED') {
        throw new Error('Only approved artworks can be featured')
      }

      // Toggle featured status
      const artwork = await tx.artwork.update({
        where: { id },
        data: {
          featured: !currentArtwork.featured,
        },
      })

      // Log admin action
      await tx.adminAction.create({
        data: {
          action_type: artwork.featured
            ? 'ARTWORK_FEATURED'
            : 'ARTWORK_UNFEATURED',
          admin_id: session.user.id,
          artwork_id: id,
          metadata: {
            featured: artwork.featured,
            updated_at: new Date().toISOString(),
          },
        },
      })

      return artwork
    })

    return NextResponse.json({
      message: result.featured
        ? 'Artwork featured successfully'
        : 'Artwork unfeatured successfully',
      artwork: result,
    })
  } catch (error: any) {
    console.error('Error featuring artwork:', error)

    if (error.message === 'Artwork not found') {
      return NextResponse.json(
        { message: 'Artwork not found' },
        { status: 404 }
      )
    }

    if (error.message === 'Only approved artworks can be featured') {
      return NextResponse.json(
        { message: 'Only approved artworks can be featured' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Failed to feature artwork' },
      { status: 500 }
    )
  }
}
