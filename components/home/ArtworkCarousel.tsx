'use client'
import { ArtworkCarouselItem, ArtworkInfo } from './ArtworkCarouselItem'
import Carousel from 'react-material-ui-carousel'

function ArtworkCarousel({ artworks }: { artworks: ArtworkInfo[] }) {
  return (
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
          px: { xs: 0, sm: 2 },
        }}
      >
        {artworks.map(art => (
          <ArtworkCarouselItem key={art.id} art={art} />
        ))}
      </Carousel>
    </section>
  )
}

export { ArtworkCarousel }
