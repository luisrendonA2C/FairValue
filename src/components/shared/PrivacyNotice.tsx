import React from 'react';

export interface PrivacyNoticeProps {
  context: 'offer' | 'lead' | 'vehicle';
  className?: string;
}

const contextMessages: Record<PrivacyNoticeProps['context'], string> = {
  offer:
    'Your identity remains protected until event close. Only the Dealer will see your contact info after lead selection.',
  lead:
    'Buyer information is anonymized until you select this lead. Selecting unlocks their contact details.',
  vehicle:
    'Dealer identity is protected during active events. Contact information becomes available after lead selection.',
};

function ShieldIcon() {
  return (
    <svg
      className="h-5 w-5 text-amber shrink-0"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4"
      />
    </svg>
  );
}

export function PrivacyNotice({ context, className = '' }: PrivacyNoticeProps) {
  return (
    <div
      className={[
        'flex items-start gap-3 p-3 rounded-lg',
        'backdrop-blur-sm bg-white/5 border border-white/10',
        'border-l-4 border-l-amber',
        className,
      ].join(' ')}
      role="note"
      aria-label="Privacy notice"
    >
      <ShieldIcon />
      <p className="text-sm text-sage leading-relaxed">
        {contextMessages[context]}
      </p>
    </div>
  );
}

PrivacyNotice.displayName = 'PrivacyNotice';

export default PrivacyNotice;
