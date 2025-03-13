"use client";

import { useState } from "react";
import { Resolution } from "@/lib/imageUtils";

interface ConversionControlsProps {
  settings: {
    format: "webp" | "jpeg" | "png";
    quality: number;
    resolution: Resolution;
  };
  setSettings: (settings: ConversionControlsProps["settings"]) => void;
  onConvert: () => void;
  hasSelectedImages: boolean;
  selectedCount: number;
}

export default function ConversionControls({
  settings,
  setSettings,
  onConvert,
  hasSelectedImages,
  selectedCount,
}: ConversionControlsProps) {
  // For a simple "High/Medium/Low" mapping
  const [qualityOption, setQualityOption] = useState<"high" | "medium" | "low">(
    settings.quality >= 90 ? "high" : settings.quality >= 80 ? "medium" : "low"
  );

  const qualityMapping = {
    high: 90,
    medium: 80,
    low: 70,
  };

  const resolutions = [
    { value: "original", label: "Original" },
    { value: "25", label: "25%" },
    { value: "50", label: "50%" },
    { value: "75", label: "75%" },
  ];

  // Dynamic button text
  const convertButtonText =
    selectedCount === 1 ? "Convert" : "Convert All";

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8 space-y-3">
      <p className="text-sm text-gray-600">
        All conversions happen <strong>client-side</strong>. Your images never
        leave your browser.
      </p>
      <p className="text-sm text-gray-600">
        Choose format, quality, and resolution. Then select which images to
        convert below, and click <strong>{convertButtonText}</strong>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        {/* Format */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Format
          </label>
          <select
            value={settings.format}
            onChange={(e) =>
              setSettings({
                ...settings,
                format: e.target.value as "webp" | "jpeg" | "png",
              })
            }
            className="w-full p-2 border rounded-md"
          >
            <option value="webp">WebP</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quality
          </label>
          <select
            value={qualityOption}
            onChange={(e) => {
              const option = e.target.value as "high" | "medium" | "low";
              setQualityOption(option);
              setSettings({ ...settings, quality: qualityMapping[option] });
            }}
            className="w-full p-2 border rounded-md"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Resolution */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Resolution
          </label>
          <select
            value={settings.resolution}
            onChange={(e) =>
              setSettings({
                ...settings,
                resolution: e.target.value as Resolution,
              })
            }
            className="w-full p-2 border rounded-md"
          >
            {resolutions.map((res) => (
              <option key={res.value} value={res.value}>
                {res.label}
              </option>
            ))}
          </select>
        </div>

        {/* Convert Button */}
        <button
          onClick={onConvert}
          disabled={!hasSelectedImages}
          className={`w-full py-2 px-4 rounded-md transition-colors ${
            hasSelectedImages
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {convertButtonText}
        </button>
      </div>
    </div>
  );
}
