import { DefaultSession } from 'next-auth'
import { Role } from '@prisma/client'

declare module 'next-auth' {
  /**
   * Extends the built-in session.user object
   * to add your custom properties.
   */
  interface Session {
    user: {
      id: string
      role: Role
      username: string
      profile?: {
        id: string
        user_id: string
        display_name?: string | null
        bio?: string | null
        profile_image_url?: string | null
      }
    } & DefaultSession['user']
  }

  interface User {
    id: string
    email: string
    username: string
    role: Role
    profile?: {
      id: string
      user_id: string
      display_name?: string | null
      bio?: string | null
      profile_image_url?: string | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: Role
    username: string
    profile?: {
      id: string
      user_id: string
      display_name?: string | null
      bio?: string | null
      profile_image_url?: string | null
    }
  }
}
