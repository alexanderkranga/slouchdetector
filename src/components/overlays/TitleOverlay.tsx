'use client';

interface TitleOverlayProps {
  onHelpClick: () => void;
}

export default function TitleOverlay({ onHelpClick }: TitleOverlayProps) {
  return (
    <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
      {/* Title and Help Button Container */}
      <div className="
        bg-white/40 backdrop-blur-md
        border border-gray-200/30
        rounded-full px-4 py-2 sm:px-5 sm:py-3
        shadow-2xl
        flex items-center gap-3
        transition-all duration-300
        pointer-events-auto
      ">
        <h1 className="
          text-neutral-800 
          text-sm sm:text-base lg:text-lg
          font-bold
          m-0
        ">
          SlouchDetector
        </h1>
        
        <button 
          onClick={onHelpClick}
          className="
            bg-white/60 hover:bg-white/80
            border border-gray-200/50 hover:border-gray-300/60
            rounded-full text-neutral-700
            w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7
            flex items-center justify-center
            text-xs sm:text-sm lg:text-base
            font-bold cursor-pointer
            transition-all duration-200 ease-in-out
            backdrop-blur-md
            shadow-lg hover:shadow-xl
            hover:scale-105 active:scale-95
          "
        >
          ?
        </button>
      </div>
      

    </div>
  );
}