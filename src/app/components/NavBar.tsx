// src/app/components/NavBar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaRocket } from 'react-icons/fa';

export default function NavBar() {
  const pathname = usePathname();

  // Utility to merge base + active classes
  const navClass = (active: boolean) =>
    `px-4 py-2 font-semibold rounded-lg shadow-lg transition-transform duration-300 
     ${active 
       ? 'bg-blue-800 text-white scale-105' 
       : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'}`;

  const secondaryClass = (active: boolean) =>
    `px-4 py-2 font-semibold rounded-lg shadow transition-transform duration-300 
     ${active
       ? 'bg-gray-200 text-gray-800 scale-105'
       : 'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105'}`;

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 text-2xl font-extrabold text-gray-800 tracking-tight">
          <FaRocket className="text-blue-600" />
          <Link href="/" className="hover:underline">
            Quick<span className="text-blue-600">Convert</span>
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex items-center space-x-4">
          {/* Image Converter */}
          <Link
            href="/"
            className={navClass(pathname === '/')}
          >
            Image Converter
          </Link>

          {/* Alt-Text Generator */}
          <Link
            href="/ai-alt-tag-generator"
            className={navClass(pathname === '/ai-alt-tag-generator')}
          >
            Alt-Text Generator
          </Link>

          {/* Contact Us */}
          <Link
            href="https://github.com/sajidhossain8272/"
            target="_blank"
            rel="noopener noreferrer"
            className={secondaryClass(false)}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
