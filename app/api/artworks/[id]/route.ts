// pages/api/artworks/[id].ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 



// TASK FOR DEV: Auth middleware is needed for PATCH/DELETE.
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {


  // TASK FOR DEV:
  // 1. This is the public gallery.
  // 2. Fetch the artwork (only if it's approved, else return 404 NOT FOUND)
  // 3. Include author profile data.
  // const artworks = await prisma.artwork.findMany({
  //   where: { status: 'APPROVED' },
  //   include: { author: { include: { profile: true } } },
  //   orderBy: { created_at: 'desc' }
  // });

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
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

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
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

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}