'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/hooks/useData';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import type { BadgeStatusColor } from '@/components/ui/Badge';
import { EmptyState } from '@/components/shared/EmptyState';
import type { OfferStatus } from '@/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getStatusBadgeProps(status: OfferStatus): { color: BadgeStatusColor; label: string } {
  switch (status) {
    case 'received':
      return { color: 'amber', label: 'Recibida' };
    case 'surpassed':
      return { color: 'sage', label: 'Superada' };
    case 'in_review':
      return { color: 'navy', label: 'En revisión' };
    case 'selected':
      return { color: 'emerald', label: 'Seleccionada' };
    case 'not_selected':
      return { color: 'sage', label: 'No seleccionada' };
    default:
      return { color: 'sage', label: status };
  }
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function BuyerOffersPage() {
  const { user } = useAuth();
  const { offers, vehicles } = useMockData();

  // Filter offers by current buyer
  const buyerOffers = offers
    .filter((o) => o.buyerId === user?.id)
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

  // Vehicle lookup helper
  function getVehicleName(vehicleId: string): string {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    if (!vehicle) return 'Vehículo desconocido';
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  }

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-bold text-white">
            Mis Ofertas
          </h1>
          {buyerOffers.length > 0 && (
            <p className="text-sage mt-1">
              {buyerOffers.length} ofertas colocadas
            </p>
          )}
        </div>

        {/* Disclaimer */}
        <GlassPanel variant="dark" padding="sm" className="mb-6">
          <div className="flex items-start gap-3">
            <span className="text-amber text-lg shrink-0">⚠️</span>
            <p className="text-sm text-white/80">
              Recuerda: enviar una oferta no constituye un compromiso de compra vinculante.
            </p>
          </div>
        </GlassPanel>

        {/* Offers List or Empty State */}
        {buyerOffers.length === 0 ? (
          <GlassPanel variant="light" padding="lg">
            <EmptyState
              title="No has colocado ofertas aún"
              message="Explora el inventario disponible y coloca tu primera oferta."
              action={{
                label: 'Explorar inventario',
                href: '/inventory',
              }}
            />
          </GlassPanel>
        ) : (
          <div className="space-y-3">
            {buyerOffers.map((offer) => {
              const statusBadge = getStatusBadgeProps(offer.status);

              return (
                <GlassPanel
                  key={offer.id}
                  variant="light"
                  padding="md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    {/* Vehicle Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {getVehicleName(offer.vehicleId)}
                      </p>
                      <p className="text-xs text-sage mt-0.5">
                        {formatDate(offer.submissionDate)}
                      </p>
                    </div>

                    {/* Amount & Status */}
                    <div className="flex items-center gap-4">
                      <span className="text-base font-bold text-amber whitespace-nowrap">
                        {formatUSD(offer.amount)}
                      </span>
                      <Badge
                        variant="status"
                        color={statusBadge.color}
                        label={statusBadge.label}
                        size="sm"
                      />
                    </div>
                  </div>
                </GlassPanel>
              );
            })}
          </div>
        )}
      </div>
    </GradientBackground>
  );
}
