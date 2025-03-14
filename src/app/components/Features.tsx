import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  FaRocket,
  FaUser,
  FaUpload,
  FaInfinity,
  FaImages,
} from "react-icons/fa";

const Features = () => {
  return (
    <section className='relative py-16 bg-gradient-to-b from-gray-50 to-gray-200'>
      {/* Optional top gradient accent */}
      <div className='absolute top-0 left-0 w-full h-32'></div>

      <div className='max-w-7xl mx-auto px-4'>
        <h3 className='text-3xl font-bold text-center text-gray-800 mb-2'>
          Why Choose Quick Convert?
        </h3>
        <p className='text-center text-gray-600 mb-10'>
          Experience hassle-free image conversion that&apos;s fast, secure, and
          entirely browser-based—no servers, just simple, efficient processing.
          Upload in bulk, convert up to 1,000 images in under a minute, and
          enjoy unlimited conversions based on your device’s power.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>  
          {/* Feature 3: Client-Side Conversion */}
          <div className='flex flex-col items-center text-center bg-white rounded-lg p-6 shadow transition-transform duration-300 hover:scale-105 hover:shadow-md'>
            <ArrowPathIcon className='h-12 w-12 text-blue-600 mb-4 transition-transform duration-300 hover:scale-105' />
            <h4 className='text-xl font-semibold mb-2'>
              Client-Side Conversion
            </h4>
            <p className='text-gray-600'>
              All conversions happen directly in your browser—your images never
              leave your computer. This ensures complete security, privacy, and
              total control over your files.
            </p>
          </div>

          {/* Feature 4: Bulk Uploads */}
          <div className='flex flex-col items-center text-center bg-white rounded-lg p-6 shadow transition-transform duration-300 hover:scale-105 hover:shadow-md'>
            <FaUpload className='text-blue-600 text-5xl mb-4 transition-transform duration-300 hover:scale-105' />
            <h4 className='text-xl font-semibold mb-2'>Bulk Uploads</h4>
            <p className='text-gray-600'>
              Easily upload and convert multiple images at once—convert up to
              1,000 images in under a minute.
            </p>
          </div>

          {/* Feature 1: Fast & Efficient */}
          <div className='flex flex-col items-center text-center bg-white rounded-lg p-6 shadow transition-transform duration-300 hover:scale-105 hover:shadow-md'>
            <FaRocket className='text-blue-600 text-5xl mb-4 transition-transform duration-300 hover:scale-105' />
            <h4 className='text-xl font-semibold mb-2'>Fast &amp; Efficient</h4>
            <p className='text-gray-600'>
              Experience lightning-fast conversions with advanced browser
              processing that leaves servers behind.
            </p>
          </div>

          {/* Feature 6: Multi-format Support */}
          <div className='flex flex-col items-center text-center bg-white rounded-lg p-6 shadow transition-transform duration-300 hover:scale-105 hover:shadow-md'>
            <FaImages className='text-blue-600 text-5xl mb-4 transition-transform duration-300 hover:scale-105' />
            <h4 className='text-xl font-semibold mb-2'>Multi-format Support</h4>
            <p className='text-gray-600'>
              Supports popular image formats including WebP, JPEG, and
              PNG—ensuring maximum compatibility for all your projects.
            </p>
          </div>

          {/* Feature 5: Unlimited Conversions */}
          <div className='flex flex-col items-center text-center bg-white rounded-lg p-6 shadow transition-transform duration-300 hover:scale-105 hover:shadow-md'>
            <FaInfinity className='text-blue-600 text-5xl mb-4 transition-transform duration-300 hover:scale-105' />
            <h4 className='text-xl font-semibold mb-2'>
              Unlimited Conversions
            </h4>
            <p className='text-gray-600'>
              Convert as many images as you need, leveraging your device’s
              processing power without any limits.
            </p>
          </div>

          {/* Feature 2: User Friendly */}
          <div className='flex flex-col items-center text-center bg-white rounded-lg p-6 shadow transition-transform duration-300 hover:scale-105 hover:shadow-md'>
            <FaUser className='text-blue-600 text-5xl mb-4 transition-transform duration-300 hover:scale-105' />
            <h4 className='text-xl font-semibold mb-2'>User Friendly</h4>
            <p className='text-gray-600'>
            An intuitive interface designed for effortless image conversion, providing a smooth user experience enhanced by personalized system fonts.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
