'use client';

import React from 'react';

export type ProgressBarVariant = 'default' | 'scored';

export interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  label?: string;
  variant?: ProgressBarVariant;
  className?: string;
}

function getScoredColor(percentage: number): string {
  if (percentage >= 80) return 'bg-emerald-500';
  if (percentage >= 60) return 'bg-amber';
  if (percentage >= 40) return 'bg-sage';
  return 'bg-navy-dark';
}

function getScoredLabel(percentage: number): string {
  if (percentage >= 80) return 'Priority';
  if (percentage >= 60) return 'Hot';
  if (percentage >= 40) return 'Medium';
  return 'Cold';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  color,
  label,
  variant = 'default',
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const fillColor =
    color
      ? color
      : variant === 'scored'
        ? getScoredColor(percentage)
        : 'bg-gradient-to-r from-navy to-amber';

  const displayLabel =
    label ?? (variant === 'scored' ? getScoredLabel(percentage) : undefined);

  return (
    <div className={`w-full ${className}`}>
      {displayLabel && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-sage">{displayLabel}</span>
          <span className="text-xs font-mono font-semibold text-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className="relative w-full h-3 bg-sage/10 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={displayLabel ?? 'Progress'}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${fillColor}`}
          style={{ width: `${percentage}%` }}
        >
          {percentage > 15 && (
            <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-sm">
              {Math.round(percentage)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
