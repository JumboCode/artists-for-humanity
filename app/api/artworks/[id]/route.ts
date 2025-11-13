// pages/api/artworks/[id].ts
import { NextResponse } from 'next/server'
import { deleteArtworkById, getArtworkById } from '@/lib/queries/artwork'
import { prisma } from '@/lib/prisma'
import { Artwork } from '@prisma/client'

// TASK FOR DEV: Auth middleware is needed for PATCH/DELETE.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  try {
    // const artworks: Artwork[] = await getArtworkById(id)
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
  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be logged in).
  // 2. Find the artwork.
  // 3. If artwork.user_id !== userId, return 403 Forbidden.
  // 4. If artwork.status !== 'PENDING', return 403 (can't edit after approval).
  // 5. Update the artwork with data from req.body.

  const id = (await params).id
  const body: Partial<Artwork> = await req.json()
  try {
    // const artworks: Artwork[] = await deleteArtworkById(id)
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
  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be logged in).
  // 2. Find the artwork.
  // 3. If artwork.user_id !== userId, return 403 Forbidden.
  // 4. Delete the artwork.
  const id = (await params).id
  try {
    // const artworks: Artwork[] = await deleteArtworkById(id)
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
