export default function HomePage() {
  return (
    <div className="section-padding">
      {/* Hero Section */}
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

      {/* Gallery Preview Section */}
      <section className="mb-16">
        <h2 className="text-center mb-12">Featured Artwork</h2>
        <div className="gallery-grid">
          {/* Placeholder artwork cards */}
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="card card-hover animate-slide-up">
              <div className="aspect-square bg-gradient-to-br from-afh-orange/20 to-afh-blue/20 flex items-center justify-center">
                <p className="text-afh-blue/60 font-medium">Artwork {item}</p>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-afh-blue mb-2">Sample Artwork Title</h3>
                <p className="text-sm text-afh-blue/70 mb-3">by Student Artist</p>
                <p className="text-sm text-afh-blue/60">Adobe Illustrator • Client Project</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Cards */}
      <section className="gallery-grid mb-16">
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
      </section>
    </div>
  )
}