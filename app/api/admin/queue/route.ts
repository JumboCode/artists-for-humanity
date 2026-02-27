import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

/**
 * GET /api/admin/queue
 * Returns all pending artworks for admin moderation
 */
export async function GET() {
  // Check if user is authenticated and is an admin
  const session = await getServerSession(authOptions)
  
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403 }
    )
  }

  try {
    // Fetch all pending artworks with author details
    const pendingArtworks = await prisma.artwork.findMany({
      where: {
        status: 'PENDING',
      },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        created_at: 'asc', // FIFO: First submitted, first in queue
      },
    })

    return NextResponse.json({
      count: pendingArtworks.length,
      artworks: pendingArtworks,
    })
  } catch (error: any) {
    console.error('Error fetching admin queue:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to fetch queue' },
      { status: 500 }
    )
  }
}