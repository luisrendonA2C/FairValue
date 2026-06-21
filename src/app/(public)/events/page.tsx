'use client';

import React, { useState, useMemo } from 'react';
import { events, vehicles } from '@/data';
import { EventCard } from '@/components/shared/EventCard';
import { VehicleCard } from '@/components/shared/VehicleCard';
import { StepIndicator, Step } from '@/components/shared/StepIndicator';
import { EmptyState } from '@/components/shared/EmptyState';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import type { Event, EventStatus } from '@/types';

const timelineSteps: Step[] = [
  { id: 'registration', label: 'Registro' },
  { id: 'offers_open', label: 'Ofertas Abiertas' },
  { id: 'offers_close', label: 'Ofertas Cerradas' },
  { id: 'lead_release', label: 'Leads Liberados' },
];

function mapStatusToStep(status: EventStatus): string {
  switch (status) {
    case 'scheduled':
      return 'registration';
    case 'active':
      return 'offers_open';
    case 'closed':
      return 'offers_close';
    case 'in_review':
      return 'offers_close';
    case 'finished':
      return 'lead_release';
    default:
      return 'registration';
  }
}

function getStatusOrder(status: EventStatus): number {
  switch (status) {
    case 'active':
      return 0;
    case 'scheduled':
      return 1;
    case 'closed':
      return 2;
    case 'in_review':
      return 3;
    case 'finished':
      return 4;
    default:
      return 5;
  }
}

export default function EventsPage() {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const orderDiff = getStatusOrder(a.status) - getStatusOrder(b.status);
      if (orderDiff !== 0) return orderDiff;
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
    });
  }, []);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find((e) => e.id === selectedEventId) ?? null;
  }, [selectedEventId]);

  const eventVehicles = useMemo(() => {
    if (!selectedEvent) return [];
    return vehicles.filter((v) => selectedEvent.vehicleIds.includes(v.id));
  }, [selectedEvent]);

  function handleEventClick(event: Event) {
    setSelectedEventId((prev) => (prev === event.id ? null : event.id));
  }

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-white font-heading text-3xl md:text-4xl font-bold mb-2">
            Eventos
          </h1>
          <p className="text-sage-light text-lg">
            Explora los eventos de subasta programados, activos y finalizados.
          </p>
        </div>

        {/* Empty State */}
        {sortedEvents.length === 0 ? (
          <GlassPanel variant="dark" padding="lg">
            <EmptyState
              title="No hay eventos"
              message="No hay eventos programados en este momento. Vuelve pronto para ver nuevas oportunidades."
            />
          </GlassPanel>
        ) : (
          <>
            {/* Event Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sortedEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => handleEventClick(event)}
                  className={[
                    'cursor-pointer transition-all duration-200',
                    selectedEventId === event.id
                      ? 'ring-2 ring-amber rounded-xl'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <EventCard
                    event={event}
                    showCountdown={event.status === 'active'}
                  />
                </div>
              ))}
            </div>

            {/* Event Detail Expansion */}
            {selectedEvent && (
              <GlassPanel variant="dark" padding="lg" className="animate-in fade-in slide-in-from-top-4 duration-300">
                {/* Event Detail Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-white font-heading text-2xl font-bold mb-1">
                      {selectedEvent.name}
                    </h2>
                    <p className="text-sage-light text-sm">
                      {selectedEvent.description}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEventId(null)}
                    className="text-sage hover:text-white transition-colors p-2"
                    aria-label="Cerrar detalle"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Timeline / StepIndicator */}
                <div className="mb-8 py-4 border-t border-b border-white/10">
                  <h3 className="text-white text-sm font-medium mb-4">
                    Ciclo del Evento
                  </h3>
                  <StepIndicator
                    steps={timelineSteps}
                    currentStep={mapStatusToStep(selectedEvent.status)}
                    orientation="horizontal"
                  />
                </div>

                {/* Vehicle Grid */}
                <div>
                  <h3 className="text-white text-sm font-medium mb-4">
                    Vehículos en este evento ({eventVehicles.length})
                  </h3>
                  {eventVehicles.length === 0 ? (
                    <p className="text-sage-light text-sm">
                      No hay vehículos asignados a este evento aún.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {eventVehicles.map((vehicle) => (
                        <VehicleCard
                          key={vehicle.id}
                          vehicle={vehicle}
                          variant="dark"
                          showStatus={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </GlassPanel>
            )}
          </>
        )}
      </div>
    </GradientBackground>
  );
}
