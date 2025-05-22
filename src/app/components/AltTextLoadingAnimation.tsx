// src/app/components/AltTextLoadingAnimation.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { FaSpinner, FaCheckCircle, FaTag } from 'react-icons/fa';

export const AltTextLoadingAnimation: React.FC = () => {
  const [phase, setPhase] = useState<'loading' | 'done'>('loading');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate a two‐stage progression: 
    // 1) Build up to 60% while “analyzing” 
    // 2) Jump to 100% then finish  
    const step1Duration = 1200;
    const step2Delay    = 200;
    const intervalTime  = 20;
    const target1       = 60;
    const inc1          = target1 / (step1Duration / intervalTime);

    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + inc1;
        if (next >= target1) {
          clearInterval(interval);
          // After a brief pause, finish
          setTimeout(() => {
            setProgress(100);
            setPhase('done');
          }, step2Delay);
          return target1;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="
        relative flex flex-col items-center justify-center 
        bg-white border border-gray-200 rounded-xl shadow-xl 
        p-8 space-y-6 animate-fadeIn
        max-w-sm mx-auto
      ">
      {phase === 'loading' ? (
        <>
          <FaSpinner className="w-12 h-12 text-green-600 animate-spin" />
          <h2 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
            <FaTag className="text-green-500" />
            <span>Crafting concise alt-text…</span>
          </h2>
          <p className="text-gray-600 text-center">
            Our AI is analyzing your image and generating a developer-ready alt tag.
          </p>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </>
      ) : (
        <>
          <FaCheckCircle className="w-14 h-14 text-green-500 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800">
            Alt-Text Generated!
          </h2>
          <p className="text-gray-700 text-center">
            One click, zero hassle—copy your new alt tag and ship it.
          </p>
        </>
      )}
    </div>
  );
};

export default AltTextLoadingAnimation;
