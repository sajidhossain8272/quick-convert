"use client";

import React, { useState } from "react";
import QuickConvertTerminal from "./QuickConvertTerminal";
import { Command, ArrowRight, BookOpen } from "lucide-react";
import { DocumentationModal } from "./DocumentationModal";

interface HeroProps {
  onConvertNowClick: () => void;
  onOpenCommandPalette: () => void;
}

const Hero: React.FC<HeroProps> = ({ onConvertNowClick, onOpenCommandPalette }) => {
  const [docModalOpen, setDocModalOpen] = useState(false);

  return (
    <div className="pt-16">
      <section className="relative overflow-hidden border-b border-[#dde4da] bg-[#f7f7f4] py-16 text-[#0f171d] sm:py-20">
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6ded2] bg-white px-4 py-2 text-xs font-semibold text-[#30404a] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[#42b719]" />
              Quick Convert · Private Browser Image Studio
            </div>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-[#0d161c] sm:text-5xl lg:text-6xl">
              The fastest browser image conversion platform.
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-[#5b6870] sm:text-lg">
              Convert, resize, compress, and edit images instantly in WebP, PNG, JPEG, AVIF, BMP, and ICO. 100% private, zero server latency, installable PWA.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                className="rounded-xl bg-[#0e171d] px-6 py-3.5 font-semibold text-white transition hover:bg-[#1d2a32] shadow-md flex items-center gap-2 text-sm"
                onClick={onConvertNowClick}
              >
                <span>Image Studio</span>
                <ArrowRight className="w-4 h-4 text-[#42b719]" />
              </button>

              <button
                onClick={() => setDocModalOpen(true)}
                className="rounded-xl border border-[#cfd7cf] bg-white px-5 py-3.5 font-semibold text-[#142027] transition hover:border-[#9fb89d] shadow-2xs flex items-center gap-2 text-sm"
              >
                <BookOpen className="w-4 h-4 text-[#42b719]" />
                <span>Read Documentation</span>
              </button>

              <button
                onClick={onOpenCommandPalette}
                className="rounded-xl border border-[#cfd7cf] bg-white px-5 py-3.5 font-semibold text-[#142027] transition hover:border-[#9fb89d] shadow-2xs flex items-center gap-2 text-sm"
              >
                <Command className="w-4 h-4 text-gray-500" />
                <span>⌘K Search</span>
              </button>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <QuickConvertTerminal />
          </div>
        </div>
      </section>

      {/* Interactive Documentation Modal */}
      <DocumentationModal isOpen={docModalOpen} onClose={() => setDocModalOpen(false)} />
    </div>
  );
};

export default Hero;
