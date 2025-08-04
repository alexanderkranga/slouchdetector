'use client';

import { WorkflowStep } from '@/types/slouch-detector';

interface WorkflowOverlayProps {
  currentStep: WorkflowStep;
  isLoading: boolean;
  loadingMessage: string;
  showRetryCamera?: boolean;
  onRetryCamera?: () => void;
}

export default function WorkflowOverlay({ 
  currentStep, 
  isLoading, 
  loadingMessage,
  showRetryCamera = false,
  onRetryCamera
}: WorkflowOverlayProps) {

  return (
    <div className="absolute bottom-4 left-4 z-10 pointer-events-auto max-w-[300px] sm:max-w-[40vw] opacity-0 transition-opacity duration-300 group-[.overlays-ready]:opacity-100">
      {/* Step 1: Loading and Camera Access Messages */}
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
                    bg-neutral-700/80 border border-neutral-500 text-gray-300
                    px-4 py-2 sm:px-6 sm:py-3
                    rounded-lg cursor-pointer font-semibold
                    text-xs sm:text-sm lg:text-base
                    transition-all duration-300
                    hover:bg-neutral-600/90 hover:border-neutral-400
                    hover:-translate-y-0.5
                  "
                >
                  Request Camera Access
                </button>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}