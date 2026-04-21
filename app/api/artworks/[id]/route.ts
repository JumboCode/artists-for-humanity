// pages/api/artworks/[id].ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// GET - Fetch artwork details (public)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const viewCookieName = `afh_artwork_view_${id}`
    const cookieHeader = req.headers.get('cookie') || ''
    const viewedRecently = cookieHeader
      .split(';')
      .some(cookie => cookie.trim().startsWith(`${viewCookieName}=`))

    const artwork = await prisma.artwork.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        thumbnail_url: true,
        project_type: true,
        tools_used: true,
        submitted_by_name: true,
        created_at: true,
        view_count: true,
        featured: true,
        status: true,
        author: {
          select: {
            username: true,
            profile: {
              select: {
                display_name: true,
                profile_image_url: true,
              },
            },
          },
        },
      },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Only show approved artwork publicly
    if (artwork.status !== 'APPROVED') {
      return NextResponse.json(
        { error: 'This artwork is not available' },
        { status: 403 }
      )
    }

    if (viewedRecently) {
      return NextResponse.json(artwork, { status: 200 })
    }

    const updatedArtwork = await prisma.artwork.update({
      where: { id },
      data: { view_count: { increment: 1 } },
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        thumbnail_url: true,
        project_type: true,
        tools_used: true,
        submitted_by_name: true,
        created_at: true,
        view_count: true,
        featured: true,
        status: true,
        author: {
          select: {
            username: true,
            profile: {
              select: {
                display_name: true,
                profile_image_url: true,
              },
            },
          },
        },
      },
    })

    const response = NextResponse.json(updatedArtwork, { status: 200 })
    response.cookies.set(viewCookieName, '1', {
      maxAge: 30,
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error('Error fetching artwork:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Update artwork (owner can edit after upload)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Must be logged in
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the artwork
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      select: { user_id: true, status: true },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Only owner can edit
    if (artwork.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Parse request body
    const data = await req.json()

    if (data.action === 'removeFromGallery') {
      if (artwork.status !== 'APPROVED') {
        return NextResponse.json(
          { error: 'Only published artwork can be removed from gallery' },
          { status: 400 }
        )
      }

      const movedToDraft = await prisma.artwork.update({
        where: { id },
        data: {
          status: 'PENDING',
          featured: false,
          approved_at: null,
          approved_by_id: null,
          rejection_reason: null,
          updated_at: new Date(),
        },
        select: {
          id: true,
          status: true,
        },
      })

      return NextResponse.json(
        {
          message: 'Artwork moved to drafts and removed from gallery',
          artwork: movedToDraft,
        },
        { status: 200 }
      )
    }

    if (data.action === 'submitDraft') {
      if (artwork.status === 'APPROVED') {
        return NextResponse.json(
          { error: 'Published artwork cannot be submitted as draft' },
          { status: 400 }
        )
      }

      const submittedDraft = await prisma.artwork.update({
        where: { id },
        data: {
          status: 'PENDING',
          rejection_reason: null,
          updated_at: new Date(),
        },
        select: {
          id: true,
          status: true,
        },
      })

      return NextResponse.json(
        {
          message: 'Draft submitted for admin review',
          artwork: submittedDraft,
        },
        { status: 200 }
      )
    }

    // Update artwork
    const updatedArtwork = await prisma.artwork.update({
      where: { id },
      data: {
        title: data.title || undefined,
        description: data.description || undefined,
        tools_used: data.tools_used || undefined,
        project_type: data.project_type || undefined,
        updated_at: new Date(),
      },
      select: {
        id: true,
        title: true,
        description: true,
        tools_used: true,
        project_type: true,
        status: true,
      },
    })

    return NextResponse.json(updatedArtwork, { status: 200 })
  } catch (error) {
    console.error('Error updating artwork:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete artwork (only for owner)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)

    // Must be logged in
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get the artwork
    const artwork = await prisma.artwork.findUnique({
      where: { id },
      select: { user_id: true },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      )
    }

    // Only owner can delete
    if (artwork.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    // Delete the artwork
    await prisma.artwork.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Artwork deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting artwork:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
