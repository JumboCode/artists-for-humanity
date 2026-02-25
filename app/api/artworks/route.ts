import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// Mock file upload function - replace with actual cloud storage later
async function uploadFileToStorage(file: File) {
  // TODO: Implement actual file upload to cloud storage (Cloudinary, S3, etc.)
  // For now, return mock URLs
  const timestamp = Date.now()
  const sanitizedName = file.name.replace(/\s+/g, '_')
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
    // Check authentication (optional - guests can upload too)
    const session = await getServerSession(authOptions)

    // Parse data
    const data = await req.json()

    // Extract required fields
    const image_base64 = data.image_base64 as string | null
    const title = data.title as string
    
    // Extract optional fields
    const description = data.description as string | null
    const tools_usedString = data.tools_used as string | null
    const project_type = data.project_type as string | null
    
    // Guest upload fields
    const submitted_by_name = data.submitted_by_name as string | null
    const submitted_by_email = data.submitted_by_email as string | null

    // Title validation
    if (!title || title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required.' },
        { status: 400 }
      )
    }
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title must be less than 200 characters.' },
        { status: 400 }
      )
    }

    // Guest upload validation
    if (!session?.user?.id) {
      // Guest uploads require artist name and email
      if (!submitted_by_name || submitted_by_name.trim().length === 0) {
        return NextResponse.json(
          { error: 'Artist name is required for guest uploads.' },
          { status: 400 }
        )
      }
      if (!submitted_by_email || submitted_by_email.trim().length === 0) {
        return NextResponse.json(
          { error: 'Email is required for guest uploads.' },
          { status: 400 }
        )
      }
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(submitted_by_email)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address.' },
          { status: 400 }
        )
      }
    }

    // Get tools_used as array
    let tools_used: string[] | null = null
    if (tools_usedString && tools_usedString.trim().length > 0) {
      tools_used = tools_usedString.split(',').map((tool) => tool.trim())
    }
    if (tools_used && tools_used.length > 3) {
      return NextResponse.json(
        { error: 'You can only select up to 3 mediums.' },
        { status: 400 }
      )
    }

    // Description validation
    if (description && description.length > 1000) {
      return NextResponse.json(
        { error: 'Description must be less than 1000 characters.' },
        { status: 400 }
      )
    }

    // File presence validation
    if (!image_base64 || image_base64.trim().length === 0) {
      return NextResponse.json(
        { error: 'File is required.' },
        { status: 400 }
      )
    }

    // Convert base64 to File object
    //TODO check if better way exists
    const matches = image_base64.match(/^data:(.+);base64,(.+)$/)
    if (!matches || matches.length !== 3) {
      return NextResponse.json(
        { error: 'Invalid file data.' },
        { status: 400 }
      )
    }
    const mimeType = matches[1]
    const base64Data = matches[2]
    const byteCharacters = atob(base64Data)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    const file = new File([byteArray], 'upload', { type: mimeType })

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
    //TODO const uploadResult = await uploadFileToStorage(file)
    // const image_url = uploadResult.publicUrl
    // const thumbnail_url = uploadResult.thumbnailUrl
    const timestamp = Date.now()
    const sanitizedName = `artwork-${timestamp}`
    const image_url = `https://mock-storage.com/artworks/${sanitizedName}.${mimeType.split('/')[1]}`
    const thumbnail_url = image_url.replace(/\.([^.]+)$/, '_thumb.$1')

    // Prepare data for database
    const artworkData = {
      title: title.trim(),
      image_url: image_url,
      thumbnail_url: thumbnail_url,
      status: 'PENDING' as const,
      user_id: session?.user?.id || null, // Null for guest uploads
      submitted_by_name: session?.user?.id 
        ? (session.user.username || session.user.name || 'Anonymous')
        : submitted_by_name?.trim() || null,
      submitted_by_email: session?.user?.id
        ? (session.user.email || null)
        : submitted_by_email?.trim() || null,
      description: description?.trim() || null,
      tools_used: tools_used || [],
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



