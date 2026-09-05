'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaTwitter, FaDiscord } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0e171d] text-white pt-20 pb-10 border-t border-[#1d2a32]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10 overflow-hidden bg-white rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/plzwork-logo-icon.png"
                  alt="Quick Convert"
                  fill
                  className="object-cover scale-[1.3]"
                />
              </div>
              <span className="text-2xl font-bold tracking-tight">Quick Convert</span>
            </Link>
            <p className="text-[#8c9ba5] text-sm leading-relaxed max-w-sm mb-8">
              Quick Convert is a fast, private, universal conversion studio for images, units, currencies, and developer utilities — running entirely in your browser.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://github.com/sajidhossain8272/" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-[#1d2a32] text-[#8c9ba5] hover:text-white hover:bg-[#4da72a] rounded-full transition-all">
                <FaGithub size={18} />
              </a>
              <a href="#" className="p-2.5 bg-[#1d2a32] text-[#8c9ba5] hover:text-white hover:bg-[#1DA1F2] rounded-full transition-all">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="p-2.5 bg-[#1d2a32] text-[#8c9ba5] hover:text-white hover:bg-[#5865F2] rounded-full transition-all">
                <FaDiscord size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-white mb-6 tracking-wide">Products</h4>
            <ul className="space-y-4 text-sm text-[#8c9ba5]">
              <li><Link href="/" className="hover:text-white transition-colors">Quick Convert</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6 tracking-wide">Resources</h4>
            <ul className="space-y-4 text-sm text-[#8c9ba5]">
              <li><a href="https://github.com/sajidhossain8272/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-6 tracking-wide">Legal</h4>
            <ul className="space-y-4 text-sm text-[#8c9ba5]">
              <li><a href="/Quick Convert - Privacy Policy.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/Quick Convert - Terms and Conditions.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1d2a32] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#8c9ba5] text-sm">
            &copy; {currentYear} Quick Convert. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-[#8c9ba5]">
            <span>Designed in</span>
            <span className="text-white font-medium">Next.js</span>
            <span className="mx-2">&middot;</span>
            <span className="flex items-center gap-1">Status: <span className="w-2 h-2 rounded-full bg-[#4da72a]"></span> All systems operational</span>
            <span className="mx-2">&middot;</span>
            <Link
              href="https://plzwork.app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:text-white transition-colors"
            >
              by <span className="text-[#4da72a] font-medium">Plzwork</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
