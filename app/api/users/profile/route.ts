import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/users/profile
 * Get current user's profile information
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        created_at: true,
        profile: {
          select: {
            display_name: true,
            bio: true,
            profile_image_url: true,
            banner_image_url: true,
            department: true,
            school: true,
            graduation_year: true,
            instagram: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { 
        profile: user.profile || {
          display_name: user.username,
          bio: null,
          profile_image_url: null,
          banner_image_url: null,
          department: null,
          school: null,
          graduation_year: null,
          instagram: null,
        }
      }, 
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/users/profile
 * Update current user's profile information
 */
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { display_name, bio, profile_image_url, banner_image_url, department, school, graduation_year, instagram } = body

    // Update profile using upsert (create if doesn't exist, update if exists)
    const profile = await prisma.profile.upsert({
      where: { user_id: session.user.id },
      update: {
        display_name: display_name || null,
        bio: bio || null,
        profile_image_url: profile_image_url || null,
        banner_image_url: banner_image_url || null,
        department: department || null,
        school: school || null,
        graduation_year: graduation_year || null,
        instagram: instagram || null,
      },
      create: {
        user_id: session.user.id,
        display_name: display_name || null,
        bio: bio || null,
        profile_image_url: profile_image_url || null,
        banner_image_url: banner_image_url || null,
        department: department || null,
        school: school || null,
        graduation_year: graduation_year || null,
        instagram: instagram || null,
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Profile updated successfully',
        profile,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
