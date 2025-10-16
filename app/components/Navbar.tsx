"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      pathname === path
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-semibold text-blue-600">MyApp</h1>
          <div className="flex space-x-4">
            <Link href="/" className={linkClasses("/")}>
              Home
            </Link>
            <Link href="/about" className={linkClasses("/about")}>
              About
            </Link>
            <Link href="/contact" className={linkClasses("/contact")}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
