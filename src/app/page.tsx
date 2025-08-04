'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { WorkflowStep, CalibrationState } from '@/types/slouch-detector';
import { useMediaPipe } from '@/hooks/useMediaPipe';
import { usePostureDetection } from '@/hooks/usePostureDetection';
import VideoContainer from '@/components/VideoContainer';
import WelcomeModal from '@/components/WelcomeModal';
import TitleOverlay from '@/components/overlays/TitleOverlay';
import VersionOverlay from '@/components/overlays/VersionOverlay';
import WorkflowOverlay from '@/components/overlays/WorkflowOverlay';
import MonitoringOverlay from '@/components/overlays/MonitoringOverlay';



import AlertMessage from '@/components/AlertMessage';

// Add Google Analytics script
const GA_TRACKING_ID = 'G-3NYQLKQJZF';

export default function SlouchDetector() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [modalType, setModalType] = useState<'welcome' | 'cameraPermission' | 'cameraError'>('welcome');
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [cameraPermissionDenied, setCameraPermissionDenied] = useState(false);
  
  // Debug logging
  console.log('SlouchDetector render:', { 
    cameraPermissionDenied, 
    cameraPermissionGranted, 
    showWelcomeModal, 
    modalType 
  });
  const [currentStep, setCurrentStep] = useState<WorkflowStep>(1);
  const [calibrationState, setCalibrationState] = useState<CalibrationState['state']>('ready');
  const [isCalibrated, setIsCalibrated] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [showRetryCamera, setShowRetryCamera] = useState(false);
  const [overlaysReady, setOverlaysReady] = useState(false);

  const videoContainerRef = useRef<{ 
    video: HTMLVideoElement | null; 
    canvas: HTMLCanvasElement | null;
    startCamera: () => Promise<void>;
  }>(null);

  // Custom hooks
  const {
    isLoaded: isMediaPipeLoaded,
    isDetecting,
    currentLandmarks,
    videoRef: mediaVideoRef,
    canvasRef: mediaCanvasRef,
    initializeMediaPipe,
    startDetection,
  } = useMediaPipe();

  const {
    isMonitoring,
    showAlert,
    saveBaseline,
    checkPosture,
    startMonitoring: startPostureMonitoring,
    stopMonitoring: stopPostureMonitoring,
    resetBaseline,
  } = usePostureDetection();

  // Check camera permission status
  const checkCameraPermission = async (): Promise<boolean> => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return result.state === 'granted';
    } catch {
      // Fallback: try to access camera to check permission
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        return true;
      } catch {
        return false;
      }
    }
  };

  // Request camera permission
  const requestCameraPermission = async () => {
    try {
      setLoadingMessage('Loading camera...');
      if (videoContainerRef.current?.startCamera) {
        await videoContainerRef.current.startCamera();
        setCameraPermissionGranted(true);
        setShowWelcomeModal(false);
      }
    } catch (error) {
      console.error('Camera permission denied:', error);
      console.log('Setting cameraPermissionDenied to true'); // Debug log
      setCameraPermissionDenied(true);
      setShowWelcomeModal(false);
      setIsLoading(false); // Stop loading state
    }
  };

  // Show welcome modal immediately if first time
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('slouchDetectorWelcomeSeen');
    
    if (!hasSeenWelcome) {
      // First time - show welcome modal immediately
      setModalType('welcome');
      setShowWelcomeModal(true);
    }
  }, []);

  // Initialize MediaPipe and handle returning user flow
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize MediaPipe
        await initializeMediaPipe();
        setIsLoading(false);
        
        // Check if user has seen welcome
        const hasSeenWelcome = localStorage.getItem('slouchDetectorWelcomeSeen');
        
        if (hasSeenWelcome) {
          // Returning user - check camera permission
          const cameraPermission = await checkCameraPermission();
          
          if (!cameraPermission) {
            // Returning user but no camera access - show camera permission modal
            setModalType('cameraPermission');
            setShowWelcomeModal(true);
          } else {
            // Returning user with camera access - start app directly
            setCameraPermissionGranted(true);
            if (videoContainerRef.current?.startCamera) {
              await videoContainerRef.current.startCamera();
            }
          }
        }
      } catch (error) {
        console.error('Failed to initialize MediaPipe:', error);
        setLoadingMessage('Failed to load. Please refresh the page.');
      }
    };

    init();
  }, [initializeMediaPipe]);

  // Sync MediaPipe refs with VideoContainer refs
  useEffect(() => {
    if (videoContainerRef.current && mediaVideoRef && mediaCanvasRef) {
      mediaVideoRef.current = videoContainerRef.current.video;
      mediaCanvasRef.current = videoContainerRef.current.canvas;
    }
  }, [mediaVideoRef, mediaCanvasRef]);

  // Start detection when video is ready and MediaPipe is loaded
  useEffect(() => {
    if (isMediaPipeLoaded && overlaysReady && !isDetecting) {
      startDetection();
    }
  }, [isMediaPipeLoaded, overlaysReady, isDetecting, startDetection]);

  // Check posture when landmarks change
  useEffect(() => {
    if (currentLandmarks && isMonitoring) {
      checkPosture(currentLandmarks);
    }
  }, [currentLandmarks, isMonitoring, checkPosture]);

  const handleVideoReady = useCallback(() => {
    console.log('Video is ready');
    setOverlaysReady(true);
  }, []);

  const handleCameraError = useCallback((error: Error) => {
    console.error('Camera error:', error);
    
    // If it's a permission denied error, show the denied state
    if (error.name === 'NotAllowedError') {
      console.log('Camera permission denied, showing error message');
      setCameraPermissionDenied(true);
      setShowWelcomeModal(false);
    } else {
      setShowRetryCamera(true);
    }
    
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  const handleRetryCamera = useCallback(() => {
    setShowRetryCamera(false);
    setIsLoading(true);
    setLoadingMessage('Loading camera...');
    // This would trigger camera retry in VideoContainer
  }, []);

  const handleWelcomeClose = useCallback(() => {
    if (modalType === 'welcome') {
      const hasSeenWelcome = localStorage.getItem('slouchDetectorWelcomeSeen');
      
      if (!hasSeenWelcome) {
        // First time user - proceed to camera permission flow
        localStorage.setItem('slouchDetectorWelcomeSeen', 'true');
        setModalType('cameraPermission');
        // Modal stays visible to show camera permission screen
      } else {
        // Help button clicked - just close the modal
        setShowWelcomeModal(false);
      }
    } else {
      setShowWelcomeModal(false);
    }
  }, [modalType]);

  const handleHelpClick = useCallback(() => {
    setModalType('welcome');
    setShowWelcomeModal(true);
  }, []);



  const handleStartCalibration = useCallback(() => {
    if (!isMediaPipeLoaded) {
      alert('Face detection is not ready yet. Please wait a moment and try again.');
      return;
    }

    if (calibrationState === 'ready') {
      // First click: Start capturing posture
      setCalibrationState('capturing');
      setIsCalibrated(false);
      console.log('Calibration started - waiting for user to click Save Posture');
    } else if (calibrationState === 'capturing') {
      // Second click: Save the current posture as baseline
      if (!currentLandmarks.leftEye || !currentLandmarks.rightEye) {
        alert('No face detected. Please ensure your face is visible and try again.');
        return;
      }
      
      setCalibrationState('completed');
      saveBaseline(currentLandmarks);
      setIsCalibrated(true);
      // DON'T change currentStep - keep it on step 1 like original HTML
      console.log('Posture baseline captured');
    } else if (calibrationState === 'completed') {
      // Third click: Reset and start over (like original HTML)
      console.log('Resetting calibration for re-calibration');
      // Reset and immediately start capturing - no intermediate states
      setCalibrationState('capturing');
      setIsCalibrated(false);
      setCurrentStep(1);
      stopPostureMonitoring();
      resetBaseline();
      console.log('Calibration restarted - waiting for user to click Save Posture');
    }
  }, [calibrationState, isMediaPipeLoaded, currentLandmarks, saveBaseline, stopPostureMonitoring, resetBaseline]);



  const handleStartMonitoring = useCallback(() => {
    startPostureMonitoring();
  }, [startPostureMonitoring]);

  const handleStopMonitoring = useCallback(() => {
    stopPostureMonitoring();
  }, [stopPostureMonitoring]);

  // Load Google Analytics
  useEffect(() => {
    // Create script elements for Google Analytics
    const gtagScript = document.createElement('script');
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    
    const gtagConfig = document.createElement('script');
    gtagConfig.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_TRACKING_ID}');
    `;
    
    document.head.appendChild(gtagScript);
    document.head.appendChild(gtagConfig);
    
    return () => {
      // Cleanup scripts on unmount
      if (document.head.contains(gtagScript)) {
        document.head.removeChild(gtagScript);
      }
      if (document.head.contains(gtagConfig)) {
        document.head.removeChild(gtagConfig);
      }
    };
  }, []);

  return (
    <div className="
      font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]
      bg-neutral-800 text-gray-300
      min-h-screen m-0 p-2.5
      flex items-center justify-center
      overflow-hidden
    ">
      {/* Welcome Modal */}
      <WelcomeModal 
        isVisible={showWelcomeModal}
        onClose={handleWelcomeClose}
        modalType={modalType}
        onRequestCamera={requestCameraPermission}
      />

      {/* Camera Permission Denied Message */}
      {cameraPermissionDenied && (
        <div 
          className="
            fixed inset-0 w-full h-screen h-[100dvh]
            bg-neutral-800 
            z-[9999]
            overflow-y-auto
          "
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
            <div className="text-center max-w-md mx-auto px-6 flex-shrink-0">
            <h1 className="
              text-red-400 
              text-2xl sm:text-3xl 
              font-bold mb-6
            ">
              Camera Access Required
            </h1>
            <p className="
              text-gray-300 
              text-lg leading-relaxed mb-8
            ">
              SlouchDetector needs camera access to detect your posture. Please reload this page and allow camera access when prompted.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="
                bg-gradient-to-r from-blue-500 to-blue-600
                hover:from-blue-400 hover:to-blue-500
                text-white font-bold
                px-8 py-4 rounded-xl
                transition-all duration-300
                shadow-lg hover:shadow-xl
                hover:-translate-y-0.5
              "
            >
              Reload Page
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Video Container - only show if camera permission not denied */}
      {!cameraPermissionDenied && (
        <VideoContainer
          ref={videoContainerRef}
          onVideoReady={handleVideoReady}
          onCameraError={handleCameraError}
          isTrackingActive={isMonitoring}
          autoStart={cameraPermissionGranted}
          showCameraLoading={cameraPermissionGranted}
          onStartCalibration={handleStartCalibration}
          calibrationState={calibrationState}
          isCalibrated={isCalibrated}
          isCalibrationLoading={isLoading}
          onStartMonitoring={handleStartMonitoring}
          onStopMonitoring={handleStopMonitoring}
          isMonitoring={isMonitoring}
          isReadyToTrack={isCalibrated && !isMonitoring}
        >
        {/* Overlays */}
        <TitleOverlay onHelpClick={handleHelpClick} />
        <VersionOverlay />
        
        <WorkflowOverlay
          currentStep={currentStep}
          isLoading={isLoading}
          loadingMessage={loadingMessage}
          showRetryCamera={showRetryCamera}
          onRetryCamera={handleRetryCamera}
        />
        
        <MonitoringOverlay />
        </VideoContainer>
      )}

      {/* Alert Message - only show if camera permission not denied */}
      {!cameraPermissionDenied && <AlertMessage isVisible={showAlert} />}
    </div>
  );
}
