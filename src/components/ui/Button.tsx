'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'glass';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    'bg-amber text-white',
    'hover:bg-amber-dark hover:shadow-glow',
    'focus:ring-2 focus:ring-amber/50 focus:ring-offset-2 focus:ring-offset-transparent',
    'active:bg-amber-dark',
  ].join(' '),
  secondary: [
    'bg-navy text-white',
    'hover:bg-navy-light',
    'focus:ring-2 focus:ring-navy/50 focus:ring-offset-2 focus:ring-offset-transparent',
    'active:bg-navy-dark',
  ].join(' '),
  outline: [
    'bg-transparent border-2 border-amber text-amber',
    'hover:bg-amber hover:text-white hover:shadow-glow',
    'focus:ring-2 focus:ring-amber/50 focus:ring-offset-2 focus:ring-offset-transparent',
    'active:bg-amber-dark active:border-amber-dark active:text-white',
  ].join(' '),
  ghost: [
    'bg-transparent text-current',
    'hover:bg-white/10',
    'focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent',
    'active:bg-white/20',
  ].join(' '),
  glass: [
    'backdrop-blur-md bg-white/10 border border-white/20 text-white',
    'hover:bg-white/20 hover:border-white/30',
    'focus:ring-2 focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent',
    'active:bg-white/25',
  ].join(' '),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-base rounded-lg gap-2',
  lg: 'px-7 py-3.5 text-lg rounded-xl gap-2.5',
};

function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className ?? 'h-4 w-4'}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      icon,
      children,
      className = '',
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles = [
      'inline-flex items-center justify-center',
      'font-medium',
      'transition-all duration-200 ease-in-out',
      'select-none',
      'cursor-pointer',
    ].join(' ');

    const disabledStyles = isDisabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : '';

    const classes = [
      baseStyles,
      variantStyles[variant],
      sizeStyles[size],
      disabledStyles,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={classes}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...rest}
      >
        {loading && <Spinner className={size === 'sm' ? 'h-3.5 w-3.5' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />}
        {!loading && icon && <span className="shrink-0">{icon}</span>}
        {children && <span>{children}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
