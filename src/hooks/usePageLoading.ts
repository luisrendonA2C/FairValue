'use client';

import { useState, useEffect } from 'react';

/**
 * usePageLoading — simulates page-level data loading for demo purposes.
 * Returns `isLoading: true` for a random duration between 300ms and 1500ms
 * on initial mount, then flips to false.
 */
export function usePageLoading(minMs = 300, maxMs = 1500) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const duration = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
    const timer = setTimeout(() => setIsLoading(false), duration);
    return () => clearTimeout(timer);
  }, [minMs, maxMs]);

  return { isLoading };
}

export default usePageLoading;
