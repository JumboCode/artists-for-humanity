'use client'
import { useEffect, useState } from 'react'
import ArtworkCard from './ArtworkCard'

const TOOL_OPTIONS = [
  'Digital Art',
  'Painting',
  'Photography',
  'Mixed Media',
  'Sculpture',
  'Drawing',
  'Printmaking',
  'Video',
  'Installation',
  'Other',
]

type Artwork = {
  id: string
  title: string
  description: string | null
  image_url: string
  thumbnail_url: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
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

type ArtworkEditForm = {
  title: string
  description: string
  tools_used: string[]
  project_type: string
  submitted_by_name: string
  submitted_by_email: string
}

export function AdminDashboard() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)

  // Modal states
  const [rejectingArtwork, setRejectingArtwork] = useState<Artwork | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [featuringArtwork, setFeaturingArtwork] = useState<Artwork | null>(null)
  const [editingArtwork, setEditingArtwork] = useState<Artwork | null>(null)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editFormError, setEditFormError] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<ArtworkEditForm>({
    title: '',
    description: '',
    tools_used: [],
    project_type: '',
    submitted_by_name: '',
    submitted_by_email: '',
  })
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false)

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
      if (selectedArtwork?.id === artwork.id) {
        setSelectedArtwork(null)
      }
      fetchQueue()
    } catch (err) {
      console.error('Failed to approve artwork:', err)
      setActionError('Failed to approve artwork. Please try again.')
      setTimeout(() => setActionError(null), 5000)
    }
  }

  function openRejectModal(artwork: Artwork) {
    setRejectingArtwork(artwork)
    setRejectReason('')
    if (selectedArtwork?.id === artwork.id) {
      setSelectedArtwork(null)
    }
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
      setActionError('Failed to reject artwork. Please try again.')
      setTimeout(() => setActionError(null), 5000)
    }
  }

  function openFeatureModal(artwork: Artwork) {
    setFeaturingArtwork(artwork)
  }

  function openEditModal(artwork: Artwork) {
    setEditFormError(null)
    setEditingArtwork(artwork)
    setIsToolsDropdownOpen(false)
    setEditForm({
      title: artwork.title || '',
      description: artwork.description || '',
      tools_used: artwork.tools_used || [],
      project_type: artwork.project_type || '',
      submitted_by_name: artwork.submitted_by_name || '',
      submitted_by_email: artwork.submitted_by_email || '',
    })
  }

  function closeEditModal() {
    setEditingArtwork(null)
    setEditFormError(null)
    setIsToolsDropdownOpen(false)
  }

  function toggleToolSelection(tool: string) {
    setEditForm((prev) => {
      const isSelected = prev.tools_used.includes(tool)
      if (isSelected) {
        return {
          ...prev,
          tools_used: prev.tools_used.filter((item) => item !== tool),
        }
      }

      if (prev.tools_used.length >= 3) {
        setEditFormError('You can select up to 3 tools.')
        return prev
      }

      setEditFormError(null)
      return {
        ...prev,
        tools_used: [...prev.tools_used, tool],
      }
    })
  }

  async function handleSaveEdit() {
    if (!editingArtwork) return

    if (!editForm.title.trim()) {
      setEditFormError('Title is required.')
      return
    }

    setIsSavingEdit(true)
    setEditFormError(null)

    try {
      const edits = {
        title: editForm.title.trim(),
        description: editForm.description.trim() || null,
        tools_used: editForm.tools_used,
        project_type: editForm.project_type.trim() || null,
        submitted_by_name: editForm.submitted_by_name.trim() || null,
        submitted_by_email: editForm.submitted_by_email.trim() || null,
      }

      const res = await fetch(`/api/admin/artworks/${editingArtwork.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'edit', edits }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update artwork')
      }

      setSelectedArtwork((prev) =>
        prev?.id === editingArtwork.id
          ? {
              ...prev,
              title: edits.title,
              description: edits.description,
              tools_used: edits.tools_used,
              submitted_by_name: edits.submitted_by_name,
              submitted_by_email: edits.submitted_by_email,
            }
          : prev
      )

      setArtworks((prev) =>
        prev.map((item) =>
          item.id === editingArtwork.id
            ? {
                ...item,
                title: edits.title,
                description: edits.description,
                tools_used: edits.tools_used,
                submitted_by_name: edits.submitted_by_name,
                submitted_by_email: edits.submitted_by_email,
              }
            : item
        )
      )

      setEditingArtwork(null)
    } catch (err) {
      console.error('Failed to edit artwork:', err)
      setEditFormError(
        err instanceof Error ? err.message : 'Failed to update artwork.'
      )
    } finally {
      setIsSavingEdit(false)
    }
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
      setActionError('Failed to feature artwork. Please try again.')
      setTimeout(() => setActionError(null), 5000)
    }
  }

  const renderArtworkPreview = (artwork: Artwork) => {
    const isVideo = /\.(mp4|webm|mov|quicktime)(\?|$)/i.test(artwork.image_url)
    const previewUrl = artwork.thumbnail_url || artwork.image_url

    if (isVideo) {
      return (
        <video
          src={artwork.image_url}
          poster={previewUrl || undefined}
          className="w-full h-full object-cover"
          controls
          playsInline
          preload="metadata"
        >
          <track kind="captions" label="English captions" />
        </video>
      )
    }

    return (
      <img
        src={previewUrl}
        alt={artwork.title}
        className="w-full h-full object-cover"
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600 font-secondary">
          Loading artwork...
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
          No artwork available
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Action Error Banner */}
      {actionError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-secondary">{actionError}</p>
        </div>
      )}

      <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-2xl font-heading text-afh-blue">Incoming Pending Drafts</h2>
          <p className="mt-1 text-sm text-gray-600 font-secondary">
            Review new submissions waiting for approval.
          </p>
        </div>
        <div className="rounded-full border border-afh-orange/40 bg-afh-orange/10 px-4 py-2 text-sm font-secondary text-afh-orange">
          {artworks.length} pending
        </div>
      </div>

      {artworks.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <p className="text-gray-600 font-secondary">No artwork in this view.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map(artwork => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            onOpen={() => setSelectedArtwork(artwork)}
            onEdit={() => openEditModal(artwork)}
            onApprove={() => handleApprove(artwork)}
            onReject={() => openRejectModal(artwork)}
            showFeatureButton={false}
            showEditButton
          />
          ))}
        </div>
      )}

      {/* Artwork Details Modal */}
      {selectedArtwork && (
        <Modal onClose={() => setSelectedArtwork(null)}>
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-heading text-afh-blue">
                  {selectedArtwork.title}
                </h2>
                <p className="mt-1 text-sm text-gray-600 font-secondary">
                  by {selectedArtwork.author?.profile?.display_name || selectedArtwork.author?.username || selectedArtwork.submitted_by_name || 'Guest'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedArtwork(null)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close artwork details"
              >
                ✕
              </button>
            </div>

            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              {renderArtworkPreview(selectedArtwork)}
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
              <p className="text-sm text-gray-600 font-secondary whitespace-pre-wrap">
                {selectedArtwork.description?.trim() || 'No description provided'}
              </p>
            </div>

            <div className="space-y-1 text-sm text-gray-600 font-secondary">
              <p>
                <span className="font-medium text-gray-700">Status:</span>{' '}
                {selectedArtwork.status}
              </p>
              {selectedArtwork.tools_used.length > 0 && (
                <p>
                  <span className="font-medium text-gray-700">Tools:</span>{' '}
                  {selectedArtwork.tools_used.join(', ')}
                </p>
              )}
              {selectedArtwork.submitted_by_email && (
                <p>
                  <span className="font-medium text-gray-700">Email:</span>{' '}
                  {selectedArtwork.submitted_by_email}
                </p>
              )}
              <p>
                <span className="font-medium text-gray-700">Submitted:</span>{' '}
                {new Date(selectedArtwork.created_at).toLocaleDateString()}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1 sm:grid sm:grid-cols-3">
              <button
                type="button"
                onClick={() => openEditModal(selectedArtwork)}
                className="w-full border border-afh-orange text-afh-orange px-3 py-2 rounded-lg hover:bg-afh-orange hover:text-white font-secondary text-sm font-medium transition-colors"
              >
                Edit
              </button>
              {selectedArtwork.status === 'PENDING' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleApprove(selectedArtwork)}
                    className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 font-secondary text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => openRejectModal(selectedArtwork)}
                    className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-secondary text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </Modal>
      )}

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

      {editingArtwork && (
        <Modal onClose={closeEditModal}>
          <h2 className="text-xl font-heading text-afh-blue mb-4">
            Edit Artwork
          </h2>

          {editFormError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-600 font-secondary">{editFormError}</p>
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-secondary text-gray-700">
              <span>Title</span>
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:!border-afh-orange focus:outline-none"
              />
            </label>

            <label className="block text-sm font-secondary text-gray-700">
              <span>Description</span>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                className="mt-1 w-full min-h-[96px] rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:!border-afh-orange focus:outline-none"
              />
            </label>

            <label className="block text-sm font-secondary text-gray-700">
              <span>Tools (select up to 3)</span>
              <div className="relative mt-1">
                <button
                  type="button"
                  onClick={() => setIsToolsDropdownOpen((prev) => !prev)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-left text-gray-900 focus:!border-afh-orange focus:outline-none"
                >
                  {editForm.tools_used.length > 0
                    ? editForm.tools_used.join(', ')
                    : 'Select tools...'}
                </button>
                {isToolsDropdownOpen && (
                  <div className="absolute z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 shadow-lg">
                    {TOOL_OPTIONS.map((tool) => {
                      const checked = editForm.tools_used.includes(tool)
                      const disabled = !checked && editForm.tools_used.length >= 3

                      return (
                        <label
                          key={tool}
                          className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm ${disabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer text-gray-700 hover:bg-gray-50'}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={disabled}
                            onChange={() => toggleToolSelection(tool)}
                            className="h-4 w-4 rounded border-gray-300 text-afh-orange focus:ring-afh-orange"
                          />
                          <span>{tool}</span>
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>
            </label>

            <label className="block text-sm font-secondary text-gray-700">
              <span>Project Type</span>
              <input
                type="text"
                value={editForm.project_type}
                onChange={(e) => setEditForm({ ...editForm, project_type: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:!border-afh-orange focus:outline-none"
              />
            </label>

            <label className="block text-sm font-secondary text-gray-700">
              <span>Submitted By Name</span>
              <input
                type="text"
                value={editForm.submitted_by_name}
                onChange={(e) => setEditForm({ ...editForm, submitted_by_name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:!border-afh-orange focus:outline-none"
              />
            </label>

            <label className="block text-sm font-secondary text-gray-700">
              <span>Submitted By Email</span>
              <input
                type="email"
                value={editForm.submitted_by_email}
                onChange={(e) => setEditForm({ ...editForm, submitted_by_email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:!border-afh-orange focus:outline-none"
              />
            </label>
          </div>

          <ModalButtons
            onCancel={closeEditModal}
            onConfirm={handleSaveEdit}
            confirmLabel={isSavingEdit ? 'Saving...' : 'Save Changes'}
            confirmColor="bg-afh-orange hover:bg-afh-orange/90"
            confirmDisabled={isSavingEdit}
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
}: Readonly<{
  children: React.ReactNode
  onClose: () => void
}>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div
        className="relative bg-white rounded-xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto"
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
}: Readonly<{
  onCancel: () => void
  onConfirm: () => void
  confirmLabel: string
  confirmColor: string
  confirmDisabled?: boolean
}>) {
  return (
    <div className="mt-6 flex flex-wrap justify-center gap-3 sm:justify-end">
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
