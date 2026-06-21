'use client';

import React from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-10 h-10', text: 'text-sm' },
  lg: { container: 'w-14 h-14', text: 'text-lg' },
  xl: { container: 'w-20 h-20', text: 'text-2xl' },
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || parts[0] === '') return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);
  const styles = sizeStyles[size];
  const showImage = src && !imgError;

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full p-[2px] bg-gradient-to-br from-navy to-amber ${className}`}
      aria-label={name}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          onError={() => setImgError(true)}
          className={`${styles.container} rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${styles.container} rounded-full flex items-center justify-center bg-gradient-to-br from-navy to-navy-dark`}
        >
          <span className={`${styles.text} font-semibold text-white`}>
            {getInitials(name)}
          </span>
        </div>
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export default Avatar;
