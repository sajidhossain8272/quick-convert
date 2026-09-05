'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, History, Command } from 'lucide-react';
import { FaBars, FaTimes } from 'react-icons/fa';

interface NavBarProps {
  onOpenCommandPalette?: () => void;
  onOpenHistory?: () => void;
}

export default function NavBar({ onOpenCommandPalette, onOpenHistory }: NavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={`fixed top-0 left-0 w-full z-40 transition-all duration-500 ${isScrolled ? 'bg-white/95 shadow-sm backdrop-blur-xl' : ''}`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className={`transition-all duration-500 flex items-center justify-between border ${
            isScrolled 
              ? 'py-3 border-transparent rounded-none mx-0' 
              : 'py-3 mt-6 rounded-[2rem] border-white/40 bg-white/70 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl px-2 sm:px-4 -mx-[20px]'
          }`}>
            {/* Logo + Tagline */}
            <div className={`flex-shrink-0 transition-all duration-500 flex items-center ${isScrolled ? 'lg:-ml-[50px]' : ''}`}>
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 group">
                <div className="relative h-11 w-11 overflow-hidden transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src="/plzwork-logo-icon.png"
                    alt="Logo"
                    fill
                    className="object-cover scale-[1.3]"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold tracking-tight text-[#0d161c]">Quick Convert</span>
                  <span className="text-[10px] font-semibold text-[#42b719] tracking-wider uppercase">Universal Converter</span>
                </div>
              </Link>
            </div>

            {/* Middle Action Bar: Search & History */}
            <div className="hidden md:flex items-center space-x-3">
              <button
                onClick={onOpenCommandPalette}
                className="flex items-center gap-3 bg-[#0d161c] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-sm hover:bg-[#1d2a32] transition group"
              >
                <Search className="w-3.5 h-3.5 text-[#42b719]" />
                <span>Search image tools...</span>
                <span className="flex items-center gap-0.5 bg-gray-800 text-gray-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-gray-700 ml-1">
                  <Command className="w-2.5 h-2.5" />K
                </span>
              </button>

              <button
                onClick={onOpenHistory}
                className="flex items-center gap-2 bg-white border border-[#cfd8cc] text-[#33424a] hover:text-[#0d161c] px-3.5 py-2 rounded-full text-xs font-semibold shadow-xs hover:border-gray-400 transition"
              >
                <History className="w-3.5 h-3.5 text-[#42b719]" />
                <span>History</span>
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={onOpenCommandPalette}
                className="p-2.5 rounded-full bg-[#0d161c] text-white shadow-sm focus:outline-none"
                aria-label="Open Search"
              >
                <Search size={16} />
              </button>
              <button
                className="p-2.5 rounded-full bg-white/50 border border-black/5 text-[#0d161c] shadow-sm focus:outline-none hover:bg-white transition-colors"
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile Overlay Menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#f7f7f4]/95 backdrop-blur-xl z-50 flex flex-col items-center justify-center space-y-6">
          <button 
            onClick={() => setMenuOpen(false)}
            className="absolute top-8 right-8 p-3 rounded-full bg-white shadow-sm border border-gray-100 text-gray-500 hover:text-black transition-colors"
          >
            <FaTimes size={24} />
          </button>
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => {
                setMenuOpen(false);
                if (onOpenCommandPalette) onOpenCommandPalette();
              }}
              className="text-xl font-bold px-6 py-3 rounded-2xl bg-[#0d161c] text-white flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-[#42b719]" />
              <span>Command Palette (⌘K)</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                if (onOpenHistory) onOpenHistory();
              }}
              className="text-xl font-bold px-6 py-3 rounded-2xl bg-white border border-gray-200 text-[#0d161c] flex items-center gap-2"
            >
              <History className="w-5 h-5 text-[#42b719]" />
              <span>Conversion History</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
