'use client';

import React, { useState, useCallback } from 'react';

export interface GalleryProps {
  /** Array of image URLs to display (1-20 images) */
  images: string[];
  /** Optional fallback image URL when no images are available */
  fallbackImage?: string;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Gallery component — Image carousel with navigation
 *
 * Displays 1-20 images with circular left/right navigation buttons,
 * an index indicator, and smooth transitions. Shows a fallback placeholder
 * when no images are available.
 *
 * Requirements: 5.1, 5.9
 */
export function Gallery({ images, fallbackImage, className = '' }: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const hasImages = images.length > 0;
  const totalImages = images.length;

  const navigateTo = useCallback(
    (newIndex: number) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrentIndex(newIndex);
      // Match transition duration (250ms)
      setTimeout(() => setIsTransitioning(false), 250);
    },
    [isTransitioning]
  );

  const goNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % totalImages;
    navigateTo(nextIndex);
  }, [currentIndex, totalImages, navigateTo]);

  const goPrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + totalImages) % totalImages;
    navigateTo(prevIndex);
  }, [currentIndex, totalImages, navigateTo]);

  // No images — show fallback placeholder
  if (!hasImages) {
    return (
      <div
        className={`relative w-full aspect-video rounded-xl overflow-hidden bg-navy-dark ${className}`}
      >
        {fallbackImage ? (
          <img
            src={fallbackImage}
            alt="No photos available"
            className="w-full h-full object-cover opacity-40"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy to-navy-dark" />
        )}
        {/* Overlay text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          {/* Camera icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-12 h-12 text-white/50"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
            />
          </svg>
          <p className="text-white/60 text-sm font-medium">No photos available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video rounded-xl overflow-hidden group ${className}`}
    >
      {/* Image display with fade transition */}
      <div className="relative w-full h-full">
        <img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1} of ${totalImages}`}
          className="w-full h-full object-cover transition-opacity duration-[250ms] ease-in-out"
          style={{ opacity: isTransitioning ? 0.7 : 1 }}
        />
      </div>

      {/* Navigation arrows (only show if more than 1 image) */}
      {totalImages > 1 && (
        <>
          {/* Left arrow */}
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
              backdrop-blur-md bg-white/20 border border-white/30
              hover:bg-white/40 active:bg-white/50
              flex items-center justify-center
              text-white shadow-lg
              transition-all duration-200 ease-in-out
              opacity-0 group-hover:opacity-100 focus:opacity-100
              focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Right arrow */}
          <button
            type="button"
            onClick={goNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
              backdrop-blur-md bg-white/20 border border-white/30
              hover:bg-white/40 active:bg-white/50
              flex items-center justify-center
              text-white shadow-lg
              transition-all duration-200 ease-in-out
              opacity-0 group-hover:opacity-100 focus:opacity-100
              focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Image index indicator */}
      {totalImages > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          {totalImages <= 8 ? (
            // Dot indicators for small image sets
            images.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => navigateTo(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  idx === currentIndex
                    ? 'bg-white w-4 shadow-sm'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${idx + 1}`}
                aria-current={idx === currentIndex ? 'true' : undefined}
              />
            ))
          ) : (
            // Counter for larger image sets
            <span className="px-2.5 py-1 rounded-full backdrop-blur-md bg-black/40 text-white text-xs font-medium tabular-nums">
              {currentIndex + 1} / {totalImages}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;
