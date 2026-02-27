import Image from 'next/image'

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

type Props = {
  artwork: Artwork
  onApprove: () => void
  onReject: () => void
  onFeature: () => void
}

export default function ArtworkCard({
  artwork,
  onApprove,
  onReject,
  onFeature,
  showFeatureButton = false,
}: Props) {
  // Determine the artist name
  const artistName =
    artwork.author?.profile?.display_name ||
    artwork.author?.username ||
    artwork.submitted_by_name ||
    'Guest'

  const isGuestUpload = !artwork.author

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative w-full h-64 bg-gray-100">
        {!imageError ? (
          <Image
            src={artwork.image_url}
            alt={artwork.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <div className="text-center p-4">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-500 font-secondary">Image unavailable</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Artist */}
        <div className="mb-3">
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
        {artwork.description && (
          <p className="text-sm text-gray-700 font-secondary mb-3 line-clamp-2">
            {artwork.description}
          </p>
        )}

        {/* Metadata */}
        <div className="space-y-1 mb-4 text-xs text-gray-500 font-secondary">
          {artwork.project_type && (
            <p>
              <span className="font-medium">Type:</span> {artwork.project_type}
            </p>
          )}
          {artwork.tools_used && artwork.tools_used.length > 0 && (
            <p>
              <span className="font-medium">Tools:</span>{' '}
              {artwork.tools_used.join(', ')}
            </p>
          )}
          {isGuestUpload && artwork.submitted_by_email && (
            <p>
              <span className="font-medium">Email:</span>{' '}
              {artwork.submitted_by_email}
            </p>
          )}
          <p>
            <span className="font-medium">Submitted:</span>{' '}
            {new Date(artwork.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onApprove}
            className="flex-1 min-w-[80px] bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 font-secondary text-sm font-medium transition-colors"
          >
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex-1 min-w-[80px] bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 font-secondary text-sm font-medium transition-colors"
          >
            Reject
          </button>
          {showFeatureButton && onFeature && (
            <button
              onClick={onFeature}
              className="flex-1 min-w-[80px] bg-afh-orange text-white px-3 py-2 rounded-lg hover:bg-opacity-90 font-secondary text-sm font-medium transition-colors"
            >
              Feature
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
