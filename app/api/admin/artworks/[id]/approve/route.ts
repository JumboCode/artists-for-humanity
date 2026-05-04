import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * An endpoint for approving a new artwork. Updates the approved_by, approved_at fields in the 'artworks' table
 * Priority: make sure only admins can do this action, so focus on what the session code is doing, whether or not
 * there's any problems in it! Checkout [...nextauth] and /lib/auth.ts
 */

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 })
}
