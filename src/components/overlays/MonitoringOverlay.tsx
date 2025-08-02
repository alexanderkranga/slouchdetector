'use client';

interface MonitoringOverlayProps {
  isVisible: boolean;
  isMonitoring: boolean;
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
  isReadyToTrack: boolean;
}

export default function MonitoringOverlay({ 
  isVisible, 
  isMonitoring, 
  onStartMonitoring, 
  onStopMonitoring,
  isReadyToTrack 
}: MonitoringOverlayProps) {
  if (!isVisible) return null;

  const startButtonClasses = `
    bg-gray-700/80 border border-gray-500 text-gray-300
    px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5
    rounded-lg cursor-pointer font-semibold
    text-sm sm:text-base lg:text-lg
    transition-all duration-300
    mx-1.5 backdrop-blur-sm
    min-h-[44px] sm:min-h-[52px] lg:min-h-[60px]
    inline-flex items-center justify-center
    relative whitespace-nowrap
    hover:bg-gray-600/90 hover:border-gray-400
    hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
    ${isReadyToTrack ? 'ready-to-track' : ''}
  `;

  const stopButtonClasses = `
    bg-gray-700/80 border border-gray-500 text-gray-300
    px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5
    rounded-lg cursor-pointer font-semibold
    text-sm sm:text-base lg:text-lg
    transition-all duration-300
    mx-1.5 backdrop-blur-sm
    min-h-[44px] sm:min-h-[52px] lg:min-h-[60px]
    inline-flex items-center justify-center
    relative whitespace-nowrap
    hover:bg-gray-600/90 hover:border-gray-400
    hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
  `;

  return (
    <div className="absolute bottom-4 right-4 z-10 pointer-events-auto opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
      {!isMonitoring ? (
        <button 
          onClick={onStartMonitoring}
          className={startButtonClasses}
        >
          Track Posture
        </button>
      ) : (
        <button 
          onClick={onStopMonitoring}
          className={stopButtonClasses}
        >
          Stop Tracking
        </button>
      )}
    </div>
  );
}