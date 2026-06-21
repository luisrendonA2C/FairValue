'use client';

import React from 'react';

export interface LockedDataProps {
  /** Whether the data is currently locked (blurred/hidden) */
  isLocked: boolean;
  /** Content to display */
  children: React.ReactNode;
  /** Custom blur amount (Tailwind class, e.g. "blur-sm", "blur-md") */
  blurAmount?: string;
  /** Additional CSS classes */
  className?: string;
}

function LockIcon() {
  return (
    <svg
      className="h-4 w-4 text-amber"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function UnlockIcon() {
  return (
    <svg
      className="h-4 w-4 text-emerald-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
      />
    </svg>
  );
}

/**
 * LockedData — Reusable component for privacy-locked data display.
 *
 * When locked: applies blur filter + semi-transparent overlay with lock icon.
 * When unlocked: shows children with unlock icon badge in corner.
 * Includes a smooth 2-second transition animation on unlock.
 */
export function LockedData({
  isLocked,
  children,
  blurAmount = 'blur-sm',
  className = '',
}: LockedDataProps) {
  return (
    <div
      className={['relative inline-block', className].filter(Boolean).join(' ')}
      aria-live="polite"
    >
      {/* Content with blur transition */}
      <div
        className={[
          'transition-all duration-[2000ms] ease-in-out',
          isLocked ? `${blurAmount} select-none pointer-events-none` : 'blur-0',
        ].join(' ')}
        aria-hidden={isLocked}
      >
        {children}
      </div>

      {/* Lock overlay */}
      {isLocked && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-white/5 backdrop-blur-[1px] rounded-md"
          aria-label="Data is locked"
        >
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-navy/80 border border-white/10">
            <LockIcon />
            <span className="text-xs text-sage">Protected</span>
          </div>
        </div>
      )}

      {/* Unlock badge */}
      {!isLocked && (
        <div
          className="absolute top-0 right-0 -mt-1 -mr-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 transition-opacity duration-[2000ms]"
          aria-label="Data is unlocked"
        >
          <UnlockIcon />
        </div>
      )}
    </div>
  );
}

LockedData.displayName = 'LockedData';

export default LockedData;
