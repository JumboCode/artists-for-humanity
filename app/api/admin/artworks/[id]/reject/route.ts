import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 


/** 
 * An endpoint for rejecting a piece of artwork. The admin should create the appropriate responses (check const/adminActions)
 * and also const/adminNotifications for messaging templates and creating an admin action
 * 
 * Priority: make sure only admins can do this action, so focus on what the session code is doing, whether or not
 * there's any problems in it! Checkout [...nextauth] and /lib/auth.ts
 */

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  

  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be admin).
  // 2. Find the artwork by its ID.
  // 3. 5. Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }


  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}