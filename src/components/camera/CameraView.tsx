"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { BrowserCameraProvider } from "@/lib/camera/browser-provider";
import { CameraStatus, CaptureData } from "@/lib/camera/types";
import { StatusBadge } from "./StatusBadge";
import { CaptureCard } from "./CaptureCard";

export function CameraView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const providerRef = useRef<BrowserCameraProvider | null>(null);
  const [status, setStatus] = useState<CameraStatus>("disconnected");
  const [captures, setCaptures] = useState<CaptureData[]>([]);
  const [lastCapture, setLastCapture] = useState<CaptureData | null>(null);

  useEffect(() => {
    providerRef.current = new BrowserCameraProvider();
    return () => {
      providerRef.current?.stop();
    };
  }, []);

  const startCamera = useCallback(async () => {
    if (!videoRef.current || !providerRef.current) return;
    setStatus("connecting");
    try {
      await providerRef.current.start(videoRef.current);
      setStatus("connected");
    } catch {
      setStatus("error");
    }
  }, []);

  const stopCamera = useCallback(() => {
    providerRef.current?.stop();
    setStatus("disconnected");
  }, []);

  const captureFrame = useCallback(() => {
    if (!videoRef.current || !providerRef.current) return;
    const dataUrl = providerRef.current.captureFrame(videoRef.current);
    if (!dataUrl) return;

    const capture: CaptureData = {
      id: crypto.randomUUID(),
      imageDataUrl: dataUrl,
      timestamp: new Date(),
      source: "Browser Camera",
    };
    setLastCapture(capture);
    setCaptures((prev) => [capture, ...prev]);
  }, []);

  const deleteCapture = useCallback((id: string) => {
    setCaptures((prev) => prev.filter((c) => c.id !== id));
    setLastCapture((prev) => (prev?.id === id ? null : prev));
  }, []);

  const updatePosition = useCallback((id: string, field: string, value: string) => {
    const numValue = value === "" ? undefined : parseFloat(value);
    setCaptures((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: numValue } : c))
    );
    setLastCapture((prev) =>
      prev?.id === id ? { ...prev, [field]: numValue } : prev
    );
  }, []);

  return (
    <div className="space-y-6">
      {/* Main two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Live feed */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Live Camera Feed</h2>
            <StatusBadge status={status} />
          </div>

          <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-[var(--border-subtle)]">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              playsInline
              muted
            />
            {status === "disconnected" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[var(--text-muted)]">
                <svg className="w-12 h-12 mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Camera not started</span>
              </div>
            )}
            {status === "error" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600">
                <svg className="w-12 h-12 mb-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-sm">Could not access camera</span>
                <span className="text-xs mt-1 text-red-600/70">Check browser permissions</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {status === "disconnected" || status === "error" ? (
              <button
                onClick={startCamera}
                className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors cursor-pointer"
              >
                Start Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-4 py-2 text-sm font-medium rounded-md bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
              >
                Stop Camera
              </button>
            )}
            <button
              onClick={captureFrame}
              disabled={status !== "connected"}
              className="px-4 py-2 text-sm font-medium rounded-md bg-emerald-700 text-white hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Capture
            </button>
          </div>
        </div>

        {/* Right: Last capture + position */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Last Capture</h2>

          {lastCapture ? (
            <CaptureCard
              capture={lastCapture}
              onDelete={deleteCapture}
              onUpdatePosition={updatePosition}
            />
          ) : (
            <div className="aspect-video bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg flex items-center justify-center text-[var(--text-muted)] text-sm">
              No captures yet
            </div>
          )}

          {lastCapture && (
            <a
              href="/depositions/new"
              className="block text-center px-4 py-2 text-sm font-medium rounded-md bg-[var(--bg-elevated)] text-[var(--accent-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              Attach to New Deposition
            </a>
          )}
        </div>
      </div>

      {/* Recent captures */}
      {captures.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            Recent Captures ({captures.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {captures.map((c) => (
              <CaptureCard
                key={c.id}
                capture={c}
                onDelete={deleteCapture}
                onUpdatePosition={updatePosition}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
