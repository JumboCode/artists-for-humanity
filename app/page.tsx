import React from 'react'
import { ArtworkInfo } from '@/components/home/ArtworkCarouselItem'
import { ArtworkCarousel } from '@/components/home/ArtworkCarousel'
import { ArtworkGallery } from '@/components/home/ArtworkGallery'
import { Artwork } from '@prisma/client'

export default async function HomePage() {
  let artworks: ArtworkInfo[] = []

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/artworks`, {
      cache: 'no-store',
    })

    if (!res.ok) throw new Error('Failed to fetch artworks')

    const data = await res.json()
    artworks = data.map((row: Artwork) => ({
      id: row.id,
      name: row.submitted_by_name ?? '',
      title: row.title,
      medium: row.tools_used?.join(', ') ?? '',
      // does this make sense for year? Wouldn't this be upload date instead of art creation date?
      year: new Date(row.created_at).getFullYear(),
      image: row.image_url,
    }))
  } catch (e) {
    // handle failed fetch. How to display failed fetch? Loading state?
    console.error(e)
  }

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
            <button
              className="inline-flex items-center justify-center 
                      min-w-[120px] sm:min-w-[140px]
                      h-[40px] sm:h-[45px] px-6 py-2
                      rounded-full border border-[#F26729] text-[#F26729] 
                      font-secondary text-sm sm:text-base transition-colors duration-300 
                      hover:bg-[#F26729] hover:text-white 
                      active:bg-[#F26729] active:text-white cursor-pointer"
            >
              Exhibition Name
            </button>

            <button
              className="inline-flex items-center justify-center 
                      min-w-[120px] sm:min-w-[140px]
                      h-[40px] sm:h-[45px] px-6 py-2
                      rounded-full border border-[#F26729] text-[#F26729] 
                      font-secondary text-sm sm:text-base transition-colors duration-300 
                      hover:bg-[#F26729] hover:text-white 
                      active:bg-[#F26729] active:text-white cursor-pointer"
            >
              Exhibition Name
            </button>

            <button
              className="inline-flex items-center justify-center 
                      min-w-[120px] sm:min-w-[140px]
                      h-[40px] sm:h-[45px] px-6 py-2
                      rounded-full border border-[#F26729] text-[#F26729] 
                      font-secondary text-sm sm:text-base transition-colors duration-300 
                      hover:bg-[#F26729] hover:text-white 
                      active:bg-[#F26729] active:text-white cursor-pointer"
            >
              Exhibition Name
            </button>
          </div>
        </section>

        {/* Carousel Section */}
        <ArtworkCarousel artworks={artworks} />

        {/* Section line */}
        <hr className="border-t-[1px] border-gray-400 my-[60px]" />

        {/* Artwork gallery */}
        <ArtworkGallery artworks={artworks} />

        {/* Section line */}
        <hr className="border-t-[1px] border-gray-400 my-[60px]" />

        {/* Call to Action */}
        <section className="w-full">
          <h2 className="text-left text-black font-heading font-light leading-snug text-2xl sm:text-3xl md:text-4xl mb-6">
            Do you also want to showcase your art on our homepage? Upload your
            work below.
          </h2>
          <button className="inline-flex items-center justify-center min-w-[140px] h-[45px] px-6 py-3 rounded-full border border-[#F26729] text-[#F26729] gap-[10px] font-secondary text-base transition-colors duration-300 hover:bg-[#F26729] hover:text-white cursor-pointer">
            Upload Your Work
          </button>
        </section>
      </div>
    </div>
  )
}
