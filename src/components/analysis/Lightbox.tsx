"use client";

import { useEffect, useCallback } from "react";
import { ScaleBadge } from "./ScaleBadge";

interface ImageItem {
  image_url: string;
  caption: string | null;
  scan_size_value: number | null;
  scan_size_unit: string;
  highlight_note: string | null;
}

interface Props {
  images: ImageItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, currentIndex, onClose, onNavigate }: Props) {
  const image = images[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && hasNext) onNavigate(currentIndex + 1);
    },
    [onClose, onNavigate, currentIndex, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl cursor-pointer z-10"
      >
        &times;
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-4 text-white/50 text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-3xl cursor-pointer z-10"
        >
          &#8249;
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-3xl cursor-pointer z-10"
        >
          &#8250;
        </button>
      )}

      {/* Image */}
      <div
        className="max-w-[80vw] max-h-[80vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.image_url}
          alt={image.caption ?? "Analysis image"}
          className="max-w-full max-h-[70vh] object-contain rounded-lg"
        />
        <div className="mt-3 text-center">
          {image.scan_size_value != null && (
            <ScaleBadge value={image.scan_size_value} unit={image.scan_size_unit} />
          )}
          {image.caption && (
            <p className="text-white/80 text-sm mt-2">{image.caption}</p>
          )}
          {image.highlight_note && (
            <p className="text-amber-400/80 text-xs mt-1">{image.highlight_note}</p>
          )}
        </div>
      </div>
    </div>
  );
}
