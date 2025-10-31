import 'next-auth'

declare module 'next-auth' {
  /**
   * Extends the built-in session.user object
   * to add your custom properties.
   */

  interface Session {
    user: {
      id: string 
    } & DefaultSession['user'] 
  }
}