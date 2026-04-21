'use client'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

const Navbar = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { data: session } = useSession()
  const profileRef = useRef<HTMLDivElement>(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const linkClasses = (path: string) =>
    `px-4 py-2 text-base font-medium transition-all duration-300 ${
      pathname === path
        ? 'underline decoration-2 underline-offset-4 text-afh-blue'
        : 'text-afh-blue hover:text-afh-orange'
    }`;

  const mobileMenuItemClasses = (path: string) =>
    `block w-full rounded-full border px-4 py-2 text-base font-medium transition-all duration-200 ${
      pathname === path
        ? 'border-afh-orange bg-afh-orange text-white'
        : 'border-afh-orange/60 text-afh-blue hover:bg-afh-orange hover:text-white'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="AFH Logo"
              width={200}
              height={80}
              className="h-16 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={linkClasses('/')}>
              Gallery
            </Link>
            <Link href="/upload" className={linkClasses('/upload')}>
              Upload My Work
            </Link>
            {/* Render Login if not logged in, otherwise render profile picture with dropdown */}
            {session ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1.5 rounded-full border border-afh-orange/50 px-2.5 py-1.5 text-afh-blue transition-all duration-200 hover:bg-afh-orange hover:text-white focus:outline-none"
                  aria-label="Profile menu"
                  aria-expanded={isProfileOpen}
                >
                  <Image
                    src={session?.user?.profile?.profile_image_url || "/imgs/user-stock.png"}
                    alt="Profile Picture"
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : 'rotate-0'}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-auto min-w-[120px] bg-white rounded-lg shadow-afh-lg py-1 border border-afh-blue/10 z-50">
                    {session.user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="mx-2 my-1 block rounded-full border border-afh-orange/60 px-4 py-2 text-sm font-medium text-afh-blue transition-all duration-150 text-center whitespace-nowrap hover:bg-afh-orange hover:text-white"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      href="/user-portal"
                      className="mx-2 my-1 block rounded-full border border-afh-orange/60 px-4 py-2 text-sm font-medium text-afh-blue transition-all duration-150 text-center whitespace-nowrap hover:bg-afh-orange hover:text-white"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Go to Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut({ callbackUrl: '/login' });
                      }}
                      className="mx-2 my-1 block w-[calc(100%-1rem)] rounded-full border border-afh-orange/60 px-4 py-2 text-sm font-medium text-afh-blue transition-all duration-150 text-center whitespace-nowrap hover:bg-afh-orange hover:text-white"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={linkClasses("/login")}>
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center gap-1.5 rounded-full border border-afh-orange/60 px-3 py-2 text-afh-blue transition-all duration-200 hover:bg-afh-orange hover:text-white focus:outline-none"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-afh-blue/10 bg-white shadow-afh">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <Link
              href="/"
              className={mobileMenuItemClasses('/')}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className={mobileMenuItemClasses('/upload')}
              onClick={() => setIsOpen(false)}
            >
              Upload My Work
            </Link>
            {session ? (
              <>
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={mobileMenuItemClasses('/admin')}
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/user-portal"
                  className={mobileMenuItemClasses('/user-portal')}
                  onClick={() => setIsOpen(false)}
                >
                  Go to Profile
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="block w-full rounded-full border border-afh-orange/60 px-4 py-2 text-center text-base font-medium text-afh-blue transition-all duration-200 hover:bg-afh-orange hover:text-white"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={mobileMenuItemClasses('/login')}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
