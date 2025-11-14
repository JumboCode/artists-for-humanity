import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';


export async function GET( req: Request) {
   try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const artworks = await prisma.artwork.findMany({
      where: { status: "APPROVED" },
      include: {
        author: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    });

    const total = await prisma.artwork.count({
      where: { status: "APPROVED" },
    });

    return NextResponse.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      artworks,
    });
  } catch (err) {
    console.error("Error fetching artworks:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  // TASK FOR DEV:
  // 1. Get artwork data from req.body.
  // 2. If user is logged in (check session), associate with their user_id.
  // 3. If user is *not* logged in, use the 'submitted_by_name/email' fields.
  // 4. Create the new artwork with status 'PENDING'.
  // 5. Note: Cloudinary widget URL will be in req.body.
  
    try {
      const { id } = await params; // if you have an ID route param
      const session = await getServerSession(authOptions);
      const body = await req.json();

      const {
        title,
        description,
        tools_used,
        project_type,
        image_url,
        thumbnail_url,
        submitted_by_name,
        submitted_by_email,
      } = body;

      if (!image_url) {
        return NextResponse.json(
          { error: "Image URL is required." },
          { status: 400 }
        );
      }

      // Build data object conditionally
      const data: any = {
        title,
        description: description || null,
        tools_used: tools_used || null,
        project_type: project_type || null,
        image_url,
        thumbnail_url: thumbnail_url || null,
        status: "PENDING",
        rejection_reason: null,
        featured: false,
        view_count: 0,
        approved_at: null,
      };

      if (session?.user?.id) {
        // logged-in user
        data.userId = session.user.id;
      } else {
        // anonymous submission
        data.submittedByName = submitted_by_name || "Anonymous";
        data.submittedByEmail = submitted_by_email || null;
      }

      const newArtwork = await prisma.artwork.create({ data });

      return NextResponse.json(newArtwork, { status: 201 });
    } catch (error) {
      console.error("Error creating artwork:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
}



