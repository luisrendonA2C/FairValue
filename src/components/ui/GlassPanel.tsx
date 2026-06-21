'use client';

import React from 'react';

export type GlassPanelVariant = 'light' | 'dark' | 'navy';
export type GlassPanelPadding = 'sm' | 'md' | 'lg' | 'none';

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassPanelVariant;
  padding?: GlassPanelPadding;
  glow?: boolean;
}

const variantStyles: Record<GlassPanelVariant, string> = {
  light: 'backdrop-blur-md bg-white/10 border border-white/20 shadow-xl',
  dark: 'backdrop-blur-md bg-navy-dark/80 border border-white/10',
  navy: 'backdrop-blur-xl bg-navy/90 border border-white/5',
};

const paddingStyles: Record<GlassPanelPadding, string> = {
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
  none: '',
};

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  className = '',
  variant = 'light',
  padding = 'md',
  glow = false,
}) => {
  const glowStyles = glow ? 'ring-1 ring-amber/30 shadow-[0_0_20px_rgba(236,167,44,0.2)]' : '';

  const classes = [
    'rounded-2xl',
    variantStyles[variant],
    paddingStyles[padding],
    glowStyles,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

GlassPanel.displayName = 'GlassPanel';

export default GlassPanel;
