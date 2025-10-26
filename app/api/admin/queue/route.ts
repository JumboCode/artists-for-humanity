import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

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