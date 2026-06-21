'use client';

import React, { useState, useRef, useCallback } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: string;
  position?: TooltipPosition;
  children: React.ReactNode;
  className?: string;
}

const positionStyles: Record<TooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles: Record<TooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-dark/90',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-navy-dark/90',
  left: 'left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-navy-dark/90',
  right: 'right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-navy-dark/90',
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = 'top',
  children,
  className = '',
}) => {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, 200);
  }, []);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {visible && (
        <div
          className={[
            'absolute z-50 pointer-events-none',
            positionStyles[position],
          ].join(' ')}
          role="tooltip"
        >
          <div className="relative px-3 py-1.5 rounded-lg bg-navy-dark/90 backdrop-blur-sm shadow-lg text-white text-xs font-medium whitespace-nowrap">
            {content}
            {/* Arrow */}
            <span
              className={[
                'absolute w-0 h-0',
                arrowStyles[position],
              ].join(' ')}
              aria-hidden="true"
            />
          </div>
        </div>
      )}
    </div>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
