'use client';

import { useState, useId, type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  className = '',
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = rest.id || generatedId;
  const [isFocused, setIsFocused] = useState(false);

  const hasValue = value !== undefined && value !== '';

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className={[
            'block text-xs font-medium mb-1',
            isFocused && !error ? 'text-amber' : 'text-sage',
            error ? 'text-red-500' : '',
            disabled ? 'opacity-50' : '',
          ].join(' ')}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={[
            'peer w-full rounded-md px-4 py-3 text-sm outline-none transition-all duration-200 appearance-none',
            'bg-white/5 backdrop-blur-sm border',
            'text-white',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
              : isFocused
                ? 'border-amber focus:border-amber focus:ring-2 focus:ring-amber/30'
                : 'border-sage/30 hover:border-sage/50',
          ].join(' ')}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-navy-dark text-white">
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom dropdown chevron */}
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
          <svg
            className={[
              'h-4 w-4 transition-transform duration-200',
              isFocused ? 'rotate-180 text-amber' : 'text-sage',
              error ? 'text-red-500' : '',
            ].join(' ')}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && (
        <p
          id={`${selectId}-error`}
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;
