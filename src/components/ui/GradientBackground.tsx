'use client';

import React from 'react';

export type GradientVariant = 'navy-forest' | 'navy-dark' | 'amber' | 'light';

export interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: GradientVariant;
  className?: string;
}

const gradientStyles: Record<GradientVariant, React.CSSProperties> = {
  'navy-forest': { background: 'linear-gradient(135deg, #00335E 0%, #3E442B 100%)' },
  'navy-dark': { background: 'linear-gradient(180deg, #00335E 0%, #001F3A 100%)' },
  'amber': { background: 'linear-gradient(135deg, #C9963C 0%, #A67B28 100%)' },
  'light': { background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)' },
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  children,
  variant = 'navy-dark',
  className = '',
}) => {
  const classes = ['w-full', className].filter(Boolean).join(' ');

  return (
    <div className={classes} style={gradientStyles[variant]}>
      {children}
    </div>
  );
};

GradientBackground.displayName = 'GradientBackground';

export default GradientBackground;
