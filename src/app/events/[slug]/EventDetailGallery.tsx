'use client';

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface EventDetailGalleryProps {
  images: string[];
  title: string;
}

export function EventDetailGallery({ images, title }: EventDetailGalleryProps) {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveLightboxIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActiveLightboxIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <section className="glass-card p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 border-b pb-4 dark:border-gray-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
            <ImageIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white leading-tight">Event Pictures</h2>
            <p className="text-xs text-slate-400">Official media and event captures</p>
          </div>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/25">
          {images.length} {images.length === 1 ? 'photo' : 'photos'}
        </span>
      </div>

      {/* Grid */}
      <div
        className={`grid gap-4 ${
          images.length === 1
            ? 'grid-cols-1'
            : images.length === 2
            ? 'grid-cols-1 sm:grid-cols-2'
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        }`}
      >
        {images.map((imgUrl, index) => (
          <div
            key={index}
            onClick={() => setActiveLightboxIndex(index)}
            className="group relative rounded-xl overflow-hidden bg-slate-900/80 border border-white/10 hover:border-violet-500/40 shadow-md cursor-pointer aspect-video sm:aspect-4/3 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10"
          >
            <img
              src={imgUrl}
              alt={`${title} - Photo ${index + 1}`}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-slate-950/0 group-hover:bg-slate-950/40 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2.5 rounded-full bg-slate-950/80 border border-white/20 text-white shadow-lg">
                <Maximize2 size={18} />
              </span>
            </div>
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-[10px] font-semibold text-slate-300 border border-white/10 backdrop-blur-sm">
              Photo {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Lightbox Modal */}
      {activeLightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveLightboxIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 animate-in fade-in duration-200"
        >
          {/* Top Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-6xl flex items-center justify-between text-white z-20 pb-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-300 truncate max-w-xs sm:max-w-md">
                {title}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-violet-300 font-mono">
                {activeLightboxIndex + 1} / {images.length}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveLightboxIndex(null)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>

          {/* Main Photo Display */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 flex items-center justify-center max-w-6xl w-full my-auto"
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveLightboxIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : images.length - 1
                  )
                }
                className="absolute left-2 sm:left-4 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-violet-600 border border-white/15 text-white transition-all shadow-xl cursor-pointer"
                title="Previous photo (←)"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <img
              src={images[activeLightboxIndex]}
              alt={`${title} - Photo ${activeLightboxIndex + 1}`}
              className="max-h-[75vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl shadow-2xl border border-white/10"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveLightboxIndex((prev) =>
                    prev !== null && prev < images.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-2 sm:right-4 z-30 p-2.5 sm:p-3 rounded-full bg-slate-900/80 hover:bg-violet-600 border border-white/15 text-white transition-all shadow-xl cursor-pointer"
                title="Next photo (→)"
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails Strip (if >1 photo) */}
          {images.length > 1 && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 overflow-x-auto max-w-2xl py-2 px-3 rounded-xl bg-slate-900/80 border border-white/10 mt-3 z-20"
            >
              {images.map((thumbUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveLightboxIndex(idx)}
                  className={`relative w-14 h-11 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeLightboxIndex === idx
                      ? 'border-violet-500 scale-105 shadow-md shadow-violet-500/30'
                      : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={thumbUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
