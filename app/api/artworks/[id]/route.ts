// pages/api/artworks/[id].ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Artwork, ArtworkStatus } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// TASK FOR DEV: Auth middleware is needed for PATCH/DELETE.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id

  try {
    // Check logged in
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to get artwork.' },
        { status: 401 }
      )
    }

    const artwork: Artwork | null = await prisma.artwork.findUnique({
      where: {
        id: id,
      },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: `Artwork with id ${id} not found` },
        { status: 404 }
      )
    }

    return NextResponse.json({ artwork }, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to fetch artwork with id ${id}` },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  try {
    // Check logged in
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to update artwork.' },
        { status: 401 }
      )
    }

    // Get Artwork
    const artwork: Artwork | null = await prisma.artwork.findUnique({
      where: {
        id: id,
      },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: `Artwork with id ${id} not found` },
        { status: 404 }
      )
    }

    // Check if user is allowed to patch artwork
    if (artwork.user_id !== session.user.id) {
      return NextResponse.json(
        { error: `User forbidden from patching artwork with id ${id}` },
        { status: 403 }
      )
    }

    // Check if artwork is pending
    if (artwork.status === ArtworkStatus.PENDING) {
      return NextResponse.json(
        { error: `User cannot edit artwork after approval` },
        { status: 403 }
      )
    }

    // Try to patch artwork
    const body: Partial<Artwork> = await req.json()

    const updatedArtwork: Artwork = await prisma.artwork.update({
      where: {
        id: id,
      },
      data: body,
    })

    return NextResponse.json({ artwork: updatedArtwork }, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to update artwork with id ${id}` },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  try {
    // Check logged in
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to update artwork.' },
        { status: 401 }
      )
    }
    const artwork: Artwork | null = await prisma.artwork.findUnique({
      where: {
        id: id,
      },
    })

    if (!artwork) {
      return NextResponse.json(
        { error: `Artwork with id ${id} not found` },
        { status: 404 }
      )
    }

    // Check if user is allowed to delete artwork
    if (artwork.user_id !== session.user.id) {
      return NextResponse.json(
        { error: `User forbidden from deleting artwork with id ${id}` },
        { status: 403 }
      )
    }

    // Try to delete artwork
    const deletedArtwork: Artwork = await prisma.artwork.delete({
      where: {
        id: id,
      },
    })

    return NextResponse.json({ artwork: deletedArtwork }, { status: 200 })
  } catch (e) {
    return NextResponse.json(
      { error: `Failed to delete artwork with id ${id}` },
      { status: 500 }
    )
  }
}
