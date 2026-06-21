'use client';

import React from 'react';
import { Lead, LeadLevel } from '@/types';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge, BadgeLevelColor } from '@/components/ui/Badge';
import { Tooltip } from '@/components/ui/Tooltip';

export interface LeadRowProps {
  lead: Lead;
  isLocked: boolean;
  onSelect?: (leadId: string) => void;
  onUnlock?: (leadId: string) => void;
  onChat?: (leadId: string) => void;
  onExport?: (leadId: string) => void;
  className?: string;
}

const levelBadgeColor: Record<LeadLevel, BadgeLevelColor> = {
  Priority: 'priority',
  Hot: 'hot',
  Medium: 'medium',
  Cold: 'cold',
};

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export const LeadRow: React.FC<LeadRowProps> = ({
  lead,
  isLocked,
  onSelect,
  onUnlock,
  onChat,
  onExport,
  className = '',
}) => {
  const lockedTooltip = 'Available after event close';

  const ActionButton = ({
    label,
    onClick,
    icon,
  }: {
    label: string;
    onClick?: () => void;
    icon: React.ReactNode;
  }) => {
    const button = (
      <button
        onClick={onClick}
        disabled={isLocked}
        aria-label={label}
        className={[
          'p-2 rounded-lg transition-all duration-200',
          'hover:bg-white/10',
          isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105',
        ].join(' ')}
      >
        {icon}
      </button>
    );

    if (isLocked) {
      return (
        <Tooltip content={lockedTooltip} position="top">
          {button}
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <tr
      className={[
        'border-b border-white/5 transition-colors duration-150 hover:bg-white/5',
        className,
      ].join(' ')}
    >
      {/* Lead Score */}
      <td className="px-4 py-3">
        <div className={`w-32 ${isLocked ? 'blur-sm' : ''}`}>
          <ProgressBar value={lead.score} variant="scored" />
        </div>
      </td>

      {/* Level Badge */}
      <td className="px-4 py-3">
        <Badge
          variant="level"
          color={levelBadgeColor[lead.level]}
          label={lead.level}
          size="sm"
        />
      </td>

      {/* Offer Amount */}
      <td className="px-4 py-3">
        <span className={`text-sm font-semibold text-white ${isLocked ? 'blur-sm' : ''}`}>
          {formatUSD(lead.offerAmount)}
        </span>
      </td>

      {/* Action Buttons */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {/* Unlock */}
          {onUnlock && (
            <ActionButton
              label="Unlock lead"
              onClick={() => onUnlock(lead.id)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5 text-amber"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21.75h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              }
            />
          )}

          {/* Select */}
          {onSelect && (
            <ActionButton
              label="Select lead"
              onClick={() => onSelect(lead.id)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5 text-emerald-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              }
            />
          )}

          {/* Chat */}
          {onChat && (
            <ActionButton
              label="Chat with lead"
              onClick={() => onChat(lead.id)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5 text-sage"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
              }
            />
          )}

          {/* Export */}
          {onExport && (
            <ActionButton
              label="Export lead"
              onClick={() => onExport(lead.id)}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4.5 h-4.5 text-sage"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              }
            />
          )}
        </div>
      </td>
    </tr>
  );
};

LeadRow.displayName = 'LeadRow';

export default LeadRow;
