import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 

/** 
 * An endpoint for featuring an artwork. Updates the featured field in the 'artworks' table
 * Priority: make sure only admins can do this action, so focus on what the session code is doing, whether or not
 * there's any problems in it! Checkout [...nextauth] and /lib/auth.ts
 */

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  

  try {

    // 1. Get user ID from session (MUST be admin).
    const session = await getServerSession(authOptions);

    // if the user isn't logged in at all, send error message 
    if (!session?.user?.id) {
        return NextResponse.json(
        { message: 'Unauthorized Action: Please Login' }, 
        { status: 401 }
        );
    }

    // if the user is logged in, but isn't an admin, send error message
    if (session.user.role !== 'ADMIN') {
        return NextResponse.json(
        { message: 'Forbidden: Requires admin privileges' },
        { status: 403 }
        );
    }

    // 2. Find the artwork by its ID
    const artwork = await prisma.Artwork.findUnique({
        where: { id },
        });

        if (!artwork) {
        return NextResponse.json(
            { error: "Artwork not found." },
            { status: 404 }
        );
        }

        const oldFeaturedValue = artwork.featured;

    // 3. Update the artwork's relevant field in the DB
    // 4. Update metadata i.e. the updatedAt field
    const featured = true;
    const [updatedFeaturedStatus] = await prisma.$transaction([
        prisma.Artwork.update({ 
            where: {id} 
            data: { 
                featured, 
                updated_at: new Date()
            }
        }), 

    // 6. Create an AdminAction: action_type='USER_EDITED', admin_id=adminId, artwork_id=id, metadata={ oldUserId: '...', newUserId: newUserId }
        prisma.adminAction.create({ 
            data: { 
                id: session.user.id, 
                created_at: new Date(),
                action_type: ARTWORK_FEATURED,
                metadata: { "old featured value: ": oldFeaturedValue, 
                            "new featured value: ": true }
            }
        }) 
    ]); 

    return NextResponse.json (updatedFeaturedStatus, {status: 200}); 
} catch (err) 
{ 
    console.error("Error setting featured artwork", err); 
    return new NextResponse ( 
        "Internal Server Error", 
        { status: 500 }
    )
}



  

  return NextResponse.json({ message: 'Not Implemented' }, { status: 501 });
}
