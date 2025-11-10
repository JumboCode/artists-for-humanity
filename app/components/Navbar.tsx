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
    `block px-4 py-2 rounded-md text-sm md:text-base lg:text-lg font-medium transition-colors duration-200 ${
      pathname === path
        ? "underline text-gray-700 hover:text-gray-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-700"
    }`;

  const mobileLinkClasses = (path: string) =>
    `block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
      pathname === path
        ? "underline text-gray-700 hover:text-gray-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-700"
    }`;

  return (
    <nav className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-18 lg:h-20 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center justify-center">
            <Image
            src="/logo.png"
            alt="AFH Logo"
            width={160}
            height={160}
            className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 object-contain transition-transform duration-200 hover:scale-105"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-4 lg:space-x-6 xl:space-x-8">
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
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-3 space-y-1">
            <Link
              href="/user-portal"
              className={mobileLinkClasses("/user-portal")}
              onClick={() => setIsOpen(false)}
            >
              Gallery
            </Link>
            <Link
              href="/upload"
              className={mobileLinkClasses("/upload")}
              onClick={() => setIsOpen(false)}
            >
              Upload My Work
            </Link>
            <Link
              href="/login"
              className={mobileLinkClasses("/login")}
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
