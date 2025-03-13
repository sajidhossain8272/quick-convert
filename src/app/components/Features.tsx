import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { FaRocket, FaUser } from "react-icons/fa";

const Features = () => {
  return (
    <section className="relative py-16 bg-gradient-to-b from-gray-50 to-gray-200">
      {/* Optional top gradient accent */}
      <div className="absolute top-0 left-0 w-full h-32 "></div>

      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Why Choose Quick Convert?
        </h3>
        <p className="text-center text-gray-600 mb-10">
          We make image conversion easier, faster, and more secure than ever before.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow duration-300 ">
            <FaRocket className="text-blue-600 text-5xl mb-4 transition-transform duration-300 hover:scale-110" />
            <h4 className="text-xl font-semibold mb-2">Fast &amp; Efficient</h4>
            <p className="text-gray-600">
              Enjoy lightning-fast image conversion directly in your browser with optimized performance.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow duration-300">
            <FaUser className="text-blue-600 text-5xl mb-4 transition-transform duration-300 hover:scale-110" />
            <h4 className="text-xl font-semibold mb-2">User Friendly</h4>
            <p className="text-gray-600">
              Intuitive design and easy-to-use interface make converting images a breeze.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center bg-white rounded-lg p-6 shadow hover:shadow-md transition-shadow duration-300">
            <ArrowPathIcon className="h-12 w-12 text-blue-600 mb-4 transition-transform duration-300 hover:scale-110" />
            <h4 className="text-xl font-semibold mb-2">Reliable Conversions</h4>
            <p className="text-gray-600">
              High-quality conversions every time with our robust and secure conversion engine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
