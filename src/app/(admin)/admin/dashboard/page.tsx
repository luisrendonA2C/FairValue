'use client';

import React from 'react';
import { useMockData } from '@/hooks/useData';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { StatCard } from '@/components/ui/StatCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// ─── Mock Recent Activity ───────────────────────────────────────────────────

interface ActivityItem {
  id: string;
  description: string;
  actor: string;
  timestamp: string;
}

const recentActivity: ActivityItem[] = [
  { id: 'act-1', description: 'New dealer registered: Auto Premium CR', actor: 'System', timestamp: '2024-12-15T14:32:00Z' },
  { id: 'act-2', description: 'Vehicle approved: 2023 Toyota RAV4', actor: 'Admin Luis', timestamp: '2024-12-15T13:45:00Z' },
  { id: 'act-3', description: 'Event created: Subasta de Diciembre', actor: 'Admin María', timestamp: '2024-12-15T12:20:00Z' },
  { id: 'act-4', description: 'Lead unlocked by Motor City CR', actor: 'System', timestamp: '2024-12-15T11:55:00Z' },
  { id: 'act-5', description: 'New offer submitted: ₡18,500,000 on BMW X3', actor: 'Buyer Carlos R.', timestamp: '2024-12-15T10:30:00Z' },
  { id: 'act-6', description: 'Dealer document uploaded: Patente Comercial', actor: 'Autos del Valle', timestamp: '2024-12-15T09:15:00Z' },
  { id: 'act-7', description: 'Vehicle submitted for review: 2022 Hyundai Tucson', actor: 'Motor City CR', timestamp: '2024-12-14T17:40:00Z' },
  { id: 'act-8', description: 'Buyer verification completed: Ana M.', actor: 'System', timestamp: '2024-12-14T16:22:00Z' },
  { id: 'act-9', description: 'Event status changed to active: Subasta Premium Diciembre', actor: 'Admin Luis', timestamp: '2024-12-14T15:00:00Z' },
  { id: 'act-10', description: 'New buyer registered: José Ramírez', actor: 'System', timestamp: '2024-12-14T14:10:00Z' },
];

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return 'Hace menos de 1 hora';
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays}d`;
}

// ─── Admin Dashboard Page ───────────────────────────────────────────────────

export default function AdminDashboardPage() {
  const { users, dealers, vehicles, events, offers, leads } = useMockData();

  const activeEvents = events.filter((e) => e.status === 'active');
  const pendingDealers = dealers.filter((d) => d.approvalStatus === 'pending_approval');
  const pendingVehicles = vehicles.filter((v) => v.status === 'pending_approval');

  return (
    <div className="bg-navy-dark text-white p-6 lg:p-8 overflow-y-auto min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
            Admin Dashboard
          </h1>
          <p className="text-sage mt-1">Resumen general de la plataforma Fair Value</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          <GradientBackground variant="navy-dark" className="rounded-2xl">
            <StatCard
              value={users.length}
              label="Usuarios Totales"
              trend="up"
              trendValue="+3 esta semana"
            />
          </GradientBackground>
          <GradientBackground variant="navy-dark" className="rounded-2xl">
            <StatCard
              value={dealers.length}
              label="Dealers"
              trend="up"
              trendValue="+1 nuevo"
            />
          </GradientBackground>
          <GradientBackground variant="navy-dark" className="rounded-2xl">
            <StatCard
              value={vehicles.length}
              label="Vehículos"
              trend="neutral"
              trendValue="Estable"
            />
          </GradientBackground>
          <GradientBackground variant="navy-dark" className="rounded-2xl">
            <StatCard
              value={activeEvents.length}
              label="Eventos Activos"
              trend="up"
              trendValue="En curso"
            />
          </GradientBackground>
          <GradientBackground variant="navy-dark" className="rounded-2xl">
            <StatCard
              value={offers.length}
              label="Ofertas"
              trend="up"
              trendValue="+5 hoy"
            />
          </GradientBackground>
          <GradientBackground variant="navy-dark" className="rounded-2xl">
            <StatCard
              value={leads.length}
              label="Leads"
              trend="up"
              trendValue="+2 nuevos"
            />
          </GradientBackground>
        </div>

        {/* Review Alerts */}
        <div className="mb-8">
          <GlassPanel variant="dark" padding="md">
            <h3 className="text-lg font-heading font-semibold text-white mb-4">
              Alertas de Revisión
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge
                variant="status"
                color="amber"
                size="md"
                label={`${pendingDealers.length} Dealers pendientes de aprobación`}
              />
              <Badge
                variant="status"
                color="amber"
                size="md"
                label={`${pendingVehicles.length} Vehículos pendientes de aprobación`}
              />
              <Badge
                variant="status"
                color="amber"
                size="md"
                label="2 Documentos por revisar"
              />
              <Badge
                variant="status"
                color="amber"
                size="md"
                label={`${activeEvents.length} Eventos próximos a cerrar`}
              />
            </div>
          </GlassPanel>
        </div>

        {/* Two-column layout: Activity Feed + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Recent Activity Feed */}
          <div className="lg:col-span-2">
            <GlassPanel variant="dark" padding="md">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Actividad Reciente
              </h3>
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 py-2.5 border-b border-sage/10 last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {item.description}
                      </p>
                      <p className="text-xs text-sage mt-0.5">{item.actor}</p>
                    </div>
                    <span className="text-xs text-sage whitespace-nowrap">
                      {formatTimestamp(item.timestamp)}
                    </span>
                  </div>
                ))}
              </div>
            </GlassPanel>
          </div>

          {/* Quick Actions */}
          <div>
            <GlassPanel variant="dark" padding="md">
              <h3 className="text-lg font-heading font-semibold text-white mb-4">
                Acciones Rápidas
              </h3>
              <div className="space-y-3">
                <Button variant="primary" size="md" className="w-full">
                  Crear Evento
                </Button>
                <Button variant="primary" size="md" className="w-full">
                  Aprobar Dealer
                </Button>
                <Button variant="primary" size="md" className="w-full">
                  Gestionar Vehículos
                </Button>
                <Button variant="primary" size="md" className="w-full">
                  Revisar Leads
                </Button>
              </div>
            </GlassPanel>
          </div>
        </div>

        {/* Mock Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-r from-amber/40 via-navy/30 to-amber/40">
            <GlassPanel variant="dark" padding="lg" className="h-full">
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-lg font-heading font-semibold text-white mb-2">
                  📊 Analytics — Coming Soon
                </p>
                <p className="text-sm text-sage text-center">
                  Gráficas de ofertas, leads y actividad por evento
                </p>
              </div>
            </GlassPanel>
          </div>
          <div className="relative rounded-2xl overflow-hidden p-[1px] bg-gradient-to-r from-navy/30 via-amber/40 to-navy/30">
            <GlassPanel variant="dark" padding="lg" className="h-full">
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-lg font-heading font-semibold text-white mb-2">
                  📈 Reportes — Coming Soon
                </p>
                <p className="text-sm text-sage text-center">
                  Métricas de conversión y rendimiento de dealers
                </p>
              </div>
            </GlassPanel>
          </div>
        </div>
    </div>
  );
}


