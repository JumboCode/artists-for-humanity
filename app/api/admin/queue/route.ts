import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/queue
 * Returns artworks for admin moderation and edits across statuses
 */
export async function GET() {
  // Check if user is authenticated and is an admin
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403 }
    )
  }

  try {
    // Fetch artworks across statuses with author details
    const artworks = await prisma.artwork.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        thumbnail_url: true,
        status: true,
        project_type: true,
        tools_used: true,
        submitted_by_name: true,
        submitted_by_email: true,
        created_at: true,
        author: {
          select: {
            username: true,
            profile: {
              select: {
                display_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    const counts = {
      total: artworks.length,
      pending: artworks.filter((art) => art.status === 'PENDING').length,
      approved: artworks.filter((art) => art.status === 'APPROVED').length,
      rejected: artworks.filter((art) => art.status === 'REJECTED').length,
    }

    return NextResponse.json({
      count: artworks.length,
      counts,
      artworks,
    })
  } catch (error: any) {
    console.error('Error fetching admin queue:', error)
    return NextResponse.json(
      { message: error.message || 'Failed to fetch queue' },
      { status: 500 }
    )
  }
}
