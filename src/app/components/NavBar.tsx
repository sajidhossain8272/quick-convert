"use client";

export default function NavBar() {
  return (
    <nav className='w-full bg-white border-b border-gray-200'>
      <div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
        <div className='text-xl font-semibold'>Quick Convert</div>
        <div className='text-sm text-gray-600'>SaaS Launch</div>
      </div>
    </nav>
  );
}
