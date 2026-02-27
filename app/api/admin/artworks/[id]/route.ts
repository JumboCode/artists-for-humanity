import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

/**
 * PATCH /api/admin/artworks/[id]
 * Admin actions: approve or reject artwork
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
    const { action, rejection_reason } = body

    if (action === 'approve') {
      // Approve the artwork using a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Update artwork status
        const artwork = await tx.artwork.update({
          where: { id },
          data: {
            status: 'APPROVED',
            approved_at: new Date(),
            approved_by_id: session.user.id,
          },
        })

        // Log admin action
        await tx.adminAction.create({
          data: {
            action_type: 'ARTWORK_APPROVED',
            admin_id: session.user.id,
            artwork_id: id,
            metadata: {
              approved_at: new Date().toISOString(),
            },
          },
        })

        return artwork
      })

      return NextResponse.json({
        message: 'Artwork approved successfully',
        artwork: result,
      })
    } else if (action === 'reject') {
      // Reject the artwork using a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Update artwork status
        const artwork = await tx.artwork.update({
          where: { id },
          data: {
            status: 'REJECTED',
            rejection_reason: rejection_reason || 'No reason provided',
          },
        })

        // Log admin action
        await tx.adminAction.create({
          data: {
            action_type: 'ARTWORK_REJECTED',
            admin_id: session.user.id,
            artwork_id: id,
            metadata: {
              rejection_reason: rejection_reason || 'No reason provided',
              rejected_at: new Date().toISOString(),
            },
          },
        })

        return artwork
      })

      return NextResponse.json({
        message: 'Artwork rejected successfully',
        artwork: result,
      })
    } else {
      return NextResponse.json(
        { message: 'Invalid action. Use "approve" or "reject"' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('Error updating artwork:', error)
    
    // Provide specific error messages
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Artwork not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: error.message || 'Failed to update artwork' },
      { status: 500 }
    )
  }
}
