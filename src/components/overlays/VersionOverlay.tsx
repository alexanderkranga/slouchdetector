'use client';

import { useState, useEffect } from 'react';

interface VersionOverlayProps {
  onHelpClick: () => void;
}

export default function VersionOverlay({ onHelpClick }: VersionOverlayProps) {
  const [showSecurityTooltip, setShowSecurityTooltip] = useState(false);

  const handleSecurityClick = () => {
    setShowSecurityTooltip(!showSecurityTooltip);
  };

  // Auto-hide tooltip after 5 seconds
  useEffect(() => {
    if (showSecurityTooltip) {
      const timer = setTimeout(() => {
        setShowSecurityTooltip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSecurityTooltip]);
  return (
    <>
      {/* SlouchDetector Title - Top Left */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
        <div className="
          bg-white/40 backdrop-blur-md
          border border-gray-200/30
          rounded-full px-3 sm:px-4
          shadow-2xl
          transition-all duration-300
          pointer-events-auto
          hover:bg-white/50 hover:border-gray-200/40
          flex items-center
          h-8 sm:h-9 lg:h-10
        ">
          <h1 className="
            text-neutral-800 
            text-xs sm:text-sm lg:text-base
            font-bold
            m-0
            whitespace-nowrap
          ">
            SlouchDetector
          </h1>
        </div>
      </div>

      {/* Right Side Button Group */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
        <div className="flex items-center gap-3">
          {/* Security/Data Protection Indicator */}
          <div className="relative">
            <button 
              onClick={handleSecurityClick}
              className="
                bg-white/40 backdrop-blur-md
                border border-gray-200/30
                rounded-full
                shadow-2xl
                transition-all duration-300
                pointer-events-auto
                hover:bg-white/50 hover:border-gray-200/40
                flex items-center justify-center
                w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10
                cursor-pointer
              " 
              title="Your data stays private - all processing happens locally on your device"
            >
              <svg 
                className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" 
                  clipRule="evenodd" 
                />
              </svg>
            </button>
            
            {/* Mobile-friendly tooltip */}
            {showSecurityTooltip && (
              <div className="
                absolute top-full mt-2 left-1/2 transform -translate-x-1/2
                bg-black/90 text-white text-xs
                px-3 py-2 rounded-lg
                shadow-lg
                z-50
                w-64 sm:w-72
                transition-opacity duration-200
              ">
                {/* Arrow pointing up */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black/90"></div>
                <div className="text-center leading-relaxed">
                  Your data stays private - all processing happens locally on your device
                </div>
              </div>
            )}
          </div>

        {/* Help Button */}
        <button 
          onClick={onHelpClick}
          className="
            bg-white/40 backdrop-blur-md
            border border-gray-200/30
            rounded-full
            shadow-2xl
            transition-all duration-300
            pointer-events-auto
            hover:bg-white/50 hover:border-gray-200/40
            flex items-center justify-center
            w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10
            text-neutral-700
            text-xs sm:text-sm lg:text-base
            font-bold cursor-pointer
            hover:scale-105 active:scale-95
          "
          title="Help & Getting Started"
        >
          ?
        </button>

        {/* Help & Feedback Link */}
        <div className="
          bg-white/40 backdrop-blur-md
          border border-gray-200/30
          rounded-full px-3 sm:px-4
          shadow-2xl
          transition-all duration-300
          pointer-events-auto
          hover:bg-white/50 hover:border-gray-200/40
          flex items-center
          h-8 sm:h-9 lg:h-10
        ">
          <a 
            href="https://x.com/AlexHardmond" 
            target="_blank" 
            rel="noopener noreferrer"
            className="
              text-neutral-700
              text-xs sm:text-sm
              font-medium
              underline
              transition-colors duration-200
              hover:text-neutral-800
            "
          >
            Help & Feedback
          </a>
        </div>
        </div>
      </div>
    </>
  );
}