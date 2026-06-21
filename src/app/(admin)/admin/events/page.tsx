'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useMockData } from '@/hooks/useData';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { generateLeadsForEvent } from '@/lib/generateLeads';
import { DEFAULT_WEIGHTS } from '@/lib/leadScoring';
import type { Event, EventStatus, Lead } from '@/types';
import type { ScoringWeights } from '@/types/scoring';

// ─── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;
const MAX_VEHICLES = 50;
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

const STATUS_ORDER: EventStatus[] = ['scheduled', 'active', 'closed', 'in_review', 'finished'];

function getNextStatus(current: EventStatus): EventStatus | null {
  const idx = STATUS_ORDER.indexOf(current);
  if (idx < 0 || idx >= STATUS_ORDER.length - 1) return null;
  return STATUS_ORDER[idx + 1];
}

function getStatusBadgeColor(status: EventStatus): 'amber' | 'emerald' | 'navy' | 'sage' {
  switch (status) {
    case 'scheduled': return 'navy';
    case 'active': return 'emerald';
    case 'closed': return 'amber';
    case 'in_review': return 'sage';
    case 'finished': return 'sage';
    default: return 'sage';
  }
}

function getStatusLabel(status: EventStatus): string {
  switch (status) {
    case 'scheduled': return 'Programado';
    case 'active': return 'Activo';
    case 'closed': return 'Cerrado';
    case 'in_review': return 'En Revisión';
    case 'finished': return 'Finalizado';
    default: return status;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CR', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

interface FormErrors {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  vehicles?: string;
}

interface EventFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  vehicleIds: string[];
}

const emptyForm: EventFormData = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  vehicleIds: [],
};

// ─── Close Summary Types ────────────────────────────────────────────────────

interface CloseSummary {
  offersScored: number;
  leadsGenerated: number;
  topScore: number;
  topLevel: string;
  generatedLeads: Lead[];
}

interface FinishSummary {
  vehiclePrices: { vehicleId: string; make: string; model: string; closingPrice: number }[];
  totalLeadsFinalized: number;
}

// ─── Admin Events Page ──────────────────────────────────────────────────────

export default function AdminEventsPage() {
  const { events, vehicles, offers, users, addLeads, updateEventStatus } = useMockData();

  // Load scoring weights from localStorage (synced with Admin Settings)
  const [scoringWeights, setScoringWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('fairvalue_scoring_weights');
      if (stored) {
        const parsed = JSON.parse(stored) as ScoringWeights;
        if (
          parsed.offerAmount + parsed.verification + parsed.profileCompleteness + parsed.timing === 100
        ) {
          setScoringWeights(parsed);
        }
      }
    } catch {
      // Use defaults if localStorage is unavailable or corrupt
    }
  }, []);

  // State
  const [page, setPage] = useState(1);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [vehicleModalEvent, setVehicleModalEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>(emptyForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [localEvents, setLocalEvents] = useState<Event[]>([]);
  const [closeSummary, setCloseSummary] = useState<CloseSummary | null>(null);
  const [closingEventId, setClosingEventId] = useState<string | null>(null);
  const [finishSummary, setFinishSummary] = useState<FinishSummary | null>(null);
  const [finishingEventId, setFinishingEventId] = useState<string | null>(null);

  // Merge context events with locally created events
  const allEvents = useMemo(() => {
    const merged = [...events, ...localEvents];
    return merged.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [events, localEvents]);

  // Pagination
  const totalPages = Math.ceil(allEvents.length / PAGE_SIZE);
  const paginatedEvents = allEvents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Available vehicles for association (not already assigned to another event)
  const availableVehicles = useMemo(() => {
    return vehicles.filter(
      (v) => v.status === 'active' || v.status === 'pending_approval' || !v.eventId
    );
  }, [vehicles]);

  // ─── Validation ─────────────────────────────────────────────────────────────

  function validateForm(data: EventFormData): FormErrors {
    const errors: FormErrors = {};
    if (!data.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    } else if (data.name.length > MAX_NAME_LENGTH) {
      errors.name = `Máximo ${MAX_NAME_LENGTH} caracteres`;
    }
    if (data.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.description = `Máximo ${MAX_DESCRIPTION_LENGTH} caracteres`;
    }
    if (!data.startDate) {
      errors.startDate = 'La fecha de inicio es obligatoria';
    } else {
      const start = new Date(data.startDate);
      const now = new Date();
      if (start < now && !editingEvent) {
        errors.startDate = 'La fecha de inicio no puede ser en el pasado';
      }
    }
    if (!data.endDate) {
      errors.endDate = 'La fecha de fin es obligatoria';
    } else if (data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
      errors.endDate = 'La fecha de fin debe ser posterior a la de inicio';
    }
    if (data.vehicleIds.length > MAX_VEHICLES) {
      errors.vehicles = `Máximo ${MAX_VEHICLES} vehículos`;
    }
    return errors;
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────

  function handleCreateEvent() {
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newEvent: Event = {
      id: `event-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      status: 'scheduled',
      vehicleIds: formData.vehicleIds,
      offerCount: 0,
    };
    setLocalEvents((prev) => [...prev, newEvent]);
    setFormData(emptyForm);
    setFormErrors({});
    setShowCreateForm(false);
  }

  function handleEditEvent() {
    if (!editingEvent) return;
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Update in local events or context events
    setLocalEvents((prev) =>
      prev.map((ev) =>
        ev.id === editingEvent.id
          ? {
              ...ev,
              name: formData.name.trim(),
              description: formData.description.trim(),
              startDate: new Date(formData.startDate).toISOString(),
              endDate: new Date(formData.endDate).toISOString(),
            }
          : ev
      )
    );
    setEditingEvent(null);
    setFormData(emptyForm);
    setFormErrors({});
  }

  function openEditForm(event: Event) {
    setEditingEvent(event);
    setFormData({
      name: event.name,
      description: event.description,
      startDate: event.startDate.slice(0, 16),
      endDate: event.endDate.slice(0, 16),
      vehicleIds: event.vehicleIds,
    });
    setFormErrors({});
  }

  function handleStatusTransition(event: Event) {
    const next = getNextStatus(event.status);
    if (!next) return;

    if (next === 'closed') {
      // Run generateLeadsForEvent with real buyer profiles and scoring weights
      const eventOffers = offers.filter((o) => o.eventId === event.id);
      const generatedLeads = generateLeadsForEvent(
        event,
        eventOffers,
        vehicles,
        users,
        scoringWeights
      );

      const topLead = generatedLeads[0]; // Already sorted by score desc
      const topScore = topLead?.score ?? 0;
      const topLevel = topLead?.level ?? 'Cold';

      setCloseSummary({
        offersScored: eventOffers.length,
        leadsGenerated: generatedLeads.length,
        topScore,
        topLevel,
        generatedLeads,
      });
      setClosingEventId(event.id);
      return;
    }

    if (next === 'finished') {
      // Show closing prices and finalize
      const eventVehicleIds = event.vehicleIds;
      const vehiclePrices = eventVehicleIds.map((vid) => {
        const vehicle = vehicles.find((v) => v.id === vid);
        const vehicleOffers = offers
          .filter((o) => o.vehicleId === vid && o.eventId === event.id)
          .sort((a, b) => b.amount - a.amount);
        return {
          vehicleId: vid,
          make: vehicle?.make ?? 'N/A',
          model: vehicle?.model ?? 'N/A',
          closingPrice: vehicleOffers[0]?.amount ?? 0,
        };
      });

      const eventOffers = offers.filter((o) => o.eventId === event.id);
      setFinishSummary({
        vehiclePrices,
        totalLeadsFinalized: Math.min(eventOffers.length, 5),
      });
      setFinishingEventId(event.id);
      return;
    }

    // Direct transitions for active → (other) and in_review → finished
    updateEventStatus(event.id, next);
    setLocalEvents((prev) =>
      prev.map((ev) => (ev.id === event.id ? { ...ev, status: next } : ev))
    );
  }

  function confirmClose() {
    if (!closingEventId || !closeSummary) return;
    // Add generated leads to the data context
    addLeads(closeSummary.generatedLeads);
    updateEventStatus(closingEventId, 'closed');
    setLocalEvents((prev) =>
      prev.map((ev) => (ev.id === closingEventId ? { ...ev, status: 'closed' as EventStatus } : ev))
    );
    setCloseSummary(null);
    setClosingEventId(null);
  }

  function confirmFinish() {
    if (!finishingEventId) return;
    updateEventStatus(finishingEventId, 'finished');
    setLocalEvents((prev) =>
      prev.map((ev) => (ev.id === finishingEventId ? { ...ev, status: 'finished' as EventStatus } : ev))
    );
    setFinishSummary(null);
    setFinishingEventId(null);
  }

  function handleVehicleToggle(vehicleId: string) {
    if (!vehicleModalEvent) return;
    const current = vehicleModalEvent.vehicleIds;
    let updated: string[];
    if (current.includes(vehicleId)) {
      updated = current.filter((id) => id !== vehicleId);
    } else {
      if (current.length >= MAX_VEHICLES) return;
      updated = [...current, vehicleId];
    }

    // Update both context events and local events
    const updatedEvent = { ...vehicleModalEvent, vehicleIds: updated };
    setVehicleModalEvent(updatedEvent);
    setLocalEvents((prev) =>
      prev.map((ev) => (ev.id === updatedEvent.id ? updatedEvent : ev))
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="bg-navy-dark text-white p-6 lg:p-8 overflow-y-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
              Gestión de Eventos
            </h1>
            <p className="text-sage mt-1">Administra los eventos de subasta de la plataforma</p>
          </div>
          <Button
            variant="primary"
            size="md"
            onClick={() => { setShowCreateForm(true); setFormData(emptyForm); setFormErrors({}); }}
          >
            + Crear Evento
          </Button>
        </div>

        {/* Events Table */}
        <GlassPanel variant="dark" padding="none" className=" mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-navy/5 border-b border-sage/10">
                  <th className="px-4 py-3 text-left font-semibold text-white">Nombre</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Inicio</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Fin</th>
                  <th className="px-4 py-3 text-left font-semibold text-white">Estado</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">Vehículos</th>
                  <th className="px-4 py-3 text-center font-semibold text-white">Ofertas</th>
                  <th className="px-4 py-3 text-right font-semibold text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEvents.map((event) => {
                  const nextStatus = getNextStatus(event.status);
                  const canEdit = event.status === 'scheduled';
                  const canManageVehicles = event.status === 'scheduled' || event.status === 'active';
                  const isFinished = event.status === 'finished';
                  const vehicleCount = event.vehicleIds.length;
                  const eventOfferCount = offers.filter((o) => o.eventId === event.id).length;

                  return (
                    <tr
                      key={event.id}
                      className="border-b border-sage/5 hover:bg-amber/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium text-white">{event.name}</span>
                      </td>
                      <td className="px-4 py-3 text-sage">{formatDate(event.startDate)}</td>
                      <td className="px-4 py-3 text-sage">{formatDate(event.endDate)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="status"
                          color={getStatusBadgeColor(event.status)}
                          label={getStatusLabel(event.status)}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-3 text-center text-white font-medium">{vehicleCount}</td>
                      <td className="px-4 py-3 text-center text-white font-medium">{eventOfferCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditForm(event)}
                            >
                              Editar
                            </Button>
                          )}
                          {canManageVehicles && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setVehicleModalEvent(event)}
                              className="text-white"
                            >
                              Vehículos
                            </Button>
                          )}
                          {nextStatus && !isFinished && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleStatusTransition(event)}
                            >
                              → {getStatusLabel(nextStatus)}
                            </Button>
                          )}
                          {isFinished && (
                            <span className="text-xs text-sage italic">Finalizado</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {paginatedEvents.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-sage">
                      No hay eventos registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-sage/10">
              <span className="text-sm text-sage">
                Mostrando {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, allEvents.length)} de {allEvents.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy/5 text-sage"
                  aria-label="Página anterior"
                >
                  ←
                </button>
                <span className="px-3 py-1 text-sm text-sage">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy/5 text-sage"
                  aria-label="Página siguiente"
                >
                  →
                </button>
              </div>
            </div>
          )}
        </GlassPanel>

        {/* ─── Create Event Modal ─────────────────────────────────────────── */}
        <Modal
          open={showCreateForm}
          onClose={() => { setShowCreateForm(false); setFormErrors({}); }}
          title="Crear Nuevo Evento"
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateEvent}>
                Crear Evento
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Nombre del evento"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              maxLength={MAX_NAME_LENGTH}
              error={formErrors.name}
              required
            />
            <div className="relative w-full">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                maxLength={MAX_DESCRIPTION_LENGTH}
                rows={3}
                placeholder="Descripción (opcional)"
                className={[
                  'w-full rounded-md px-4 py-3 text-sm outline-none transition-all duration-200',
                  'bg-white/5 backdrop-blur-sm border text-white-dark',
                  formErrors.description
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-sage/30 hover:border-sage/50 focus:border-amber focus:ring-2 focus:ring-amber/30',
                ].join(' ')}
              />
              {formErrors.description && (
                <p className="mt-1 text-xs text-red-500" role="alert">{formErrors.description}</p>
              )}
              <span className="absolute bottom-2 right-3 text-xs text-sage">
                {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-sage mb-1">Fecha de inicio *</label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className={[
                    'w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all duration-200',
                    'bg-white/5 backdrop-blur-sm border text-white-dark',
                    formErrors.startDate
                      ? 'border-red-500'
                      : 'border-sage/30 hover:border-sage/50 focus:border-amber focus:ring-2 focus:ring-amber/30',
                  ].join(' ')}
                />
                {formErrors.startDate && (
                  <p className="mt-1 text-xs text-red-500" role="alert">{formErrors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-sage mb-1">Fecha de fin *</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className={[
                    'w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all duration-200',
                    'bg-white/5 backdrop-blur-sm border text-white-dark',
                    formErrors.endDate
                      ? 'border-red-500'
                      : 'border-sage/30 hover:border-sage/50 focus:border-amber focus:ring-2 focus:ring-amber/30',
                  ].join(' ')}
                />
                {formErrors.endDate && (
                  <p className="mt-1 text-xs text-red-500" role="alert">{formErrors.endDate}</p>
                )}
              </div>
            </div>
            {/* Vehicle Selection */}
            <div>
              <label className="block text-xs font-medium text-sage mb-2">
                Vehículos ({formData.vehicleIds.length}/{MAX_VEHICLES})
              </label>
              <div className="max-h-40 overflow-y-auto border border-sage/20 rounded-md p-2 space-y-1">
                {availableVehicles.map((v) => (
                  <label
                    key={v.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-amber/5 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={formData.vehicleIds.includes(v.id)}
                      onChange={() => {
                        setFormData((prev) => ({
                          ...prev,
                          vehicleIds: prev.vehicleIds.includes(v.id)
                            ? prev.vehicleIds.filter((id) => id !== v.id)
                            : [...prev.vehicleIds, v.id],
                        }));
                      }}
                      className="rounded border-sage/30 text-amber focus:ring-amber/30"
                    />
                    <span className="text-white">
                      {v.year} {v.make} {v.model}
                    </span>
                    <span className="text-xs text-sage ml-auto">
                      ${v.price.toLocaleString()}
                    </span>
                  </label>
                ))}
                {availableVehicles.length === 0 && (
                  <p className="text-xs text-sage text-center py-2">No hay vehículos disponibles</p>
                )}
              </div>
              {formErrors.vehicles && (
                <p className="mt-1 text-xs text-red-500" role="alert">{formErrors.vehicles}</p>
              )}
            </div>
          </div>
        </Modal>

        {/* ─── Edit Event Modal ──────────────────────────────────────────── */}
        <Modal
          open={!!editingEvent}
          onClose={() => { setEditingEvent(null); setFormErrors({}); }}
          title="Editar Evento"
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => setEditingEvent(null)}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={handleEditEvent}>
                Guardar Cambios
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Nombre del evento"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              maxLength={MAX_NAME_LENGTH}
              error={formErrors.name}
              required
            />
            <div className="relative w-full">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                maxLength={MAX_DESCRIPTION_LENGTH}
                rows={3}
                placeholder="Descripción (opcional)"
                className={[
                  'w-full rounded-md px-4 py-3 text-sm outline-none transition-all duration-200',
                  'bg-white/5 backdrop-blur-sm border text-white-dark',
                  formErrors.description
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-sage/30 hover:border-sage/50 focus:border-amber focus:ring-2 focus:ring-amber/30',
                ].join(' ')}
              />
              {formErrors.description && (
                <p className="mt-1 text-xs text-red-500" role="alert">{formErrors.description}</p>
              )}
              <span className="absolute bottom-2 right-3 text-xs text-sage">
                {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-sage mb-1">Fecha de inicio *</label>
                <input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className={[
                    'w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all duration-200',
                    'bg-white/5 backdrop-blur-sm border text-white-dark',
                    formErrors.startDate
                      ? 'border-red-500'
                      : 'border-sage/30 hover:border-sage/50 focus:border-amber focus:ring-2 focus:ring-amber/30',
                  ].join(' ')}
                />
                {formErrors.startDate && (
                  <p className="mt-1 text-xs text-red-500" role="alert">{formErrors.startDate}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium text-sage mb-1">Fecha de fin *</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className={[
                    'w-full rounded-md px-4 py-2.5 text-sm outline-none transition-all duration-200',
                    'bg-white/5 backdrop-blur-sm border text-white-dark',
                    formErrors.endDate
                      ? 'border-red-500'
                      : 'border-sage/30 hover:border-sage/50 focus:border-amber focus:ring-2 focus:ring-amber/30',
                  ].join(' ')}
                />
                {formErrors.endDate && (
                  <p className="mt-1 text-xs text-red-500" role="alert">{formErrors.endDate}</p>
                )}
              </div>
            </div>
          </div>
        </Modal>

        {/* ─── Vehicle Association Modal ─────────────────────────────────── */}
        <Modal
          open={!!vehicleModalEvent}
          onClose={() => setVehicleModalEvent(null)}
          title={`Vehículos — ${vehicleModalEvent?.name ?? ''}`}
          actions={
            <Button variant="primary" size="sm" onClick={() => setVehicleModalEvent(null)}>
              Cerrar
            </Button>
          }
        >
          {vehicleModalEvent && (
            <div>
              <p className="text-sm text-sage mb-3">
                Selecciona hasta {MAX_VEHICLES} vehículos para este evento.
                Seleccionados: <span className="font-medium text-white">{vehicleModalEvent.vehicleIds.length}</span>
              </p>
              <div className="max-h-60 overflow-y-auto border border-sage/20 rounded-md p-2 space-y-1">
                {vehicles.map((v) => (
                  <label
                    key={v.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-amber/5 cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={vehicleModalEvent.vehicleIds.includes(v.id)}
                      onChange={() => handleVehicleToggle(v.id)}
                      className="rounded border-sage/30 text-amber focus:ring-amber/30"
                    />
                    <span className="text-white">
                      {v.year} {v.make} {v.model}
                    </span>
                    <span className="text-xs text-sage ml-auto">
                      ${v.price.toLocaleString()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </Modal>

        {/* ─── Close Summary Modal ───────────────────────────────────────── */}
        <Modal
          open={!!closeSummary}
          onClose={() => { setCloseSummary(null); setClosingEventId(null); }}
          title="Resumen de Cierre de Evento"
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => { setCloseSummary(null); setClosingEventId(null); }}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={confirmClose}>
                Confirmar Cierre
              </Button>
            </>
          }
        >
          {closeSummary && (
            <div className="space-y-4">
              <p className="text-sm text-sage">
                Se ejecutó <span className="font-medium text-white">Lead Scoring</span> para todas las ofertas del evento con pesos configurados.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-navy/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{closeSummary.offersScored}</p>
                  <p className="text-xs text-sage mt-1">Ofertas Calificadas</p>
                </div>
                <div className="bg-navy/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-amber">{closeSummary.leadsGenerated}</p>
                  <p className="text-xs text-sage mt-1">Leads Generados</p>
                </div>
                <div className="bg-navy/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-white">{closeSummary.topScore}</p>
                  <p className="text-xs text-sage mt-1">Score Más Alto</p>
                </div>
                <div className="bg-navy/5 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-600">{closeSummary.topLevel}</p>
                  <p className="text-xs text-sage mt-1">Nivel Top Lead</p>
                </div>
              </div>

              {/* Color-coded progress bars for each generated lead */}
              {closeSummary.generatedLeads.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-white mb-3">Scoring por Lead:</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {closeSummary.generatedLeads.slice(0, 10).map((lead) => {
                      const buyer = users.find((u) => u.id === lead.buyerId);
                      const vehicle = vehicles.find((v) => v.id === lead.vehicleId);
                      const barColor =
                        lead.level === 'Priority' ? 'bg-emerald-500' :
                        lead.level === 'Hot' ? 'bg-amber' :
                        lead.level === 'Medium' ? 'bg-sky-500' :
                        'bg-sage/50';
                      const textColor =
                        lead.level === 'Priority' ? 'text-emerald-600' :
                        lead.level === 'Hot' ? 'text-amber' :
                        lead.level === 'Medium' ? 'text-sky-600' :
                        'text-sage';

                      return (
                        <div key={lead.id} className="bg-white/50 border border-sage/10 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-white truncate max-w-[140px]">
                              {buyer?.name ?? 'Comprador'}
                            </span>
                            <span className="text-xs text-sage truncate max-w-[100px]">
                              {vehicle ? `${vehicle.make} ${vehicle.model}` : ''}
                            </span>
                            <span className={`text-xs font-bold ${textColor}`}>
                              {lead.score} — {lead.level}
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-sage/10 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                              style={{ width: `${lead.score}%` }}
                            />
                          </div>
                          {lead.reasons.length > 0 && (
                            <p className="text-[10px] text-sage mt-1 truncate">
                              {lead.reasons.slice(0, 3).join(' • ')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                    {closeSummary.generatedLeads.length > 10 && (
                      <p className="text-xs text-sage text-center py-1">
                        +{closeSummary.generatedLeads.length - 10} leads más...
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Scoring weights info */}
              <div className="mt-3 pt-3 border-t border-sage/10">
                <p className="text-xs text-sage">
                  Pesos aplicados: Oferta {scoringWeights.offerAmount}% · Verificación {scoringWeights.verification}% · Perfil {scoringWeights.profileCompleteness}% · Timing {scoringWeights.timing}%
                </p>
              </div>
            </div>
          )}
        </Modal>

        {/* ─── Finish Summary Modal ──────────────────────────────────────── */}
        <Modal
          open={!!finishSummary}
          onClose={() => { setFinishSummary(null); setFinishingEventId(null); }}
          title="Finalizar Evento"
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={() => { setFinishSummary(null); setFinishingEventId(null); }}>
                Cancelar
              </Button>
              <Button variant="primary" size="sm" onClick={confirmFinish}>
                Confirmar Finalización
              </Button>
            </>
          }
        >
          {finishSummary && (
            <div className="space-y-4">
              <p className="text-sm text-sage">
                Al finalizar este evento, los leads serán marcados como finales y no se permitirán más cambios.
              </p>
              <div className="bg-navy/5 rounded-xl p-4 mb-3">
                <p className="text-sm font-medium text-white mb-1">Leads Finalizados</p>
                <p className="text-2xl font-bold text-amber">{finishSummary.totalLeadsFinalized}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-2">Precios de Cierre por Vehículo:</p>
                <div className="space-y-2">
                  {finishSummary.vehiclePrices.map((vp) => (
                    <div
                      key={vp.vehicleId}
                      className="flex items-center justify-between px-3 py-2 bg-white/50 border border-sage/10 rounded-lg"
                    >
                      <span className="text-sm text-white">
                        {vp.make} {vp.model}
                      </span>
                      <span className="text-sm font-semibold text-amber">
                        {vp.closingPrice > 0 ? `$${vp.closingPrice.toLocaleString()}` : 'Sin ofertas'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>

    </div>
  );
}

