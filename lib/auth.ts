import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { normalizeUsername } from '@/lib/security'

const DUMMY_PASSWORD_HASH = bcrypt.hashSync('not-the-user-password', 10)

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const username = normalizeUsername(credentials.username)
        if (!username || credentials.password.length > 128) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { username },
          include: { profile: true },
        })

        if (!user?.password_hash) {
          await bcrypt.compare(credentials.password, DUMMY_PASSWORD_HASH)
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password_hash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 7,
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.username = user.username
      }
      return token
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.username = token.username
        
        // Fetch fresh profile data
        try {
          const userWithProfile = await prisma.user.findUnique({
            where: { id: token.id },
            include: { profile: true },
          })
          
          if (userWithProfile?.profile) {
            session.user.profile = userWithProfile.profile
          }
        } catch (error) {
          console.error('Error fetching profile in session:', error)
        }
      }
      return session
    },
  },
}
