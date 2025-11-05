"use client";

import React from 'react';
import Carousel from "react-material-ui-carousel";
import { Paper, Box, Typography } from "@mui/material";

const artwork =[
    {
      name: "Ashley Lafortune",
      title: "Title",
      medium: "Digital Illustration",
      year: 2022,
      image: "/imgs/carousel1.png",
      
    },
    {
      name: "Griffin Lonergan",
      title: "Title",
      medium: "Medium",
      year: 2022,
      image: "/imgs/carousel2.jpg",
    },
    {
      name: "Syleah Forde",
      title: "Title",
      medium: "Medium",
      year: 2022,
      image: "/imgs/carousel3.jpg",
    },
    {
      name: "Ethan Brown",
      title: "Abstract Lines",
      medium: "Adobe Photoshop",
      year: 2021,
      image: "/imgs/meow.jpg",
    },
    {
      name: "Lily Chen",
      title: "Nature's Path",
      medium: "Oil Painting",
      year: 2022,
      image: "/imgs/meow.jpg",
    },
    {
      name: "David Park",
      title: "Geometric Dreams",
      medium: "Sketching",
      year: 2023,
      image: "/imgs/meow.jpg", 
    },
  ]

  function ArtworkCarouselItem({ art}: {art: typeof artwork[0]}) {
  // A simple placeholder for the image src for demonstration
  // Replace meow with actual logic if images are hosted differently
  const imageSource = art.image;
  
  return (
    <Paper 
      elevation={0} 
      sx={{ 
        mx: 2, // Horizontal margin for spacing between items (if not using nextjs-carousel's auto spacing)
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
          height: { xs: 300, sm: 400, md: 500 }, // Responsive height
          overflow: 'hidden', 
        }}
      >
        {/* Using a regular <img> tag here for simplicity since the Image import is not directly used for the dynamic src */}
        <img
          src={art.image}
          alt={art.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            padding: '10px',
            transition: 'transform 0.1s',
          }}
          // You can add an onMouseEnter/onMouseLeave for the hover effect if you prefer an MUI approach
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
            {/* Mimics: <span className="font-semibold">{art.name}</span> */}
            <Typography variant="body" fontWeight="600" color="text.primary"> 
              {art.name}
            </Typography>
            
            {/* Mimics: <span className="text-gray-400 font-light">|</span> */}
            <Typography variant="body" fontWeight="300" sx={{ color: 'text.disabled' }}>
              |
            </Typography>
            
            {/* Mimics: <span className="text-gray-600">{art.title}</span> */}
            <Typography variant="body" sx={{ color: 'text.secondary' }}> 
              {art.title}
            </Typography>
          </Box>

          {/* Right side: Medium + Year */}
          <Box display="flex" alignItems="center" gap={1} flexShrink={0} sx={{ color: 'text.secondary' }}>
            {/* Mimics: <span>{art.medium}</span> */}
            <Typography variant="body" component="span" color="inherit">
              {art.medium}
            </Typography>
            
            {/* Mimics: <span className="text-gray-300">|</span> */}
            <Typography variant="body" component="span" sx={{ color: 'text.disabled' }}>
              |
            </Typography>
            
            {/* Mimics: <span>{art.year}</span> */}
            <Typography variant="body" component="span" color="inherit">
              {art.year}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default function HomePage() {
  return (
    <div className="section-padding" style={{ backgroundColor: "#ffffffff" }}>
      {/* Intro Section*/}
      <section className="justify-left flex flex-col w-[66%]  h-auto gap-[20px] max-w-full -ml-8">
        <h2 className="text-left text-black font-heading font-light leading-snug text-4xl sm:text-3xl md:text-4xl">
          Showcasing the Next Generation of Creative Voices
        </h2>

        <p className="text-left text-black font-text font-light  mt-4 max-w-full">
          Explore the work of AFH’s young artists — a living showcase of design, creativity, and growth through real-world projects and personal expression.
        </p>
      <div className="flex flex-wrap justify-start gap-3 sm:gap-4 mt-5">
        <button className="flex-1 sm:flex-none inline-flex items-center justify-center 
                    min-w-[100px] sm:min-w-[130px] md:min-w-[150px]
                    h-[40px] sm:h-[45px] px-4 sm:px-6 py-2 sm:py-3 
                    rounded-full border border-[#F26729] text-[#F26729] 
                    font-secondary text-sm sm:text-base transition-colors duration-300 
                    hover:bg-[#F26729] hover:text-white 
                    active:bg-[#F26729] active:text-white cursor-pointer">
          Exhibition Name
        </button>

        <button className="flex-1 sm:flex-none inline-flex items-center justify-center 
                    min-w-[100px] sm:min-w-[130px] md:min-w-[150px]
                    h-[40px] sm:h-[45px] px-4 sm:px-6 py-2 sm:py-3 
                    rounded-full border border-[#F26729] text-[#F26729] 
                    font-secondary text-sm sm:text-base transition-colors duration-300 
                    hover:bg-[#F26729] hover:text-white 
                    active:bg-[#F26729] active:text-white cursor-pointer">
          Exhibition Name
        </button>

        <button className="flex-1 sm:flex-none inline-flex items-center justify-center 
                    min-w-[100px] sm:min-w-[130px] md:min-w-[150px]
                    h-[40px] sm:h-[45px] px-4 sm:px-6 py-2 sm:py-3 
                    rounded-full border border-[#F26729] text-[#F26729] 
                    font-secondary text-sm sm:text-base transition-colors duration-300 
                    hover:bg-[#F26729] hover:text-white 
                    active:bg-[#F26729] active:text-white cursor-pointer">
          Exhibition Name
        </button>
      </div>
      </section>

      {/* Carousel Section */}
      <section className="w-[66%] h-auto gap-[20px] max-w-full -ml-8 mt-12">
      <Carousel
        // Optional props for customization
        autoPlay={true}
        animation="slide"
        //indicators={true} // Show the dots at the bottom
        cycleNavigation={true} // Loop the carousel
        swipe={true}
        // Custom styling for the main container (to center the carousel content)
        sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1, sm: 3 } }} 
      >
        {artwork.map((art, i) => (
          // Use a key for React list rendering
          <ArtworkCarouselItem key={i} art={art} /> 
        ))}
      </Carousel>
      </section>


      
    {/* Section line */}
    <hr className=" border-t-[1px] border-gray-#69737B my-[60px]" />
    {/* Artwork gallery */}
    <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
      {artwork.map((art, index) => (
        <div key={index} className="bg-white shadow-none">
          
          {/* Image Section */}
          <div className="w-full image-hover animate-slide-up flex items-center justify-center">
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-[300px] object-cover rounded-t-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Artwork info */}
          <div className="flex font-body font-light items-center justify-between flex-wrap gap-x-2 text-base text-black mt-2">
            {/* Left side: Artist + Title */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold">{art.name}</span>
              <span className="text-gray-400 font-light">|</span>
              <span className="text-gray-600">{art.title}</span>
            </div>

            {/* Right side: Medium + Year */}
            <div className="flex items-center gap-2 flex-shrink-0 text-gray-500">
              <span>{art.medium}</span>
              <span className="text-gray-300">|</span>
              <span>{art.year}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

  
  <hr className=" border-t-[1px] border-gray-#69737B my-[60px]" />

  <h2 className="text-left text-black font-heading font-light leading-snug text-2xl sm:text-3xl md:text-4xl">
          Do you also want to showcase your art on our homepage? Upload your work below.
        </h2>
        <button className="inline-flex items-center justify-center min-w-[90px] h-[40px] px-[15px] py-[10px] rounded-[50px] border-[1px] border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer my-8">
          Upload Your Work
        </button>

    </div>
  )
}