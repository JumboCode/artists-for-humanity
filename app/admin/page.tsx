'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Redirect non-admins
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
    } else if (session.user.role !== 'ADMIN') {
      router.push('/user-portal')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-afh-blue mx-auto mb-4"></div>
          <p className="text-gray-600 font-secondary">Loading...</p>
        </div>
      </div>
    )
  }

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Page Header */}
        <div className="mb-8 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-heading font-light text-afh-blue">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-gray-600 font-secondary text-lg max-w-2xl">
            Review and manage pending artwork submissions
          </p>
        </div>

        {/* Section divider */}
        <hr className="border-t border-gray-300 my-8" />

        {/* Dashboard Content */}
        <AdminDashboard />
      </div>
    </div>
  )
}
