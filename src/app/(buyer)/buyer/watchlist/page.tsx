'use client';

import React from 'react';
import { useMockData } from '@/hooks/useData';
import { useWatchlist } from '@/hooks/useWatchlist';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { VehicleCard } from '@/components/shared/VehicleCard';
import { EmptyState } from '@/components/shared/EmptyState';

export default function BuyerWatchlistPage() {
  const { vehicles } = useMockData();
  const { watchlist, isFavorited, toggleFavorite } = useWatchlist();

  // Filter vehicles by watchlist IDs, ordered by most recently added (watchlist order)
  const favoritedVehicles = watchlist
    .map((id) => vehicles.find((v) => v.id === id))
    .filter((v): v is NonNullable<typeof v> => v !== undefined);

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-white">
            Mi Watchlist
          </h1>
          {favoritedVehicles.length > 0 && (
            <p className="text-sage mt-1">
              {favoritedVehicles.length} vehículos guardados
            </p>
          )}
        </div>

        {/* Content */}
        {favoritedVehicles.length === 0 ? (
          <EmptyState
            title="No tienes vehículos guardados"
            message="Explora nuestro inventario y agrega vehículos a tu watchlist para seguirlos de cerca."
            action={{
              label: 'Explorar Inventario',
              href: '/inventory',
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {favoritedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorited={isFavorited(vehicle.id)}
                onFavorite={toggleFavorite}
                variant="dark"
              />
            ))}
          </div>
        )}
      </div>
    </GradientBackground>
  );
}
