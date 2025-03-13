import React, { useState, useEffect } from "react";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const confettiColors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7", "#7ED321"];

const generateConfettiItems = (count = 20) => {
  return Array.from({ length: count }).map((_, index) => {
    const left = Math.floor(Math.random() * 100); // percentage
    const delay = Math.random() * 0.5; // seconds
    const background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    return { left, delay, background, id: index };
  });
};

const LoadingAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [confettiItems, setConfettiItems] = useState<{ left: number; delay: number; background: string; id: number }[]>([]);

  useEffect(() => {
    const totalDuration = 3000; // total loading time in ms
    const intervalTime = 30; // update every 30ms (~100 updates over 3000ms)
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (100 / (totalDuration / intervalTime));
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    const timer = setTimeout(() => {
      setIsLoading(false);
      setConfettiItems(generateConfettiItems(25)); // generate confetti items on completion
    }, totalDuration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center bg-white p-16 rounded-xl border border-gray-200 shadow-sm mb-8 space-y-3 w-96 overflow-hidden">
      {/* Inline CSS for keyframes */}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(150px) rotate(360deg); opacity: 0; }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      {isLoading ? (
        <div className="flex flex-col items-center w-full">
          <FaSpinner size={80} className="text-blue-600 animate-spin" />
          <p className="mt-4 text-xl text-blue-600 animate-pulse">Converting...</p>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center transition-all duration-500 animate-[fadeInScale_0.5s_ease-out]">
          <FaCheckCircle size={80} className="text-green-500 animate-bounce" />
          <p className="mt-4 text-xl font-bold text-green-600">
            No more slow, it&apos;s now fast & secure!
          </p>
        </div>
      )}

      {/* Confetti Burst */}
      {!isLoading &&
        confettiItems.map((item) => (
          <div
            key={item.id}
            className="absolute top-0"
            style={{
              left: `${item.left}%`,
              width: "8px",
              height: "8px",
              background: item.background,
              borderRadius: "50%",
              animation: `confettiFall 1.5s ease-out ${item.delay}s forwards`,
            }}
          ></div>
        ))}
    </div>
  );
};

export default LoadingAnimation;
