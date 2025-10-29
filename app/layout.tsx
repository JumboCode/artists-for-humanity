import './globals.css'
import { Poppins } from 'next/font/google'
import Navbar from "./components/Navbar";

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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={poppins.className}>
        <Navbar />
        <div className="min-h-screen bg-afh-white w-full">
          <main className="container-afh">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}