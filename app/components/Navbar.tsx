"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react"; 

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const linkClasses = (path: string) =>
    `px-4 py-2 text-base font-normal transition-colors duration-200 ${
      pathname === path
        ? "underline decoration-2 underline-offset-4 text-black"
        : "text-black hover:text-afh-orange"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="w-full px-6 sm:px-8 lg:px-12 py-3">
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
            <Link href="/" className={linkClasses("/")}>
              Gallery
            </Link>
            <Link href="/upload" className={linkClasses("/upload")}>
              Upload My Work
            </Link>
            <Link href="/login" className={linkClasses("/login")}>
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-afh-orange"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block ${linkClasses("/")}`}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className={`block ${linkClasses("/upload")}`}
              onClick={() => setIsOpen(false)}
            >
              Upload My Work
            </Link>
            <Link
              href="/login"
              className={`block ${linkClasses("/login")}`}
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
