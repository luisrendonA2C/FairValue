'use client';

import { useState, useMemo } from 'react';
import { useMockData } from '@/hooks/useData';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/shared/EmptyState';
import type { OfferStatus } from '@/types';
import type { BadgeColor } from '@/components/ui/Badge';

// ─── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'received', label: 'Received' },
  { value: 'surpassed', label: 'Surpassed' },
  { value: 'in_review', label: 'In Review' },
  { value: 'selected', label: 'Selected' },
  { value: 'not_selected', label: 'Not Selected' },
];

// ─── Audit Log Entry Type ───────────────────────────────────────────────────

interface AuditLogEntry {
  id: string;
  offerId: string;
  prevStatus: OfferStatus | 'none';
  newStatus: OfferStatus;
  timestamp: string;
  actor: string;
}

// ─── Mock Audit Log Data ────────────────────────────────────────────────────

const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'audit-001',
    offerId: 'offer-015',
    prevStatus: 'received',
    newStatus: 'selected',
    timestamp: '2024-11-08T20:30:00Z',
    actor: 'Administrador Fair Value',
  },
  {
    id: 'audit-002',
    offerId: 'offer-018',
    prevStatus: 'received',
    newStatus: 'surpassed',
    timestamp: '2024-11-08T20:25:00Z',
    actor: 'Administrador Fair Value',
  },
  {
    id: 'audit-003',
    offerId: 'offer-016',
    prevStatus: 'received',
    newStatus: 'not_selected',
    timestamp: '2024-11-08T20:20:00Z',
    actor: 'Administrador Fair Value',
  },
  {
    id: 'audit-004',
    offerId: 'offer-017',
    prevStatus: 'received',
    newStatus: 'not_selected',
    timestamp: '2024-11-08T20:20:00Z',
    actor: 'Administrador Fair Value',
  },
  {
    id: 'audit-005',
    offerId: 'offer-019',
    prevStatus: 'received',
    newStatus: 'not_selected',
    timestamp: '2024-11-08T20:15:00Z',
    actor: 'Administrador Fair Value',
  },
  {
    id: 'audit-006',
    offerId: 'offer-020',
    prevStatus: 'received',
    newStatus: 'not_selected',
    timestamp: '2024-11-08T20:15:00Z',
    actor: 'Administrador Fair Value',
  },
  {
    id: 'audit-007',
    offerId: 'offer-001',
    prevStatus: 'none',
    newStatus: 'received',
    timestamp: '2024-12-11T10:15:00Z',
    actor: 'System',
  },
  {
    id: 'audit-008',
    offerId: 'offer-005',
    prevStatus: 'none',
    newStatus: 'received',
    timestamp: '2024-12-11T08:20:00Z',
    actor: 'System',
  },
  {
    id: 'audit-009',
    offerId: 'offer-008',
    prevStatus: 'none',
    newStatus: 'received',
    timestamp: '2024-12-10T12:00:00Z',
    actor: 'System',
  },
  {
    id: 'audit-010',
    offerId: 'offer-004',
    prevStatus: 'none',
    newStatus: 'received',
    timestamp: '2024-12-10T16:45:00Z',
    actor: 'System',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusBadgeColor(status: OfferStatus): BadgeColor {
  switch (status) {
    case 'received':
      return 'navy';
    case 'surpassed':
      return 'sage';
    case 'in_review':
      return 'amber';
    case 'selected':
      return 'emerald';
    case 'not_selected':
      return 'sage';
    default:
      return 'sage';
  }
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminOffersPage() {
  const { offers, events, vehicles, dealers, users, leads } = useMockData();

  // Filter state
  const [filterEvent, setFilterEvent] = useState('');
  const [filterVehicle, setFilterVehicle] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterDealer, setFilterDealer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterAmountMin, setFilterAmountMin] = useState('');
  const [filterAmountMax, setFilterAmountMax] = useState('');
  const [filterScoreMin, setFilterScoreMin] = useState('');
  const [filterScoreMax, setFilterScoreMax] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Lookup maps
  const eventMap = useMemo(
    () => Object.fromEntries(events.map((e) => [e.id, e])),
    [events]
  );
  const vehicleMap = useMemo(
    () => Object.fromEntries(vehicles.map((v) => [v.id, v])),
    [vehicles]
  );
  const dealerMap = useMemo(
    () => Object.fromEntries(dealers.map((d) => [d.id, d])),
    [dealers]
  );
  const userMap = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u])),
    [users]
  );
  const leadMap = useMemo(
    () => Object.fromEntries(leads.map((l) => [l.offerId, l])),
    [leads]
  );

  // Build buyer index map for anonymization (buyer-001 → 1, buyer-002 → 2, etc.)
  const buyerIndexMap = useMemo(() => {
    const buyerIds = users.filter((u) => u.role === 'buyer').map((u) => u.id);
    const map: Record<string, number> = {};
    buyerIds.forEach((id, idx) => {
      map[id] = idx + 1;
    });
    return map;
  }, [users]);

  // Determine if event is "active" (buyer identity hidden during active/scheduled events)
  const isEventActive = (eventId: string): boolean => {
    const event = eventMap[eventId];
    if (!event) return false;
    return event.status === 'active' || event.status === 'scheduled';
  };

  // Get buyer display name (anonymized during active events)
  const getBuyerDisplayName = (buyerId: string, eventId: string): string => {
    if (isEventActive(eventId)) {
      const idx = buyerIndexMap[buyerId] ?? 0;
      return `Buyer #${idx}`;
    }
    const user = userMap[buyerId];
    return user?.name ?? buyerId;
  };

  // Get vehicle display name
  const getVehicleName = (vehicleId: string): string => {
    const vehicle = vehicleMap[vehicleId];
    if (!vehicle) return vehicleId;
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  };

  // Get dealer name from vehicle
  const getDealerName = (vehicleId: string): string => {
    const vehicle = vehicleMap[vehicleId];
    if (!vehicle) return '—';
    const dealer = dealerMap[vehicle.dealerId];
    return dealer?.businessName ?? vehicle.dealerId;
  };

  // Get event name
  const getEventName = (eventId: string): string => {
    const event = eventMap[eventId];
    return event?.name ?? eventId;
  };

  // Get lead score for an offer
  const getLeadScore = (offerId: string): number | null => {
    const lead = leadMap[offerId];
    return lead?.score ?? null;
  };

  // Filter options
  const eventOptions = useMemo(
    () => [
      { value: '', label: 'All Events' },
      ...events.map((e) => ({ value: e.id, label: e.name })),
    ],
    [events]
  );

  const vehicleOptions = useMemo(
    () => [
      { value: '', label: 'All Vehicles' },
      ...vehicles.map((v) => ({
        value: v.id,
        label: `${v.year} ${v.make} ${v.model}`,
      })),
    ],
    [vehicles]
  );

  const buyerOptions = useMemo(
    () => [
      { value: '', label: 'All Buyers' },
      ...users
        .filter((u) => u.role === 'buyer')
        .map((u) => ({ value: u.id, label: u.name })),
    ],
    [users]
  );

  const dealerOptions = useMemo(
    () => [
      { value: '', label: 'All Dealers' },
      ...dealers.map((d) => ({ value: d.id, label: d.businessName })),
    ],
    [dealers]
  );

  // Filtered offers
  const filteredOffers = useMemo(() => {
    let result = [...offers];

    if (filterEvent) {
      result = result.filter((o) => o.eventId === filterEvent);
    }
    if (filterVehicle) {
      result = result.filter((o) => o.vehicleId === filterVehicle);
    }
    if (filterUser) {
      result = result.filter((o) => o.buyerId === filterUser);
    }
    if (filterDealer) {
      result = result.filter((o) => {
        const vehicle = vehicleMap[o.vehicleId];
        return vehicle?.dealerId === filterDealer;
      });
    }
    if (filterStatus) {
      result = result.filter((o) => o.status === filterStatus);
    }
    if (filterAmountMin) {
      const min = Number(filterAmountMin);
      if (!isNaN(min)) {
        result = result.filter((o) => o.amount >= min);
      }
    }
    if (filterAmountMax) {
      const max = Number(filterAmountMax);
      if (!isNaN(max)) {
        result = result.filter((o) => o.amount <= max);
      }
    }
    if (filterScoreMin) {
      const min = Number(filterScoreMin);
      if (!isNaN(min)) {
        result = result.filter((o) => {
          const score = getLeadScore(o.id);
          return score !== null && score >= min;
        });
      }
    }
    if (filterScoreMax) {
      const max = Number(filterScoreMax);
      if (!isNaN(max)) {
        result = result.filter((o) => {
          const score = getLeadScore(o.id);
          return score !== null && score <= max;
        });
      }
    }

    // Sort by submission date descending
    result.sort(
      (a, b) =>
        new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
    );

    return result;
  }, [
    offers,
    filterEvent,
    filterVehicle,
    filterUser,
    filterDealer,
    filterStatus,
    filterAmountMin,
    filterAmountMax,
    filterScoreMin,
    filterScoreMax,
    vehicleMap,
    leadMap,
  ]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOffers.length / PAGE_SIZE));
  const paginatedOffers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOffers.slice(start, start + PAGE_SIZE);
  }, [filteredOffers, currentPage]);

  // Active filter count
  const activeFilterCount = [
    filterEvent,
    filterVehicle,
    filterUser,
    filterDealer,
    filterStatus,
    filterAmountMin,
    filterAmountMax,
    filterScoreMin,
    filterScoreMax,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setFilterEvent('');
    setFilterVehicle('');
    setFilterUser('');
    setFilterDealer('');
    setFilterStatus('');
    setFilterAmountMin('');
    setFilterAmountMax('');
    setFilterScoreMin('');
    setFilterScoreMax('');
    setCurrentPage(1);
  };

  // Sort audit log by timestamp descending (reverse chronological)
  const sortedAuditLog = useMemo(
    () =>
      [...MOCK_AUDIT_LOG].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ),
    []
  );

  return (
    <div className="bg-navy-dark text-white min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            Offers Management
          </h1>
          <p className="text-sage text-sm">
            View all platform offers, filter by criteria, and review the audit trail of status changes.
          </p>
        </div>

        {/* Filters Section */}
        <GlassPanel variant="dark" padding="md" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
            <Select
              label="Event"
              options={eventOptions}
              value={filterEvent}
              onChange={(e) => {
                setFilterEvent(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Select
              label="Vehicle"
              options={vehicleOptions}
              value={filterVehicle}
              onChange={(e) => {
                setFilterVehicle(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Select
              label="Buyer"
              options={buyerOptions}
              value={filterUser}
              onChange={(e) => {
                setFilterUser(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Select
              label="Dealer"
              options={dealerOptions}
              value={filterDealer}
              onChange={(e) => {
                setFilterDealer(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="number"
              label="Min Amount"
              placeholder="e.g. 30000"
              value={filterAmountMin}
              onChange={(e) => {
                setFilterAmountMin(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Input
              type="number"
              label="Max Amount"
              placeholder="e.g. 70000"
              value={filterAmountMax}
              onChange={(e) => {
                setFilterAmountMax(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Input
              type="number"
              label="Min Score"
              placeholder="e.g. 50"
              value={filterScoreMin}
              onChange={(e) => {
                setFilterScoreMin(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Input
              type="number"
              label="Max Score"
              placeholder="e.g. 100"
              value={filterScoreMax}
              onChange={(e) => {
                setFilterScoreMax(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Active filter summary */}
          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <span className="text-xs text-sage">
                {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active
                {' · '}
                Showing {filteredOffers.length} of {offers.length} offers
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs text-amber hover:text-amber-dark transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </GlassPanel>

        {/* Offers Table */}
        <GlassPanel variant="dark" padding="md" className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Offers ({filteredOffers.length})
          </h2>

          {paginatedOffers.length === 0 ? (
            <EmptyState
              title="No offers found"
              message="No offers match the current filter criteria. Try adjusting your filters."
              action={{ label: 'Clear Filters', onClick: clearAllFilters }}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left">
                    <th className="pb-3 pr-4 text-sage font-medium">Buyer</th>
                    <th className="pb-3 pr-4 text-sage font-medium">Vehicle</th>
                    <th className="pb-3 pr-4 text-sage font-medium">Amount</th>
                    <th className="pb-3 pr-4 text-sage font-medium">Date</th>
                    <th className="pb-3 pr-4 text-sage font-medium">Event</th>
                    <th className="pb-3 pr-4 text-sage font-medium">Dealer</th>
                    <th className="pb-3 pr-4 text-sage font-medium">Score</th>
                    <th className="pb-3 text-sage font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOffers.map((offer) => {
                    const score = getLeadScore(offer.id);
                    return (
                      <tr
                        key={offer.id}
                        className="border-b border-white/5 transition-colors hover:bg-white/5"
                      >
                        <td className="py-3 pr-4 text-white font-medium text-xs">
                          {getBuyerDisplayName(offer.buyerId, offer.eventId)}
                        </td>
                        <td className="py-3 pr-4 text-white text-xs">
                          {getVehicleName(offer.vehicleId)}
                        </td>
                        <td className="py-3 pr-4 text-amber font-semibold text-xs">
                          {formatCurrency(offer.amount)}
                        </td>
                        <td className="py-3 pr-4 text-sage text-xs">
                          {formatDate(offer.submissionDate)}
                        </td>
                        <td className="py-3 pr-4 text-sage text-xs">
                          {getEventName(offer.eventId)}
                        </td>
                        <td className="py-3 pr-4 text-sage text-xs">
                          {getDealerName(offer.vehicleId)}
                        </td>
                        <td className="py-3 pr-4">
                          {score !== null ? (
                            <span
                              className={[
                                'text-xs font-semibold',
                                score >= 80
                                  ? 'text-emerald-400'
                                  : score >= 60
                                    ? 'text-amber'
                                    : score >= 40
                                      ? 'text-yellow-400'
                                      : 'text-sage',
                              ].join(' ')}
                            >
                              {score}
                            </span>
                          ) : (
                            <span className="text-sage text-xs">—</span>
                          )}
                        </td>
                        <td className="py-3">
                          <Badge
                            label={formatStatus(offer.status)}
                            color={getStatusBadgeColor(offer.status)}
                            size="sm"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
              <span className="text-xs text-sage">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </GlassPanel>

        {/* Audit Log Section */}
        <GlassPanel variant="dark" padding="md">
          <h2 className="text-lg font-semibold text-white mb-4">
            Audit Log — Offer State Transitions
          </h2>
          <p className="text-sage text-xs mb-4">
            Chronological record of all offer status changes, most recent first.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 pr-4 text-sage font-medium">Offer</th>
                  <th className="pb-3 pr-4 text-sage font-medium">Previous Status</th>
                  <th className="pb-3 pr-4 text-sage font-medium">New Status</th>
                  <th className="pb-3 pr-4 text-sage font-medium">Timestamp</th>
                  <th className="pb-3 text-sage font-medium">Actor</th>
                </tr>
              </thead>
              <tbody>
                {sortedAuditLog.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-white/5 transition-colors hover:bg-white/5"
                  >
                    <td className="py-3 pr-4 text-white text-xs font-mono">
                      {entry.offerId}
                    </td>
                    <td className="py-3 pr-4">
                      {entry.prevStatus === 'none' ? (
                        <span className="text-sage text-xs italic">—</span>
                      ) : (
                        <Badge
                          label={formatStatus(entry.prevStatus)}
                          color={getStatusBadgeColor(entry.prevStatus as OfferStatus)}
                          size="sm"
                        />
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        label={formatStatus(entry.newStatus)}
                        color={getStatusBadgeColor(entry.newStatus)}
                        size="sm"
                      />
                    </td>
                    <td className="py-3 pr-4 text-sage text-xs">
                      {formatDateTime(entry.timestamp)}
                    </td>
                    <td className="py-3 text-white text-xs">
                      {entry.actor}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

