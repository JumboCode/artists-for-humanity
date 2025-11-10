// pages/api/artworks/[id].ts
import { NextResponse } from 'next/server'
import { deleteArtworkById, getArtworkById } from '@/lib/queries/artwork'
import { Artwork } from '@/lib/queries/types'

// TASK FOR DEV: Auth middleware is needed for PATCH/DELETE.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id
  try {
    const artworks: Artwork[] = await getArtworkById(id)
    return NextResponse.json({ artwork: artworks[0] }, { status: 200 })
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

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 })
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }) {
  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be logged in).
  // 2. Find the artwork.
  // 3. If artwork.user_id !== userId, return 403 Forbidden.
  // 4. Delete the artwork.
  const id = (await params).id
  try {
    const artworks: Artwork[] = await deleteArtworkById(id);
    return NextResponse.json({ artwork: artworks[0] },{ status: 200 })
  }
  catch(e){return NextResponse.json(
      { error: `Failed to fetch artwork with id ${id}` },
      { status: 500 }
    )}

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 })
}
