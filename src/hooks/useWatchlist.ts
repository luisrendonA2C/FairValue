'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Constants ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fair_value_watchlist';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStoredWatchlist(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'string')) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

// ─── Hook ───────────────────────────────────────────────────────────────────

/**
 * Custom hook for managing a buyer's vehicle watchlist with localStorage persistence.
 *
 * - `watchlist`: array of vehicle IDs currently in the watchlist (most recent first)
 * - `isFavorited(id)`: returns true if the vehicle is in the watchlist
 * - `toggleFavorite(id)`: adds vehicle to beginning if not present, removes if present
 *
 * Toggling twice returns to original state (idempotence).
 * Persists in localStorage under key 'fair_value_watchlist' for session continuity.
 */
export function useWatchlist(): {
  watchlist: string[];
  isFavorited: (vehicleId: string) => boolean;
  toggleFavorite: (vehicleId: string) => void;
} {
  const [watchlist, setWatchlist] = useState<string[]>(() => getStoredWatchlist());

  // Persist to localStorage whenever watchlist changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch {
      // Silently fail if localStorage is full or unavailable
    }
  }, [watchlist]);

  const isFavorited = useCallback(
    (vehicleId: string): boolean => {
      return watchlist.includes(vehicleId);
    },
    [watchlist]
  );

  const toggleFavorite = useCallback(
    (vehicleId: string): void => {
      setWatchlist((prev) => {
        if (prev.includes(vehicleId)) {
          // Remove from watchlist
          return prev.filter((id) => id !== vehicleId);
        } else {
          // Add to beginning (most recent first)
          return [vehicleId, ...prev];
        }
      });
    },
    []
  );

  return { watchlist, isFavorited, toggleFavorite };
}
