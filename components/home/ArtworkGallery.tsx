'use client'
import Masonry from '@mui/lab/Masonry'
import { Typography, Box } from '@mui/material'
import Image from 'next/image'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import { ArtworkInfo } from './ArtworkCarouselItem'
import { useState } from 'react'

function ArtworkGallery({ artworks }: { artworks: ArtworkInfo[] }) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div>
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
              Filter by
            </Typography>
          </Box>
        </Box>
      </section>

      {/* Artwork gallery with Masonry */}
      <Masonry
        columns={{ xs: 1, sm: 2, lg: 3 }}
        spacing={{ xs: 2, sm: 3 }}
        sx={{ width: '100%', margin: '0 auto' }}
      >
        {artworks.map(art => (
          <div key={art.id} className="bg-white shadow-none">
            {/* Image Section */}
            <div className="w-full image-hover animate-slide-up flex items-center justify-center overflow-hidden rounded-lg">
              <Image
                src={art.image}
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
              />
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
    </div>
  )
}

export { ArtworkGallery }
