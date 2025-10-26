import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 


/** 
 * An endpoint for editing a piece of artwork. Only the right user should be allowed to do this i.e. the user who
 * is logged in can only PATCH their own artwork
 * and also const/adminNotifications for messaging templates and creating an admin action
 */

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  

  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be admin).
  // 2. Find the artwork by its ID


  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}