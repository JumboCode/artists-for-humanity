'use client'

import React, { useState, useEffect } from 'react'
import Carousel from 'react-material-ui-carousel'
import Image from 'next/image'
import Link from 'next/link'
import Masonry from '@mui/lab/Masonry'
import { Paper, Box, Typography } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useSession } from 'next-auth/react'
import { Trash2, Star, StarOff } from 'lucide-react'

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
  medium: string
  year: number
  image: string
  featured: boolean
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

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true)
      setImgSrc('/imgs/carousel1.png') // Fallback to a local placeholder
    }
  }

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
          onError={handleImageError}
          unoptimized={imgSrc.includes('mock-storage')}
        />
        
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
    </Paper>
  )
}

// Gallery Item Component
// Gallery item component for image error handling
function ArtworkImage({ art }: Readonly<{ art: ArtworkItem }>) {
  const [imgSrc, setImgSrc] = useState(art.image)
  const [imgError, setImgError] = useState(false)

  const handleImageError = () => {
    if (!imgError) {
      setImgError(true)
      setImgSrc('/imgs/carousel1.png')
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

export default function HomePage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  
  const [searchQuery, setSearchQuery] = useState('')
  const [artwork, setArtwork] = useState(FALLBACK_ARTWORK)
  const [featuredArtwork, setFeaturedArtwork] = useState(FALLBACK_ARTWORK)
  const [allArtwork, setAllArtwork] = useState(FALLBACK_ARTWORK)
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

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
      const transformedArtwork = data.map((item: any) => ({
        id: item.id,
        name: item.author?.profile?.display_name || 
              item.submitted_by_name || 
              'Anonymous Artist',
        title: item.title,
        medium: item.tools_used?.join(', ') || item.project_type || 'Mixed Media',
        year: new Date(item.created_at).getFullYear(),
        image: item.image_url || item.thumbnail_url,
        featured: item.featured || false,
      }))
      
      // Only update if we got artwork
      if (transformedArtwork.length > 0) {
        setAllArtwork(transformedArtwork)
        // Separate featured artwork for carousel
        const featured = transformedArtwork.filter((art: ArtworkItem) => art.featured)
        setFeaturedArtwork(featured)
        // Note: artwork (gallery) is set by the filter useEffect based on allArtwork
      }
    } catch (error) {
      console.error('Error fetching artwork:', error)
      // Keep using fallback artwork
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

    // Apply medium filter
    if (selectedFilter) {
      filtered = filtered.filter(art =>
        art.medium.toLowerCase().includes(selectedFilter.toLowerCase())
      )
    }

    setArtwork(filtered)
  }, [searchQuery, selectedFilter, allArtwork])

  // Get unique mediums for filter buttons
  const uniqueMediums = Array.from(
    new Set(allArtwork.flatMap(art => art.medium.split(',').map(m => m.trim())))
  ).slice(0, 5) // Show top 5 mediums

  return (
    <div
      className="py-12 sm:py-16 lg:py-20"
      style={{ backgroundColor: '#ffffff' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Intro Section */}
        <section className="justify-left flex flex-col w-full lg:w-[66%] h-auto gap-[20px] max-w-full">
          <h2 className="text-left text-black font-heading font-light leading-snug text-4xl sm:text-3xl md:text-4xl">
            Showcasing the Next Generation of Creative Voices
          </h2>

          <p className="text-left text-black font-text font-light  mt-4 max-w-full">
            Explore the work of AFH’s young artists — a living showcase of
            design, creativity, and growth through real-world projects and
            personal expression.
          </p>
          <div className="flex flex-wrap justify-start gap-3 sm:gap-4 mt-5">
            {uniqueMediums.map((medium) => (
              <button
                key={medium}
                onClick={() => setSelectedFilter(selectedFilter === medium ? null : medium)}
                className={`inline-flex items-center justify-center 
                        min-w-[120px] sm:min-w-[140px]
                        h-[40px] sm:h-[45px] px-6 py-2
                        rounded-full border border-[#F26729] 
                        font-secondary text-sm sm:text-base transition-colors duration-300 
                        cursor-pointer ${
                          selectedFilter === medium
                            ? 'bg-[#F26729] text-white'
                            : 'text-[#F26729] hover:bg-[#F26729] hover:text-white'
                        }`}
              >
                {medium}
              </button>
            ))}
            {selectedFilter && (
              <button
                onClick={() => setSelectedFilter(null)}
                className="inline-flex items-center justify-center 
                        min-w-[100px] h-[40px] sm:h-[45px] px-4 py-2
                        rounded-full bg-gray-200 text-gray-700
                        font-secondary text-sm sm:text-base transition-colors duration-300 
                        hover:bg-gray-300 cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>
        </section>

        {/* Carousel Section */}
        <section className="w-full lg:w-[66%] h-auto gap-[20px] max-w-full mt-12">
          <Carousel
            autoPlay={true}
            animation="slide"
            indicators={true}
            navButtonsAlwaysVisible={false}
            navButtonsAlwaysInvisible={true}
            cycleNavigation={true}
            swipe={true}
            interval={4000}
            duration={500}
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
                marginTop: '20px',
                textAlign: 'center',
              }
            }}
            sx={{
              maxWidth: 1200,
              mx: 'auto',
              px: { xs: 0, sm: 2 },
            }}
          >
            {featuredArtwork.length > 0 ? (
              featuredArtwork.map((art, index) => (
                <ArtworkCarouselItem 
                  key={`${art.id}-${index}`} 
                  art={art}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                  onToggleFeatured={handleToggleFeatured}
                />
              ))
            ) : (
              <Paper
                elevation={0}
                sx={{
                  mx: { xs: 1, sm: 2 },
                  p: 4,
                  textAlign: 'center',
                  color: 'text.secondary',
                }}
              >
                <Typography variant="h6">
                  {loading ? 'Loading artwork...' : 'No featured artwork available'}
                </Typography>
              </Paper>
            )}
          </Carousel>
        </section>

        {/* Section line */}
        <hr className="border-t-[1px] border-gray-400 my-[60px]" />

        {/* Search Field */}
        <section className="w-full mb-8">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={2}
            flexWrap="wrap"
          >
            {/* Search Bar */}
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              sx={{ maxWidth: '350px' }}
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

            {/* Filter By */}
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{ cursor: 'pointer' }}
              onClick={() => {
                // Scroll to filters
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              <FilterListIcon sx={{ color: '#000000', fontSize: '24px' }} />
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  color: '#000000',
                  fontSize: '16px',
                }}
              >
                {selectedFilter ? `Filtering: ${selectedFilter}` : 'Filter by medium'}
              </Typography>
            </Box>
          </Box>
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
          <Masonry
            columns={{ xs: 1, sm: 2, lg: 3 }}
            spacing={{ xs: 2, sm: 3 }}
            sx={{ width: '100%', margin: '0 auto' }}
          >
            {artwork.map((art, index) => (
              <div key={`${art.id}-${index}`} className="bg-white shadow-none relative group">
                {/* Image Section with Admin Controls */}
                <div className="w-full image-hover animate-slide-up flex items-center justify-center overflow-hidden rounded-lg relative">
                  <ArtworkImage art={art} />
                  
                  {/* Admin Controls Overlay */}
                  {isAdmin && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      {/* Feature/Unfeature Button */}
                      <button
                        onClick={() => handleToggleFeatured(art.id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                        title={art.featured ? "Remove from carousel" : "Add to carousel"}
                        aria-label={art.featured ? "Unfeature artwork" : "Feature artwork"}
                      >
                        {art.featured ? (
                          <StarOff size={20} className="text-yellow-500" />
                        ) : (
                          <Star size={20} className="text-gray-600 hover:text-yellow-500" />
                        )}
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(art.id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                        title="Delete artwork"
                        aria-label="Delete artwork"
                      >
                        <Trash2 size={20} className="text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Artwork info */}
                <div className="flex font-body font-light items-center justify-between flex-wrap gap-x-2 text-sm sm:text-base text-black mt-2 px-2">
                  {/* Left side: Artist + Title */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{art.name}</span>
                    <span className="text-gray-400 font-light">|</span>
                    <span className="text-gray-600">{art.title}</span>
                  </div>

                  {/* Right side: Medium + Year */}
                  <div className="flex items-center gap-2 flex-shrink-0 text-gray-500 text-xs sm:text-sm">
                    <span>{art.medium}</span>
                    <span className="text-gray-300">|</span>
                    <span>{art.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </Masonry>
        ) : (
          <div className="w-full text-center py-12">
            <p className="text-gray-600 font-secondary text-lg">
              No artwork found. Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Section line */}
        <hr className="border-t-[1px] border-gray-400 my-[60px]" />

        {/* Call to Action */}
        <section className="w-full">
          <h2 className="text-left text-black font-heading font-light leading-snug text-2xl sm:text-3xl md:text-4xl mb-6">
            Do you also want to showcase your art on our homepage? Upload your
            work below.
          </h2>
          <Link
            href="/upload"
            className="inline-flex items-center justify-center min-w-[140px] h-[45px] px-6 py-3 rounded-full border border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer"
          >
            Upload Your Work
          </Link>
        </section>
      </div>
    </div>
  )
}
