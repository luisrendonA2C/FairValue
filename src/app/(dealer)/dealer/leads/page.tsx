'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/hooks/useData';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeLevelColor } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Lead, LeadLevel, LeadStatus } from '@/types';

// ─── Constants ──────────────────────────────────────────────────────────────

const MAX_UNLOCKS_PER_EVENT = 10;

const levelBadgeColor: Record<LeadLevel, BadgeLevelColor> = {
  Priority: 'priority',
  Hot: 'hot',
  Medium: 'medium',
  Cold: 'cold',
};

const statusLabels: Record<LeadStatus, string> = {
  generated: 'Generado',
  released: 'Liberado',
  selected: 'Seleccionado',
  contacted: 'Contactado',
  appointment_scheduled: 'Cita Agendada',
  not_interested: 'No Interesado',
  closed_externally: 'Cerrado Externamente',
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function generateCSV(dealerLeads: Lead[]): string {
  const headers = 'Lead ID,Score,Level,Offer Amount,Status\n';
  const rows = dealerLeads
    .map(
      (lead) =>
        `${lead.id},${lead.score},${lead.level},${lead.offerAmount},${lead.status}`
    )
    .join('\n');
  return headers + rows;
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function DealerLeadsPage() {
  const { user } = useAuth();
  const { leads, events, dealers, users, unlockLead, updateLeadStatus } =
    useMockData();

  const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({});

  // Find the dealer entity for the current user
  const currentDealer = useMemo(
    () => dealers.find((d) => d.userId === user?.id),
    [dealers, user]
  );

  const dealerId = currentDealer?.id ?? '';

  // Filter leads by dealerId
  const dealerLeads = useMemo(
    () => leads.filter((lead) => lead.dealerId === dealerId),
    [leads, dealerId]
  );

  // Sort by score descending, offerAmount desc as tiebreaker
  const sortedLeads = useMemo(
    () =>
      [...dealerLeads].sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return b.offerAmount - a.offerAmount;
      }),
    [dealerLeads]
  );

  // Determine if any event related to these leads is still active
  const hasActiveEvent = useMemo(() => {
    const eventIds = new Set(dealerLeads.map((l) => l.eventId));
    return events.some((e) => eventIds.has(e.id) && e.status === 'active');
  }, [dealerLeads, events]);

  // Count unlocks for each event (from existing data + local unlocks)
  const unlockCountByEvent = useMemo(() => {
    const counts: Record<string, number> = {};
    dealerLeads.forEach((lead) => {
      if (lead.isUnlocked || unlockedMap[lead.id]) {
        counts[lead.eventId] = (counts[lead.eventId] ?? 0) + 1;
      }
    });
    return counts;
  }, [dealerLeads, unlockedMap]);

  // ─── Handlers ───────────────────────────────────────────────────────────

  function handleUnlock(lead: Lead) {
    const eventUnlocks = unlockCountByEvent[lead.eventId] ?? 0;
    if (eventUnlocks >= MAX_UNLOCKS_PER_EVENT) return;
    unlockLead(lead.id);
    setUnlockedMap((prev) => ({ ...prev, [lead.id]: true }));
  }

  function handleSelect(leadId: string) {
    updateLeadStatus(leadId, 'selected');
  }

  function handleStatusChange(leadId: string, status: LeadStatus) {
    updateLeadStatus(leadId, status);
  }

  function handleExportCSV() {
    const csv = generateCSV(sortedLeads);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${dealerId}-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // ─── Buyer Info Lookup ──────────────────────────────────────────────────

  function getBuyerInfo(buyerId: string) {
    return users.find((u) => u.id === buyerId);
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">
              Mis Leads
            </h1>
            <p className="text-sage text-sm mt-1">
              Gestiona los leads generados por tus vehículos en eventos
            </p>
          </div>
          {sortedLeads.length > 0 && !hasActiveEvent && (
            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              Exportar Leads
            </Button>
          )}
        </div>

        {/* Locked State - Active Event */}
        {hasActiveEvent && (
          <GlassPanel variant="dark" padding="lg">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <svg
                className="w-16 h-16 text-amber/60 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <h2 className="text-xl font-semibold text-white mb-2">
                Evento en Curso
              </h2>
              <p className="text-sage text-sm max-w-md">
                Los leads estarán disponibles después del cierre del evento
              </p>
            </div>
          </GlassPanel>
        )}

        {/* Empty State */}
        {!hasActiveEvent && sortedLeads.length === 0 && (
          <GlassPanel variant="dark" padding="lg">
            <EmptyState
              title="Sin leads disponibles"
              message="Aún no se han generado leads para tus vehículos. Los leads aparecerán aquí después del cierre de un evento."
              icon={
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
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                  />
                </svg>
              }
            />
          </GlassPanel>
        )}

        {/* Leads Table */}
        {!hasActiveEvent && sortedLeads.length > 0 && (
          <GlassPanel variant="dark" padding="none">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-4 py-3 text-xs font-semibold text-sage uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-sage uppercase tracking-wider">
                      Lead Score
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-sage uppercase tracking-wider">
                      Nivel
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-sage uppercase tracking-wider">
                      Oferta
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-sage uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-sage uppercase tracking-wider">
                      Buyer Info
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold text-sage uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLeads.map((lead) => {
                    const isUnlocked = lead.isUnlocked || unlockedMap[lead.id];
                    const buyer = isUnlocked
                      ? getBuyerInfo(lead.buyerId)
                      : null;
                    const eventUnlocks =
                      unlockCountByEvent[lead.eventId] ?? 0;
                    const canUnlock = eventUnlocks < MAX_UNLOCKS_PER_EVENT;

                    return (
                      <tr
                        key={lead.id}
                        className="border-b border-white/5 transition-colors duration-150 hover:bg-white/5"
                      >
                        {/* Lead ID */}
                        <td className="px-4 py-3">
                          <span className="text-xs font-mono text-sage">
                            {lead.id}
                          </span>
                        </td>

                        {/* Score */}
                        <td className="px-4 py-3">
                          <div className="w-28">
                            <ProgressBar
                              value={lead.score}
                              variant="scored"
                            />
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
                          <span className="text-sm font-semibold text-white">
                            {formatUSD(lead.offerAmount)}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span className="text-xs text-sage">
                            {statusLabels[lead.status]}
                          </span>
                        </td>

                        {/* Buyer Info (unlocked) */}
                        <td className="px-4 py-3">
                          {isUnlocked && buyer ? (
                            <div className="space-y-0.5">
                              <p className="text-xs font-medium text-white">
                                {buyer.name}
                              </p>
                              <p className="text-xs text-sage">
                                {buyer.phone}
                              </p>
                              <p className="text-xs text-sage">
                                {buyer.email}
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-sage/50 italic">
                              Bloqueado
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            {!isUnlocked && (
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={!canUnlock}
                                onClick={() => handleUnlock(lead)}
                              >
                                Desbloquear
                              </Button>
                            )}
                            {isUnlocked && lead.status !== 'selected' && (
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleSelect(lead.id)}
                              >
                                Seleccionar
                              </Button>
                            )}
                            {isUnlocked && (
                              <StatusDropdown
                                currentStatus={lead.status}
                                onStatusChange={(status) =>
                                  handleStatusChange(lead.id, status)
                                }
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </GlassPanel>
        )}
      </div>
    </GradientBackground>
  );
}

// ─── Status Dropdown Sub-component ──────────────────────────────────────────

function StatusDropdown({
  currentStatus,
  onStatusChange,
}: {
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
}) {
  const [open, setOpen] = useState(false);

  const transitions: LeadStatus[] = [
    'selected',
    'contacted',
    'appointment_scheduled',
    'not_interested',
    'closed_externally',
  ];

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="text-sage text-xs"
      >
        Cambiar estado ▾
      </Button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-navy-dark border border-white/10 rounded-lg shadow-xl py-1 min-w-[180px]">
          {transitions
            .filter((s) => s !== currentStatus)
            .map((status) => (
              <button
                key={status}
                onClick={() => {
                  onStatusChange(status);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-white hover:bg-white/10 transition-colors"
              >
                {statusLabels[status]}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
