"use client";

import React, { useState } from 'react';
import Carousel from "react-material-ui-carousel";
import Image from "next/image";
import Masonry from '@mui/lab/Masonry';
import { Paper, Box, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const artwork = [
  {
    name: "Ashley Lafortune",
    title: "Sweet Dreams",
    medium: "Digital Illustration",
    year: 2023,
    image: "/Ashley 1.JPG",
  },
  {
    name: "Griffin Lonergan",
    title: "Urban Stories",
    medium: "Mixed Media",
    year: 2023,
    image: "/Griffin 1.jpg",
  },
  {
    name: "Syleah Forde",
    title: "Island Paradise",
    medium: "Digital Art",
    year: 2023,
    image: "/Syleah 2.png",
  },
  {
    name: "Ashley Lafortune",
    title: "Koi Fish",
    medium: "Digital Painting",
    year: 2023,
    image: "/Ashley 2.JPG",
  },
  {
    name: "Griffin Lonergan",
    title: "Mountain Journey",
    medium: "Digital Illustration",
    year: 2022,
    image: "/Griffin 3.jpg",
  },
  {
    name: "Syleah Forde",
    title: "Abstract Expression",
    medium: "Mixed Media",
    year: 2023,
    image: "/Syleah 3.jpg",
  },
  {
    name: "Ashley Lafortune",
    title: "Floral Dreams",
    medium: "Mixed Media",
    year: 2022,
    image: "/Ashley 3.JPG",
  },
  {
    name: "Griffin Lonergan",
    title: "Wild Spirit",
    medium: "Digital Art",
    year: 2023,
    image: "/Griffin 4.jpg",
  },
  {
    name: "Syleah Forde",
    title: "Cultural Fusion",
    medium: "Digital Illustration",
    year: 2022,
    image: "/imgs/carousel3.jpg",
  },
  {
    name: "Griffin Lonergan",
    title: "Dreamscape",
    medium: "Adobe Photoshop",
    year: 2023,
    image: "/Griffin 5.jpg",
  },
  {
    name: "Ashley Lafortune",
    title: "Creative Vision",
    medium: "Digital Art",
    year: 2023,
    image: "/imgs/carousel1.png",
  },
  {
    name: "Griffin Lonergan",
    title: "Portrait Study",
    medium: "Digital Painting",
    year: 2022,
    image: "/imgs/griffin2.jpg",
  },
]

function ArtworkCarouselItem({ art }: Readonly<{ art: typeof artwork[0] }>) {
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mx: { xs: 1, sm: 2 },
        borderRadius: '10px', 
        overflow: 'hidden', 
        backgroundColor: 'white',
        cursor: 'pointer',
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
          src={art.image}
          alt={art.title}
          fill
          priority
          style={{
            objectFit: 'cover',
            borderRadius: '8px',
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
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
            <Typography variant="body1" fontWeight="300" sx={{ color: 'text.disabled' }}>
              |
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}> 
              {art.title}
            </Typography>
          </Box>

          {/* Right side: Medium + Year */}
          <Box display="flex" alignItems="center" gap={1} flexShrink={0} sx={{ color: 'text.secondary' }}>
            <Typography variant="body1" component="span" color="inherit">
              {art.medium}
            </Typography>
            <Typography variant="body1" component="span" sx={{ color: 'text.disabled' }}>
              |
            </Typography>
            <Typography variant="body1" component="span" color="inherit">
              {art.year}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="py-12 sm:py-16 lg:py-20" style={{ backgroundColor: "#ffffff" }}>
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* Intro Section */}
        <section className="justify-left flex flex-col w-full lg:w-[66%] h-auto gap-[20px] max-w-full">
        <h2 className="text-left text-black font-heading font-light leading-snug text-4xl sm:text-3xl md:text-4xl">
          Showcasing the Next Generation of Creative Voices
        </h2>

        <p className="text-left text-black font-text font-light  mt-4 max-w-full">
          Explore the work of AFH’s young artists — a living showcase of design, creativity, and growth through real-world projects and personal expression.
        </p>
        <div className="flex flex-wrap justify-start gap-3 sm:gap-4 mt-5">
          <button className="inline-flex items-center justify-center 
                      min-w-[120px] sm:min-w-[140px]
                      h-[40px] sm:h-[45px] px-6 py-2
                      rounded-full border border-[#F26729] text-[#F26729] 
                      font-secondary text-sm sm:text-base transition-colors duration-300 
                      hover:bg-[#F26729] hover:text-white 
                      active:bg-[#F26729] active:text-white cursor-pointer">
            Exhibition Name
          </button>

          <button className="inline-flex items-center justify-center 
                      min-w-[120px] sm:min-w-[140px]
                      h-[40px] sm:h-[45px] px-6 py-2
                      rounded-full border border-[#F26729] text-[#F26729] 
                      font-secondary text-sm sm:text-base transition-colors duration-300 
                      hover:bg-[#F26729] hover:text-white 
                      active:bg-[#F26729] active:text-white cursor-pointer">
            Exhibition Name
          </button>

          <button className="inline-flex items-center justify-center 
                      min-w-[120px] sm:min-w-[140px]
                      h-[40px] sm:h-[45px] px-6 py-2
                      rounded-full border border-[#F26729] text-[#F26729] 
                      font-secondary text-sm sm:text-base transition-colors duration-300 
                      hover:bg-[#F26729] hover:text-white 
                      active:bg-[#F26729] active:text-white cursor-pointer">
            Exhibition Name
          </button>
        </div>
      </section>

        {/* Carousel Section */}
        <section className="w-full lg:w-[66%] h-auto gap-[20px] max-w-full mt-12">
        <Carousel
          autoPlay={true}
          animation="slide"
          indicators={false}
          navButtonsAlwaysVisible={true}
          cycleNavigation={true}
          swipe={true}
          interval={4000}
          duration={500}
          sx={{ 
            maxWidth: 1200, 
            mx: 'auto', 
            px: { xs: 0, sm: 2 } 
          }} 
        >
          {artwork.map((art) => (
            <ArtworkCarouselItem key={`${art.name}-${art.title}`} art={art} /> 
          ))}
        </Carousel>
        </section>

        {/* Section line */}
        <hr className="border-t-[1px] border-gray-400 my-[60px]" />

        {/* Search Field */}
        <section className="w-full mb-8">
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} flexWrap="wrap">
          {/* Search Bar */}
          <Box display="flex" alignItems="center" gap={1.5} sx={{ maxWidth: '350px' }}>
            <SearchIcon sx={{ color: '#000000', fontSize: '24px' }} />
            <input
              type="text"
              placeholder="Search by name or work"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
          <Box display="flex" alignItems="center" gap={1} sx={{ cursor: 'pointer' }}>
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
        {artwork.map((art) => (
          <div key={`${art.name}-${art.title}-gallery`} className="bg-white shadow-none">
            {/* Image Section */}
            <div className="w-full image-hover animate-slide-up flex items-center justify-center overflow-hidden rounded-lg">
              <Image
                src={art.image}
                alt={art.title}
                width={600}
                height={800}
                style={{ 
                  width: "100%", 
                  height: "auto", 
                  borderRadius: "8px",
                  transition: "transform 0.3s ease",
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

        {/* Section line */}
        <hr className="border-t-[1px] border-gray-400 my-[60px]" />

        {/* Call to Action */}
        <section className="w-full">
        <h2 className="text-left text-black font-heading font-light leading-snug text-2xl sm:text-3xl md:text-4xl mb-6">
          Do you also want to showcase your art on our homepage? Upload your work below.
        </h2>
        <button className="inline-flex items-center justify-center min-w-[140px] h-[45px] px-6 py-3 rounded-full border border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer">
          Upload Your Work
        </button>
        </section>
      </div>
    </div>
  );
}