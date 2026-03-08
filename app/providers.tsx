'use client'

import { SessionProvider } from 'next-auth/react'
import ClaimArtworkModal from '@/components/ClaimArtworkModal'

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      {children}
      <ClaimArtworkModal />
    </SessionProvider>
  )
}
