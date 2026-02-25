import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 


/** 
 * An endpoint for reassigning a piece of artwork. The admin should have the ability to assign the artwork to a 
 * registered user's profile or correct any typos in the submission details before approval
 * 
 * Priority: make sure only admins can do this action, so focus on what the session code is doing, whether or not
 * there's any problems in it! Checkout [...nextauth] and /lib/auth.ts
 */

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json();
  const { newUserId } = body; // { "newUserId": "..." }

  // TASK FOR DEV:
  // 1. Validate newUserId exists and is a valid user
  // 2. Check the current session's user. If that person an admin or not? If yes, continue. If no, give back an error message
  // 3. Use a $transaction to:
  //    a) Update artwork: set user_id = newUserId
  //    b) Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }
  // 4. Return updated artwork.
  // 5. 5. Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }


  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}