'use client';

import React from 'react';
import type { Event } from '@/types';
import { CountdownTimer } from './CountdownTimer';
import { getImageUrl } from '@/lib/imageProvider';
import { vehicles } from '@/data';

export interface EventCardProps {
  event: Event;
  showCountdown?: boolean;
  className?: string;
}

const statusColors: Record<string, { badge: string; label: string }> = {
  scheduled: {
    badge: 'bg-navy/20 text-blue-300 border border-blue-400/30',
    label: 'Scheduled',
  },
  active: {
    badge: 'bg-amber/20 text-amber border border-amber/40',
    label: 'Active',
  },
  closed: {
    badge: 'bg-sage/20 text-sage-light border border-sage/30',
    label: 'Closed',
  },
  in_review: {
    badge: 'bg-purple-500/20 text-purple-300 border border-purple-400/30',
    label: 'In Review',
  },
  finished: {
    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30',
    label: 'Finished',
  },
};

function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  };
  return `${start.toLocaleDateString('en-US', options)} — ${end.toLocaleDateString('en-US', options)}`;
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '...';
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  showCountdown = false,
  className = '',
}) => {
  const isActive = event.status === 'active';
  const statusConfig = statusColors[event.status] ?? statusColors.scheduled;

  return (
    <div
      className={[
        'glass-card p-6 rounded-xl transition-transform duration-300 hover:scale-[1.02]',
        isActive ? 'shadow-glow border-amber/30' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header: name + status badge */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-white font-heading text-lg font-semibold leading-tight">
          {event.name}
        </h3>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${statusConfig.badge}`}
        >
          {statusConfig.label}
        </span>
      </div>

      {/* Date range */}
      <p className="text-sage-light text-sm mb-2">
        {formatDateRange(event.startDate, event.endDate)}
      </p>

      {/* Description */}
      <p className="text-white/70 text-sm mb-4 leading-relaxed">
        {truncate(event.description, 120)}
      </p>

      {/* Vehicle preview images */}
      <div className="flex gap-2 my-3">
        {event.vehicleIds.slice(0, 3).map((vid, idx) => {
          const vehicle = vehicles.find(v => v.id === vid);
          const imgId = vehicle?.imageIds[0] || vid;
          return (
            <div key={idx} className="w-16 h-12 rounded-lg overflow-hidden border border-white/10">
              <img 
                src={getImageUrl('vehicle', imgId)} 
                alt="" 
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&q=60'; }}
              />
            </div>
          );
        })}
      </div>

      {/* Vehicle count */}
      <div className="flex items-center gap-2 mb-4">
        <svg
          className="w-4 h-4 text-sage-light"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h-.375a3 3 0 013-3h.75m0 3H6.75m0 0h6.75m-6.75 0V9m6.75 5.25V9m0 5.25h.375a3 3 0 003-3V9.75m0 0H18a3 3 0 00-3-3h-1.5m-6 0h6"
          />
        </svg>
        <span className="text-sage-light text-sm">
          {event.vehicleIds.length} vehicle{event.vehicleIds.length !== 1 ? 's' : ''}
        </span>
        {event.offerCount > 0 && (
          <>
            <span className="text-white/30 mx-1">•</span>
            <span className="text-sage-light text-sm">
              {event.offerCount} offer{event.offerCount !== 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>

      {/* Countdown for active events */}
      {showCountdown && isActive && (
        <CountdownTimer targetDate={event.endDate} className="mt-2" />
      )}
    </div>
  );
};

EventCard.displayName = 'EventCard';

export default EventCard;
