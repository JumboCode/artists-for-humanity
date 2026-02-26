import './globals.css'
import { Poppins } from 'next/font/google'
import Navbar from "./components/Navbar"
import { Providers } from "./providers"

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata = {
  title: 'Artists for Humanity - Digital Portfolio Platform',
  description: 'Showcasing the Next Generation of Creative Voices - A digital archive and portfolio platform for AFH youth program participants',
  keywords: 'artists, humanity, portfolio, youth, creative, Boston, art, digital archive',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
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
            <main className="container-afh">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}