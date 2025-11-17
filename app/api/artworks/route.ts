import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma' 
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadFileToStorage(file: File) {
    // ... (Your file upload logic)
    const publicUrl = `https://mock-storage.com/artworks/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const thumbnailUrl = publicUrl.replace('.jpg', '_thumb.jpg'); 
    return { publicUrl, thumbnailUrl };
}

export async function GET( req: Request) {
   try {
    const approvedArtworks = await prisma.artwork.findMany({
      where: {
        status: 'APPROVED',
      },
      orderBy: {
        createdAt: 'desc',
      },
      // You can select specific fields to keep the response light
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        project_type: true,
        submitted_by: true, // Display artist name if available
        // ... include other necessary fields
      }
    });

    return NextResponse.json(approvedArtworks, { status: 200 });
  } catch (err) {
    console.error("Error fetching artworks:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {

  // TASK FOR DEV:
  // 1. Get artwork data from req.body.
  // 2. If user is logged in (check session), associate with their user_id.
  // 3. If user is *not* logged in, use the 'submitted_by_name/email' fields.
  // 4. Create the new artwork with status 'PENDING'.
  // 5. Note: Cloudinary widget URL will be in req.body.
  
    try {
      const session = await getServerSession(authOptions);
        
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json(
                { error: "Submission failed. You must be logged in to submit artwork." },
                { status: 401 } // 401 Unauthorized status code
            );
        }

        // 2. Parse the FormData for the file and text fields
        const formData = await req.formData();
        
        // Extract data
        const file = formData.get('file') as unknown as File; // Cast to File object
        const title = formData.get('title') as string;
        const description = formData.get('description') as string | null;
        const tools_used = formData.get('tools_used') as string | null;
        const project_type = formData.get('project_type') as string | null;
        
        // Basic Validation
        if (!file || !title) {
            return NextResponse.json(
              { error: "Missing required fields: file and title." },
              { status: 400 }
            );
        }

        // 3. File Upload (Simulated)
        const uploadResult = await uploadFileToStorage(file);
        const image_url = uploadResult.publicUrl;
        const thumbnail_url = uploadResult.thumbnailUrl;
        
        // 4. Build Data Object (Acceptance Criteria: Artwork is PENDING)
        const data = {
            // Required Fields
            title: title,
            image_url: image_url,
            // Artwork Status and Metadata
            status: "PENDING", // Initial status required by acceptance criteria
            thumbnail_url: thumbnail_url,
            // User Association (Use session data for security and reliability)
            userId: session.user.id,
            submitted_by: session.user.name || "Logged-in User", // Use session name if available
            // Optional Fields
            description: description,
            tools_used: tools_used,
            project_type: project_type,
            rejection_reason: null,
            featured: false,
            view_count: 0,
            approved_at: null,
            // Note: submittedByEmail and submittedByName are skipped because we require login
        };

        // 5. Create new artwork record in the database
        const newArtwork = await prisma.artwork.create({ 
            data,
            // Return only essential fields to the client
            select: { id: true, title: true, status: true, image_url: true }
        });

        // Acceptance Criteria: API modified fields are correct (status=PENDING, userId=session.user.id)
        return NextResponse.json(newArtwork, { status: 201 });
    } catch (error) {
      console.error("Error creating artwork:", error);
        // Return a generic 500 error for security
        return NextResponse.json(
            { error: "Internal server error during artwork submission." },
            { status: 500 }
        );
    }
}



