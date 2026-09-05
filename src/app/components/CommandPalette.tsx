"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Search, Command, ArrowRight, X, Hash, Sparkles } from "lucide-react";
import { executeSmartSearch } from "@/engine/search";
import { SearchResult, CategoryType, Unit } from "@/engine/types";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: CategoryType) => void;
  onSelectConversion?: (fromUnit: Unit, toUnit: Unit, value: number) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  onSelectConversion,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      if (item.type === "conversion" && item.fromUnit && item.toUnit && onSelectConversion) {
        const match = item.title.match(/^([\d.]+)/);
        const val = match ? parseFloat(match[1]) : 1;
        onSelectConversion(item.fromUnit, item.toUnit, val);
      }
      onSelectCategory(item.category);
      onClose();
    },
    [onSelectCategory, onSelectConversion, onClose]
  );

  useEffect(() => {
    if (query.trim()) {
      const found = executeSmartSearch(query);
      setResults(found);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, handleSelect]);

  if (!isOpen) return null;

  const defaultCategories: { id: CategoryType; label: string; desc: string }[] = [
    { id: "length", label: "Length", desc: "Meters, Feet, Inches, Miles, Kilometers" },
    { id: "weight", label: "Weight & Mass", desc: "Kilograms, Pounds, Ounces, Grams, Tons" },
    { id: "temperature", label: "Temperature", desc: "Celsius, Fahrenheit, Kelvin" },
    { id: "currency", label: "Currency", desc: "USD, EUR, GBP, JPY, CAD, BDT, INR" },
    { id: "digital", label: "Digital Storage", desc: "Bytes, MB, GB, TB, GiB" },
    { id: "volume", label: "Volume", desc: "Liters, Gallons, Milliliters, Cups" },
    { id: "area", label: "Area", desc: "Square Meters, Square Feet, Acres" },
    { id: "speed", label: "Speed", desc: "km/h, mph, m/s, Knots" },
    { id: "time", label: "Time", desc: "Seconds, Minutes, Hours, Days" },
    { id: "dev", label: "Developer Tools", desc: "Base64, UUID, JSON Formatter" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0e171d] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-800 bg-[#141f27]">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search or convert (e.g. '5 feet to cm', 'USD to EUR', '100°C')..."
            className="w-full bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results / Commands Body */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Categories & Quick Jump
              </div>
              {defaultCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-800/70 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-800 text-gray-300 group-hover:bg-[#42b719]/10 group-hover:text-[#42b719] transition">
                      <Hash className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-200 group-hover:text-white">
                        {cat.label}
                      </div>
                      <div className="text-xs text-gray-400">{cat.desc}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Search Results & Conversions
              </div>
              {results.map((res, idx) => (
                <div
                  key={res.id}
                  onClick={() => handleSelect(res)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition ${
                    idx === selectedIndex ? "bg-[#42b719]/10 border border-[#42b719]/30 text-white" : "hover:bg-gray-800/60 text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${res.type === "conversion" ? "bg-[#42b719]/20 text-[#42b719]" : "bg-gray-800 text-gray-300"}`}>
                      {res.type === "conversion" ? <Sparkles className="w-4 h-4" /> : <Command className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{res.title}</div>
                      <div className="text-xs text-gray-400">{res.subtitle}</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono px-2 py-1 bg-gray-800 rounded text-gray-400">
                    Enter ↵
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500 text-sm">
              No converter matches &quot;{query}&quot;. Try &quot;5 ft to cm&quot; or &quot;Celsius&quot;.
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#141f27] border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-300">↑</kbd> <kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-300">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-300">↵</kbd> Select</span>
            <span><kbd className="px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-300">ESC</kbd> Close</span>
          </div>
          <span className="text-[11px] font-mono text-[#42b719]">Quick Convert V2</span>
        </div>
      </div>
    </div>
  );
};
