"use client";

import { FaRocket } from "react-icons/fa";

export default function NavBar() {
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 text-2xl font-extrabold text-gray-800 tracking-tight">
          <FaRocket className="text-blue-600 text-2xl" />
          <span>
            Quick<span className="text-blue-600">Convert</span>
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/sajidhossain8272/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-lg 
                       transition-transform duration-300 hover:bg-blue-700 hover:scale-105"
          >
            Contact Us
          </a>
        </div>
      </div>
    </nav>
  );
}
