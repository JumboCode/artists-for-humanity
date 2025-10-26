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
  // const adminId = "GET_FROM_SESSION_MIDDLEWARE";

  const { id } = await params
  

  // TASK FOR DEV:
  // 1. This is an "action" endpoint.
  // 2. Use a $transaction to:
  //    a) Update the artwork: set status='APPROVED', approved_at=now(), approved_by_id=adminId
  //    b) Create an AdminAction: action_type='ARTWORK_APPROVED', admin_id=adminId, artwork_id=id
  // 3. Return the updated artwork.
  // 4. Return the appropriate messaging and status code for a PATCH request
  // 5. Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }



  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}