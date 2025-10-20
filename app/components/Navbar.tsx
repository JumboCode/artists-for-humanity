"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      pathname === path
        ? "underline text-gray-700 hover:text-gray-700"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-700"
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className={linkClasses("/")}>
            <h1 className="text-xl font-semibold ">AFH</h1>
          </Link>
          
          <div className="flex space-x-4">
            
            <Link href="/user-portal" className={linkClasses("/user-portal")}>
              Gallery
            </Link>
            <Link href="/upload" className={linkClasses("/upload")}>
              Upload My Work
            </Link>
            <Link href="/login" className={linkClasses("/login")}>
              Login
            </Link>
            <Link href="*" className={linkClasses("/error404")}>
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
