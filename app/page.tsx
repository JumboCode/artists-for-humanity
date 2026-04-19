'use client'

import React, { useState, useEffect, useRef } from 'react'
import Carousel from 'react-material-ui-carousel'
import Image from 'next/image'
import Link from 'next/link'
import Masonry from '@mui/lab/Masonry'
import { Paper, Box, Typography, CircularProgress } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useSession } from 'next-auth/react'
import { Trash2, Star, StarOff, X } from 'lucide-react'

// Fallback mock data in case API fails
const FALLBACK_ARTWORK: ArtworkItem[] = [
  {
    id: 'fallback-1',
    name: 'Ashley Lafortune',
    title: 'Sweet Dreams',
    medium: 'Digital Illustration',
    year: 2023,
    image: '/Ashley 1.JPG',
    featured: true,
  },
  {
    id: 'fallback-2',
    name: 'Griffin Lonergan',
    title: 'Urban Stories',
    medium: 'Mixed Media',
    year: 2023,
    image: '/Griffin 1.jpg',
    featured: false,
  },
  {
    id: 'fallback-3',
    name: 'Syleah Forde',
    title: 'Island Paradise',
    medium: 'Digital Art',
    year: 2023,
    image: '/Syleah 2.png',
    featured: true,
  },
  {
    id: 'fallback-4',
    name: 'Ashley Lafortune',
    title: 'Koi Fish',
    medium: 'Digital Painting',
    year: 2023,
    image: '/Ashley 2.JPG',
    featured: false,
  },
  {
    id: 'fallback-5',
    name: 'Griffin Lonergan',
    title: 'Mountain Journey',
    medium: 'Digital Illustration',
    year: 2022,
    image: '/Griffin 3.jpg',
    featured: false,
  },
  {
    id: 'fallback-6',
    name: 'Syleah Forde',
    title: 'Abstract Expression',
    medium: 'Mixed Media',
    year: 2023,
    image: '/Syleah 3.jpg',
    featured: false,
  },
  {
    id: 'fallback-7',
    name: 'Ashley Lafortune',
    title: 'Floral Dreams',
    medium: 'Mixed Media',
    year: 2022,
    image: '/Ashley 3.JPG',
    featured: false,
  },
  {
    id: 'fallback-8',
    name: 'Griffin Lonergan',
    title: 'Wild Spirit',
    medium: 'Digital Art',
    year: 2023,
    image: '/Griffin 4.jpg',
    featured: false,
  },
  {
    id: 'fallback-9',
    name: 'Syleah Forde',
    title: 'Cultural Fusion',
    medium: 'Digital Illustration',
    year: 2022,
    image: '/imgs/carousel3.jpg',
    featured: false,
  },
  {
    id: 'fallback-10',
    name: 'Griffin Lonergan',
    title: 'Dreamscape',
    medium: 'Adobe Photoshop',
    year: 2023,
    image: '/Griffin 5.jpg',
    featured: true,
  },
  {
    id: 'fallback-11',
    name: 'Ashley Lafortune',
    title: 'Creative Vision',
    medium: 'Digital Art',
    year: 2023,
    image: '/imgs/carousel1.png',
    featured: false,
  },
  {
    id: 'fallback-12',
    name: 'Griffin Lonergan',
    title: 'Portrait Study',
    medium: 'Digital Painting',
    year: 2022,
    image: '/imgs/griffin2.jpg',
    featured: false,
  },
]

// Type definition for artwork items
type ArtworkItem = {
  id: string
  name: string
  title: string
  description?: string | null
  medium: string
  year: number
  image: string
  featured: boolean
  projectType?: string | null
  toolsUsed?: string[]
  submittedByName?: string | null
  artistUsername?: string | null
  artistImage?: string | null
  createdAt?: string
  viewCount?: number
}

const GALLERY_ITEMS_PER_PAGE = 12

function setLocalImageFallback(
  setImageSrc: (value: string) => void,
  setErrorState?: (value: boolean) => void
) {
  setErrorState?.(true)
  setImageSrc('/imgs/carousel1.png')
}

function applyImageFallbackOnce(
  hasError: boolean,
  setImageSrc: (value: string) => void,
  setErrorState: (value: boolean) => void
) {
  if (!hasError) {
    setLocalImageFallback(setImageSrc, setErrorState)
  }
}

function getArtworkPreviewBackgroundStyle(color: string) {
  return {
    backgroundColor: color,
  }
}

function ArtworkCarouselItem({ 
  art, 
  isAdmin, 
  onDelete, 
  onToggleFeatured 
}: Readonly<{ 
  art: ArtworkItem
  isAdmin?: boolean
  onDelete?: (id: string) => void
  onToggleFeatured?: (id: string) => void
}>) {
  const [imgSrc, setImgSrc] = useState(art.image)
  const [hasError, setHasError] = useState(false)
  const detailHref = `/artworks/${art.id}`

  return (
    <Paper
      elevation={0}
      sx={{
        mx: { xs: 1, sm: 2 },
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: 'white',
        cursor: 'pointer',
        position: 'relative',
        '&:hover .admin-controls': {
          opacity: 1,
        },
      }}
    >
      <Link href={detailHref} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F26729] focus-visible:ring-offset-2 rounded-[10px]">
        {/* Image Section */}
        <Box
          sx={{
            width: '100%',
            height: { xs: 300, sm: 400, md: 500 },
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '8px',
          }}
        >
          <Image
            src={imgSrc}
            alt={art.title}
            fill
            priority
            style={{
              objectFit: 'cover',
              borderRadius: '8px',
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            onError={() => applyImageFallbackOnce(hasError, setImgSrc, setHasError)}
            unoptimized={imgSrc.includes('mock-storage')}
          />
        </Box>

        {/* Artwork Info Section */}
        <Box p={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={1}
          >
            {/* Left side: Artist + Title */}
            <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
              <Typography variant="body1" fontWeight="600" color="text.primary">
                {art.name}
              </Typography>
              <Typography
                variant="body1"
                fontWeight="300"
                sx={{ color: 'text.disabled' }}
              >
                |
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                {art.title}
              </Typography>
            </Box>

            {/* Right side: Medium + Year */}
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              flexShrink={0}
              sx={{ color: 'text.secondary' }}
            >
              <Typography variant="body1" component="span" color="inherit">
                {art.medium}
              </Typography>
              <Typography
                variant="body1"
                component="span"
                sx={{ color: 'text.disabled' }}
              >
                |
              </Typography>
              <Typography variant="body1" component="span" color="inherit">
                {art.year}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Link>

      {/* Admin Controls Overlay */}
      {isAdmin && onDelete && onToggleFeatured && (
        <Box
          className="admin-controls"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.2s',
            zIndex: 10,
          }}
        >
          {/* Unfeature Button (only show for featured items) */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFeatured(art.id)
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Remove from carousel"
            aria-label="Remove from carousel"
          >
            <StarOff size={20} className="text-yellow-500" />
          </button>
          
          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(art.id)
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Delete artwork"
            aria-label="Delete artwork"
          >
            <Trash2 size={20} className="text-red-500 hover:text-red-700" />
          </button>
        </Box>
      )}
    </Paper>
  )
}

type GalleryArtworkCardProps = {
  art: ArtworkItem
  isAdmin: boolean
  onOpen: (art: ArtworkItem) => void
  onDelete: (id: string) => void
  onToggleFeatured: (id: string) => void
}

function GalleryArtworkCard({
  art,
  isAdmin,
  onOpen,
  onDelete,
  onToggleFeatured,
}: Readonly<GalleryArtworkCardProps>) {
  const [imgSrc, setImgSrc] = useState(art.image)
  const [hasError, setHasError] = useState(false)

  return (
    <div className="bg-white shadow-none relative group">
      <button
        type="button"
        onClick={() => onOpen(art)}
        className="w-full text-left focus:outline-none"
        aria-label={`Open details for ${art.title}`}
      >
        <div className="w-full image-hover animate-slide-up flex items-center justify-center overflow-hidden rounded-lg relative">
          <div className="w-full relative overflow-hidden rounded-lg">
            <Image
              src={imgSrc}
              alt={art.title}
              width={600}
              height={800}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
                transition: 'transform 0.3s ease',
              }}
              className="hover:scale-105"
              onError={() => applyImageFallbackOnce(hasError, setImgSrc, setHasError)}
              unoptimized={imgSrc.includes('mock-storage')}
            />

            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors duration-300" />
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 text-white">
              <p className="text-sm font-semibold uppercase tracking-wide text-white opacity-90">
                {art.name}
              </p>
              <h3 className="text-lg font-heading font-light mt-1 text-white">
                {art.title}
              </h3>
              {art.description ? (
                <p className="mt-2 text-sm leading-relaxed line-clamp-3 text-white/85">
                  {art.description}
                </p>
              ) : (
                <p className="mt-2 text-sm text-white/70">
                  Click to view the artwork details.
                </p>
              )}
            </div>
          </div>
        </div>
      </button>

      {/* Admin Controls Overlay */}
      {isAdmin && (
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFeatured(art.id)
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title={art.featured ? 'Remove from carousel' : 'Add to carousel'}
            aria-label={art.featured ? 'Unfeature artwork' : 'Feature artwork'}
          >
            {art.featured ? (
              <StarOff size={20} className="text-yellow-500" />
            ) : (
              <Star size={20} className="text-gray-600 hover:text-yellow-500" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(art.id)
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Delete artwork"
            aria-label="Delete artwork"
          >
            <Trash2 size={20} className="text-red-500 hover:text-red-700" />
          </button>
        </div>
      )}

      <div className="px-2 pt-3 pb-2">
        <div className="flex font-body font-light items-center justify-between flex-wrap gap-x-2 text-sm sm:text-base text-black">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{art.name}</span>
            <span className="text-gray-400 font-light">|</span>
            <span className="text-gray-600">{art.title}</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 text-gray-500 text-xs sm:text-sm">
            <span>{art.medium}</span>
            <span className="text-gray-300">|</span>
            <span>{art.year}</span>
          </div>
        </div>

        <ArtworkDescription description={art.description} />
      </div>
    </div>
  )
}

function HeroCarouselSlide({
  art,
  isAdmin,
  onOpen,
  onDelete,
  onToggleFeatured,
  isActive,
}: Readonly<GalleryArtworkCardProps & { isActive: boolean }>) {
  const [imgSrc, setImgSrc] = useState(art.image)
  const [hasError, setHasError] = useState(false)
  const [isZoomed, setIsZoomed] = useState(false)
  const [bgColor, setBgColor] = useState('#1a1a1a')
  const imgRef = useRef<HTMLImageElement>(null)

  const extractDominantColor = () => {
    if (!imgRef.current || imgRef.current.naturalHeight === 0) return

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      // Set smaller canvas size for faster processing
      canvas.width = 50
      canvas.height = 50
      ctx.drawImage(imgRef.current, 0, 0, 50, 50)

      const imageData = ctx.getImageData(0, 0, 50, 50)
      const data = imageData.data

      let r = 0, g = 0, b = 0
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
      }

      const pixelCount = data.length / 4
      const color = `rgb(${Math.round(r / pixelCount)}, ${Math.round(g / pixelCount)}, ${Math.round(b / pixelCount)})`
      setBgColor(color)
    } catch (error) {
      console.debug('Color extraction failed:', error)
      setBgColor('#1a1a1a')
    }
  }

  useEffect(() => {
    if (!isActive) {
      setIsZoomed(false)
      return
    }

    const frame = window.requestAnimationFrame(() => {
      setIsZoomed(true)
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [isActive, art.id])

  return (
    <div
      className="relative group rounded-3xl overflow-hidden"
      style={{
        backgroundColor: bgColor,
        backgroundImage: `linear-gradient(180deg, ${bgColor} 0%, ${bgColor} 62%, #111111 100%)`,
      }}
    >
      <button
        type="button"
        onClick={() => onOpen(art)}
        className="w-full text-left focus:outline-none"
        aria-label={`Open details for ${art.title}`}
      >
        <div className="relative w-full h-[52vh] sm:h-[58vh] lg:h-[64vh]">
          <Image
            ref={imgRef}
            src={imgSrc}
            alt={art.title}
            fill
            className={`relative z-10 object-contain p-4 sm:p-6 lg:p-8 transition-transform duration-[3800ms] ease-out ${isZoomed ? 'scale-[1.06]' : 'scale-100'}`}
            sizes="100vw"
            onError={() => applyImageFallbackOnce(hasError, setImgSrc, setHasError)}
            onLoad={extractDominantColor}
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              WebkitFontSmoothing: 'antialiased',
            }}
          />

          <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 z-30 p-5 sm:p-7 text-white">
            <p className="text-xs sm:text-sm tracking-[0.16em] uppercase text-white/80">
              {art.name}
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-heading font-light text-white">
              {art.title}
            </h3>
            <p className="mt-2 text-sm sm:text-base text-white/85">
              {art.medium}
            </p>
          </div>
        </div>
      </button>

      {isAdmin && (
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleFeatured(art.id)
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title={art.featured ? 'Remove from carousel' : 'Add to carousel'}
            aria-label={art.featured ? 'Unfeature artwork' : 'Feature artwork'}
          >
            {art.featured ? (
              <StarOff size={20} className="text-yellow-500" />
            ) : (
              <Star size={20} className="text-gray-600 hover:text-yellow-500" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(art.id)
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            title="Delete artwork"
            aria-label="Delete artwork"
          >
            <Trash2 size={20} className="text-red-500 hover:text-red-700" />
          </button>
        </div>
      )}
    </div>
  )
}

// Gallery Item Component
// Gallery item component for image error handling
function ArtworkImage({ art }: Readonly<{ art: ArtworkItem }>) {
  const [imgSrc, setImgSrc] = useState(art.image)
  const [imgError, setImgError] = useState(false)

  const handleImageError = () => {
    if (!imgError) {
      setLocalImageFallback(setImgSrc, setImgError)
    }
  }

  return (
    <Image
      src={imgSrc}
      alt={art.title}
      width={600}
      height={800}
      style={{
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
        transition: 'transform 0.3s ease',
      }}
      className="hover:scale-105"
      onError={handleImageError}
      unoptimized={imgSrc.includes('mock-storage')}
    />
  )
}

function ArtworkDescription({ description }: Readonly<{ description?: string | null }>) {
  if (!description?.trim()) {
    return null
  }

  const preview = description.trim()
  const maxPreviewLength = 90
  const shortPreview =
    preview.length > maxPreviewLength
      ? `${preview.slice(0, maxPreviewLength).trimEnd()}...`
      : preview

  return (
    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{shortPreview}</p>
  )
}

function formatArtworkDate(dateValue?: string) {
  if (!dateValue) {
    return 'Unknown date'
  }

  return new Date(dateValue).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function HomePage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  
  const [searchQuery, setSearchQuery] = useState('')
  const [artwork, setArtwork] = useState<ArtworkItem[]>([])
  const [featuredArtwork, setFeaturedArtwork] = useState<ArtworkItem[]>([])
  const [allArtwork, setAllArtwork] = useState<ArtworkItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [selectedArtwork, setSelectedArtwork] = useState<ArtworkItem | null>(null)
  const [isArtworkDetailsLoading, setIsArtworkDetailsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [previewBgColor, setPreviewBgColor] = useState('#111111')
  const previewImageRef = useRef<HTMLImageElement>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  const mapArtworkFromApi = (item: any): ArtworkItem => ({
    id: item.id,
    name: item.author?.profile?.display_name ||
      item.submitted_by_name ||
      'Anonymous Artist',
    title: item.title,
    description: item.description || null,
    medium: item.tools_used?.join(', ') || item.project_type || 'Mixed Media',
    year: new Date(item.created_at).getFullYear(),
    image: item.image_url || item.thumbnail_url,
    featured: item.featured || false,
    projectType: item.project_type || null,
    toolsUsed: item.tools_used || [],
    submittedByName: item.submitted_by_name || null,
    artistUsername: item.author?.username || null,
    artistImage: item.author?.profile?.profile_image_url || null,
    createdAt: item.created_at,
    viewCount: item.view_count || 0,
  })

  // Fetch real artwork from API
  useEffect(() => {
    fetchArtwork()
  }, [])

  const fetchArtwork = async () => {
    try {
      const res = await fetch('/api/artworks')
      if (!res.ok) throw new Error('Failed to fetch artworks')
      
      const data = await res.json()
      
      // Transform API data to match the artwork format
      const transformedArtwork = data.map(mapArtworkFromApi)
      
      setAllArtwork(transformedArtwork)
      // Separate featured artwork for carousel
      const featured = transformedArtwork.filter((art: ArtworkItem) => art.featured)
      setFeaturedArtwork(featured)
      // Note: artwork (gallery) is set by the filter useEffect based on allArtwork
    } catch (error) {
      console.error('Error fetching artwork:', error)
      setAllArtwork([])
      setFeaturedArtwork([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (artworkId: string) => {
    if (!confirm('Are you sure you want to delete this artwork? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/artworks/${artworkId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete artwork')

      // Refresh artwork list
      fetchArtwork()
      alert('Artwork deleted successfully')
    } catch (error) {
      console.error('Error deleting artwork:', error)
      alert('Failed to delete artwork. Please try again.')
    }
  }

  const handleToggleFeatured = async (artworkId: string) => {
    try {
      const res = await fetch(`/api/admin/artworks/${artworkId}/feature`, {
        method: 'PATCH',
      })

      if (!res.ok) throw new Error('Failed to toggle featured status')

      // Refresh artwork list
      fetchArtwork()
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert('Failed to update featured status. Please try again.')
    }
  }

  const closeArtworkModal = () => {
    setSelectedArtwork(null)
    setIsArtworkDetailsLoading(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFilterDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const extractPreviewBackgroundColor = () => {
    if (!previewImageRef.current || previewImageRef.current.naturalHeight === 0) return

    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = 50
      canvas.height = 50
      ctx.drawImage(previewImageRef.current, 0, 0, 50, 50)

      const imageData = ctx.getImageData(0, 0, 50, 50)
      const data = imageData.data

      let r = 0, g = 0, b = 0
      for (let i = 0; i < data.length; i += 4) {
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
      }

      const pixelCount = data.length / 4
      const color = `rgb(${Math.round(r / pixelCount)}, ${Math.round(g / pixelCount)}, ${Math.round(b / pixelCount)})`
      setPreviewBgColor(color)
    } catch (error) {
      console.debug('Preview background extraction failed:', error)
      setPreviewBgColor('#111111')
    }
  }

  const handleOpenArtwork = async (art: ArtworkItem) => {
    setPreviewBgColor('#111111')
    setSelectedArtwork({ ...art, viewCount: undefined })
    setIsArtworkDetailsLoading(true)

    try {
      const res = await fetch(`/api/artworks/${art.id}`)
      if (!res.ok) return

      const data = await res.json()
      const updatedArtwork = mapArtworkFromApi(data)
      setSelectedArtwork(updatedArtwork)
    } catch (error) {
      console.error('Error opening artwork details:', error)
    } finally {
      setIsArtworkDetailsLoading(false)
    }
  }

  // Filter artwork based on search query and selected filter
  useEffect(() => {
    // Start with all artwork (including featured)
    let filtered = allArtwork

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        art =>
          art.name.toLowerCase().includes(query) ||
          art.title.toLowerCase().includes(query) ||
          art.medium.toLowerCase().includes(query)
      )
    }

    // Apply medium filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(art =>
        selectedFilters.some(filter =>
          art.medium.toLowerCase().includes(filter.toLowerCase())
        )
      )
    }

    setArtwork(filtered)
    setCurrentPage(1)
  }, [searchQuery, selectedFilters, allArtwork])

  const totalPages = Math.max(1, Math.ceil(artwork.length / GALLERY_ITEMS_PER_PAGE))
  const startIndex = (currentPage - 1) * GALLERY_ITEMS_PER_PAGE
  const paginatedArtwork = artwork.slice(
    startIndex,
    startIndex + GALLERY_ITEMS_PER_PAGE
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    setCarouselIndex(0)
  }, [featuredArtwork])

  // Get unique mediums for filter buttons
  const uniqueMediums = Array.from(
    new Set(allArtwork.flatMap(art => art.medium.split(',').map(m => m.trim())))
  ).slice(0, 5) // Show top 5 mediums

  const toggleFilterMedium = (medium: string) => {
    setSelectedFilters(prev =>
      prev.includes(medium)
        ? prev.filter(item => item !== medium)
        : [...prev, medium]
    )
  }

  const clearFilterMediums = () => {
    setSelectedFilters([])
    setIsFilterDropdownOpen(false)
  }

  let filterDropdownLabel = 'Select mediums...'
  if (selectedFilters.length <= 2 && selectedFilters.length > 0) {
    filterDropdownLabel = selectedFilters.join(', ')
  } else if (selectedFilters.length > 2) {
    filterDropdownLabel = `${selectedFilters.length} mediums selected`
  }

  let emptyStateMessage = 'No artwork found. Try adjusting your search or filters.'
  if (loading) {
    emptyStateMessage = 'Loading artwork...'
  } else if (allArtwork.length === 0) {
    emptyStateMessage = 'No artwork yet. Be the first to upload your work.'
  }

  return (
    <div
      className="py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Intro Section */}
        <section className="flex flex-col items-center text-center w-full max-w-4xl mx-auto h-auto gap-3 mb-8">
          <h2 className="text-black font-heading font-light leading-snug text-4xl sm:text-3xl md:text-4xl">
            Showcasing the Next Generation of Creative Voices
          </h2>

          <p className="text-black font-text font-light mt-3 max-w-3xl">
            Explore the work of AFH’s young artists — a living showcase of
            design, creativity, and growth through real-world projects and
            personal expression.
          </p>
        </section>

        {/* Carousel Hero Section */}
        <section className="w-full min-h-[50vh] flex items-center">
          <Carousel
            key={featuredArtwork.map(art => art.id).join('|') || 'featured-empty'}
            index={carouselIndex}
            onChange={(now) => {
              if (typeof now === 'number') {
                setCarouselIndex(now)
              }
            }}
            changeOnFirstRender
            autoPlay={true}
            animation="fade"
            indicators={true}
            navButtonsAlwaysVisible={false}
            navButtonsAlwaysInvisible={true}
            cycleNavigation={true}
            swipe={true}
            interval={4500}
            duration={300}
            indicatorIconButtonProps={{
              style: {
                padding: '8px',
                color: '#D1D5DB',
              }
            }}
            activeIndicatorIconButtonProps={{
              style: {
                color: '#F26729',
              }
            }}
            indicatorContainerProps={{
              style: {
                marginTop: '10px',
                textAlign: 'center',
              }
            }}
            sx={{
              width: '100%',
              maxWidth: 1300,
              mx: 'auto',
              px: { xs: 0, sm: 1 },
            }}
          >
            {featuredArtwork.length > 0 ? (
              featuredArtwork.map((art, index) => (
                <HeroCarouselSlide
                  key={`${art.id}-${index}`} 
                  art={art}
                  isAdmin={isAdmin}
                  isActive={carouselIndex === index}
                  onOpen={handleOpenArtwork}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))
            ) : (
              <Paper
                elevation={0}
                sx={{
                  mx: { xs: 1, sm: 1 },
                  p: 4,
                  minHeight: { xs: '46vh', sm: '50vh', lg: '56vh' },
                  textAlign: 'center',
                  color: 'text.secondary',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={34}
                    thickness={4.2}
                    sx={{ color: '#F26729' }}
                    aria-label="Loading featured artwork"
                  />
                ) : (
                  <Typography variant="h6">
                    No featured artwork available
                  </Typography>
                )}
              </Paper>
            )}
          </Carousel>
        </section>

        {/* Section line */}
        <hr className="border-t-[1px] border-gray-400 my-[40px]" />

        {/* Search & Filter Section */}
        <section className="w-full mb-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <Box
              className="mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-[420px]"
              display="flex"
              alignItems="center"
              gap={1.5}
              sx={{ width: '100%' }}
            >
              <SearchIcon sx={{ color: '#000000', fontSize: '24px' }} />
              <input
                type="text"
                placeholder="Search by name or work"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="search-input"
                style={{
                  flex: 1,
                  border: 'none',
                  borderBottom: '1px solid #000000',
                  outline: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  color: '#000000',
                  fontSize: '16px',
                  padding: '4px 0',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                }}
              />
            </Box>

            {uniqueMediums.length > 0 && (
              <div ref={filterDropdownRef} className="relative w-full lg:w-auto lg:min-w-[260px]">
                <button
                  type="button"
                  onClick={() => setIsFilterDropdownOpen(prev => !prev)}
                  className="afh-pill-control w-full justify-between pr-4"
                  aria-haspopup="menu"
                  aria-expanded={isFilterDropdownOpen}
                >
                  <span className={selectedFilters.length === 0 ? 'text-gray-500' : 'text-gray-800'}>
                    {filterDropdownLabel}
                  </span>
                  <span
                    className="ml-3 flex items-center text-[#F26729] transition-transform duration-300"
                    style={{ transform: isFilterDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>

                {isFilterDropdownOpen && (
                  <div className="absolute right-0 top-full z-20 mt-2 w-full rounded-2xl border border-gray-200 bg-white shadow-lg lg:w-[320px]">
                    <div className="max-h-64 overflow-y-auto p-3">
                      <div className="flex items-center justify-between px-1 pb-2">
                        <p className="text-xs uppercase tracking-[0.24em] text-gray-500 font-secondary">
                          Mediums
                        </p>
                        {selectedFilters.length > 0 && (
                          <button
                            type="button"
                            onClick={clearFilterMediums}
                            className="text-xs font-secondary text-afh-orange transition-colors hover:text-afh-orange/80"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        {uniqueMediums.map((medium) => {
                          const isSelected = selectedFilters.includes(medium)
                          return (
                            <label
                              key={medium}
                              className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-gray-50"
                            >
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleFilterMedium(medium)}
                                className="h-4 w-4 rounded border-gray-300 text-afh-orange accent-afh-orange focus:ring-afh-orange"
                              />
                              <span className="text-sm font-secondary text-gray-800">
                                {medium}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Show result count */}
        {searchQuery && (
          <section className="w-full mb-4">
            <p className="text-gray-600 font-secondary text-sm">
              Found {artwork.length} artwork{artwork.length === 1 ? '' : 's'} matching "{searchQuery}"
            </p>
          </section>
        )}

        {/* Artwork gallery with Masonry */}
        {artwork.length > 0 ? (
          <>
            <Masonry
              columns={{ xs: 1, sm: 2, lg: 3 }}
              spacing={{ xs: 2, sm: 3 }}
              sx={{ width: '100%', margin: '0 auto' }}
            >
              {paginatedArtwork.map((art, index) => (
                <GalleryArtworkCard
                  key={`${art.id}-${index}`}
                  art={art}
                  isAdmin={isAdmin}
                  onOpen={handleOpenArtwork}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))}
            </Masonry>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="afh-pill-control disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`afh-pill-control min-w-[44px] px-3 ${
                      currentPage === pageNumber
                        ? 'afh-pill-control-active'
                        : ''
                    }`}
                    aria-label={`Go to page ${pageNumber}`}
                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="afh-pill-control disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full text-center py-12">
            <p className="text-gray-600 font-secondary text-lg">
              {emptyStateMessage}
            </p>
          </div>
        )}

        {/* Artwork Preview Modal */}
        {selectedArtwork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
            <button
              type="button"
              className="absolute inset-0 bg-black/55 backdrop-blur-md"
              aria-label="Close artwork preview"
              onClick={closeArtworkModal}
            />
            <div className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-auto rounded-3xl bg-white shadow-2xl border border-white/70">
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-200 bg-white/95 px-4 py-3 backdrop-blur-sm sm:px-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Artwork Preview
                  </p>
                  <h3 className="mt-1 text-lg font-heading text-gray-900 sm:text-2xl">
                    {selectedArtwork.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={closeArtworkModal}
                  className="rounded-full p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Close preview"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-0 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
                <div className="relative" style={getArtworkPreviewBackgroundStyle(previewBgColor)}>
                  <div className="relative flex min-h-[320px] h-[clamp(320px,68vh,760px)] w-full items-center justify-center overflow-hidden p-4 sm:p-6 lg:p-8">
                    <Image
                      ref={previewImageRef}
                      src={selectedArtwork.image}
                      alt={selectedArtwork.title}
                      fill
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      onLoad={extractPreviewBackgroundColor}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-6 p-5 sm:p-6 lg:p-7">
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500">Artist</p>
                    <p className="mt-1 text-xl font-semibold text-gray-900">
                      {selectedArtwork.name}
                    </p>
                    {selectedArtwork.artistUsername && (
                      <p className="mt-1 text-sm text-gray-500">
                        @{selectedArtwork.artistUsername}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      {selectedArtwork.projectType || selectedArtwork.medium}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Year</p>
                      <p className="mt-1 text-gray-900">{selectedArtwork.year}</p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Views</p>
                      <p className="mt-1 text-gray-900">
                        {isArtworkDetailsLoading ? (
                          <span className="inline-block h-4 w-10 rounded bg-gray-200 animate-pulse align-middle" />
                        ) : (
                          selectedArtwork.viewCount || 0
                        )}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">Created</p>
                      <p className="mt-1 text-gray-900">{formatArtworkDate(selectedArtwork.createdAt)}</p>
                    </div>
                  </div>

                  {selectedArtwork.description ? (
                    <div className="rounded-2xl bg-gray-50 p-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        About this artwork
                      </h4>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                        {selectedArtwork.description}
                      </p>
                    </div>
                  ) : (
                    <p className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-600">
                      No description was provided for this artwork.
                    </p>
                  )}

                  {selectedArtwork.toolsUsed && selectedArtwork.toolsUsed.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">
                        Tools Used
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedArtwork.toolsUsed.map((tool) => (
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

                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section line */}
        <hr className="border-t-[1px] border-gray-400 my-[60px]" />

        {/* Call to Action */}
        <section className="w-full text-center md:text-left">
          <h2 className="text-black font-heading font-light leading-snug text-2xl sm:text-3xl md:text-4xl mb-6">
            Do you also want to showcase your art on our homepage? Upload your
            work below.
          </h2>
          <Link
            href="/upload"
            className="afh-pill-control afh-pill-control-accent mx-auto md:mx-0 min-w-[170px] gap-2 px-6 text-base"
          >
            Upload Your Work
          </Link>
        </section>
      </div>
    </div>
  )
}
