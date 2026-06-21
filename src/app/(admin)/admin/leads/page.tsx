'use client';

import { useState, useMemo, useCallback } from 'react';
import { useMockData } from '@/hooks/useData';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { LeadLevel, LeadStatus } from '@/types';

const ITEMS_PER_PAGE = 10;

const levelBadgeColor: Record<LeadLevel, 'priority' | 'hot' | 'medium' | 'cold'> = {
  Priority: 'priority',
  Hot: 'hot',
  Medium: 'medium',
  Cold: 'cold',
};

const statusBadgeColor: Record<LeadStatus, 'amber' | 'emerald' | 'sage' | 'navy' | 'white'> = {
  generated: 'sage',
  released: 'emerald',
  selected: 'amber',
  contacted: 'navy',
  appointment_scheduled: 'emerald',
  not_interested: 'sage',
  closed_externally: 'navy',
};

const statusLabels: Record<LeadStatus, string> = {
  generated: 'Generated',
  released: 'Released',
  selected: 'Selected',
  contacted: 'Contacted',
  appointment_scheduled: 'Appointment',
  not_interested: 'Not Interested',
  closed_externally: 'Closed',
};

export default function AdminLeadsPage() {
  const { leads, users, vehicles, events, dealers, unlockLead, updateLeadStatus } = useMockData();

  // Filters
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterDealer, setFilterDealer] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterScoreMin, setFilterScoreMin] = useState<string>('');
  const [filterScoreMax, setFilterScoreMax] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [releaseModalOpen, setReleaseModalOpen] = useState(false);
  const [releaseEventId, setReleaseEventId] = useState<string | null>(null);
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generateEventId, setGenerateEventId] = useState<string | null>(null);
  const [confirmRegenerateOpen, setConfirmRegenerateOpen] = useState(false);

  // Notification
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  // Helper lookups
  const getBuyerName = useCallback((buyerId: string) => {
    const user = users.find((u) => u.id === buyerId);
    return user?.name ?? 'Unknown Buyer';
  }, [users]);

  const getVehicleName = useCallback((vehicleId: string) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    return vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Unknown Vehicle';
  }, [vehicles]);

  const getDealerName = useCallback((dealerId: string) => {
    const dealer = dealers.find((d) => d.id === dealerId);
    return dealer?.businessName ?? 'Unknown Dealer';
  }, [dealers]);

  const getEventName = useCallback((eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    return event?.name ?? 'Unknown Event';
  }, [events]);

  // Filtered and sorted leads
  const filteredLeads = useMemo(() => {
    let result = [...leads];

    if (filterEvent !== 'all') {
      result = result.filter((l) => l.eventId === filterEvent);
    }
    if (filterDealer !== 'all') {
      result = result.filter((l) => l.dealerId === filterDealer);
    }
    if (filterLevel !== 'all') {
      result = result.filter((l) => l.level === filterLevel);
    }
    if (filterStatus !== 'all') {
      result = result.filter((l) => l.status === filterStatus);
    }
    if (filterScoreMin !== '') {
      const min = parseInt(filterScoreMin, 10);
      if (!isNaN(min)) result = result.filter((l) => l.score >= min);
    }
    if (filterScoreMax !== '') {
      const max = parseInt(filterScoreMax, 10);
      if (!isNaN(max)) result = result.filter((l) => l.score <= max);
    }

    // Sort by score descending
    result.sort((a, b) => b.score - a.score);

    return result;
  }, [leads, filterEvent, filterDealer, filterLevel, filterStatus, filterScoreMin, filterScoreMax]);

  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLeads.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLeads, currentPage]);

  // Reset page when filters change
  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Release leads action
  const handleReleaseLeads = () => {
    if (!releaseEventId) return;
    const eventLeads = leads.filter(
      (l) => l.eventId === releaseEventId && l.releaseStatus === 'unreleased'
    );
    // Update each lead's status
    eventLeads.forEach((lead) => {
      updateLeadStatus(lead.id, 'released');
    });
    showNotification(`${eventLeads.length} leads released successfully for "${getEventName(releaseEventId)}"`);
    setReleaseModalOpen(false);
    setReleaseEventId(null);
  };

  // Generate leads action
  const handleGenerateLeads = () => {
    if (!generateEventId) return;
    // Check if leads already exist for this event
    const existingLeads = leads.filter((l) => l.eventId === generateEventId);
    if (existingLeads.length > 0 && !confirmRegenerateOpen) {
      setConfirmRegenerateOpen(true);
      return;
    }
    // Simulate generating leads
    showNotification(`Leads generated successfully for "${getEventName(generateEventId)}". Scoring complete.`);
    setGenerateModalOpen(false);
    setGenerateEventId(null);
    setConfirmRegenerateOpen(false);
  };

  const handleConfirmRegenerate = () => {
    if (!generateEventId) return;
    showNotification(`Leads regenerated for "${getEventName(generateEventId)}". Previous leads updated.`);
    setGenerateModalOpen(false);
    setGenerateEventId(null);
    setConfirmRegenerateOpen(false);
  };

  // Action handlers
  const handleUnlock = (leadId: string) => {
    unlockLead(leadId);
    showNotification('Lead unlocked — buyer information revealed');
  };

  const handleChat = (leadId: string) => {
    showNotification('Opening chat thread...');
  };

  const handleExport = (leadId: string) => {
    showNotification('Lead data exported to CSV');
  };

  // Filter options
  const eventOptions = [
    { value: 'all', label: 'All Events' },
    ...events.map((e) => ({ value: e.id, label: e.name })),
  ];

  const dealerOptions = [
    { value: 'all', label: 'All Dealers' },
    ...dealers.map((d) => ({ value: d.id, label: d.businessName })),
  ];

  const levelOptions = [
    { value: 'all', label: 'All Levels' },
    { value: 'Priority', label: 'Priority' },
    { value: 'Hot', label: 'Hot' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Cold', label: 'Cold' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'generated', label: 'Generated' },
    { value: 'released', label: 'Released' },
    { value: 'selected', label: 'Selected' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'appointment_scheduled', label: 'Appointment' },
    { value: 'not_interested', label: 'Not Interested' },
    { value: 'closed_externally', label: 'Closed' },
  ];

  return (
    <div className="bg-navy-dark text-white min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">
              Lead Management
            </h1>
            <p className="text-sage/80 mt-1">
              Score, generate, and release leads to dealers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setGenerateModalOpen(true)}
            >
              Generate Leads
            </Button>
            <Button
              variant="primary"
              onClick={() => setReleaseModalOpen(true)}
            >
              Release Leads
            </Button>
          </div>
        </div>

        {/* Success Notification */}
        {notification && (
          <div className="mb-4 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm animate-fade-in">
            {notification}
          </div>
        )}

        {/* Filters */}
        <GlassPanel variant="dark" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Select
              label="Event"
              options={eventOptions}
              value={filterEvent}
              onChange={(e) => { setFilterEvent(e.target.value); handleFilterChange(); }}
            />
            <Select
              label="Dealer"
              options={dealerOptions}
              value={filterDealer}
              onChange={(e) => { setFilterDealer(e.target.value); handleFilterChange(); }}
            />
            <Select
              label="Level"
              options={levelOptions}
              value={filterLevel}
              onChange={(e) => { setFilterLevel(e.target.value); handleFilterChange(); }}
            />
            <Select
              label="Status"
              options={statusOptions}
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); handleFilterChange(); }}
            />
            <Input
              label="Min Score"
              type="number"
              value={filterScoreMin}
              onChange={(e) => { setFilterScoreMin(e.target.value); handleFilterChange(); }}
              placeholder="0"
            />
            <Input
              label="Max Score"
              type="number"
              value={filterScoreMax}
              onChange={(e) => { setFilterScoreMax(e.target.value); handleFilterChange(); }}
              placeholder="100"
            />
          </div>
        </GlassPanel>

        {/* Leads Table */}
        <GlassPanel variant="dark" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Buyer
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="text-left px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Dealer
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="text-right px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Offer
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Release
                  </th>
                  <th className="text-right px-4 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-sage/60 text-sm">
                      No leads found matching current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-white/5 transition-colors duration-150"
                    >
                      <td className="px-4 py-4 text-sm font-medium text-white">
                        {getBuyerName(lead.buyerId)}
                      </td>
                      <td className="px-4 py-4 text-sm text-sage/80 max-w-[160px] truncate">
                        {getVehicleName(lead.vehicleId)}
                      </td>
                      <td className="px-4 py-4 text-sm text-sage/80">
                        {getDealerName(lead.dealerId)}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm font-bold text-white">
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge
                          variant="level"
                          color={levelBadgeColor[lead.level]}
                          label={lead.level}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-white text-right font-medium">
                        ${lead.offerAmount.toLocaleString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge
                          variant="status"
                          color={statusBadgeColor[lead.status]}
                          label={statusLabels[lead.status]}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-4 text-center">
                        <Badge
                          variant="status"
                          color={lead.releaseStatus === 'released' ? 'emerald' : 'sage'}
                          label={lead.releaseStatus === 'released' ? 'Released' : 'Unreleased'}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!lead.isUnlocked && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-amber hover:bg-amber/10"
                              onClick={() => handleUnlock(lead.id)}
                            >
                              Unlock
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/70 hover:bg-white/10"
                            onClick={() => handleChat(lead.id)}
                          >
                            Chat
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/70 hover:bg-white/10"
                            onClick={() => handleExport(lead.id)}
                          >
                            Export
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <p className="text-sm text-sage/70">
                Page {currentPage} of {totalPages} ({filteredLeads.length} leads)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </GlassPanel>

        {/* Release Leads Modal */}
        <Modal
          open={releaseModalOpen}
          onClose={() => {
            setReleaseModalOpen(false);
            setReleaseEventId(null);
          }}
          title="Release Leads"
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReleaseModalOpen(false);
                  setReleaseEventId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                disabled={!releaseEventId}
                onClick={handleReleaseLeads}
              >
                Release All Leads
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-white-dark/80">
              Select an event to release all unreleased leads to their respective dealers.
            </p>
            <Select
              label="Event"
              options={[
                { value: '', label: 'Select an event...' },
                ...events.map((e) => ({ value: e.id, label: e.name })),
              ]}
              value={releaseEventId ?? ''}
              onChange={(e) => setReleaseEventId(e.target.value || null)}
            />
            {releaseEventId && (
              <p className="text-xs text-sage">
                {leads.filter((l) => l.eventId === releaseEventId && l.releaseStatus === 'unreleased').length} unreleased leads will be released.
              </p>
            )}
          </div>
        </Modal>

        {/* Generate Leads Modal */}
        <Modal
          open={generateModalOpen}
          onClose={() => {
            setGenerateModalOpen(false);
            setGenerateEventId(null);
            setConfirmRegenerateOpen(false);
          }}
          title={confirmRegenerateOpen ? 'Warning: Regenerate Leads' : 'Generate Leads'}
          variant={confirmRegenerateOpen ? 'confirmation' : 'default'}
          actions={
            confirmRegenerateOpen ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setConfirmRegenerateOpen(false);
                    setGenerateModalOpen(false);
                    setGenerateEventId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-amber hover:bg-amber-dark"
                  onClick={handleConfirmRegenerate}
                >
                  Regenerate Anyway
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setGenerateModalOpen(false);
                    setGenerateEventId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  disabled={!generateEventId}
                  onClick={handleGenerateLeads}
                >
                  Generate
                </Button>
              </>
            )
          }
        >
          {confirmRegenerateOpen ? (
            <div className="space-y-3">
              <p className="text-sm text-white-dark/80">
                <svg className="w-4 h-4 text-amber inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                Leads already exist for this event. Regenerating will recalculate scores and may overwrite existing lead data.
              </p>
              <p className="text-xs text-sage">
                {leads.filter((l) => l.eventId === generateEventId).length} existing leads will be affected.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-white-dark/80">
                Select an event to run lead scoring (calculateLeadScore) and generate lead entries with status &quot;generated&quot;.
              </p>
              <Select
                label="Event"
                options={[
                  { value: '', label: 'Select an event...' },
                  ...events.map((e) => ({ value: e.id, label: e.name })),
                ]}
                value={generateEventId ?? ''}
                onChange={(e) => setGenerateEventId(e.target.value || null)}
              />
              {generateEventId && leads.filter((l) => l.eventId === generateEventId).length > 0 && (
                <p className="text-xs text-amber">
                  <svg className="w-3.5 h-3.5 text-amber inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                  {leads.filter((l) => l.eventId === generateEventId).length} leads already exist for this event.
                </p>
              )}
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}

