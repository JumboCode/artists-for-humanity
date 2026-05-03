import './globals.css'
import { Poppins } from 'next/font/google'
import Image from 'next/image'
import Navbar from './components/Navbar'
import { Providers } from './providers'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: 'Artists for Humanity - Digital Portfolio Platform',
  description:
    'Showcasing the Next Generation of Creative Voices - A digital archive and portfolio platform for AFH youth program participants',
  keywords:
    'artists, humanity, portfolio, youth, creative, Boston, art, digital archive',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: {
      url: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={poppins.className}>
        <Providers>
          <Navbar />
          <div className="min-h-screen bg-afh-white w-full">
            <main className="container-afh">{children}</main>
            <footer className="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-[#071826]/70 via-[#071826]/85 to-[#071826]/95 text-white backdrop-blur-sm">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgba(245,130,31,0.28),transparent_50%),radial-gradient(circle_at_92%_5%,rgba(255,255,255,0.05),transparent_35%)]" />
              <div className="relative mx-auto max-w-[1440px] px-6 py-10 sm:px-8 lg:px-12 xl:px-16">
                <div className="grid gap-10 grid-cols-1 md:grid-cols-3 md:gap-6 lg:gap-16 md:items-start">
                  {/* Logo and Description */}
                  <div className="space-y-4 flex flex-col items-center">
                    <div className="w-32">
                      <Image
                        src="/logo.png"
                        alt="Artists for Humanity Logo"
                        width={128}
                        height={128}
                        className="w-full h-auto"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="space-y-2.5 text-center">
                    <p className="font-medium text-white text-sm uppercase tracking-wide">Follow Us</p>
                    <div className="space-y-2">
                      <a
                        href="https://www.facebook.com/ArtistsForHumanity"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-white/80 hover:text-afh-orange transition-colors"
                      >
                        Facebook
                      </a>
                      <a
                        href="https://www.instagram.com/artists.for.humanity/"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-white/80 hover:text-afh-orange transition-colors"
                      >
                        Instagram
                      </a>
                      <a
                        href="https://www.youtube.com/user/AFHBoston"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-white/80 hover:text-afh-orange transition-colors"
                      >
                        YouTube
                      </a>
                      <a
                        href="https://x.com/AFHBoston"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-white/80 hover:text-afh-orange transition-colors"
                      >
                        Twitter
                      </a>
                      <a
                        href="https://www.linkedin.com/company/artistsforhumanity/"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-white/80 hover:text-afh-orange transition-colors"
                      >
                        LinkedIn
                      </a>
                      <a
                        href="https://afhboston.medium.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="block text-sm text-white/80 hover:text-afh-orange transition-colors"
                      >
                        Medium
                      </a>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-2.5 text-center">
                    <p className="font-medium text-white text-sm uppercase tracking-wide">Contact</p>
                    <div className="space-y-3 text-sm text-white/75 font-secondary">
                      <div>
                        <p className="text-white/90 font-medium">Address</p>
                        <p>100 W 2nd Street</p>
                        <p>Boston, MA 02127</p>
                      </div>
                      <div>
                        <a 
                          href="tel:617-268-7620"
                          className="text-white/80 hover:text-afh-orange transition-colors inline-block"
                        >
                          617-268-7620
                        </a>
                      </div>
                      <div>
                        <a 
                          href="https://www.afhboston.org/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-white/80 hover:text-afh-orange transition-colors inline-block"
                        >
                          afhboston.org
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-center text-center">
                  <p>© {new Date().getFullYear()} Artists for Humanity</p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  )
}
