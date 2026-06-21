import React from 'react';

export interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: EmptyStateAction;
  className?: string;
}

function DefaultFolderIcon() {
  return (
    <svg
      className="h-16 w-16 text-sage/50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
      />
    </svg>
  );
}

export function EmptyState({
  title,
  message,
  icon,
  action,
  className = '',
}: EmptyStateProps) {
  const ActionWrapper = action?.href ? 'a' : 'button';

  return (
    <div
      className={[
        'flex flex-col items-center justify-center py-12 px-6 text-center',
        className,
      ].join(' ')}
    >
      {/* Icon / Illustration */}
      <div className="mb-4">
        {icon ?? <DefaultFolderIcon />}
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg font-semibold text-navy-dark dark:text-white mb-2">
        {title}
      </h3>

      {/* Message */}
      <p className="text-sage text-sm max-w-sm mb-6">
        {message}
      </p>

      {/* Optional CTA */}
      {action && (
        <ActionWrapper
          {...(action.href ? { href: action.href } : {})}
          {...(action.onClick ? { onClick: action.onClick } : {})}
          className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium rounded-lg border-2 border-amber text-amber hover:bg-amber hover:text-white transition-all duration-200"
        >
          {action.label}
        </ActionWrapper>
      )}
    </div>
  );
}

EmptyState.displayName = 'EmptyState';

export default EmptyState;
