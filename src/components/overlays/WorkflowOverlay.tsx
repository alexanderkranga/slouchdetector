'use client';

import { WorkflowStep } from '@/types/slouch-detector';

interface WorkflowOverlayProps {
  currentStep: WorkflowStep;
  isLoading: boolean;
  loadingMessage: string;
  onStartCalibration: () => void;
  calibrationState: 'ready' | 'capturing' | 'completed';
  isCalibrated: boolean;
  showRetryCamera?: boolean;
  onRetryCamera?: () => void;
}

export default function WorkflowOverlay({ 
  currentStep, 
  isLoading, 
  loadingMessage,
  onStartCalibration,
  calibrationState,
  isCalibrated,
  showRetryCamera = false,
  onRetryCamera
}: WorkflowOverlayProps) {
  const getCalibrationButtonText = () => {
    switch (calibrationState) {
      case 'ready':
        return 'Calibrate Posture';
      case 'capturing':
        return 'Save Posture';
      case 'completed':
        return 'Calibrate Posture';
      default:
        return 'Calibrate Posture';
    }
  };

  const getCalibrationButtonClasses = () => {
    const baseClasses = `
      bg-gray-700/80 border border-gray-500 text-gray-300
      px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5
      rounded-lg cursor-pointer font-semibold
      text-sm sm:text-base lg:text-lg
      transition-all duration-300
      mx-1.5 backdrop-blur-sm
      min-h-[44px] sm:min-h-[52px] lg:min-h-[60px]
      inline-flex items-center justify-center
      relative whitespace-nowrap
      disabled:bg-gray-800/60 disabled:text-gray-500 
      disabled:cursor-not-allowed disabled:border-gray-600
      disabled:transform-none disabled:shadow-none
      hover:bg-gray-600/90 hover:border-gray-400
      hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.3)]
    `;

    if (calibrationState === 'ready' && !isLoading) {
      return `${baseClasses} ready-to-calibrate`;
    }

    if (calibrationState === 'capturing') {
      return `${baseClasses} calibrating`;
    }

    return baseClasses;
  };

  return (
    <div className="absolute bottom-4 left-4 z-10 pointer-events-auto max-w-[300px] sm:max-w-[40vw] opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
      {/* Step 1: Start Calibration */}
      {currentStep === 1 && (
        <div className="block">
          <div className="mb-2">
            {isLoading ? (
              <span className="
                text-white italic
                text-sm sm:text-base lg:text-lg
                drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                [text-stroke:0.5px_black] [-webkit-text-stroke:0.5px_black]
              ">
                {loadingMessage}
              </span>
            ) : showRetryCamera ? (
              <div>
                <div className="mb-2 text-white text-sm sm:text-base lg:text-lg drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  Camera access denied.
                </div>
                <button 
                  onClick={onRetryCamera}
                  className="
                    bg-gray-700/80 border border-gray-500 text-gray-300
                    px-4 py-2 sm:px-6 sm:py-3
                    rounded-lg cursor-pointer font-semibold
                    text-xs sm:text-sm lg:text-base
                    transition-all duration-300
                    hover:bg-gray-600/90 hover:border-gray-400
                    hover:-translate-y-0.5
                  "
                >
                  Request Camera Access
                </button>
              </div>
            ) : null}
          </div>
          <div className="flex items-center">
            <button 
              onClick={onStartCalibration}
              disabled={isLoading}
              className={getCalibrationButtonClasses()}
            >
              {getCalibrationButtonText()}
            </button>
            {isCalibrated && (
              <div className="
                inline-flex items-center ml-4
                opacity-0 -translate-x-5 transition-all duration-500
                opacity-100 translate-x-0
              ">
                <div className="
                  w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                  bg-green-500 rounded-full
                  flex items-center justify-center
                  mr-2
                ">
                  <span className="
                    text-white text-xs sm:text-sm lg:text-base
                    font-bold
                  ">
                    ✓
                  </span>
                </div>
                <span className="
                  text-white text-xs sm:text-sm lg:text-base
                  font-semibold
                  drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]
                  [text-stroke:0.5px_black] [-webkit-text-stroke:0.5px_black]
                ">
                  Calibrated
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}