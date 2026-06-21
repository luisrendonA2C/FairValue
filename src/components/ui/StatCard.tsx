'use client';

import React from 'react';

export type StatCardTrend = 'up' | 'down' | 'neutral';

export interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  trend?: StatCardTrend;
  trendValue?: string;
  className?: string;
}

const trendColors: Record<StatCardTrend, string> = {
  up: 'text-emerald-400',
  down: 'text-red-400',
  neutral: 'text-sage',
};

const trendIcons: Record<StatCardTrend, string> = {
  up: '↑',
  down: '↓',
  neutral: '→',
};

export const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  trend,
  trendValue,
  className = '',
}) => {
  const classes = [
    'relative overflow-hidden rounded-2xl',
    'backdrop-blur-md bg-white/10 border border-white/20 shadow-xl',
    'p-5',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {/* Amber accent stripe on left edge */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber to-amber-dark rounded-l-2xl" />

      <div className="flex items-start justify-between">
        <div className="pl-3">
          <p className="font-heading text-3xl font-bold text-white">
            {value}
          </p>
          <p className="text-sm text-sage mt-1">
            {label}
          </p>
          {trend && trendValue && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trendColors[trend]}`}>
              <span>{trendIcons[trend]}</span>
              <span>{trendValue}</span>
            </p>
          )}
        </div>

        {icon && (
          <div className="text-white/40 text-2xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

StatCard.displayName = 'StatCard';

export default StatCard;
