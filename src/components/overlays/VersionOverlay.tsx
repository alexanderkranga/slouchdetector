'use client';

export default function VersionOverlay() {
  return (
    <div className="absolute top-4 right-4 z-10 pointer-events-none opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
      <div className="
        text-white 
        text-sm sm:text-lg lg:text-xl
        font-bold
        drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
        [text-stroke:1px_black] [-webkit-text-stroke:1px_black]
        m-0
      ">
        V0
      </div>
    </div>
  );
}