'use client';

import React from 'react';

export type SectionDividerVariant = 'light' | 'dark';

export interface SectionDividerProps {
  label?: string;
  className?: string;
  variant?: SectionDividerVariant;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  label,
  className = '',
  variant = 'light',
}) => {
  const gradientColor = variant === 'light'
    ? 'from-transparent via-sage/30 to-transparent'
    : 'from-transparent via-white/20 to-transparent';

  if (!label) {
    return (
      <div className={`w-full py-4 ${className}`}>
        <div className={`h-px bg-gradient-to-r ${gradientColor}`} />
      </div>
    );
  }

  return (
    <div className={`w-full py-4 flex items-center gap-4 ${className}`}>
      <div className={`flex-1 h-px bg-gradient-to-r ${gradientColor}`} />
      <span className={`text-sm font-medium ${variant === 'light' ? 'text-sage' : 'text-white/60'}`}>
        {label}
      </span>
      <div className={`flex-1 h-px bg-gradient-to-r ${gradientColor}`} />
    </div>
  );
};

SectionDivider.displayName = 'SectionDivider';

export default SectionDivider;
