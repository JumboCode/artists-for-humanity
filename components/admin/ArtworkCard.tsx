import Image from 'next/image'
import { useState } from 'react'

type Artwork = {
  id: string
  title: string
  description: string | null
  image_url: string
  thumbnail_url: string | null
  tools_used: string[]
  project_type: string | null
  submitted_by_name: string | null
  submitted_by_email: string | null
  created_at: string
  author: {
    email: string
    username: string
    profile: {
      display_name: string | null
    } | null
  } | null
  featured?: boolean
}

type Props = {
  artwork: Artwork
  onOpen: () => void
  onEdit?: () => void
  onApprove: () => void
  onReject: () => void
  onFeature?: () => void
  onUnpublish?: () => void
  showFeatureButton?: boolean
  showEditButton?: boolean
  showUnpublishButton?: boolean
}

export default function ArtworkCard({
  artwork,
  onOpen,
  onEdit,
  onApprove,
  onReject,
  onFeature,
  onUnpublish,
  showFeatureButton = false,
  showEditButton = false,
  showUnpublishButton = false,
}: Readonly<Props>) {
  const [imageError, setImageError] = useState(false)
  const [previewBgColor, setPreviewBgColor] = useState('#f3f4f6')
  const previewUrl = artwork.thumbnail_url || artwork.image_url
  const isVideo = /\.(mp4|webm|mov|quicktime)(\?|$)/i.test(artwork.image_url)
  // Determine the artist name
  const isGuestUpload = !artwork.author
  const artistName =
    artwork.author?.profile?.display_name ||
    artwork.author?.username ||
    artwork.submitted_by_name ||
    'Guest'
  const displayEmail = artwork.submitted_by_email || artwork.author?.email || null

  const extractDominantColor = (image: HTMLImageElement) => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 40
      canvas.height = 40
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let r = 0
      let g = 0
      let b = 0

      for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
      }

      const pixelCount = data.length / 4
      setPreviewBgColor(
        `rgb(${Math.round(r / pixelCount)}, ${Math.round(g / pixelCount)}, ${Math.round(b / pixelCount)})`
      )
    } catch {
      setPreviewBgColor('#f3f4f6')
    }
  }

  let previewContent: React.ReactNode
  if (imageError) {
    previewContent = (
      <div className="w-full h-full flex items-center justify-center bg-gray-200">
        <div className="text-center p-4">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2z" />
          </svg>
          <p className="text-xs text-gray-500 font-secondary">Preview unavailable</p>
        </div>
      </div>
    )
  } else if (isVideo) {
    previewContent = (
      <video
        src={artwork.image_url}
        poster={previewUrl || undefined}
        className="w-full h-full object-contain"
        muted
        playsInline
        preload="metadata"
      >
        <track kind="captions" label="English captions" />
      </video>
    )
  } else {
    previewContent = (
      <Image
        src={previewUrl}
        alt={artwork.title}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={(event) => extractDominantColor(event.currentTarget)}
        onError={() => setImageError(true)}
      />
    )
  }

  return (
    <div className="group h-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Image */}
      <button
        type="button"
        onClick={onOpen}
        className="relative w-full h-64 overflow-hidden text-left"
        style={{ backgroundColor: previewBgColor }}
        aria-label={`Open details for ${artwork.title}`}
      >
        {previewContent}
        {artwork.featured && (
          <div className="absolute top-2 left-2 z-20 rounded-full bg-afh-orange px-2 py-0.5 text-xs font-secondary font-medium text-white shadow">
            Featured
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 text-white">
          <p className="text-xs uppercase tracking-[0.15em] text-white/80 font-secondary">
            Click to review details
          </p>
        </div>
      </button>

      {/* Content */}
      <div className="p-4 flex flex-1 flex-col text-center sm:text-left">
        {/* Title and Artist */}
        <div className="mb-3 min-h-[56px]">
          <h3 className="text-lg font-heading font-semibold text-afh-blue line-clamp-2">
            {artwork.title}
          </h3>
          <p className="text-sm text-gray-600 font-secondary mt-1">
            by {artistName}
            {isGuestUpload && (
              <span className="text-afh-orange ml-1">(Guest)</span>
            )}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-700 font-secondary mb-3 line-clamp-2 min-h-[40px]">
          {artwork.description?.trim() || 'No description provided'}
        </p>

        {/* Metadata */}
        <div className="space-y-1 text-xs text-gray-500 font-secondary">
          {artwork.tools_used && artwork.tools_used.length > 0 && (
            <p>
              <span className="font-medium">Tools:</span>{' '}
              {artwork.tools_used.join(', ')}
            </p>
          )}
          <p>
            <span className="font-medium">Type:</span>{' '}
            {artwork.project_type || 'none'}
          </p>
          {displayEmail && (
            <p>
              <span className="font-medium">Email:</span>{' '}
              {displayEmail}
            </p>
          )}
          <p>
            <span className="font-medium">Submitted:</span>{' '}
            {new Date(artwork.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto pt-4">
          <div className={`grid gap-2 ${showUnpublishButton ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {showEditButton && onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="w-full border border-afh-orange text-afh-orange px-3 py-2 rounded-lg hover:bg-afh-orange hover:text-white font-secondary text-sm font-medium transition-colors"
              >
                Edit
              </button>
            )}
            {!showUnpublishButton && (
              <>
                <button
                  onClick={onApprove}
                  className="w-full bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 font-secondary text-sm font-medium transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={onReject}
                  className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-secondary text-sm font-medium transition-colors"
                >
                  Reject
                </button>
              </>
            )}
            {showFeatureButton && onFeature && (
              <button
                onClick={onFeature}
                className={`w-full bg-afh-orange text-white px-3 py-2 rounded-lg hover:bg-opacity-90 font-secondary text-sm font-medium transition-colors ${showUnpublishButton ? 'col-span-1' : ''}`}
              >
                {artwork.featured ? 'Unfeature' : 'Feature'}
              </button>
            )}
            {showUnpublishButton && onUnpublish && (
              <button
                onClick={onUnpublish}
                className="w-full col-span-2 border border-gray-400 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 font-secondary text-sm font-medium transition-colors"
              >
                Move to Pending
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
