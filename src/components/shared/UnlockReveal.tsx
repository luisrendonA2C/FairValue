'use client';

import React, { useState, useEffect } from 'react';

export interface BuyerContactData {
  name: string;
  email: string;
  phone: string;
}

export interface DealerContactData {
  businessName: string;
  email: string;
  phone: string;
}

export interface UnlockRevealProps {
  /** Whether the data has been unlocked */
  isUnlocked: boolean;
  /** Buyer contact data to reveal on unlock */
  buyerData?: BuyerContactData;
  /** Dealer contact data to reveal on unlock */
  dealerData?: DealerContactData;
  /** Callback triggered when unlock action is performed */
  onUnlock?: () => void;
  /** Additional CSS classes */
  className?: string;
}

function LockIconLarge() {
  return (
    <svg
      className="h-8 w-8 text-amber"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    </svg>
  );
}

function UnlockIconLarge() {
  return (
    <svg
      className="h-6 w-6 text-emerald-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
      />
    </svg>
  );
}

function ContactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-sage uppercase tracking-wide min-w-[60px]">
        {label}
      </span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}

/**
 * UnlockReveal — Animated unlock transition component.
 *
 * Locked state: shows blur + lock icon + "Data protected" text.
 * Unlock action: 2-second animation from blur to revealed content.
 * Revealed state: full contact info with unlock icon.
 *
 * Handles duplicate unlock gracefully by showing existing data without re-animation.
 */
export function UnlockReveal({
  isUnlocked,
  buyerData,
  dealerData,
  onUnlock,
  className = '',
}: UnlockRevealProps) {
  const [animating, setAnimating] = useState(false);
  const [revealed, setRevealed] = useState(isUnlocked);

  // Handle external unlock state changes
  useEffect(() => {
    if (isUnlocked && !revealed) {
      // Trigger reveal animation
      setAnimating(true);
      const timer = setTimeout(() => {
        setRevealed(true);
        setAnimating(false);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (isUnlocked && revealed) {
      // Already revealed — duplicate unlock, no re-animation
      setRevealed(true);
    }
  }, [isUnlocked, revealed]);

  const handleUnlock = () => {
    if (onUnlock && !isUnlocked && !animating) {
      onUnlock();
    }
  };

  const hasData = buyerData || dealerData;

  return (
    <div
      className={[
        'relative rounded-xl overflow-hidden',
        'backdrop-blur-sm bg-white/5 border border-white/10',
        'p-4',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-live="polite"
    >
      {/* Locked State */}
      {!revealed && !animating && (
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <LockIconLarge />
          <p className="text-sm text-sage text-center">
            Data protected
          </p>
          <p className="text-xs text-sage/60 text-center">
            Contact information will be revealed after lead selection
          </p>
          {onUnlock && !isUnlocked && (
            <button
              onClick={handleUnlock}
              className="mt-2 px-4 py-2 rounded-lg bg-amber/20 border border-amber/40 text-amber text-sm font-medium hover:bg-amber/30 transition-colors duration-200"
              aria-label="Unlock contact data"
            >
              Select Lead to Unlock
            </button>
          )}
        </div>
      )}

      {/* Animating State — 2 second reveal transition */}
      {animating && (
        <div className="flex flex-col items-center justify-center gap-3 py-4 animate-pulse">
          <div className="relative">
            <LockIconLarge />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border-2 border-amber/50 border-t-amber animate-spin" />
            </div>
          </div>
          <p className="text-sm text-amber text-center">
            Unlocking contact information...
          </p>
        </div>
      )}

      {/* Revealed State */}
      {revealed && hasData && (
        <div className="space-y-3 transition-opacity duration-[2000ms] ease-in-out opacity-100">
          {/* Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <UnlockIconLarge />
            <span className="text-sm text-emerald-400 font-medium">
              Contact Unlocked
            </span>
          </div>

          {/* Buyer Data */}
          {buyerData && (
            <div className="space-y-2">
              <p className="text-xs text-sage/60 uppercase tracking-wider">
                Buyer Information
              </p>
              <ContactRow label="Name" value={buyerData.name} />
              <ContactRow label="Email" value={buyerData.email} />
              <ContactRow label="Phone" value={buyerData.phone} />
            </div>
          )}

          {/* Dealer Data */}
          {dealerData && (
            <div className="space-y-2">
              {buyerData && <div className="border-t border-white/10 my-2" />}
              <p className="text-xs text-sage/60 uppercase tracking-wider">
                Dealer Information
              </p>
              <ContactRow label="Name" value={dealerData.businessName} />
              <ContactRow label="Email" value={dealerData.email} />
              <ContactRow label="Phone" value={dealerData.phone} />
            </div>
          )}
        </div>
      )}

      {/* Revealed but no data */}
      {revealed && !hasData && (
        <div className="flex items-center gap-2 py-2">
          <UnlockIconLarge />
          <p className="text-sm text-sage">No contact data available</p>
        </div>
      )}
    </div>
  );
}

UnlockReveal.displayName = 'UnlockReveal';

export default UnlockReveal;
