import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

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
    const { action, rejection_reason, edits } = body

    if (action === 'approve') {
      // Approve the artwork using a transaction
      const result = await prisma.$transaction(async tx => {
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
      const result = await prisma.$transaction(async tx => {
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
    } else if (action === 'edit') {
      // Edit artwork details
      if (!edits || typeof edits !== 'object') {
        return NextResponse.json(
          { message: 'Edits object is required for edit action' },
          { status: 400 }
        )
      }

      // Build update data object with only allowed fields
      const updateData: any = {}
      if (edits.title !== undefined) updateData.title = edits.title
      if (edits.description !== undefined) updateData.description = edits.description
      if (edits.tools_used !== undefined) updateData.tools_used = edits.tools_used
      if (edits.project_type !== undefined) updateData.project_type = edits.project_type
      if (edits.submitted_by_name !== undefined) updateData.submitted_by_name = edits.submitted_by_name
      if (edits.submitted_by_email !== undefined) updateData.submitted_by_email = edits.submitted_by_email

      // If admin edits the submitter email, try to link artwork ownership to that user.
      // This ensures the artwork appears in the matching user's portal immediately.
      if (edits.submitted_by_email !== undefined) {
        const normalizedEmail = String(edits.submitted_by_email || '').trim().toLowerCase()

        if (normalizedEmail) {
          const matchedUser = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true },
          })

          updateData.submitted_by_email = normalizedEmail
          updateData.user_id = matchedUser?.id ?? null
        } else {
          updateData.submitted_by_email = null
          updateData.user_id = null
        }
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          { message: 'No valid fields provided to edit' },
          { status: 400 }
        )
      }

      const result = await prisma.$transaction(async tx => {
        // Update artwork
        const artwork = await tx.artwork.update({
          where: { id },
          data: updateData,
        })

        // Log admin action
        await tx.adminAction.create({
          data: {
            action_type: 'USER_EDITED',
            admin_id: session.user.id,
            artwork_id: id,
            metadata: {
              edits: updateData,
              edited_at: new Date().toISOString(),
            },
          },
        })

        return artwork
      })

      return NextResponse.json({
        message: 'Artwork edited successfully',
        artwork: result,
      })
    } else if (action === 'unpublish') {
      // Move artwork back to PENDING, removing it from gallery and carousel
      const result = await prisma.$transaction(async tx => {
        const artwork = await tx.artwork.update({
          where: { id },
          data: {
            status: 'PENDING',
            featured: false,
            approved_at: null,
            approved_by_id: null,
            rejection_reason: null,
          },
        })

        await tx.adminAction.create({
          data: {
            action_type: 'ARTWORK_UNFEATURED',
            admin_id: session.user.id,
            artwork_id: id,
            metadata: {
              unpublished_at: new Date().toISOString(),
              note: 'Moved back to pending by admin',
            },
          },
        })

        return artwork
      })

      return NextResponse.json({
        message: 'Artwork moved back to pending',
        artwork: result,
      })
    } else {
      return NextResponse.json(
        { message: 'Invalid action. Use "approve", "reject", "edit", or "unpublish"' },
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

/**
 * DELETE /api/admin/artworks/[id]
 * Completely remove an artwork from the database (admin only)
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const session = await getServerSession(authOptions)

    // Check authentication and admin role
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // Check if artwork exists
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      select: { id: true, title: true },
    })

    if (!artwork) {
      return NextResponse.json(
        { message: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Delete the artwork (CASCADE will handle related AdminActions)
    await prisma.artwork.delete({
      where: { id },
    })

    return NextResponse.json(
      {
        success: true,
        message: `Artwork "${artwork.title}" deleted successfully`,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting artwork:', error)
    return NextResponse.json(
      { message: 'Failed to delete artwork' },
      { status: 500 }
    )
  }
}
