import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

/** 
 * An endpoint for featuring an artwork. Updates the featured field in the 'artworks' table
 * Priority: make sure only admins can do this action, so focus on what the session code is doing, whether or not
 * there's any problems in it! Checkout [...nextauth] and /lib/auth.ts
 */

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  

  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be admin).
  // 2. Find the artwork by its ID
  // 3. Update the artwork's relevant field in the DB
  // 4. Update metadata i.e. the updatedAt field
  // 5. Return the relevant status code for a PATCH
  // 6. 5. Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}
