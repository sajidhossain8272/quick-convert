"use client";

import React, { useState } from "react";
import {
  BookOpen,
  X,
  ShieldCheck,
  Zap,
  Command,
  Layers,
  Sparkles,
} from "lucide-react";

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"overview" | "privacy" | "shortcuts" | "formats">("overview");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[85vh] bg-[#0e171d] text-white rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-[#141f27]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#42b719]/10 text-[#42b719]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Quick Convert Documentation</h3>
              <p className="text-xs text-gray-400">Complete Guide to Client-Side Image Processing & Live Re-Conversion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-800 bg-[#0e171d] text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "overview" ? "bg-[#42b719] text-white" : "bg-gray-800/60 text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab("privacy")}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "privacy" ? "bg-[#42b719] text-white" : "bg-gray-800/60 text-gray-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Privacy & Security</span>
          </button>

          <button
            onClick={() => setActiveTab("shortcuts")}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "shortcuts" ? "bg-[#42b719] text-white" : "bg-gray-800/60 text-gray-400 hover:text-white"
            }`}
          >
            <Command className="w-3.5 h-3.5" />
            <span>Keyboard Shortcuts</span>
          </button>

          <button
            onClick={() => setActiveTab("formats")}
            className={`px-3.5 py-2 rounded-xl transition flex items-center gap-2 ${
              activeTab === "formats" ? "bg-[#42b719] text-white" : "bg-gray-800/60 text-gray-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Supported Formats</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6 text-sm text-gray-300">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Welcome to Quick Convert</h4>
              <p className="leading-relaxed">
                Quick Convert is a desktop-grade, privacy-first image conversion engine running 100% inside your browser. Utilizing HTML5 <code className="bg-gray-800 px-1 py-0.5 rounded text-green-400 font-mono">OffscreenCanvas</code> and multi-threaded Web Workers, image processing is executed directly on your device with instant live re-conversion.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#141f27] border border-gray-800 rounded-xl space-y-1">
                  <Zap className="w-5 h-5 text-[#42b719] mb-1" />
                  <div className="font-bold text-white">Live Re-Conversion</div>
                  <div className="text-xs text-gray-400">Change target format, quality, or filters to re-convert images live.</div>
                </div>

                <div className="p-4 bg-[#141f27] border border-gray-800 rounded-xl space-y-1">
                  <ShieldCheck className="w-5 h-5 text-[#42b719] mb-1" />
                  <div className="font-bold text-white">100% Private</div>
                  <div className="text-xs text-gray-400">Your photos and screenshots never leave your computer.</div>
                </div>

                <div className="p-4 bg-[#141f27] border border-gray-800 rounded-xl space-y-1">
                  <Layers className="w-5 h-5 text-[#42b719] mb-1" />
                  <div className="font-bold text-white">All Formats Export</div>
                  <div className="text-xs text-gray-400">Export any image into WebP, PNG, JPEG, AVIF, BMP, and ICO simultaneously.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#42b719]" />
                Privacy & Client-Side Security Architecture
              </h4>
              <p className="leading-relaxed">
                Unlike traditional online converters that upload confidential images to remote cloud servers, Quick Convert performs all decoding, pixel transformations, resizing, compression, and encoding in your local browser memory.
              </p>

              <div className="p-4 bg-[#141f27] border border-gray-800 rounded-xl space-y-2">
                <div className="font-bold text-white">EXIF Privacy Metadata Stripper</div>
                <p className="text-xs text-gray-400">
                  Digital camera captures and smartphone photos embed sensitive EXIF metadata, including GPS coordinates, camera models, exposure timestamps, and serial numbers. Quick Convert includes an automatic EXIF stripper that cleans this data before export.
                </p>
              </div>
            </div>
          )}

          {activeTab === "shortcuts" && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Keyboard Shortcuts & Efficiency</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <span className="font-medium text-white">Paste Image from Clipboard</span>
                  <kbd className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-green-400">Ctrl + V</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <span className="font-medium text-white">Re-convert All Queue Items</span>
                  <kbd className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-green-400">Ctrl + Enter</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <span className="font-medium text-white">Open Command Search</span>
                  <kbd className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded text-xs font-mono text-green-400">⌘K / Ctrl+K</kbd>
                </div>
              </div>
            </div>
          )}

          {activeTab === "formats" && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Supported Image Formats</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <div className="font-bold text-[#42b719]">WebP</div>
                  <div className="text-xs text-gray-400">Modern web standard providing up to 45% compression savings with alpha channel support.</div>
                </div>
                <div className="p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <div className="font-bold text-[#42b719]">PNG</div>
                  <div className="text-xs text-gray-400">Lossless format ideal for screenshots, UI graphics, text, and vector transparency.</div>
                </div>
                <div className="p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <div className="font-bold text-[#42b719]">JPEG</div>
                  <div className="text-xs text-gray-400">Universal photography format supported by every browser, TV, and operating system.</div>
                </div>
                <div className="p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <div className="font-bold text-[#42b719]">AVIF</div>
                  <div className="text-xs text-gray-400">Next-gen codec based on AV1 delivering ultra-high compression for web imagery.</div>
                </div>
                <div className="p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <div className="font-bold text-[#42b719]">BMP</div>
                  <div className="text-xs text-gray-400">Uncompressed raster graphics format used for legacy systems.</div>
                </div>
                <div className="p-3 bg-[#141f27] border border-gray-800 rounded-xl">
                  <div className="font-bold text-[#42b719]">ICO</div>
                  <div className="text-xs text-gray-400">Favicon icon format for web apps and browser tab icons.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#141f27] border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
          <span className="font-mono text-[#42b719]">Quick Convert Platform</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#42b719] hover:bg-[#349814] text-white text-xs font-semibold rounded-xl transition"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
