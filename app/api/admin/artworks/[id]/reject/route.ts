import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AdminActionType, ArtworkStatus } from '@prisma/client';


/** 
 * An endpoint for rejecting a piece of artwork. The admin should create the appropriate responses (check const/adminActions)
 * and also const/adminNotifications for messaging templates and creating an admin action
 * 
 * Priority: make sure only admins can do this action, so focus on what the session code is doing, whether or not
 * there's any problems in it! Checkout [...nextauth] and /lib/auth.ts
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  // Check if user is logged in
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json(
      { message: 'Unauthorized Action: Please Login' }, 
      { status: 401 }
    );
  }

  // Check if user is an admin
  if (session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { message: 'Forbidden: Requires admin privileges' },
      { status: 403 }
    );
  }

  // Check if artwork ID provided
  const { id } = await params;
  if (!id) {
    return NextResponse.json(
      { message: 'Artwork ID is required' },
      { status: 400 }
    );
  }

  // Get request body
  let body;
  try {
    body = await req.json();
  } catch (err) {
    return NextResponse.json(
      { message: 'Invalid JSON in request body' },
      { status: 400 }
    );
  }

  // Validate rejection_reason
  //TODO not sure if required or not
  if (!body.rejection_reason || typeof body.rejection_reason !== 'string') {
    return NextResponse.json(
      { message: 'Rejection reason is required and must be a string' },
      { status: 400 }
    );
  }

  try {
    // Get artwork for previous status
    const [previousArtwork] = await prisma.$transaction([
      prisma.artwork.findUnique({
        where: { id }
      })
    ])

    // Check if artwork exists
    if (!previousArtwork) {
      return NextResponse.json(
        { message: 'Artwork not found' },
        { status: 404 }
      );
    }

    const [updatedArtwork] = await prisma.$transaction([
      // Update artwork
      prisma.artwork.update({
        where: { id },
        data: {
          status: ArtworkStatus.REJECTED,
          rejection_reason: body.rejection_reason,
        }
      }),

      // Create admin action
      prisma.adminAction.create({
        data: {
          action_type: AdminActionType.ARTWORK_REJECTED,
          metadata: {
            reason: body.rejection_reason,
            previous_status: previousArtwork.status,
            notification_sent: false,
          },
          admin_id: userId,
          artwork_id: id,
        }
      })
    ]);

    // Return updated artwork
    return NextResponse.json(updatedArtwork, { status: 200 });
  
  } catch (error) {
    // Log error and return 500
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}