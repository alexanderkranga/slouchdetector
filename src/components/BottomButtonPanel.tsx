import React from 'react';

interface BottomButtonPanelProps {
  // Calibration props
  onStartCalibration: () => void;
  calibrationState: 'ready' | 'capturing' | 'completed';
  isCalibrated: boolean;
  isCalibrationLoading: boolean;
  
  // Monitoring props
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
  isMonitoring: boolean;
  isReadyToTrack: boolean;
}

export default function BottomButtonPanel({
  onStartCalibration,
  calibrationState,
  isCalibrated,
  isCalibrationLoading,
  onStartMonitoring,
  onStopMonitoring,
  isMonitoring,
  isReadyToTrack
}: BottomButtonPanelProps) {
  
  const getCalibrationButtonText = () => {
    switch (calibrationState) {
      case 'ready':
        return 'Calibrate Posture';
      case 'capturing':
        return 'Save';
      case 'completed':
        return 'Recalibrate Posture';
      default:
        return 'Calibrate Posture';
    }
  };

  const getCalibrationButtonClasses = () => {
    const baseClasses = `
      relative px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4
      bg-neutral-100/80 hover:bg-neutral-100/90
      border border-neutral-300 hover:border-neutral-400
      rounded-full cursor-pointer
      transition-all duration-200 ease-in-out
      backdrop-blur-md
      flex items-center justify-center
      text-neutral-700 text-xs sm:text-sm lg:text-base
      font-medium
      disabled:bg-neutral-200/60 disabled:text-neutral-400 
      disabled:cursor-not-allowed disabled:border-neutral-300
      hover:scale-105 active:scale-95
      shadow-lg hover:shadow-xl
      whitespace-nowrap
    `;

    if (calibrationState === 'ready' && !isCalibrationLoading) {
      return `${baseClasses} ring-2 ring-blue-500/50`;
    }

    if (calibrationState === 'capturing') {
      return `${baseClasses} ring-2 ring-green-500/50 animate-pulse`;
    }

    return baseClasses;
  };

  const getMonitoringButtonClasses = () => {
    const baseClasses = `
      relative px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4
      border border-neutral-500 hover:border-neutral-400
      rounded-full cursor-pointer
      transition-all duration-200 ease-in-out
      backdrop-blur-md
      flex items-center justify-center
      text-white text-xs sm:text-sm lg:text-base
      font-medium
      hover:scale-105 active:scale-95
      shadow-lg hover:shadow-xl
      whitespace-nowrap
    `;

    if (isMonitoring) {
      return `${baseClasses} bg-red-600/90 hover:bg-red-500/90 ring-2 ring-red-500/50`;
    }

    if (isReadyToTrack) {
      return `${baseClasses} bg-green-600/90 hover:bg-green-500/90 ring-2 ring-green-500/50`;
    }

    return `${baseClasses} bg-neutral-700/90 hover:bg-neutral-600/90`;
  };

  return (
      <div className="
        bg-white/40 backdrop-blur-md
        border border-gray-200/30
        rounded-full px-4 py-3
        shadow-2xl
        flex items-center gap-3
        transition-all duration-300
      ">
        {/* Calibrated Status Indicator */}
        {isCalibrated && (
          <div className="
            w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7
            bg-green-500 rounded-full
            flex items-center justify-center
            shadow-lg
          ">
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {/* Calibration Button */}
        <div className="relative group">
          <button 
            onClick={onStartCalibration}
            disabled={isCalibrationLoading}
            className={getCalibrationButtonClasses()}
            title={getCalibrationButtonText()}
          >
            {getCalibrationButtonText()}
          </button>
        </div>

        {/* Monitoring Button */}
        {isCalibrated && (
          <div className="relative group">
            <button 
              onClick={isMonitoring ? onStopMonitoring : onStartMonitoring}
              className={getMonitoringButtonClasses()}
              title={isMonitoring ? 'Stop Tracking' : 'Start Tracking'}
            >
              {isMonitoring ? 'Stop' : 'Track Posture'}
            </button>
          </div>
        )}
      </div>
  );
}