import { NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'


export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  // TASK FOR DEV:
  // 1. This is the public gallery.
  // 2. Fetch all artworks where status is 'APPROVED'.
  // 3. Include pagination (e.g., ?page=1&limit=20).
  // 4. Include author profile data.
  // const artworks = await prisma.artwork.findMany({
  //   where: { status: 'APPROVED' },
  //   include: { author: { include: { profile: true } } },
  //   orderBy: { created_at: 'desc' }
  // });
  return NextResponse.json({}, { status: 501 });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  // TASK FOR DEV:
  // 1. Get artwork data from req.body.
  // 2. If user is logged in (check session), associate with their user_id.
  // 3. If user is *not* logged in, use the 'submitted_by_name/email' fields.
  // 4. Create the new artwork with status 'PENDING'.
  // 5. Note: Cloudinary widget URL will be in req.body.
  
  return NextResponse.json({}, { status: 501 });
}



