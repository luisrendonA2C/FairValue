'use client';

import React from 'react';

export type SkeletonVariant = 'text' | 'card' | 'table-row' | 'image';

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string;
  height?: string;
  count?: number;
  className?: string;
}

const variantDefaults: Record<SkeletonVariant, { width: string; height: string }> = {
  text: { width: '100%', height: '1rem' },
  card: { width: '100%', height: '12rem' },
  'table-row': { width: '100%', height: '3rem' },
  image: { width: '100%', height: '10rem' },
};

const variantStyles: Record<SkeletonVariant, string> = {
  text: 'rounded-md',
  card: 'rounded-2xl',
  'table-row': 'rounded-lg',
  image: 'rounded-xl',
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
}) => {
  const defaults = variantDefaults[variant];
  const resolvedWidth = width ?? defaults.width;
  const resolvedHeight = height ?? defaults.height;

  const items = Array.from({ length: count }, (_, i) => (
    <div
      key={i}
      className={[
        'relative overflow-hidden bg-sage/10',
        variantStyles[variant],
        'animate-pulse',
        className,
      ].join(' ')}
      style={{ width: resolvedWidth, height: resolvedHeight }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  ));

  if (count === 1) return items[0];

  return <div className="flex flex-col gap-2">{items}</div>;
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;
