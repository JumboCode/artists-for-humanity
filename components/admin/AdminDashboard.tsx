'use client'
import { useEffect, useState } from 'react'
import ArtworkCard from './ArtworkCard'

type Artwork = {
  id: string
  title: string
  description: string | null
  image_url: string
  tools_used: string[]
  project_type: string | null
  submitted_by_name: string | null
  submitted_by_email: string | null
  created_at: string
  author: {
    username: string
    profile: {
      display_name: string | null
    } | null
  } | null
}

export function AdminDashboard() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal states
  const [rejectingArtwork, setRejectingArtwork] = useState<Artwork | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [featuringArtwork, setFeaturingArtwork] = useState<Artwork | null>(null)

  useEffect(() => {
    fetchQueue()
  }, [])

  async function fetchQueue() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/queue')
      if (!res.ok) throw new Error('Failed to fetch queue')
      const data = await res.json()
      setArtworks(data.artworks || [])
    } catch (err) {
      console.error('Failed to fetch queue:', err)
      setError('Failed to load pending artwork')
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(artwork: Artwork) {
    try {
      const res = await fetch(`/api/admin/artworks/${artwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' }),
      })

      if (!res.ok) throw new Error('Failed to approve')
      fetchQueue()
    } catch (err) {
      console.error('Failed to approve artwork:', err)
      alert('Failed to approve artwork. Please try again.')
    }
  }

  function openRejectModal(artwork: Artwork) {
    setRejectingArtwork(artwork)
    setRejectReason('')
  }

  async function handleReject() {
    if (!rejectingArtwork || !rejectReason.trim()) return

    try {
      const res = await fetch(`/api/admin/artworks/${rejectingArtwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reject',
          rejection_reason: rejectReason,
        }),
      })

      if (!res.ok) throw new Error('Failed to reject')

      setRejectingArtwork(null)
      setRejectReason('')
      fetchQueue()
    } catch (err) {
      console.error('Failed to reject artwork:', err)
      alert('Failed to reject artwork. Please try again.')
    }
  }

  function openFeatureModal(artwork: Artwork) {
    setFeaturingArtwork(artwork)
  }

  async function handleFeature() {
    if (!featuringArtwork) return

    try {
      const res = await fetch(
        `/api/admin/artworks/${featuringArtwork.id}/feature`,
        {
          method: 'PATCH',
        }
      )

      if (!res.ok) throw new Error('Failed to feature')

      setFeaturingArtwork(null)
      fetchQueue()
    } catch (err) {
      console.error('Failed to feature artwork:', err)
      alert('Failed to feature artwork. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 font-secondary">
          Loading pending artwork...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-red-600 font-secondary">{error}</p>
        <button
          onClick={fetchQueue}
          className="px-4 py-2 bg-afh-blue text-white rounded-lg hover:bg-opacity-90"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (artworks.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 font-secondary">
          No pending artwork to review
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map(artwork => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onApprove={() => handleApprove(artwork)}
            onReject={() => openRejectModal(artwork)}
            onFeature={() => openFeatureModal(artwork)}
          />
        ))}
      </div>

      {/* Reject Modal */}
      {rejectingArtwork && (
        <Modal onClose={() => setRejectingArtwork(null)}>
          <h2 className="text-xl font-heading text-afh-blue mb-4">
            Reject Artwork
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Please provide a reason for rejection:
          </p>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 font-secondary text-gray-900 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-afh-orange"
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={e => setRejectReason(e.target.value)}
            autoFocus
          />
          <ModalButtons
            onCancel={() => setRejectingArtwork(null)}
            onConfirm={handleReject}
            confirmLabel="Reject"
            confirmDisabled={!rejectReason.trim()}
            confirmColor="bg-red-500 hover:bg-red-600"
          />
        </Modal>
      )}

      {/* Feature Modal */}
      {featuringArtwork && (
        <Modal onClose={() => setFeaturingArtwork(null)}>
          <h2 className="text-xl font-heading text-afh-blue mb-4">
            Feature Artwork?
          </h2>
          <p className="text-gray-700 font-secondary mb-6">
            This will mark <strong>{featuringArtwork.title}</strong> as a
            featured artwork on the homepage.
          </p>
          <ModalButtons
            onCancel={() => setFeaturingArtwork(null)}
            onConfirm={handleFeature}
            confirmLabel="Feature"
            confirmColor="bg-afh-orange hover:bg-opacity-90"
          />
        </Modal>
      )}
    </>
  )
}

/* Reusable Modal Component */
function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      onKeyDown={e => e.key === 'Escape' && onClose()}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
    >
      <div
        className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl"
        onClick={e => e.stopPropagation()}
        role="document"
      >
        {children}
      </div>
    </div>
  )
}

function ModalButtons({
  onCancel,
  onConfirm,
  confirmLabel,
  confirmColor,
  confirmDisabled = false,
}: {
  onCancel: () => void
  onConfirm: () => void
  confirmLabel: string
  confirmColor: string
  confirmDisabled?: boolean
}) {
  return (
    <div className="flex justify-end gap-3 mt-6">
      <button
        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-secondary transition-colors"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        className={`px-5 py-2 text-white rounded-lg font-secondary transition-colors ${confirmColor} ${confirmDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={onConfirm}
        disabled={confirmDisabled}
      >
        {confirmLabel}
      </button>
    </div>
  )
}
