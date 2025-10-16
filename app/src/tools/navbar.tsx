import React, { useState } from 'react';

// --- Navigation Bar Component ---
const NavBar = ({ setPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper function to handle navigation and close the mobile menu
  const handleNavClick = (pageName) => {
    setPage(pageName);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a onClick={() => handleNavClick('home')} className="cursor-pointer text-2xl font-bold text-blue-600">
              Logo
            </a>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a onClick={() => handleNavClick('home')} className="text-gray-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-md font-medium cursor-pointer transition-colors duration-300">Home</a>
              <a onClick={() => handleNavClick('about')} className="text-gray-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-md font-medium cursor-pointer transition-colors duration-300">About</a>
              <a onClick={() => handleNavClick('services')} className="text-gray-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-md font-medium cursor-pointer transition-colors duration-300">Services</a>
              <a onClick={() => handleNavClick('contact')} className="text-gray-600 hover:bg-blue-600 hover:text-white px-3 py-2 rounded-md text-md font-medium cursor-pointer transition-colors duration-300">Contact</a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-blue-600 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a onClick={() => handleNavClick('home')} className="text-gray-600 hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">Home</a>
            <a onClick={() => handleNavClick('about')} className="text-gray-600 hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">About</a>
            <a onClick={() => handleNavClick('services')} className="text-gray-600 hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">Services</a>
            <a onClick={() => handleNavClick('contact')} className="text-gray-600 hover:bg-blue-600 hover:text-white block px-3 py-2 rounded-md text-base font-medium cursor-pointer">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;

