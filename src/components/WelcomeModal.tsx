'use client';

import { useEffect, useState } from 'react';

interface WelcomeModalProps {
  isVisible: boolean;
  onClose: () => void;
  modalType: 'welcome' | 'cameraPermission' | 'cameraError';
  onRequestCamera?: () => void;
}

export default function WelcomeModal({ isVisible, onClose, modalType, onRequestCamera }: WelcomeModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
    }
  }, [isVisible]);

  const handleContinue = () => {
    if (modalType === 'cameraPermission' && onRequestCamera) {
      onRequestCamera();
    } else if (modalType === 'cameraError') {
      window.location.reload();
    } else {
      // For welcome modal, call onClose directly without animation
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className={`
        fixed inset-0 w-screen h-screen h-[100dvh] 
        bg-neutral-800/90 backdrop-blur-md
        z-[2000] transition-opacity duration-300
        overflow-y-auto
        ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div 
        className="
          min-h-screen min-h-[100dvh] 
          flex items-center justify-center
          py-16 px-4
        "
        style={{
          minHeight: '100dvh'
        }}
      >
        <div className="
          bg-neutral-700/80 backdrop-blur-md
          border border-neutral-500/50
          rounded-3xl p-6 sm:p-8 lg:p-12
          max-w-[600px] w-[90vw]
          shadow-2xl
          text-center relative
          flex-shrink-0
        ">
          {modalType === 'welcome' && (
            <>
              <h1 className="
                text-green-400 
                text-2xl sm:text-3xl lg:text-4xl 
                font-bold mb-5
              ">
                Welcome to SlouchDetector
              </h1>
              
              <p className="
                text-gray-200 
                text-base sm:text-lg lg:text-xl
                leading-relaxed mb-8
              ">
                This app helps you maintain good posture by monitoring your position and alerting you when you slouch. It uses MediaPipe AI face detection locally on your device to learn your ideal posture and reminds you to sit up straight. Everything runs offline - no data ever leaves your computer.
              </p>
              
              <div className="text-left mb-8">
                <h3 className="
                  text-green-400 
                  text-lg sm:text-xl lg:text-2xl
                  mb-4 text-center
                ">
                  How it works:
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="
                      bg-green-500 text-white
                      rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                      flex items-center justify-center
                      font-bold text-sm lg:text-base
                      flex-shrink-0 mt-0.5
                    ">
                      1
                    </div>
                    <div className="
                      text-gray-200 
                      text-sm sm:text-base lg:text-lg
                      leading-relaxed
                    ">
                      <strong>Grant camera access</strong> - We&apos;ll detect your face position in real-time
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="
                      bg-green-500 text-white
                      rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                      flex items-center justify-center
                      font-bold text-sm lg:text-base
                      flex-shrink-0 mt-0.5
                    ">
                      2
                    </div>
                    <div className="
                      text-gray-200 
                      text-sm sm:text-base lg:text-lg
                      leading-relaxed
                    ">
                      <strong>Calibrate your good posture</strong> - Sit up straight and save your ideal position
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="
                      bg-green-500 text-white
                      rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                      flex items-center justify-center
                      font-bold text-sm lg:text-base
                      flex-shrink-0 mt-0.5
                    ">
                      3
                    </div>
                    <div className="
                      text-gray-200 
                      text-sm sm:text-base lg:text-lg
                      leading-relaxed
                    ">
                      <strong>Start tracking</strong> - The app monitors your posture and alerts you when you slouch
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="
                      bg-green-500 text-white
                      rounded-full w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8
                      flex items-center justify-center
                      font-bold text-sm lg:text-base
                      flex-shrink-0 mt-0.5
                    ">
                      4
                    </div>
                    <div className="
                      text-gray-200 
                      text-sm sm:text-base lg:text-lg
                      leading-relaxed
                    ">
                      <strong>Stay healthy</strong> - Maintain better posture throughout your day
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {modalType === 'cameraPermission' && (
            <>
              <h1 className="
                text-green-400 
                text-2xl sm:text-3xl lg:text-4xl 
                font-bold mb-5
              ">
                Camera Access Required
              </h1>
              
              <p className="
                text-gray-200 
                text-base sm:text-lg lg:text-xl
                leading-relaxed mb-6
              ">
                To detect your posture, this app needs access to your camera. All processing happens locally in your browser using MediaPipe AI models.
              </p>
              
              <div className="
                bg-green-800/40 border border-green-500/50 
                rounded-lg p-4 mb-8
              ">
                <p className="
                  text-green-300 
                  text-sm sm:text-base lg:text-lg
                  leading-relaxed
                ">
                  <strong>Your Privacy:</strong> 100% offline processing. No video data leaves your device.
                </p>
              </div>
              
              <p className="
                text-gray-200 
                text-base sm:text-lg lg:text-xl
                leading-relaxed mb-8
              ">
                Click Continue to grant camera access and start the setup.
              </p>
            </>
          )}

          {modalType === 'cameraError' && (
            <>
              <h1 className="
                text-red-400 
                text-2xl sm:text-3xl lg:text-4xl 
                font-bold mb-5
              ">
                Camera Access Required
              </h1>
              
              <p className="
                text-gray-200 
                text-base sm:text-lg lg:text-xl
                leading-relaxed mb-8
              ">
                SlouchDetector requires camera access to work. Without camera access, the app cannot detect your posture.
              </p>
              
              <p className="
                text-gray-200 
                text-base sm:text-lg lg:text-xl
                leading-relaxed mb-8
              ">
                Please reload this page and allow camera access when prompted, or check your browser settings to enable camera permissions for this site.
              </p>
            </>
          )}
          
          <div className="flex justify-center">
            <button 
              onClick={handleContinue}
              className={`
                relative px-4 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-5
                bg-neutral-600/80 hover:bg-neutral-600/90
                border border-neutral-400 hover:border-neutral-300
                rounded-full cursor-pointer
                transition-all duration-200 ease-in-out
                backdrop-blur-md
                flex items-center justify-center
                text-gray-100 text-sm sm:text-base lg:text-lg
                font-medium
                hover:scale-105 active:scale-95
                shadow-lg hover:shadow-xl
                whitespace-nowrap
                min-h-[44px] sm:min-h-[52px] lg:min-h-[60px]
                ${modalType === 'cameraError' 
                  ? 'ring-2 ring-blue-500/50' 
                  : 'ring-2 ring-green-500/50'
                }
              `}
            >
              {modalType === 'cameraError' ? 'Reload Page' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}