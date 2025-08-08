export interface Point {
  x: number;
  y: number;
}

export interface FaceLandmarks {
  leftEye: Point | null;
  rightEye: Point | null;
  leftEar: Point | null;
  rightEar: Point | null;
}

export interface CalibrationState {
  state: 'ready' | 'capturing' | 'completed';
  baseline: FaceLandmarks;
  current: FaceLandmarks;
  isCalibrated: boolean;
}

export interface MonitoringState {
  isMonitoring: boolean;
  alertTimer: NodeJS.Timeout | null;
  alertDelay: number;
  verticalThreshold: number;
}

export interface VideoState {
  isReady: boolean;
  isPlaying: boolean;
  dimensions: {
    width: number;
    height: number;
    displayWidth: number;
    displayHeight: number;
  };
  scaleX: number;
  scaleY: number;
}

export interface MediaPipeResults {
  faceLandmarks?: Array<Array<{ x: number; y: number; z?: number }>>;
}

export interface FaceLandmarker {
  detectForVideo: (video: HTMLVideoElement, timestamp: number) => MediaPipeResults;
}

export interface MediaPipeState {
  isLoaded: boolean;
  isDetecting: boolean;
  faceLandmarker: unknown | null;
}

export type WorkflowStep = 1 | 2 | 3 | 4;

export interface AppState {
  currentStep: WorkflowStep;
  showLandmarks: boolean;
  showWelcomeModal: boolean;
  calibration: CalibrationState;
  monitoring: MonitoringState;
  video: VideoState;
  mediaPipe: MediaPipeState;
}