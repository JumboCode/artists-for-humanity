import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/artworks
 * Returns all APPROVED artworks for admin review/management
 */
export async function GET() {
  const session = await getServerSession(authOptions)

  if (session?.user?.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Unauthorized - Admin access required' },
      { status: 403 }
    )
  }

  try {
    const artworks = await prisma.artwork.findMany({
      where: { status: 'APPROVED' },
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        thumbnail_url: true,
        status: true,
        project_type: true,
        tools_used: true,
        featured: true,
        submitted_by_name: true,
        submitted_by_email: true,
        created_at: true,
        author: {
          select: {
            email: true,
            username: true,
            profile: {
              select: { display_name: true },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    })

    return NextResponse.json({ count: artworks.length, artworks })
  } catch (error: unknown) {
    console.error('Error fetching approved artworks:', error)
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Failed to fetch artworks' },
      { status: 500 }
    )
  }
}
