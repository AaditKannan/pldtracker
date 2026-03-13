"use client";

import { useState } from "react";
import { ScaleBadge } from "./ScaleBadge";
import { Lightbox } from "./Lightbox";

interface ImageItem {
  id: string;
  image_url: string;
  caption: string | null;
  scan_size_value: number | null;
  scan_size_unit: string;
  highlight_note: string | null;
  image_order: number;
}

interface Props {
  images: ImageItem[];
}

export function ImageGallery({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const sorted = [...images].sort((a, b) => a.image_order - b.image_order);

  if (sorted.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sorted.map((img, i) => (
          <div key={img.id} className="flex flex-col">
            <button
              onClick={() => setLightboxIndex(i)}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
            >
              <img
                src={img.image_url}
                alt={img.caption ?? "Analysis image"}
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="mt-1 flex items-center justify-between gap-1">
              {img.caption && (
                <span className="text-[10px] text-[var(--text-muted)] truncate leading-tight">
                  {img.caption}
                </span>
              )}
              {img.scan_size_value != null && (
                <ScaleBadge value={img.scan_size_value} unit={img.scan_size_unit} />
              )}
            </div>
          </div>
        ))}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          images={sorted}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
