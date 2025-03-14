"use client";
import Loading from "./Loading";

interface HeroProps {
  onConvertNowClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onConvertNowClick }) => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20 overflow-hidden">
        {/* Optional background pattern overlay */}
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] bg-repeat opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 space-y-6">
            <h2 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
              Transform Your Images in a Blink!
            </h2>
            <p className="text-lg leading-relaxed">
              Experience the ultimate browser-based image conversion tool. Fast, secure, and engineered for seamless image processing. No servers—just safe and fast conversions.
            </p>
            <button
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold shadow-lg hover:bg-gray-200 transition transform hover:scale-105"
              onClick={onConvertNowClick}
            >
              Try Now
            </button>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0 lg:pl-20 flex justify-center items-center">
            <Loading />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
