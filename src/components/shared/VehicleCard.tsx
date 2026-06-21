'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Vehicle, VehicleStatus } from '@/types';
import { getImageUrl } from '@/lib/imageProvider';
import { Badge, BadgeStatusColor } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';

export interface VehicleCardProps {
  vehicle: Vehicle;
  onFavorite?: (vehicleId: string) => void;
  isFavorited?: boolean;
  showStatus?: boolean;
  variant?: 'default' | 'dark';
  className?: string;
}

const statusBadgeConfig: Record<VehicleStatus, { label: string; color: BadgeStatusColor; className?: string }> = {
  active: { label: 'Active', color: 'amber' },
  pending_approval: { label: 'Pending', color: 'navy' },
  assigned_to_event: { label: 'In Event', color: 'amber' },
  closed: { label: 'Closed', color: 'sage' },
  draft: { label: 'Draft', color: 'sage' },
  rejected: { label: 'Rejected', color: 'amber', className: 'bg-red-500/15 text-red-700 border-red-500/30' },
};

function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString('en-US')} km`;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onFavorite,
  isFavorited = false,
  showStatus = true,
  variant = 'default',
  className = '',
}) => {
  const router = useRouter();
  const { showToast } = useToast();
  const imageUrl = getImageUrl('vehicle', vehicle.imageIds[0] || vehicle.id);
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const badgeConfig = statusBadgeConfig[vehicle.status];

  const cardBg = variant === 'dark'
    ? 'bg-navy-dark border border-white/10'
    : 'bg-white border border-sage/10';

  const textPrimary = variant === 'dark' ? 'text-white' : 'text-navy-dark';
  const textSecondary = variant === 'dark' ? 'text-sage-light' : 'text-sage-dark';

  return (
    <div
      onClick={() => router.push(`/vehicle/${vehicle.id}`)}
      className={[
        'group relative rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,51,94,0.25)] cursor-pointer',
        cardBg,
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Image Container */}
      <div className="relative aspect-[16/9] overflow-hidden bg-navy/50">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80'; }}
        />

        {/* Glass overlay on image bottom for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Status Badge */}
        {showStatus && (
          <div className="absolute top-3 left-3">
            <Badge
              variant="status"
              color={badgeConfig.color}
              label={badgeConfig.label}
              size="sm"
              className={badgeConfig.className}
            />
          </div>
        )}

        {/* Favorite Toggle */}
        {onFavorite && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(vehicle.id);
              showToast(isFavorited ? 'Removed from watchlist' : 'Added to watchlist', 'info');
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 transition-colors duration-200 hover:bg-black/50"
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill={isFavorited ? '#ECA72C' : 'none'}
              stroke={isFavorited ? '#ECA72C' : 'white'}
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </button>
        )}

        {/* Price overlay at bottom of image */}
        <div className="absolute bottom-3 left-3">
          <span className="text-white font-bold text-lg drop-shadow-md">
            {formatPrice(vehicle.price)}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className={`font-semibold text-base truncate ${textPrimary}`}>
          {title}
        </h3>

        {/* Specs Row */}
        <div className={`flex items-center gap-3 mt-2 text-sm ${textSecondary}`}>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            {formatMileage(vehicle.mileage)}
          </span>
          <span className="w-px h-3 bg-sage/30" />
          <span className="capitalize">{vehicle.fuelType}</span>
          <span className="w-px h-3 bg-sage/30" />
          <span className="capitalize">{vehicle.transmission}</span>
        </div>
      </div>
    </div>
  );
};

VehicleCard.displayName = 'VehicleCard';

export default VehicleCard;
