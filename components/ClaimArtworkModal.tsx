'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface UnclaimedArtwork {
  id: string
  title: string
  image_url: string
  status: string
  created_at: string
}

export default function ClaimArtworkModal() {
  const { data: session } = useSession()
  const router = useRouter()
  const [unclaimedArtwork, setUnclaimedArtwork] = useState<UnclaimedArtwork[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isClaiming, setIsClaiming] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)

  useEffect(() => {
    // Only check once per session when user first logs in
    if (session?.user && !hasChecked) {
      checkForUnclaimedArtwork()
      setHasChecked(true)
    }
  }, [session, hasChecked])

  const checkForUnclaimedArtwork = async () => {
    try {
      const response = await fetch('/api/artworks/claim')
      if (response.ok) {
        const data = await response.json()
        if (data.count > 0) {
          setUnclaimedArtwork(data.artwork)
          setIsOpen(true)
        }
      }
    } catch (error) {
      console.error('Error checking for unclaimed artwork:', error)
    }
  }

  const handleClaim = async () => {
    setIsClaiming(true)
    try {
      const response = await fetch('/api/artworks/claim', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        // Success! Close modal
        setIsOpen(false)
        // Show success message
        alert(`Successfully claimed ${data.count} artwork(s)! You can now view them in your portfolio.`)
        // Refresh the page to show updated artwork
        router.refresh()
      } else {
        throw new Error('Failed to claim artwork')
      }
    } catch (error) {
      console.error('Error claiming artwork:', error)
      alert('Failed to claim artwork. Please try again or contact support.')
    } finally {
      setIsClaiming(false)
    }
  }

  if (!isOpen || unclaimedArtwork.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative bg-white rounded-xl p-8 w-full max-w-2xl mx-4 shadow-2xl max-h-[80vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M15 5L5 15M5 5l10 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-heading text-afh-blue mb-2">
            🎉 We Found Your Artwork!
          </h2>
          <p className="text-gray-600">
            You submitted {unclaimedArtwork.length} artwork{unclaimedArtwork.length > 1 ? 's' : ''} before creating your account. 
            Would you like to add {unclaimedArtwork.length > 1 ? 'them' : 'it'} to your portfolio?
          </p>
        </div>

        {/* Artwork Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {unclaimedArtwork.map((artwork) => (
            <div key={artwork.id} className="border rounded-lg overflow-hidden">
              <div className="aspect-square relative bg-gray-100">
                <Image
                  src={artwork.image_url}
                  alt={artwork.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-3">
                <p className="font-medium text-sm truncate">{artwork.title}</p>
                <p className="text-xs text-gray-500 capitalize">{artwork.status.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2.5 rounded-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Skip for Now
          </button>
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="px-5 py-2.5 rounded-full bg-afh-orange text-white hover:bg-afh-orange/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isClaiming ? 'Claiming...' : `Claim My Artwork (${unclaimedArtwork.length})`}
          </button>
        </div>

        {/* Info note */}
        <p className="text-xs text-gray-500 mt-4 text-center">
          This will link the artwork to your account. You can manage it from your portfolio after claiming.
        </p>
      </div>
    </div>
  )
}
