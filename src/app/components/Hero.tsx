"use client";
import Loading from "./Loading";

interface HeroProps {
  onConvertNowClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onConvertNowClick }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className='bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16'>
        <div className='max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center'>
          <div className='md:w-1/2 space-y-6'>
            <h2 className='text-4xl font-extrabold'>
              Convert Your Images Instantly
            </h2>
            <p className='text-lg'>
              Experience a seamless and secure browser-based image conversion
              service. Say goodbye to slow and insecure conversions – your files
              stay in your browser, ensuring fast, secure, and private
              processing every time.
            </p>
            <button
              className='bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow 
                         hover:bg-gray-100 transition'
              onClick={onConvertNowClick}
            >
              Convert Now
            </button>
          </div>
          <div className='md:w-1/2 mt-8 md:mt-0 lg:pl-60 flex flex-col items-center space-y-4 lg:pt-8'>
            <Loading />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
