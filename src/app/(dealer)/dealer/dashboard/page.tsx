'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/hooks/useData';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { StatCard } from '@/components/ui/StatCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Car, FileText, Target, CheckCircle, TrendingUp, Plus, Upload } from 'lucide-react';
import { ProgressBar } from '@/components/ui/ProgressBar';
import type { Vehicle, Lead, Offer, Event } from '@/types';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStatusBadgeColor(status: Vehicle['status']) {
  switch (status) {
    case 'active':
      return 'emerald' as const;
    case 'assigned_to_event':
      return 'amber' as const;
    case 'pending_approval':
      return 'sage' as const;
    case 'closed':
      return 'navy' as const;
    case 'rejected':
      return 'navy' as const;
    default:
      return 'sage' as const;
  }
}

function getLeadLevelColor(level: Lead['level']) {
  switch (level) {
    case 'Priority':
      return 'priority' as const;
    case 'Hot':
      return 'hot' as const;
    case 'Medium':
      return 'medium' as const;
    case 'Cold':
      return 'cold' as const;
    default:
      return 'medium' as const;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('es-CR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function DealerDashboardPage() {
  const { user } = useAuth();
  const { vehicles, offers, leads, events } = useMockData();

  // Find dealer record linked to the current user
  const dealerId = user?.id === 'dealer-user-001'
    ? 'dealer-001'
    : user?.id === 'dealer-user-002'
      ? 'dealer-002'
      : user?.id === 'dealer-user-003'
        ? 'dealer-003'
        : 'dealer-001'; // fallback for demo

  // Filter data for this dealer
  const dealerVehicles = vehicles.filter((v: Vehicle) => v.dealerId === dealerId);
  const dealerOffers = offers.filter((o: Offer) =>
    dealerVehicles.some((v: Vehicle) => v.id === o.vehicleId)
  );
  const dealerLeads = leads.filter((l: Lead) => l.dealerId === dealerId);
  const dealerEvents = events.filter((e: Event) =>
    e.vehicleIds.some((vid: string) => dealerVehicles.some((v: Vehicle) => v.id === vid))
  );

  // ─── KPI Calculations ──────────────────────────────────────────────
  const activeVehicles = dealerVehicles.filter(
    (v) => v.status === 'active' || v.status === 'assigned_to_event'
  ).length;
  const totalOffers = dealerOffers.length;
  const leadsGenerated = dealerLeads.length;
  const leadsSelected = dealerLeads.filter(
    (l) => l.status === 'selected' || l.status === 'contacted'
  ).length;
  const conversionRate = leadsGenerated > 0
    ? Math.round((leadsSelected / leadsGenerated) * 100)
    : 0;

  // ─── Vehicle Table (up to 10) ─────────────────────────────────────
  const vehicleTableData = dealerVehicles.slice(0, 10).map((v) => {
    const vOffers = dealerOffers.filter((o) => o.vehicleId === v.id);
    const assignedEvent = dealerEvents.find((e) => e.vehicleIds.includes(v.id));
    return { ...v, offerCount: vOffers.length, eventName: assignedEvent?.name ?? '—' };
  });

  // ─── Top 5 Leads by Score ─────────────────────────────────────────
  const topLeads = [...dealerLeads]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // ─── Recent Activity (5 most recent events with offers) ───────────
  const recentActivity = [...dealerOffers]
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
    .slice(0, 5)
    .map((o) => {
      const vehicle = dealerVehicles.find((v) => v.id === o.vehicleId);
      return {
        id: o.id,
        description: `New offer on ${vehicle?.year ?? ''} ${vehicle?.make ?? ''} ${vehicle?.model ?? ''}`,
        amount: o.amount,
        timestamp: o.submissionDate,
      };
    });

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-white">
            Dealer Dashboard
          </h1>
          <p className="text-sage mt-1">
            Welcome back, {user?.name ?? 'Dealer'}
          </p>
        </div>

        {/* Copart-inspired layout: sidebar stats + main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ─── Sidebar Stats ─────────────────────────────────────── */}
          <div className="lg:col-span-1 space-y-4">
            <StatCard
              value={activeVehicles}
              label="Active Vehicles"
              icon={<span>🚗</span>}
              trend="up"
              trendValue="+2 this month"
            />
            <StatCard
              value={totalOffers}
              label="Total Offers"
              icon={<span>📋</span>}
              trend="up"
              trendValue={`${totalOffers} received`}
            />
            <StatCard
              value={leadsGenerated}
              label="Leads Generated"
              icon={<span>🎯</span>}
              trend="neutral"
              trendValue="From all events"
            />
            <StatCard
              value={leadsSelected}
              label="Leads Selected"
              icon={<span>✅</span>}
              trend="up"
              trendValue="Contacted & selected"
            />
            <StatCard
              value={`${conversionRate}%`}
              label="Conversion Rate"
              icon={<span>📈</span>}
              trend={conversionRate >= 30 ? 'up' : conversionRate >= 15 ? 'neutral' : 'down'}
              trendValue="Lead → Contact"
            />
          </div>

          {/* ─── Main Content ──────────────────────────────────────── */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" icon={<span>➕</span>}>
                Add Vehicle
              </Button>
              <Button variant="outline" size="sm" icon={<span>🎯</span>}>
                View Leads
              </Button>
              <Button variant="outline" size="sm" icon={<span>📋</span>}>
                View Offers
              </Button>
              <Button variant="outline" size="sm" icon={<span>📄</span>}>
                Upload Documents
              </Button>
            </div>

            {/* Vehicle Table */}
            <GlassPanel variant="dark" padding="none">
              <div className="p-4 border-b border-white/10">
                <h2 className="text-lg font-semibold text-white">My Vehicles</h2>
                <p className="text-sm text-sage">Up to 10 vehicles with status and event info</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-navy/20">
                      <th className="px-4 py-3 text-left font-semibold text-sage-dark">Vehicle</th>
                      <th className="px-4 py-3 text-left font-semibold text-sage-dark">Year</th>
                      <th className="px-4 py-3 text-left font-semibold text-sage-dark">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-sage-dark">Offers</th>
                      <th className="px-4 py-3 text-left font-semibold text-sage-dark">Event</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleTableData.map((v, idx) => (
                      <tr
                        key={v.id}
                        className={[
                          'transition-all duration-150',
                          'hover:bg-amber/5',
                          idx % 2 === 0 ? 'bg-transparent' : 'bg-white/[0.03]',
                        ].join(' ')}
                      >
                        <td className="px-4 py-3 text-white font-medium">
                          {v.make} {v.model}
                        </td>
                        <td className="px-4 py-3 text-sage">{v.year}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="status"
                            color={getStatusBadgeColor(v.status)}
                            label={v.status.replace(/_/g, ' ')}
                          />
                        </td>
                        <td className="px-4 py-3 text-amber font-semibold">
                          {v.offerCount}
                        </td>
                        <td className="px-4 py-3 text-sage text-xs">
                          {v.eventName}
                        </td>
                      </tr>
                    ))}
                    {vehicleTableData.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sage">
                          No vehicles found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </GlassPanel>

            {/* Two-column: Chart Placeholder + Recent Leads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart Placeholder */}
              <GlassPanel variant="light" padding="lg" className="flex flex-col items-center justify-center min-h-[240px]">
                <div className="animate-pulse mb-4">
                  <svg
                    className="w-16 h-16 text-amber/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  Offers Analytics
                </h3>
                <p className="text-sm text-sage mt-1">Coming Soon</p>
              </GlassPanel>

              {/* Recent Leads Ranking */}
              <GlassPanel variant="dark" padding="md">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Top Leads by Score
                </h3>
                <div className="space-y-3">
                  {topLeads.map((lead, idx) => (
                    <div
                      key={lead.id}
                      className={[
                        'flex items-center justify-between p-3 rounded-xl',
                        'bg-white/[0.04] hover:bg-white/[0.08] transition-colors',
                      ].join(' ')}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-amber w-5">
                          #{idx + 1}
                        </span>
                        <div>
                          <Badge
                            variant="level"
                            color={getLeadLevelColor(lead.level)}
                            label={lead.level}
                            size="sm"
                          />
                          <div className="mt-1">
                            <ProgressBar
                              value={lead.score}
                              max={100}
                              variant="scored"
                              className="w-24"
                            />
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(lead.offerAmount)}
                      </span>
                    </div>
                  ))}
                  {topLeads.length === 0 && (
                    <p className="text-sm text-sage text-center py-4">
                      No leads yet
                    </p>
                  )}
                </div>
              </GlassPanel>
            </div>

            {/* Recent Activity */}
            <GlassPanel variant="navy" padding="md">
              <h3 className="text-lg font-semibold text-white mb-4">
                Recent Activity
              </h3>
              <div className="space-y-2">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="text-sm text-white">{activity.description}</p>
                      <p className="text-xs text-sage mt-0.5">
                        {formatTimestamp(activity.timestamp)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-amber">
                      {formatCurrency(activity.amount)}
                    </span>
                  </div>
                ))}
                {recentActivity.length === 0 && (
                  <p className="text-sm text-sage text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </GlassPanel>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}

