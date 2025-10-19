import Image from "next/image";
import meow from './imgs/meow.jpg';

const artwork =[
    {
      name: "Alice Johnson",
      title: "Sunset Dreams",
      medium: "Adobe Illustrator",
      year: 2023,
      image: "app/imgs/meow.jpg",
      
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
      
      {/* Add img carousel here */}
        
      </section>

    {/* HERO SECTION
      <header className="text-center hero-gradient rounded-2xl section-padding mb-16">
        <h1 className="text-brand-secondary mb-6">
          Showcasing the Next Generation<br />
          <span className="text-brand-primary">of Creative Voices</span>
        </h1>
        <p className="text-xl text-afh-blue/80 mb-8 max-w-3xl mx-auto">
          Artists For Humanity harnesses the power of mentorship and paid professional experiences 
          to inspire teens to build their future through creative expression.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="btn-primary animate-fade-in">
            Explore Gallery
          </button>
          <button className="btn-outline animate-fade-in">
            Upload Artwork
          </button>
        </div>
      </header>
      */}

      
{/* Section line */}
<hr className=" border-t-[1px] border-gray-#69737B my-[60px]" />

{/* Artwork gallery */}
<div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-20">
  {artwork.map((art, index) => (
    <div key={index} className=" bg-white shadow-none">
        {/* Image Section */}
      <div className="w-full  image-hover animate-slide-up rounded-t-lg bg-blue-500 flex items-center justify-center">
        <img
          // src={art.image}
          src = "/imgs/meow.jpg"
          alt={art.title}
          className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="p-2">
        <p className="text-black text-m font-medium">{art.name}</p>
        <p className="text-m font-body font-light text-black mb-1">{art.title} • {art.medium} • {art.year}</p>
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