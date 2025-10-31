import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 



/** 
 * An endpoint for editing a piece of artwork. To be done by the admin only
 * 
 */

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params
  console.log('HIT THE GET ENDPOINT. ID:', id);
  // const adminId = "GET_FROM_SESSION_MIDDLEWARE";

  // TASK FOR DEV:
  // 1. Get user ID from session
  // 2. Find the artwork by its ID
  // 3. Make sure this is a currently logged in admin; if not, reject the request; forbidden
  // 4. Otherwise, let the admin edit this piece of artwork

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}
