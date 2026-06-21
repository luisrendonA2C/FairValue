'use client';

import { useState, useId, type InputHTMLAttributes } from 'react';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  label?: string;
  placeholder?: string;
  error?: string;
  maxLength?: number;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  id?: string;
  name?: string;
  required?: boolean;
}

export function Input({
  type = 'text',
  label,
  placeholder,
  error,
  maxLength,
  value,
  onChange,
  disabled = false,
  className = '',
  id,
  name,
  required = false,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={[
            'block text-xs font-medium mb-1',
            isFocused && !error ? 'text-amber' : 'text-sage',
            error ? 'text-red-500' : '',
            disabled ? 'opacity-50' : '',
          ].join(' ')}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        maxLength={maxLength}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={[
          'peer w-full rounded-md px-4 py-3 text-sm outline-none transition-all duration-200',
          'bg-white/5 backdrop-blur-sm border',
          'text-white placeholder:text-sage/60',
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
            : isFocused
              ? 'border-amber focus:border-amber focus:ring-2 focus:ring-amber/30'
              : 'border-sage/30 hover:border-sage/50',
        ].join(' ')}
        {...rest}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-xs text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
