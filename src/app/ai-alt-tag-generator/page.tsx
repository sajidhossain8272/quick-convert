'use client';

import React from 'react';
import { AiCaptionGenerator } from '../components/AiCaptionGenerator';
import AltTextLoadingAnimation from '../components/AltTextLoadingAnimation';

export default function Page() {
  // Scroll handler for the CTA
  const scrollToGenerator = () => {
    const el = document.getElementById('generator-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const steps = [
    'Drag & drop (or click) to upload your image.',
    'Our AI (powered by Google Gemini Vision) analyzes it.',
    'Receive a concise, descriptive caption to use as alt-text.',
  ];

  return (
    <main className="bg-gradient-to-b from-blue-50 to-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          {/* Text Column */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-5xl font-extrabold text-white pt-20">
              AI-Powered Alt-Text Generator in Seconds
            </h1>
            <p className="text-lg text-gray-50">
              Create concise, SEO-friendly alt-tags for any image—no signup required.
            </p>
            <p className="text-sm text-gray-200 italic">
              Supports JPG, PNG, WebP, HEIC & more.
            </p>
            <button
              onClick={scrollToGenerator}
              className="mt-4 inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition"
            >
              Try Now
            </button>
          </div>
          {/* Loader Column */}
          <div className="flex-1">
            <AltTextLoadingAnimation />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center p-6 bg-white rounded-lg shadow-lg
                           hover:shadow-2xl transform hover:-translate-y-1 transition"
              >
                <div className="flex items-center justify-center h-14 w-14
                                bg-gradient-to-tr from-blue-400 to-purple-500
                                text-white rounded-full text-xl font-bold mb-4">
                  {idx + 1}
                </div>
                <p className="text-gray-700 text-center">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section
        id="generator-section"
        className="py-16 bg-gradient-to-br from-white to-blue-50"
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <AiCaptionGenerator />
          </div>
        </div>
      </section>
    </main>
  );
}
