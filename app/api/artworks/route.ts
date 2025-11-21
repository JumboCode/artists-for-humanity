import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Mock file upload function - replace with actual cloud storage later
async function uploadFileToStorage(file: File) {
  // TODO: Implement actual file upload to cloud storage (Cloudinary, S3, etc.)
  // For now, return mock URLs
  const timestamp = Date.now()
  const sanitizedName = file.name.replaceAll(' ', '_')
  const publicUrl = `https://mock-storage.com/artworks/${timestamp}-${sanitizedName}`
  const thumbnailUrl = publicUrl.replace(/\.(jpg|jpeg|png|gif|webp)$/i, '_thumb.$1')
  
  return { publicUrl, thumbnailUrl }
}

export async function GET() {
  try {
    // Fetch all approved artworks for public gallery
    const approvedArtworks = await prisma.artwork.findMany({
      where: {
        status: 'APPROVED',
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        image_url: true,
        thumbnail_url: true,
        project_type: true,
        tools_used: true,
        submitted_by_name: true,
        created_at: true,
        view_count: true,
        featured: true,
        author: {
          select: {
            username: true,
            profile: {
              select: {
                display_name: true,
                profile_image_url: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json(approvedArtworks, { status: 200 })
  } catch (error) {
    console.error('Error fetching artworks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be logged in to submit artwork.' },
        { status: 401 }
      )
    }

    // Parse FormData
    const formData = await req.formData()

    // Extract required fields
    const file = formData.get('file') as File | null
    const title = formData.get('title') as string
    
    // Extract optional fields
    const description = formData.get('description') as string | null
    const tools_used = formData.get('tools_used') as string | null
    const project_type = formData.get('project_type') as string | null

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: 'File is required.' },
        { status: 400 }
      )
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required.' },
        { status: 400 }
      )
    }

    if (title.length > 500) {
      return NextResponse.json(
        { error: 'Title must be less than 500 characters.' },
        { status: 400 }
      )
    }

    // File validation
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB.' },
        { status: 400 }
      )
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ]

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and videos are allowed.' },
        { status: 400 }
      )
    }

    // Upload file to storage
    const uploadResult = await uploadFileToStorage(file)
    const image_url = uploadResult.publicUrl
    const thumbnail_url = uploadResult.thumbnailUrl

    // Prepare data for database
    const artworkData = {
      title: title.trim(),
      image_url,
      thumbnail_url,
      status: 'PENDING' as const,
      user_id: session.user.id,
      submitted_by_name: session.user.username || session.user.name || 'Anonymous',
      description: description?.trim() || null,
      tools_used: tools_used ? [tools_used] : [],
      project_type: project_type || null,
      featured: false,
      view_count: 0,
    }

    // Create artwork in database
    const newArtwork = await prisma.artwork.create({
      data: artworkData,
      select: {
        id: true,
        title: true,
        status: true,
        image_url: true,
        created_at: true,
      },
    })

    return NextResponse.json(newArtwork, { status: 201 })
  } catch (error) {
    console.error('Error creating artwork:', error)
    return NextResponse.json(
      { error: 'Internal server error during artwork submission.' },
      { status: 500 }
    )
  }
}



