import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

/**
 * Upload file to Cloudinary
 * @param base64Data - Base64 encoded file data
 * @param userId - User ID for folder organization (or 'guest')
 * @returns Object with publicUrl and thumbnailUrl
 */
async function uploadFileToCloudinary(
  base64Data: string,
  userId: string | null
) {
  try {
    const folder = `afh/artworks/${userId || 'guest'}`

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Data, {
      folder: folder,
      resource_type: 'auto', // Automatically detect image or video
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }, // Optimize quality and format
      ],
    })

    // Generate thumbnail URL
    const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
      transformation: [
        { width: 400, height: 400, crop: 'fill', quality: 'auto' },
      ],
    })

    return {
      publicUrl: uploadResult.secure_url,
      thumbnailUrl: thumbnailUrl,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw new Error('Failed to upload file to cloud storage')
  }
}

export async function GET() {
  try {
    // Fetch all approved artworks for public gallery
    const approvedArtworks = await prisma.artwork.findMany({
      where: {
        status: 'APPROVED',
        // Exclude artwork with mock URLs
        AND: [
          { image_url: { not: { contains: 'mock-storage.com' } } },
        ],
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
      return NextResponse.json({ error: 'Title is required.' }, { status: 400 })
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
      tools_used = tools_usedString.split(',').map(tool => tool.trim())
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
      return NextResponse.json({ error: 'File is required.' }, { status: 400 })
    }

    // Validate base64 image data format - avoid regex on large strings to prevent stack overflow
    if (!image_base64.startsWith('data:')) {
      return NextResponse.json({ error: 'Invalid file data format.' }, { status: 400 })
    }
    
    const colonIndex = image_base64.indexOf(':')
    const semicolonIndex = image_base64.indexOf(';')
    const commaIndex = image_base64.indexOf(',')
    
    if (colonIndex === -1 || semicolonIndex === -1 || commaIndex === -1 || 
        semicolonIndex < colonIndex || commaIndex < semicolonIndex) {
      return NextResponse.json({ error: 'Invalid file data structure.' }, { status: 400 })
    }
    
    const mimeType = image_base64.substring(colonIndex + 1, semicolonIndex)
    const encoding = image_base64.substring(semicolonIndex + 1, commaIndex)
    
    if (encoding !== 'base64') {
      return NextResponse.json({ error: 'Only base64 encoding is supported.' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'video/quicktime',
    ]

    if (!allowedTypes.includes(mimeType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images and videos are allowed.' },
        { status: 400 }
      )
    }

    // Check file size (max 10 MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (image_base64.length > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB.' },
        { status: 413 }
      )
    }


    // Note: File size validation happens client-side before base64 encoding
    // Server-side validation done by Cloudinary (40MB limit by default)

    // Upload file to Cloudinary
    const uploadResult = await uploadFileToCloudinary(
      image_base64,
      session?.user?.id || null
    )
    const image_url = uploadResult.publicUrl
    const thumbnail_url = uploadResult.thumbnailUrl

    // Prepare data for database
    const artworkData = {
      title: title.trim(),
      image_url: image_url,
      thumbnail_url: thumbnail_url,
      status: 'PENDING' as const,
      user_id: session?.user?.id || null, // Null for guest uploads
      submitted_by_name: session?.user?.id
        ? session.user.username || session.user.name || 'Anonymous'
        : submitted_by_name?.trim() || null,
      submitted_by_email: session?.user?.id
        ? session.user.email || null
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
