'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Share2, Heart } from 'lucide-react'

type Artwork = {
  id: string
  title: string
  description: string | null
  image_url: string
  thumbnail_url: string | null
  project_type: string | null
  tools_used: string[]
  submitted_by_name: string | null
  created_at: string
  view_count: number
  featured: boolean
  author: {
    username: string
    profile: {
      display_name: string | null
      profile_image_url: string | null
    } | null
  } | null
}

export default function ArtworkDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [artwork, setArtwork] = useState<Artwork | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetchArtwork()
  }, [params.id])

  const fetchArtwork = async () => {
    try {
      const res = await fetch(`/api/artworks/${params.id}`)
      if (!res.ok) throw new Error('Failed to fetch artwork')
      const data = await res.json()
      setArtwork(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading artwork')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading artwork...</p>
      </div>
    )
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{error || 'Artwork not found'}</p>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 text-afh-orange hover:bg-afh-orange/10 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>
    )
  }

  const artistName = artwork.author?.profile?.display_name || artwork.submitted_by_name || 'Anonymous Artist'
  const artistUsername = artwork.author?.username

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-700 hover:text-afh-orange transition-colors"
          >
            <ArrowLeft size={24} />
            <span className="font-secondary">Back</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-full transition-colors ${
                liked
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart size={24} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={artwork.image_url}
                alt={artwork.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-heading font-light text-gray-900 mb-2">
                {artwork.title}
              </h1>
              {artwork.project_type && (
                <p className="text-gray-600 font-secondary">{artwork.project_type}</p>
              )}
            </div>

            {/* Artist Info */}
            <div className="border-t border-b border-gray-200 py-6">
              <p className="text-sm text-gray-600 mb-3">Artist</p>
              <div className="flex items-center gap-3">
                {artwork.author?.profile?.profile_image_url && (
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={artwork.author.profile.profile_image_url}
                      alt={artistName}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-medium text-gray-900">{artistName}</p>
                  {artistUsername && (
                    <p className="text-sm text-gray-600">@{artistUsername}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {artwork.description && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-2">About this artwork</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Tools Used */}
            {artwork.tools_used && artwork.tools_used.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Tools Used</h2>
                <div className="flex flex-wrap gap-2">
                  {artwork.tools_used.map((tool) => (
                    <span
                      key={tool}
                      className="px-3 py-1 bg-afh-orange/10 text-afh-orange rounded-full text-sm font-secondary"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                Created: {new Date(artwork.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p>Views: {artwork.view_count || 0}</p>
              {artwork.featured && (
                <p className="text-afh-orange font-medium">Featured on homepage</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
