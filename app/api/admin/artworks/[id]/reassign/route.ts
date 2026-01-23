import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';


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
  const { newUserId } = req.body; // { "newUserId": "..." }

  // TASK FOR DEV:
  // 1. Validate newUserId exists and is a valid user
  // 2. Check the current session's user. If that person an admin or not? If yes, continue. If no, give back an error message
  // 3. Use a $transaction to:
  //    a) Update artwork: set user_id = newUserId
  //    b) Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }
  // 4. Return updated artwork.
  // 5. 5. Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }

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
          user_id: newUserId
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
    return NextResponse.json({ status: 200 });
  
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}