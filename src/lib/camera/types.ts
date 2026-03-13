export type CameraStatus = "disconnected" | "connecting" | "connected" | "error";

export interface CaptureData {
  id: string;
  imageDataUrl: string;
  timestamp: Date;
  source: string;
  x?: number;
  y?: number;
  r?: number;
  angle?: number;
  notes?: string;
}

export interface CameraProvider {
  start(videoElement: HTMLVideoElement): Promise<void>;
  stop(): void;
  getStatus(): CameraStatus;
  captureFrame(videoElement: HTMLVideoElement): string | null;
}
