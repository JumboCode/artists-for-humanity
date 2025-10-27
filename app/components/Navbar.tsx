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
    `block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      pathname === path
        ? "underline text-gray-700 hover:text-gray-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-700"
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8  py-1 sm:py-2 lg:py-4">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-semibold text-gray-700">
            <Image
            src="/logo.png"
            alt="AFH Logo"
            width={160}
            height={160}
            className="w-28 h-28 sm:w-30 sm:h-30 md:w-32 md:h-32 object-contain"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4">
            <Link href="/user-portal" className={linkClasses("/user-portal")}>
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
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/user-portal"
              className={linkClasses("/user-portal")}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className={linkClasses("/upload")}
              onClick={() => setIsOpen(false)}
            >
              Upload My Work
            </Link>
            <Link
              href="/login"
              className={linkClasses("/login")}
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
