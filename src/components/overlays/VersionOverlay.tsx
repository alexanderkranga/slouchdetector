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

        {/* GitHub Repo Link */}
        <a
          href="https://github.com/alexanderkranga/slouchdetector"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View on GitHub"
          title="View on GitHub"
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
          "
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-800"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C6.475 2 2 6.486 2 12.021c0 4.426 2.865 8.18 6.839 9.504.5.093.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.607.069-.607 1.004.07 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.833.091-.647.35-1.088.636-1.338-2.221-.253-4.555-1.112-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.27.098-2.646 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.338 1.909-1.296 2.748-1.026 2.748-1.026.546 1.376.203 2.393.1 2.646.64.7 1.028 1.595 1.028 2.688 0 3.848-2.337 4.695-4.565 4.943.359.31.678.92.678 1.854 0 1.337-.012 2.417-.012 2.746 0 .268.18.58.688.481C19.138 20.197 22 16.444 22 12.02 22 6.486 17.523 2 12 2z" />
          </svg>
        </a>
        </div>
      </div>
    </>
  );
}