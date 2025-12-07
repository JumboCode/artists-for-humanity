import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


export async function GET(req: Request) {
  try {
    // const session = await getServerSession(authOptions);
    // // 1. Check if logged in
    // if (!session?.user?.id) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const MOCKED_USER_ID = "561afd5e-4f4c-4258-be2b-6052a1a67586";
    console.log("DEBUG: Using Mocked User ID:", MOCKED_USER_ID);


    const profile = await prisma.profile.findFirst({
      where: {
        user_id: MOCKED_USER_ID
      },
    });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile }, { status: 200 });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {

    const MOCKED_USER_ID = "561afd5e-4f4c-4258-be2b-6052a1a67586";

    console.log("DEBUG: Using Mocked User ID:", MOCKED_USER_ID);

    const body = await req.json();
    const { bio, displayName, profileImage } = body;


    const updateData: any = {};
    if (bio !== undefined) updateData.bio = bio;
    if (displayName !== undefined) updateData.display_name = displayName;
    if (profileImage !== undefined) updateData.profile_image = profileImage;


    const result = await prisma.profile.updateMany({
      where: {
        user_id: MOCKED_USER_ID,
      },
      data: updateData,
    });

    if (result.count === 0) {
      console.error("DEBUG: No profile found for this User ID.");
      return NextResponse.json({ message: 'Profile not found. Check MOCKED_USER_ID.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Success', result }, { status: 200 });

  } catch (error) {
    console.error("CRITICAL ERROR:", error);
    return NextResponse.json({
      message: 'Internal Server Error',
      error: String(error)
    }, { status: 500 });
  }
}