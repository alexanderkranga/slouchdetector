'use client';

export default function VersionOverlay() {
  return (
    <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
      {/* Help & Feedback Link */}
      <div className="
        bg-white/30 backdrop-blur-md
        border border-gray-200/20
        rounded-full px-3 py-1 sm:px-4 sm:py-2
        shadow-lg
        transition-all duration-300
        pointer-events-auto
        hover:bg-white/40 hover:border-gray-200/30
        flex items-center
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
  );
}