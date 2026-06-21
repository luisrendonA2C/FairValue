'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/hooks/useData';
import { useWatchlist } from '@/hooks/useWatchlist';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getLeadLevel } from '@/lib/leadScoring';
import { FileText, Calendar, Star } from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getVerificationBadgeProps(status: string) {
  switch (status) {
    case 'verified':
      return { color: 'emerald' as const, label: 'Verificado' };
    case 'under_review':
      return { color: 'amber' as const, label: 'En revisión' };
    case 'documents_uploaded':
      return { color: 'navy' as const, label: 'Docs subidos' };
    case 'rejected':
      return { color: 'sage' as const, label: 'Rechazado' };
    default:
      return { color: 'white' as const, label: 'Sin iniciar' };
  }
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Mock Recent Activity ───────────────────────────────────────────────────

const recentActivity = [
  {
    id: '1',
    description: 'Oferta colocada en 2023 Toyota RAV4 — $40,500',
    timestamp: '2024-01-15T14:30:00Z',
  },
  {
    id: '2',
    description: 'BMW 330i agregado a watchlist',
    timestamp: '2024-01-15T12:15:00Z',
  },
  {
    id: '3',
    description: 'Verificación de identidad completada',
    timestamp: '2024-01-14T09:00:00Z',
  },
  {
    id: '4',
    description: 'Oferta colocada en 2022 Honda CR-V — $35,200',
    timestamp: '2024-01-13T16:45:00Z',
  },
  {
    id: '5',
    description: 'Perfil actualizado — teléfono verificado',
    timestamp: '2024-01-12T11:20:00Z',
  },
];

// ─── Page Component ─────────────────────────────────────────────────────────

export default function BuyerDashboardPage() {
  const { user } = useAuth();
  const { offers, events } = useMockData();
  const { watchlist } = useWatchlist();

  // Derived data
  const activeOffers = offers.filter(
    (o) => o.buyerId === user?.id && (o.status === 'received' || o.status === 'in_review')
  );

  const upcomingEvents = events.filter(
    (e) => e.status === 'scheduled' || e.status === 'active'
  );

  // Mock lead score based on profile completeness
  const mockLeadScore = user?.profileCompleteness
    ? Math.round(user.profileCompleteness * 0.85)
    : 45;
  const leadLevel = getLeadLevel(mockLeadScore);

  const verificationBadge = getVerificationBadgeProps(
    user?.verificationStatus ?? 'not_started'
  );

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-white">
            Bienvenido, {user?.name ?? 'Comprador'}
          </h1>
          <p className="text-sage mt-1">
            Tu resumen de actividad en Fair Value
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <StatCard
            value={activeOffers.length}
            label="Ofertas activas"
            icon={<FileText className="w-5 h-5 text-amber" />}
          />

          <StatCard
            value={watchlist.length}
            label="Watchlist"
            icon={<Star className="w-5 h-5 text-amber" />}
          />

          {/* Verification Status */}
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl p-5">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber to-amber-dark rounded-l-2xl" />
            <div className="pl-3">
              <p className="text-sm text-sage mb-2">Verificación</p>
              <Badge
                variant="status"
                color={verificationBadge.color}
                label={verificationBadge.label}
                size="md"
              />
            </div>
          </div>

          {/* Lead Score */}
          <div className="relative overflow-hidden rounded-2xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl p-5">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber to-amber-dark rounded-l-2xl" />
            <div className="pl-3">
              <p className="text-sm text-sage mb-1">Lead Score</p>
              <ProgressBar
                value={mockLeadScore}
                variant="scored"
                label={leadLevel}
              />
            </div>
          </div>

          <StatCard
            value={Math.min(upcomingEvents.length, 3)}
            label="Eventos próximos"
            icon={<Calendar className="w-5 h-5 text-amber" />}
          />
        </div>

        {/* Upcoming Events Preview */}
        {upcomingEvents.length > 0 && (
          <GlassPanel variant="light" padding="md" className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-3">
              Próximos Eventos
            </h2>
            <div className="space-y-2">
              {upcomingEvents.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {event.name}
                    </p>
                    <p className="text-xs text-sage">
                      {new Date(event.startDate).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <Badge
                    variant="status"
                    color={event.status === 'active' ? 'emerald' : 'navy'}
                    label={event.status === 'active' ? 'Activo' : 'Programado'}
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        {/* Recent Activity */}
        <GlassPanel variant="light" padding="md">
          <h2 className="text-lg font-semibold text-white mb-4">
            Actividad Reciente
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between py-2 border-b border-white/10 last:border-b-0"
              >
                <p className="text-sm text-white/90">{activity.description}</p>
                <span className="text-xs text-sage whitespace-nowrap ml-4">
                  {formatTimestamp(activity.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </GradientBackground>
  );
}
