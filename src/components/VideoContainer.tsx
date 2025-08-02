'use client';

import { useEffect, useRef, useState, forwardRef, useCallback } from 'react';
import { VideoState } from '@/types/slouch-detector';

interface VideoContainerProps {
  onVideoReady: (videoState: VideoState) => void;
  onCameraError: (error: Error) => void;
  isTrackingActive: boolean;
  autoStart?: boolean;
  children?: React.ReactNode;
}

const VideoContainer = forwardRef<{ 
  video: HTMLVideoElement | null; 
  canvas: HTMLCanvasElement | null;
  startCamera: () => Promise<void>;
}, VideoContainerProps>(
  ({ onVideoReady, onCameraError, isTrackingActive, autoStart = true, children }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [videoState, setVideoState] = useState<VideoState>({
      isReady: false,
      isPlaying: false,
      dimensions: { width: 0, height: 0, displayWidth: 0, displayHeight: 0 },
      scaleX: 1,
      scaleY: 1,
    });

    const startCamera = useCallback(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            frameRate: { ideal: 30, min: 24 },
            facingMode: 'user',
            aspectRatio: { ideal: 16/9 }
          },
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        console.log('Camera started successfully');
      } catch (error) {
        console.error('Error starting camera:', error);
        onCameraError(error as Error);
      }
    }, [onCameraError]);

    // Expose video and canvas refs to parent
    useEffect(() => {
      if (ref && typeof ref === 'object') {
        ref.current = {
          video: videoRef.current,
          canvas: canvasRef.current,
          startCamera,
        };
      }
    }, [ref, startCamera]);

    const updateVideoContainerSize = useCallback(() => {
      if (videoRef.current && videoRef.current.videoWidth && videoRef.current.videoHeight) {
        const containerWidth = window.innerWidth - 20; // Account for padding
        const containerHeight = window.innerHeight - 20;
        
        const videoAspectRatio = videoRef.current.videoWidth / videoRef.current.videoHeight;
        const containerAspectRatio = containerWidth / containerHeight;
        
        let displayWidth, displayHeight;
        
        if (videoAspectRatio > containerAspectRatio) {
          // Video is wider than container, fit by width
          displayWidth = containerWidth;
          displayHeight = containerWidth / videoAspectRatio;
        } else {
          // Video is taller than container, fit by height
          displayHeight = containerHeight;
          displayWidth = containerHeight * videoAspectRatio;
        }
        
        // Update video dimensions
        if (videoRef.current) {
          videoRef.current.style.width = displayWidth + 'px';
          videoRef.current.style.height = displayHeight + 'px';
        }
        
        // Update container dimensions
        if (containerRef.current) {
          containerRef.current.style.width = displayWidth + 'px';
          containerRef.current.style.height = displayHeight + 'px';
        }
        
        // Update canvas dimensions
        if (canvasRef.current) {
          canvasRef.current.width = displayWidth;
          canvasRef.current.height = displayHeight;
        }
        
        const newVideoState: VideoState = {
          isReady: true,
          isPlaying: videoRef.current.currentTime > 0,
          dimensions: {
            width: videoRef.current.videoWidth,
            height: videoRef.current.videoHeight,
            displayWidth,
            displayHeight,
          },
          scaleX: displayWidth / videoRef.current.videoWidth,
          scaleY: displayHeight / videoRef.current.videoHeight,
        };
        
        setVideoState(newVideoState);
        onVideoReady(newVideoState);
        
        console.log(`Video container sized: ${displayWidth}x${displayHeight}, Aspect ratio: ${videoAspectRatio.toFixed(3)}`);
      }
    }, [onVideoReady]);

    // Initialize camera on mount if autoStart is true
    useEffect(() => {
      if (autoStart) {
        startCamera();
      }
    }, [autoStart, startCamera]);

    // Handle video metadata loaded
    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      const handleLoadedMetadata = () => {
        console.log('Video metadata loaded:', video.videoWidth, 'x', video.videoHeight);
        updateVideoContainerSize();
      };

      const handlePlaying = () => {
        console.log('Video started playing');
        setVideoState(prev => ({ ...prev, isPlaying: true }));
      };

      const handleResize = () => {
        updateVideoContainerSize();
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('playing', handlePlaying);
      window.addEventListener('resize', handleResize);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('playing', handlePlaying);
        window.removeEventListener('resize', handleResize);
      };
    }, [updateVideoContainerSize]);

    return (
      <div className="w-[calc(100vw-20px)] h-[calc(100vh-20px)] flex items-center justify-center">
        <div 
          ref={containerRef}
          className={`
            relative rounded-2xl overflow-hidden bg-black
            flex items-center justify-center
            transition-shadow duration-300
            group ${videoState.isReady ? 'overlays-ready' : ''}
            ${isTrackingActive ? 'shadow-[0_0_0_2px_#ff8c00,_0_0_20px_rgba(255,140,0,0.6)]' : ''}
          `}
        >
          {/* Loading overlay when video is not ready */}
          {!videoState.isReady && (
            <div className="
              absolute inset-0 
              bg-gray-800 
              flex items-center justify-center
              rounded-2xl
              z-10
            ">
              <div className="text-center">
                <div className="
                  w-8 h-8 border-4 border-green-500 border-t-transparent 
                  rounded-full animate-spin mx-auto mb-4
                "></div>
                <p className="
                  text-gray-300 
                  text-lg font-medium
                ">
                  Loading camera...
                </p>
              </div>
            </div>
          )}
          
          <video 
            ref={videoRef}
            autoPlay 
            muted 
            playsInline
            className="block rounded-2xl scale-x-[-1]"
          />
          <canvas 
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
          />
          {children}
        </div>
      </div>
    );
  }
);

VideoContainer.displayName = 'VideoContainer';

export default VideoContainer;