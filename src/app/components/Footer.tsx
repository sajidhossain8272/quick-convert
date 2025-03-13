"use client";

export default function Footer() {
  return (
    <footer className='w-full mt-12 bg-white border-t border-gray-200'>
      <div className='max-w-6xl mx-auto py-4 px-4 text-center text-sm text-gray-500'>
        © {new Date().getFullYear()} Quick Convert. All rights reserved.
      </div>
    </footer>
  );
}
