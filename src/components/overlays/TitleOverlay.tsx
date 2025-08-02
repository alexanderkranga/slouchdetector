'use client';

interface TitleOverlayProps {
  onHelpClick: () => void;
}

export default function TitleOverlay({ onHelpClick }: TitleOverlayProps) {
  return (
    <div className="absolute top-4 left-4 z-10 pointer-events-none opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
      <h1 className="
        text-white 
        text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl
        font-bold
        drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
        [text-stroke:1px_black] [-webkit-text-stroke:1px_black]
        m-0 flex items-center 
        gap-2 sm:gap-3 lg:gap-4
      ">
        SlouchDetector
        <button 
          onClick={onHelpClick}
          className="
            bg-white/90 border border-gray-300
            rounded-full text-white
            w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7
            flex items-center justify-center
            text-xs sm:text-sm lg:text-base
            font-bold cursor-pointer
            transition-all duration-300
            pointer-events-auto
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
            [text-stroke:1px_black] [-webkit-text-stroke:1px_black]
            shadow-[0_1px_4px_rgba(0,0,0,0.2)]
            self-center -mt-0.5
            hover:bg-white hover:border-gray-400 
            hover:scale-110 hover:shadow-[0_2px_8px_rgba(0,0,0,0.3)]
            active:scale-95
          "
          title="Show help guide"
        >
          ?
        </button>
      </h1>
      <div className="mt-1">
        <a 
          href="https://x.com/AlexHardmond" 
          target="_blank" 
          rel="noopener noreferrer"
          className="
            text-white
            text-xs sm:text-sm lg:text-base
            font-bold
            drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
            [text-stroke:1px_black] [-webkit-text-stroke:1px_black]
            no-underline
            transition-opacity duration-300
            pointer-events-auto
            hover:opacity-80
          "
        >
          by @AlexHardmond
        </a>
      </div>
    </div>
  );
}