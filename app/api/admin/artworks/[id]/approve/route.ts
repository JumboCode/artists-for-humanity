import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';



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

  const body = await req.json().catch(() => ({}));
  const newUserId = body.newUserId ?? null;

  try {

    // Fetch old user for metadata before any update
    const existing = await prisma.artwork.findUnique({
      where: { id },
      select: { user_id: true }
    });

    const oldUserId = existing?.user_id ?? null;

    const [updatedArtwork] = await prisma.$transaction([
      prisma.artwork.update({
        where: { id },
        data: {
          status: "APPROVED",
          approved_at: new Date(),
          approved_by_id: adminId
        }
      }),

      prisma.adminAction.create({
        data: {
          action_type: "ARTWORK_APPROVED",
          admin_id: adminId,
          artwork_id: id
        }
      }),
      prisma.adminAction.create({
        data: {
          action_type: "USER_EDITED",
          admin_id: adminId,
          artwork_id: id,
          metadata: {
            oldUserId,
            newUserId
          }
        }
      })
    ]);

    // 3. Return updated artwork
    return NextResponse.json(updatedArtwork, { status: 200 });
  
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}