import Image from "next/image";
import meow from './imgs/meow.jpg';
import React from 'react'

const artwork =[
    {
      name: "Alice Johnson",
      title: "Sunset Dreams",
      medium: "Adobe Illustrator",
      year: 2023,
      image: "/imgs/meow.jpg",
      
    },
    {
      name: "Mark Lee",
      title: "Urban Flow",
      medium: "Photography",
      year: 2022,
      image: "/imgs/meow.jpg",
    },
    {
      name: "Sophia Kim",
      title: "Color Burst",
      medium: "Watercolor",
      year: 2023,
      image: "/imgs/meow.jpg",
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

export default function HomePage() {
  return (
    
    <div className="section-padding" style={{ backgroundColor: "#ffffffff" }}>
      {/* Intro Section*/}
      <section className="flex flex-col w-[1392px] h-auto pt-[200px] pr-[500px] pl-[10px] gap-[10px] mx-auto max-w-full">
        <h2 className="text-left text-black font-heading font-light leading-snug text-2xl sm:text-3xl md:text-4xl">
          Showcasing the Next Generation of Creative Voices
        </h2>

        <p className="text-left text-black font-secondary text-light">
          Explore the work of AFH’s young artists — a living showcase of design, creativity, and growth through real-world projects and personal expression.
        </p>

        <div className="flex space-x-[10px gap-[20px] mt-[20px] ">
          <button className="inline-flex items-center justify-center min-w-[90px] h-[40px] px-[15px] py-[10px] rounded-[50px] border-[1px] border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer">
            Exhibition Name
          </button>
          <button className="inline-flex items-center justify-center min-w-[90px] h-[40px] px-[15px] py-[10px] rounded-[50px] border-[1px] border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer">
            Exhibition Name
          </button>
          <button className="inline-flex items-center justify-center min-w-[90px] h-[40px] px-[15px] py-[10px] rounded-[50px] border-[1px] border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer">
            Exhibition Name
          </button>
        </div>
      </section>

      {/* Carousel Section */}
<section className="w-full mt-16">

  <div className="relative w-full overflow-hidden">
    {/* Carousel container */}
    <div className="flex space-x-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-2">
      {artwork.map((art, index) => (
        <div
          key={index}
          className="min-w-[400px] sm:min-w-[500px] md:min-w-[500px] snap-center bg-white rounded-2xl flex-shrink-0"
        >
          <div className="w-full h-64 overflow-hidden rounded-t-2xl">
            <img
              src={art.image}
              alt={art.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="p-4">
        <div className="flex items-center font-body font-light justify-between flex-wrap gap-x-2 text-base text-black">
          {/* Left side: Artist + Title */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{art.name}</span>
            <span className="text-gray-500 font-light">|</span>
            <span className="text-gray-800">{art.title}</span>
          </div>

          {/* Right side: Medium + Year */}
          <div className="flex items-center gap-2 flex-shrink-0 text-gray-500 text-light">
            <span>{art.medium}</span>
            <span className="text-gray-500">|</span>
            <span>{art.year}</span>
          </div>
        </div>
      </div>
              </div>
            ))}
          </div>

        </div>
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



      {/*
      <section className="gallery-grid mb-16">

        <div className="gallery-grid">
          
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="card card-hover animate-slide-up">
              <div className="aspect-square overflow-hidden">
              <img
                  src={`lib/imgs/jcimg.jpg`} 
                  alt={`Artwork ${item}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <p className="text-afh-blue/60 font-medium">Artwork {item}</p>
              </div>
              <div className="p-6">
                <p className="text-sm text-afh-white/70 mb-3">Name</p>
                <p className="text-sm text-afh-white/60">Adobe Illustrator • Client Project</p>
              </div>
            </div>
          ))}
        </div>  
      
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-afh-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="mb-4">For Young Artists</h3>
          <p className="text-afh-blue/70">
            Build your professional portfolio while gaining real-world experience through 
            paid creative projects and mentorship.
          </p>
        </div>
        
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-afh-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🤝</span>
          </div>
          <h3 className="mb-4">For Partners</h3>
          <p className="text-afh-blue/70">
            Connect with talented teen artists to bring your creative vision to life 
            while supporting youth development in Boston.
          </p>
        </div> 
        
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-afh-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌟</span>
          </div>
          <h3 className="mb-4">Community Impact</h3>
          <p className="text-afh-blue/70">
            Transcending economic, racial and social divisions to transform communities 
            through the power of creative expression.
          </p>
        </div> 
      </section> */}
    </div>
  )
}