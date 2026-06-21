import type { Event } from '@/types';

export const events: Event[] = [
  {
    id: 'event-001',
    name: 'Subasta Premium Diciembre',
    description: 'Evento exclusivo de fin de año con vehículos premium seleccionados. SUVs y sedanes de alta gama de las mejores marcas disponibles en Costa Rica.',
    startDate: '2024-12-10T08:00:00Z',
    endDate: '2024-12-17T23:59:59Z',
    status: 'active',
    vehicleIds: ['vehicle-001', 'vehicle-002', 'vehicle-003', 'vehicle-006'],
    offerCount: 14,
  },
  {
    id: 'event-002',
    name: 'Ofertas de Inicio de Año 2025',
    description: 'Evento programado para enero con vehículos variados: pick-ups, SUVs y sedanes deportivos. Oportunidades únicas para iniciar el año con vehículo nuevo.',
    startDate: '2025-01-08T08:00:00Z',
    endDate: '2025-01-15T23:59:59Z',
    status: 'scheduled',
    vehicleIds: ['vehicle-007', 'vehicle-009', 'vehicle-010'],
    offerCount: 0,
  },
  {
    id: 'event-003',
    name: 'Subasta Deportivos Noviembre',
    description: 'Evento finalizado con vehículos deportivos y de alto rendimiento. Los leads ya fueron generados y entregados a los dealers participantes.',
    startDate: '2024-11-01T08:00:00Z',
    endDate: '2024-11-08T23:59:59Z',
    status: 'finished',
    vehicleIds: ['vehicle-011'],
    offerCount: 6,
  },
];
