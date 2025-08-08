'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { FaceLandmarks } from '@/types/slouch-detector';

export const usePostureDetection = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [baseline, setBaseline] = useState<FaceLandmarks>({
    leftEye: null,
    rightEye: null,
    leftEar: null,
    rightEar: null,
  });

  const alertTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const alertDelay = 1000; // 1 second hardcoded
  const verticalThreshold = 0; // Will be calculated dynamically

  // Initialize audio context
  useEffect(() => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      console.log('Audio context not available');
    }
  }, []);

  const saveBaseline = useCallback((landmarks: FaceLandmarks) => {
    setBaseline({ ...landmarks });
    console.log('Posture baseline saved:', landmarks);
  }, []);

  const playAlertSound = useCallback(() => {
    if (audioContextRef.current) {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime);
      oscillator.frequency.setValueAtTime(1200, audioContextRef.current.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.5);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.5);
    }
  }, []);

  const triggerAlert = useCallback(() => {
    setShowAlert(true);
    playAlertSound();
    
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
    
    alertTimerRef.current = null;
  }, [playAlertSound]);

  const clearAlert = useCallback(() => {
    if (alertTimerRef.current) {
      clearTimeout(alertTimerRef.current);
      alertTimerRef.current = null;
    }
    setShowAlert(false);
  }, []);

  const checkPosture = useCallback((currentLandmarks: FaceLandmarks) => {
    // Only check if monitoring is active and we have baseline data
    if (!isMonitoring || !baseline.leftEye || !baseline.rightEye || 
        !currentLandmarks.leftEye || !currentLandmarks.rightEye) {
      return;
    }
    
    const eyeDrop = Math.max(
      currentLandmarks.leftEye.y - baseline.leftEye.y,
      currentLandmarks.rightEye.y - baseline.rightEye.y
    );
    
    const earDrop = Math.max(
      currentLandmarks.leftEar && baseline.leftEar ? currentLandmarks.leftEar.y - baseline.leftEar.y : 0,
      currentLandmarks.rightEar && baseline.rightEar ? currentLandmarks.rightEar.y - baseline.rightEar.y : 0
    );
    
    const maxDrop = Math.max(eyeDrop, earDrop);
    
    if (maxDrop > verticalThreshold) {
      if (!alertTimerRef.current) {
        alertTimerRef.current = setTimeout(() => {
          triggerAlert();
        }, alertDelay);
      }
    } else {
      clearAlert();
    }
  }, [isMonitoring, baseline, verticalThreshold, alertDelay, triggerAlert, clearAlert]);

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true);
    console.log('Posture monitoring started');
  }, []);

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    clearAlert();
    console.log('Posture monitoring stopped');
  }, [clearAlert]);

  const resetBaseline = useCallback(() => {
    setBaseline({
      leftEye: null,
      rightEye: null,
      leftEar: null,
      rightEar: null,
    });
    console.log('Baseline reset');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAlert();
    };
  }, [clearAlert]);

  return {
    isMonitoring,
    showAlert,
    baseline,
    saveBaseline,
    checkPosture,
    startMonitoring,
    stopMonitoring,
    resetBaseline,
    clearAlert,
  };
};