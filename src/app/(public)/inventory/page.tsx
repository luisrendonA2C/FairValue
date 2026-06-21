'use client';

import React, { Suspense, useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { vehicles as allVehicles } from '@/data';
import { Vehicle } from '@/types';
import { useFilters } from '@/hooks/useFilters';
import { useWatchlist } from '@/hooks/useWatchlist';
import { VehicleCard } from '@/components/shared/VehicleCard';
import { FilterPanel, FilterConfig } from '@/components/shared/FilterPanel';
import { EmptyState } from '@/components/shared/EmptyState';

// ─── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 24;

type SortOption = {
  label: string;
  field: string;
  direction: 'asc' | 'desc';
};

const SORT_OPTIONS: SortOption[] = [
  { label: 'Recién Agregado', field: 'submissionDate', direction: 'desc' },
  { label: 'Precio ↑', field: 'price', direction: 'asc' },
  { label: 'Precio ↓', field: 'price', direction: 'desc' },
  { label: 'Más Nuevo', field: 'year', direction: 'desc' },
  { label: 'Más Antiguo', field: 'year', direction: 'asc' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getUniqueValues(items: Vehicle[], field: keyof Vehicle): string[] {
  const values = new Set<string>();
  for (const item of items) {
    const val = item[field];
    if (val && typeof val === 'string') {
      values.add(val);
    }
  }
  return Array.from(values).sort();
}

// ─── Page Wrapper (Suspense boundary for useSearchParams) ───────────────────

export default function InventoryPage() {
  return (
    <div className="pt-16">
      <Suspense fallback={<InventoryLoading />}>
        <InventoryContent />
      </Suspense>
    </div>
  );
}

function InventoryLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-dark via-navy-dark to-forest flex items-center justify-center">
      <div className="animate-pulse text-sage text-sm">Cargando inventario...</div>
    </div>
  );
}

// ─── Main Content Component ─────────────────────────────────────────────────

function InventoryContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') ?? '';

  // Only show vehicles that are active or assigned to event
  const publicVehicles = useMemo(
    () => allVehicles.filter((v) => v.status === 'active' || v.status === 'assigned_to_event'),
    []
  );

  // Derive unique filter options from public vehicles
  const makeOptions = useMemo(
    () => getUniqueValues(publicVehicles, 'make').map((v) => ({ value: v, label: v })),
    [publicVehicles]
  );
  const modelOptions = useMemo(
    () => getUniqueValues(publicVehicles, 'model').map((v) => ({ value: v, label: v })),
    [publicVehicles]
  );
  const fuelTypeOptions = useMemo(
    () => getUniqueValues(publicVehicles, 'fuelType').map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })),
    [publicVehicles]
  );
  const transmissionOptions = useMemo(
    () => getUniqueValues(publicVehicles, 'transmission').map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })),
    [publicVehicles]
  );
  const bodyTypeOptions = useMemo(
    () => getUniqueValues(publicVehicles, 'bodyType').map((v) => ({ value: v, label: v.charAt(0).toUpperCase() + v.slice(1) })),
    [publicVehicles]
  );

  // Filter configuration for the FilterPanel
  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      { key: 'make', label: 'Marca', type: 'select', options: makeOptions },
      { key: 'model', label: 'Modelo', type: 'select', options: modelOptions },
      { key: 'year', label: 'Año', type: 'range' },
      { key: 'price', label: 'Precio', type: 'range' },
      { key: 'mileage', label: 'Kilometraje', type: 'range' },
      { key: 'fuelType', label: 'Combustible', type: 'select', options: fuelTypeOptions },
      { key: 'transmission', label: 'Transmisión', type: 'select', options: transmissionOptions },
      { key: 'bodyType', label: 'Tipo', type: 'select', options: bodyTypeOptions },
    ],
    [makeOptions, modelOptions, fuelTypeOptions, transmissionOptions, bodyTypeOptions]
  );

  // Use the useFilters hook
  const {
    filtered,
    filters,
    setFilter,
    setSearch,
    setSort,
    clearAll,
    activeCount,
  } = useFilters<Vehicle>(publicVehicles, {
    searchFields: ['make', 'model', 'description'],
    defaultSort: { field: 'submissionDate', direction: 'desc' },
  });

  // Initialize search from URL param
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [initialSearch, setSearch]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filtered.length]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  // Watchlist
  const { isFavorited, toggleFavorite } = useWatchlist();

  // Sort state
  const [selectedSortIndex, setSelectedSortIndex] = useState(0);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idx = Number(e.target.value);
    setSelectedSortIndex(idx);
    const opt = SORT_OPTIONS[idx];
    setSort(opt.field, opt.direction);
  };

  // Mobile filter drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-dark via-navy-dark to-forest">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 backdrop-blur-md bg-navy-dark/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sage"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por marca, modelo o descripción..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-sage text-sm focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/30 transition-all duration-200"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <select
              value={selectedSortIndex}
              onChange={handleSortChange}
              className="px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm appearance-none cursor-pointer focus:outline-none focus:border-amber focus:ring-2 focus:ring-amber/30 transition-all duration-200 pr-8"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236A7062'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.25rem' }}
            >
              {SORT_OPTIONS.map((opt, idx) => (
                <option key={idx} value={idx} className="bg-navy-dark text-white">
                  {opt.label}
                </option>
              ))}
            </select>

            {/* Active filter count + Clear */}
            {activeCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center min-w-[22px] h-6 px-1.5 text-xs font-bold rounded-full bg-amber text-white">
                  {activeCount}
                </span>
                <button
                  onClick={clearAll}
                  className="text-xs font-medium text-amber hover:text-amber-dark transition-colors whitespace-nowrap"
                >
                  Limpiar Todo
                </button>
              </div>
            )}

            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden inline-flex items-center gap-1 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:border-amber transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Desktop Filter Panel */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <FilterPanel
                filters={filterConfigs}
                values={filters.filters}
                onChange={setFilter}
                onClear={clearAll}
                activeCount={activeCount}
              />
            </div>
          </aside>

          {/* Right Content - Vehicle Grid */}
          <main className="flex-1 min-w-0">
            {/* Results count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-sage">
                {filtered.length} vehículo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>

            {paginatedVehicles.length > 0 ? (
              <>
                {/* Vehicle Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger-children">
                  {paginatedVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onFavorite={toggleFavorite}
                      isFavorited={isFavorited(vehicle.id)}
                      variant="dark"
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-4">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber transition-colors"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-sage">
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-amber transition-colors"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="animate-slideUp">
                <EmptyState
                  title="No se encontraron vehículos"
                  message="Intenta ajustar los filtros o la búsqueda para ver más resultados."
                  action={{
                    label: 'Limpiar Filtros',
                    onClick: clearAll,
                  }}
                />
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer/Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-navy-dark border-r border-white/10 overflow-y-auto p-4 animate-slide-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Filtros</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 text-sage transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterPanel
              filters={filterConfigs}
              values={filters.filters}
              onChange={setFilter}
              onClear={clearAll}
              activeCount={activeCount}
            />
          </div>
        </div>
      )}
    </div>
  );
}
