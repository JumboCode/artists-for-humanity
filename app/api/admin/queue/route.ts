import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

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

const session = await getServerSession(authOptions);
    
    // check if user is logged in
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized Action: Please Login' }, 
        { status: 401 }
      );
    }
  
    // check if user is an admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Forbidden: Requires admin privileges' },
        { status: 403 }
      );
    }
  
    // Securely get the admin ID from the session
    const adminId = session.user.id;
    const { id: artworkId } = (await params);
  
    if (!artworkId) {
      return NextResponse.json(
        { message: 'Artwork ID is required' },
        { status: 400 }
      );
    }
  
    // get artwork

    const body = await req.json().catch(() => ({}));
  const newUserId = body.newUserId ?? null;

  try {

    const totalCount = await prisma.artwork.count({
      where: { status: 'PENDING' }
    });

    // Fetch old user for metadata before any update
    const pendingArtworks = await prisma.artwork.findMany({
      where: {
        status: 'PENDING',
      },
      select: {
        id: true,       // Usually helpful to keep the ID
        user_id: true,
      },
      orderBy: {
        created_at: 'asc', // FIFO
      },
    });


    // 3. Return updated artwork
    return NextResponse.json({
      count: totalCount,
      data: pendingArtworks
    }, { status: 200 });
  
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}