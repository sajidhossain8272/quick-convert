// src/app/components/AiCaptionGenerator.tsx
'use client';

import React, {
  useState,
  useRef,
  useEffect,
  DragEvent,
  ChangeEvent
} from 'react';
import { PhotoIcon } from '@heroicons/react/24/outline';
import { FaCopy, FaCheck } from 'react-icons/fa';

export const AiCaptionGenerator: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef    = useRef<HTMLDivElement>(null);

  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [caption, setCaption]       = useState<string>('');
  const [isLoading, setIsLoading]   = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isCopied, setIsCopied]     = useState<boolean>(false);

  // Scroll result area into view on upload or when loading starts
  useEffect(() => {
    if ((isLoading || previewSrc) && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isLoading, previewSrc]);

  // reset copy state after 2s
  useEffect(() => {
    if (isCopied) {
      const t = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [isCopied]);

  const handleFile = async (file: File) => {
    setCaption('');
    setIsLoading(true);
    setIsCopied(false);
    setPreviewSrc(URL.createObjectURL(file));

    try {
      const fd = new FormData();
      fd.append('image', file);
      const res  = await fetch(
        'https://quick-convert-server.vercel.app/api/alt-text',
        { method: 'POST', body: fd }
      );
      const json = await res.json();
      setCaption(json.caption || 'No caption returned');
    } catch {
      setCaption('Error generating caption.');
    } finally {
      setIsLoading(false);
    }
  };

  const onDragOver  = (e: DragEvent) => { e.preventDefault(); if (!isLoading) setDragActive(true); };
  const onDragLeave = (e: DragEvent) => { e.preventDefault(); if (!isLoading) setDragActive(false); };
  const onDrop      = (e: DragEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && !isLoading) handleFile(e.target.files[0]);
  };

  const copyCaption = () => {
    if (!caption) return;
    navigator.clipboard.writeText(caption);
    setIsCopied(true);
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <div
        className={`relative flex flex-col items-center justify-center p-8 border-2 rounded-lg transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'}
          ${isLoading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}
        `}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={onFileChange}
          className="hidden"
          disabled={isLoading}
        />
        <PhotoIcon className="h-12 w-12 text-gray-400" />
        <span className="mt-2 text-gray-600 text-center">
          {dragActive
            ? 'Drop image here…'
            : 'Drag & drop an image here, or click to select'}
        </span>
      </div>

      {/* Result Area */}
      {(isLoading || previewSrc) && (
        <div
          ref={resultRef}
          className="mx-auto max-w-md bg-white shadow-lg rounded-xl overflow-hidden"
        >
          {/* Spinner */}
          {isLoading && (
            <div className="flex flex-col items-center p-8 space-y-4">
              <svg
                className="w-10 h-10 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <p className="text-gray-600">Generating alt-text…</p>
            </div>
          )}

          {/* Preview + Caption Card */}
          {!isLoading && previewSrc && (
            <div className="p-6 space-y-4">
              <img
                src={previewSrc}
                alt={caption || 'Preview'}
                className="w-full rounded-lg shadow-md"
              />
              <div className="relative bg-gray-50 p-4 rounded-md border border-gray-200">
                <p className="text-gray-700 italic">{caption}</p>
                <button
                  onClick={copyCaption}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                  aria-label="Copy caption"
                >
                  {isCopied ? (
                    <FaCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <FaCopy className="w-5 h-5" />
                  )}
                </button>
                {isCopied && (
                  <span className="absolute bottom-2 right-3 text-xs text-green-600">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
