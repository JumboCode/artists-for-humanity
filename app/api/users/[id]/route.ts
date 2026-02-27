import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    // Only allow users to edit their own profile
    if (!session || session.user.id !== id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { firstName, lastName, headline, school, year, instagram, bio } = body;

    // Construct display_name from firstName and lastName
    const display_name = `${firstName?.trim() || ''} ${lastName?.trim() || ''}`.trim();

const updatedProfile = await prisma.profile.update({
  where: { user_id: id },
  data: {
    display_name,
    bio: bio ?? headline ?? null, 
    school: school ?? null,
    graduation_year: year ?? null,        
    instagram_handle: instagram ?? null, 
  },
});

    return NextResponse.json({ profile: updatedProfile }, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}