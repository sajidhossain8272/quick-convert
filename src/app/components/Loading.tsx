import React, { useState, useEffect } from "react";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";

const confettiColors = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7", "#7ED321"];

const generateConfettiItems = (count = 20) => {
  return Array.from({ length: count }).map((_, index) => {
    const left = Math.floor(Math.random() * 100); // percentage across container width
    const delay = Math.random() * 0.5; // seconds
    const background = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    const size = Math.floor(Math.random() * 5) + 6; // random size between 6px and 10px
    const drift = Math.floor(Math.random() * 20) - 10; // horizontal drift between -10px and 10px
    return { left, delay, background, size, drift, id: index };
  });
};

const LoadingAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [confettiItems, setConfettiItems] = useState<
    { left: number; delay: number; background: string; size: number; drift: number; id: number }[]
  >([]);

  useEffect(() => {
    // Phase 1: Progress normally from 0% to 25% over 2 seconds
    const normalDuration = 2000; 
    const blinkFinishDuration = 100; 
    const intervalTime = 30; 
    const targetProgress = 25; 
    const increment = targetProgress / (normalDuration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= targetProgress) {
          clearInterval(interval);
          return targetProgress;
        }
        return next;
      });
    }, intervalTime);

    // Phase 2: After normal progress, jump instantly to 100% and complete
    const timerNormal = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setConfettiItems(generateConfettiItems(25)); // generate confetti on completion
      }, blinkFinishDuration);
    }, normalDuration);

    return () => {
      clearTimeout(timerNormal);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className="
        relative 
        flex 
        flex-col 
        items-center 
        justify-center 
        bg-white
        shadow-2xl
        p-6 
        rounded-xl 
        border 
        border-gray-200 
        overflow-hidden 
        animate-fadeIn
        w-[calc(100%-2rem)] // 100% width - 2rem padding
        max-w-[calc(100%-2rem)] // max-width: 100%-2rem
        h-80
        m-0
      "
      style={{ minWidth: "320px" }} // optional to ensure a minimum width
    >
      {/* Inline CSS for keyframes */}
      <style>{`
        @keyframes confettiFall {
          0% { 
            transform: translateY(-20px) translateX(calc(var(--drift) * -1)) rotate(0deg); 
            opacity: 1; 
          }
          100% { 
            transform: translateY(150px) translateX(var(--drift)) rotate(360deg); 
            opacity: 0; 
          }
        }
        @keyframes fadeInScale {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {isLoading ? (
        <div className="flex flex-col items-center w-full">
          <FaSpinner size={60} className="text-blue-600 animate-spin" />
          <p className="mt-4 text-lg text-blue-600 animate-pulse">Converting...</p>
          {/* Enhanced Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center transition-all duration-500 animate-[fadeInScale_0.5s_ease-out]">
          <FaCheckCircle size={60} className="text-green-500 animate-bounce" />
          <p className="mt-4 lg:text-xl text-lg font-bold text-green-600">
            Conversion Completed
          </p>
          <p className="mt-2 lg:text-lg text-sm text-gray-700">
            That&apos;s how fast our conversion is—<span className="font-bold ">try it now!</span>
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
              width: `${item.size}px`,
              height: `${item.size}px`,
              background: item.background,
              borderRadius: "50%",
              animation: `confettiFall 1.5s ease-out ${item.delay}s forwards`,
              // Pass the drift value via a CSS variable for horizontal movement
              "--drift": `${item.drift}px`,
            } as React.CSSProperties}
          />
        ))}
    </div>
  );
};

export default LoadingAnimation;
