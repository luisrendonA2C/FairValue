'use client';

import React from 'react';

export type BadgeVariant = 'status' | 'level' | 'count';
export type BadgeSize = 'sm' | 'md';

export type BadgeStatusColor = 'amber' | 'navy' | 'sage' | 'white' | 'emerald';
export type BadgeLevelColor = 'priority' | 'hot' | 'medium' | 'cold';

export type BadgeColor = BadgeStatusColor | BadgeLevelColor;

export interface BadgeProps {
  variant?: BadgeVariant;
  color?: BadgeColor;
  label: string;
  className?: string;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const statusColorStyles: Record<BadgeStatusColor, string> = {
  amber: 'bg-amber/15 text-amber-dark border border-amber/30',
  navy: 'bg-navy/10 text-navy border border-navy/20',
  sage: 'bg-sage/10 text-sage-dark border border-sage/20',
  white: 'bg-white/90 text-navy border border-sage/10',
  emerald: 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20',
};

const levelColorStyles: Record<BadgeLevelColor, string> = {
  priority: 'bg-amber/20 text-amber-dark border border-amber/40',
  hot: 'bg-orange-500/15 text-orange-700 border border-orange-500/30',
  medium: 'bg-sage/15 text-sage-dark border border-sage/30',
  cold: 'bg-navy-dark/10 text-navy-dark border border-navy-dark/20',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

function getColorStyle(variant: BadgeVariant, color: BadgeColor): string {
  if (variant === 'level') {
    return levelColorStyles[color as BadgeLevelColor] ?? levelColorStyles.medium;
  }
  if (variant === 'count') {
    return 'bg-navy/10 text-navy border border-navy/20';
  }
  return statusColorStyles[color as BadgeStatusColor] ?? statusColorStyles.sage;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'status',
  color = 'sage',
  label,
  className = '',
  size = 'sm',
  icon,
}) => {
  const colorStyle = getColorStyle(variant, color);

  const classes = [
    'inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap',
    sizeStyles[size],
    colorStyle,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes}>
      {icon && <span className="shrink-0">{icon}</span>}
      {label}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
