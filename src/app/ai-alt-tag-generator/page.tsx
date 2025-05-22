'use client';

import React from 'react';
import { AiCaptionGenerator } from '../components/AiCaptionGenerator';
import AltTextLoadingAnimation from '../components/AltTextLoadingAnimation';

export default function Page() {
  return (
    <main className="bg-gradient-to-b from-blue-50 to-white">
      
      {/* Hero */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          
          {/* Text Column */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-5xl font-extrabold text-white mb-4">
              AI-Powered Alt-Text Generator in Seconds
            </h1>
            <p className="text-lg text-blue-100 mb-6">
              Instantly create concise, SEO-friendly alt-tags for any image. No signup required — just upload and go.
            </p>
            <p className="text-sm text-blue-100 italic">
              Captions are free to use anywhere.
            </p>
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
            {[
              'Drag & drop (or click) to upload your image.',
              'Our AI (powered by Google Gemini Vision) analyzes it.',
              'Receive a concise, descriptive caption to use as alt-text.',
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
                  {i + 1}
                </div>
                <p className="text-gray-700 text-center">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="py-16 bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white shadow-xl rounded-2xl p-8">
            <AiCaptionGenerator />
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} QuickConvert. Captions are free to use anywhere.
          </p>
        </div>
      </section>
    </main>
  );
}
