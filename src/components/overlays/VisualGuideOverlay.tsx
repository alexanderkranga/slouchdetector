import React from 'react';
import { FaceLandmarks } from '@/types/slouch-detector';

interface VisualGuideOverlayProps {
  isEnabled: boolean;
  currentLandmarks: FaceLandmarks;
  baseline: FaceLandmarks;
  canvasWidth: number;
  canvasHeight: number;
}

export default function VisualGuideOverlay({ 
  isEnabled, 
  currentLandmarks, 
  baseline, 
  canvasWidth, 
  canvasHeight 
}: VisualGuideOverlayProps) {
  
  if (!isEnabled || canvasWidth === 0 || canvasHeight === 0) {
    return null;
  }

  // Calculate current lowest point from the 4 face landmarks
  const getCurrentLowestY = (): number | null => {
    const points = [
      currentLandmarks.leftEye?.y,
      currentLandmarks.rightEye?.y,
      currentLandmarks.leftEar?.y,
      currentLandmarks.rightEar?.y
    ].filter(y => y !== null && y !== undefined) as number[];
    
    if (points.length === 0) return null;
    return Math.max(...points);
  };

  // Calculate baseline threshold line Y position
  const getBaselineThresholdY = (): number | null => {
    if (!baseline.leftEye || !baseline.rightEye) return null;
    
    const baselinePoints = [
      baseline.leftEye.y,
      baseline.rightEye.y,
      baseline.leftEar?.y,
      baseline.rightEar?.y
    ].filter(y => y !== null && y !== undefined) as number[];
    
    if (baselinePoints.length === 0) return null;
    
    // Baseline threshold is at the baseline level (threshold = 0 currently)
    // This can be adjusted by adding a threshold value
    const baselineY = Math.max(...baselinePoints);
    const verticalThreshold = 0; // Currently hardcoded to 0
    return baselineY + verticalThreshold;
  };

  const currentLowestY = getCurrentLowestY();
  const baselineThresholdY = getBaselineThresholdY();

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* Current Position Line - White with Orange Glow */}
      {currentLowestY !== null && (
        <>
          <div 
            className="absolute left-0 right-0 h-0.5 bg-white"
            style={{ 
              top: `${currentLowestY}px`,
              filter: 'drop-shadow(0 0 8px #ff8c00) drop-shadow(0 0 4px #ff8c00)',
              boxShadow: '0 0 12px rgba(255, 140, 0, 0.8)'
            }}
          />
          {/* Current Position Label */}
          <div 
            className="absolute left-4 transform -translate-y-1/2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-medium whitespace-nowrap"
            style={{ 
              top: `${currentLowestY}px`,
              filter: 'drop-shadow(0 0 4px #ff8c00)'
            }}
          >
            Current Head Level
          </div>
        </>
      )}

      {/* Baseline Threshold Line - Red */}
      {baselineThresholdY !== null && (
        <>
          <div 
            className="absolute left-0 right-0 h-0.5 bg-red-500"
            style={{ 
              top: `${baselineThresholdY}px`,
              filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))'
            }}
          />
          
          {/* Baseline Threshold Label */}
          <div 
            className="absolute left-4 transform -translate-y-1/2 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-red-400 text-xs font-medium whitespace-nowrap"
            style={{ 
              top: `${baselineThresholdY}px`,
              filter: 'drop-shadow(0 0 4px rgba(239, 68, 68, 0.6))'
            }}
          >
            Stay Above This Line
          </div>
        </>
      )}
    </div>
  );
}