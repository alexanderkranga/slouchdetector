'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FaceLandmarks, MediaPipeResults, FaceLandmarker } from '@/types/slouch-detector';

export const useMediaPipe = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [currentLandmarks, setCurrentLandmarks] = useState<FaceLandmarks>({
    leftEye: null,
    rightEye: null,
    leftEar: null,
    rightEar: null,
  });

  const faceLandmarkerRef = useRef<FaceLandmarker | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDetectionRunningRef = useRef(false);
  const detectFaceRef = useRef<(() => void) | null>(null);

  const initializeMediaPipe = useCallback(async () => {
    try {
      console.log('Initializing face detection system...');
      
      // Temporarily suppress MediaPipe info messages that appear as errors in dev mode
      const originalConsoleInfo = console.info;
      const originalConsoleLog = console.log;
      console.info = (...args) => {
        if (typeof args[0] === 'string' && args[0].includes('TensorFlow Lite XNNPACK delegate')) {
          return; // Suppress this specific info message
        }
        originalConsoleInfo(...args);
      };
      
      // Import MediaPipe dynamically
      const { FilesetResolver, FaceLandmarker } = await import('@mediapipe/tasks-vision');
      
      // Initialize face detection WASM
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      
      console.log('Creating face detection model...');
      faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: false,
        runningMode: "VIDEO",
        numFaces: 1,
        minFaceDetectionConfidence: 0.5,
        minFacePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5
      }) as FaceLandmarker;
      
      setIsLoaded(true);
      console.log('✅ Face detection system ready');
      
      // Restore original console methods
      console.info = originalConsoleInfo;
      console.log = originalConsoleLog;
    } catch (error) {
      console.error('❌ Error creating face detection system:', error);
      throw error;
    }
  }, []);

  const processFaceResults = useCallback((results: MediaPipeResults, canvas: HTMLCanvasElement) => {
    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
      const landmarks = results.faceLandmarks[0];
      
      // Calculate eye centers
      const leftEyeInner = landmarks[133]; // Left eye inner corner
      const leftEyeOuter = landmarks[33];  // Left eye outer corner  
      const rightEyeInner = landmarks[362]; // Right eye inner corner
      const rightEyeOuter = landmarks[263]; // Right eye outer corner
      
      const leftEyeCenterX = ((leftEyeInner.x + leftEyeOuter.x) / 2);
      const leftEyeCenterY = ((leftEyeInner.y + leftEyeOuter.y) / 2);
      const rightEyeCenterX = ((rightEyeInner.x + rightEyeOuter.x) / 2);
      const rightEyeCenterY = ((rightEyeInner.y + rightEyeOuter.y) / 2);
      
      // Get ear positions
      const leftEarX = landmarks[127] ? landmarks[127].x : leftEyeCenterX - 0.1;
      const leftEarY = landmarks[127] ? landmarks[127].y : leftEyeCenterY + 0.02;
      const rightEarX = landmarks[356] ? landmarks[356].x : rightEyeCenterX + 0.1;
      const rightEarY = landmarks[356] ? landmarks[356].y : rightEyeCenterY + 0.02;
      
      // Convert normalized coordinates to display coordinates
      const displayWidth = canvas.width;
      const displayHeight = canvas.height;
      
      const newLandmarks: FaceLandmarks = {
        leftEye: {
          x: Math.round(leftEyeCenterX * displayWidth),
          y: Math.round(leftEyeCenterY * displayHeight)
        },
        rightEye: {
          x: Math.round(rightEyeCenterX * displayWidth),
          y: Math.round(rightEyeCenterY * displayHeight)
        },
        leftEar: {
          x: Math.round(leftEarX * displayWidth),
          y: Math.round(leftEarY * displayHeight)
        },
        rightEar: {
          x: Math.round(rightEarX * displayWidth),
          y: Math.round(rightEarY * displayHeight)
        }
      };
      
      setCurrentLandmarks(newLandmarks);
    } else {
      // No face detected
      setCurrentLandmarks({
        leftEye: null,
        rightEye: null,
        leftEar: null,
        rightEar: null,
      });
    }
  }, []);

  const startDetection = useCallback(() => {
    if (!isLoaded || !faceLandmarkerRef.current || !videoRef.current || !canvasRef.current) {
      console.error("Cannot start face detection - system not ready");
      return;
    }

    console.log("Starting real-time face detection");
    let lastVideoTime = -1;
    isDetectionRunningRef.current = true;
    setIsDetecting(true);
    
    const detectFace = () => {
      if (!isDetectionRunningRef.current || !videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.currentTime !== lastVideoTime && video.videoWidth > 0 && video.videoHeight > 0 && faceLandmarkerRef.current) {
        try {
          const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
          processFaceResults(results, canvas);
          lastVideoTime = video.currentTime;
        } catch (error) {
          console.error("Face detection error:", error);
        }
      }
      
      // Use requestAnimationFrame when tab is visible, setInterval when hidden
      if (document.visibilityState === 'visible') {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }
        requestAnimationFrame(detectFace);
      } else {
        // When tab is hidden, use setInterval to keep detection running
        if (!detectionIntervalRef.current) {
          detectionIntervalRef.current = setInterval(detectFace, 33); // ~30 FPS
        }
      }
    };
    
    // Store detectFace function in a ref so visibility change handler can access it
    detectFaceRef.current = detectFace;
    
    detectFace();
  }, [isLoaded, processFaceResults]);

  const stopDetection = useCallback(() => {
    isDetectionRunningRef.current = false;
    setIsDetecting(false);
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    detectFaceRef.current = null;
    console.log('Face detection stopped');
  }, []);

  // Handle visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (isDetectionRunningRef.current && detectFaceRef.current) {
        if (document.visibilityState === 'visible') {
          console.log('Tab became visible - switching to requestAnimationFrame');
          if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current);
            detectionIntervalRef.current = null;
          }
          // Restart the detection loop with requestAnimationFrame
          requestAnimationFrame(detectFaceRef.current);
        } else {
          console.log('Tab became hidden - switching to setInterval for background detection');
          if (!detectionIntervalRef.current) {
            detectionIntervalRef.current = setInterval(detectFaceRef.current, 33); // ~30 FPS
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isLoaded,
    isDetecting,
    currentLandmarks,
    videoRef,
    canvasRef,
    initializeMediaPipe,
    startDetection,
    stopDetection,
  };
};