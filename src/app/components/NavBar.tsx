// src/app/components/NavBar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaRocket, FaBars, FaTimes } from 'react-icons/fa';

export default function NavBar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Base classes for primary links
  const linkBase     = 'block px-4 py-2 font-semibold rounded-lg transition-colors';
  const linkActive   = 'bg-blue-800 text-white';
  const linkInactive = 'text-gray-800 hover:bg-blue-600 hover:text-white';

  // Base classes for secondary link
  const secBase      = 'block px-4 py-2 font-semibold rounded-lg transition-colors';
  const secActive    = 'bg-gray-200 text-gray-800';
  const secInactive  = 'text-gray-800 hover:bg-gray-100';

  // Navigation items
  const links = [
    { href: '/',                     label: 'Image Converter',     active: pathname === '/',                          primary: true },
    { href: '/ai-alt-tag-generator', label: 'Alt-Text Generator',  active: pathname === '/ai-alt-tag-generator',     primary: true },
    { href: 'https://github.com/sajidhossain8272/', label: 'Contact Us', active: false,                         primary: false }
  ];

  return (
    <nav className="w-full bg-white shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 text-2xl font-extrabold text-gray-800 tracking-tight">
            <FaRocket className="text-blue-600" />
            <Link href="/" onClick={() => setMenuOpen(false)}>
              Quick<span className="text-blue-600">Convert</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {links.map((link, idx) => {
              const base     = link.primary ? linkBase     : secBase;
              const active   = link.primary ? linkActive   : secActive;
              const inactive = link.primary ? linkInactive : secInactive;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  target={link.primary ? undefined : '_blank'}
                  rel={link.primary ? undefined : 'noopener noreferrer'}
                  className={`${base} ${link.active ? active : inactive}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-gray-800 hover:text-gray-600 focus:outline-none"
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-white/95 backdrop-blur-sm z-40 flex flex-col items-center pt-20 space-y-6">
          {links.map((link, idx) => {
            const base     = link.primary ? linkBase     : secBase;
            const active   = link.primary ? linkActive   : secActive;
            const inactive = link.primary ? linkInactive : secInactive;
            return (
              <Link
                key={idx}
                href={link.href}
                target={link.primary ? undefined : '_blank'}
                rel={link.primary ? undefined : 'noopener noreferrer'}
                onClick={() => setMenuOpen(false)}
                className={`${base} text-xl ${link.active ? active : inactive}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
