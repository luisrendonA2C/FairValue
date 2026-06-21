'use client';

import React, { useState, useMemo } from 'react';
import { useMockData } from '@/hooks/useData';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { VehicleStatus } from '@/types';

const ITEMS_PER_PAGE = 20;

const statusBadgeColor: Record<VehicleStatus, 'amber' | 'emerald' | 'sage' | 'navy'> = {
  draft: 'sage',
  pending_approval: 'amber',
  active: 'emerald',
  assigned_to_event: 'navy',
  closed: 'sage',
  rejected: 'sage',
};

const statusLabels: Record<VehicleStatus, string> = {
  draft: 'Borrador',
  pending_approval: 'Pendiente',
  active: 'Activo',
  assigned_to_event: 'En Evento',
  closed: 'Cerrado',
  rejected: 'Rechazado',
};

export default function AdminVehiclesPage() {
  const { vehicles, dealers } = useMockData();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');

  // Filtered vehicles
  const filteredVehicles = useMemo(() => {
    let result = vehicles;

    if (statusFilter !== 'all') {
      result = result.filter((v) => v.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.vin.toLowerCase().includes(q) ||
          String(v.year).includes(q)
      );
    }

    return result;
  }, [vehicles, statusFilter, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE);
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function getDealerName(dealerId: string): string {
    const dealer = dealers.find((d) => d.id === dealerId);
    return dealer?.businessName ?? 'N/A';
  }

  return (
    <div className="bg-navy-dark text-white p-6 lg:p-8 overflow-y-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
            Gestión de Vehículos
          </h1>
          <p className="text-sage mt-1">
            Administra todos los vehículos de la plataforma
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 max-w-sm">
          <Input
            type="text"
            placeholder="Buscar por marca, modelo, VIN..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value as VehicleStatus | 'all');
            setCurrentPage(1);
          }}
          className="rounded-lg border border-sage/30 px-4 py-3 text-sm text-white bg-white/5 backdrop-blur-sm focus:border-amber focus:ring-2 focus:ring-amber/30 outline-none appearance-none"
        >
          <option value="all">Todos los estados</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Vehicles Table */}
      <GlassPanel variant="dark" padding="none" className=" mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy/5 border-b border-sage/10">
                <th className="px-4 py-3 text-left font-semibold text-white">Vehículo</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Dealer</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Año</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Precio</th>
                <th className="px-4 py-3 text-left font-semibold text-white">Estado</th>
                <th className="px-4 py-3 text-center font-semibold text-white">Vistas</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVehicles.map((vehicle) => (
                <tr
                  key={vehicle.id}
                  className="border-b border-sage/5 hover:bg-amber/5 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-white">
                      {vehicle.make} {vehicle.model}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sage">{getDealerName(vehicle.dealerId)}</td>
                  <td className="px-4 py-3 text-sage">{vehicle.year}</td>
                  <td className="px-4 py-3 text-white font-medium">
                    ${vehicle.price.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="status"
                      color={statusBadgeColor[vehicle.status]}
                      label={statusLabels[vehicle.status]}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3 text-center text-sage">{vehicle.views}</td>
                </tr>
              ))}
              {paginatedVehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sage">
                    No se encontraron vehículos
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
              Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredVehicles.length)} de{' '}
              {filteredVehicles.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy/5 text-sage"
                aria-label="Página anterior"
              >
                ←
              </button>
              <span className="px-3 py-1 text-sm text-sage">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy/5 text-sage"
                aria-label="Página siguiente"
              >
                →
              </button>
            </div>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}

