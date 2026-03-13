import { CameraProvider, CameraStatus } from "./types";

export class BrowserCameraProvider implements CameraProvider {
  private stream: MediaStream | null = null;
  private status: CameraStatus = "disconnected";

  async start(videoElement: HTMLVideoElement): Promise<void> {
    this.status = "connecting";
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      videoElement.srcObject = this.stream;
      await videoElement.play();
      this.status = "connected";
    } catch {
      this.status = "error";
      throw new Error("Could not access camera");
    }
  }

  stop(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    this.status = "disconnected";
  }

  getStatus(): CameraStatus {
    return this.status;
  }

  captureFrame(videoElement: HTMLVideoElement): string | null {
    if (this.status !== "connected") return null;
    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(videoElement, 0, 0);
    return canvas.toDataURL("image/png");
  }
}
