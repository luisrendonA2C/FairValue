'use client';

import React from 'react';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'glass';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const variantStyles: Record<CardVariant, string> = {
  default: [
    'bg-white rounded-xl shadow-md',
    'border border-transparent',
  ].join(' '),
  elevated: [
    'bg-white rounded-xl shadow-2xl',
    'border border-transparent',
    'ring-1 ring-white/50',
  ].join(' '),
  outlined: [
    'bg-white rounded-xl',
    'border border-sage/20',
  ].join(' '),
  glass: [
    'backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl',
    'shadow-xl',
  ].join(' '),
};

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-7',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  children,
}) => {
  const interactive = onClick ? 'cursor-pointer transition-all duration-200 hover:scale-[1.01]' : '';

  const classes = [
    variantStyles[variant],
    paddingStyles[padding],
    interactive,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} onClick={onClick} role={onClick ? 'button' : undefined} tabIndex={onClick ? 0 : undefined}>
      {children}
    </div>
  );
};

Card.displayName = 'Card';

export default Card;
