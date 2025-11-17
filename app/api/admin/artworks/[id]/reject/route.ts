import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { AdminActionType } from '@prisma/client';


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
  // const adminId = "GET_FROM_SESSION_MIDDLEWARE";

  const { id } = await params
  
  // TASK FOR DEV:
  // 1. Get user ID from session (MUST be admin).
  // 2. Find the artwork by its ID.
  // 3. Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }

  const session = await getServerSession(authOptions);

  // Check if user is logged in
  // if (!session?.user?.id) {
  //   return NextResponse.json(
  //     { message: 'Unauthorized Action: Please Login' }, 
  //     { status: 401 }
  //   );
  // }

  // Check if user is an admin
  // if (session.user.role !== 'ADMIN') {
  //   return NextResponse.json(
  //     { message: 'Forbidden: Requires admin privileges' },
  //     { status: 403 }
  //   );
  // }

  // Securely get the admin ID from the session
  // const adminId = session.user.id;
  const adminId = "test";
  const { id: artworkId } = (await params);

  // Check if artworkId provided
  if (!artworkId) {
    return NextResponse.json(
      { message: 'Artwork ID is required' },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));

  try {

    const [updatedArtwork] = await prisma.$transaction([
      // Update artwork
      prisma.artwork.update({
        where: { id },
        data: {
          status: "REJECTED",
          rejection_reason: body.rejection_reason,
          updated_at: new Date(),
        }
      }),

      // Create admin action
      prisma.adminAction.create({
        data: {
          action_type: AdminActionType.ARTWORK_REJECTED,
          metadata: {
            reason: body.rejection_reason,
//TODO            previous_status: ,
            notification_sent: false,
          },
          created_at: new Date(),
          admin_id: adminId,
          artwork_id: artworkId,
        }
      })
    ]);

    // Return updated artwork
    return NextResponse.json(updatedArtwork, { status: 200 });
  
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}