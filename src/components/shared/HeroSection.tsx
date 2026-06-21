'use client';

import React, { useState } from 'react';

export interface HeroSectionProps {
  backgroundImage: string;
  headline: string;
  subheadline: string;
  onSearch: (query: string) => void;
  ctaText?: string;
  ctaHref?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  backgroundImage,
  headline,
  subheadline,
  onSearch,
  ctaText,
  ctaHref,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark luxury overlay */}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-navy-dark/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl mx-auto">
        {/* Headline */}
        <h1 className="text-white font-heading text-5xl md:text-6xl font-bold mb-2 leading-tight">
          {headline}
        </h1>

        {/* Tagline */}
        <p className="text-amber font-heading text-xl md:text-2xl font-medium mb-6 tracking-wide">
          Vehicle Marketplace
        </p>

        {/* Subheadline */}
        <p className="text-white/80 text-lg md:text-xl max-w-2xl mb-8">
          {subheadline}
        </p>

        {/* Glassmorphism search bar */}
        <form onSubmit={handleSubmit} className="w-full max-w-xl mb-6">
          <div className="relative flex items-center rounded-full backdrop-blur-md bg-white/10 border border-white/20 shadow-xl">
            {/* Search icon */}
            <svg
              className="absolute left-4 w-5 h-5 text-white/60"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles by make, model, or keyword..."
              className="w-full py-3 pl-12 pr-14 bg-transparent text-white placeholder-white/50 outline-none rounded-full"
            />

            {/* Submit button */}
            <button
              type="submit"
              className="absolute right-2 p-2 rounded-full bg-amber hover:bg-amber-dark transition-colors duration-200"
              aria-label="Search"
            >
              <svg
                className="w-4 h-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </form>

        {/* CTA button */}
        {ctaText && (
          <a
            href={ctaHref || '#'}
            className="inline-block px-8 py-3 rounded-full bg-amber hover:bg-amber-dark text-white font-semibold text-lg transition-colors duration-200 shadow-glow"
          >
            {ctaText}
          </a>
        )}
      </div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';

export default HeroSection;
