'use client';

import { useState, useMemo, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface FilterConfig {
  searchFields?: string[]; // fields to search on (case-insensitive partial match)
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
}

export interface FilterState {
  search: string;
  filters: Record<string, any>;
  sort: { field: string; direction: 'asc' | 'desc' } | null;
}

export interface UseFiltersReturn<T> {
  filtered: T[];
  filters: FilterState;
  setFilter: (key: string, value: any) => void;
  setSearch: (query: string) => void;
  setSort: (field: string, direction: 'asc' | 'desc') => void;
  clearAll: () => void;
  activeCount: number;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useFilters<T extends Record<string, any>>(
  items: T[],
  config: FilterConfig
): UseFiltersReturn<T> {
  const [search, setSearchState] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState<{ field: string; direction: 'asc' | 'desc' } | null>(
    config.defaultSort ?? null
  );

  // ─── Set search (only apply if query length >= 2) ───────────────────────
  const setSearch = useCallback((query: string) => {
    setSearchState(query);
  }, []);

  // ─── Set a single filter value ──────────────────────────────────────────
  const setFilter = useCallback((key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // ─── Set sort field and direction ───────────────────────────────────────
  const setSortHandler = useCallback((field: string, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  }, []);

  // ─── Clear all filters, search, and sort to defaults ────────────────────
  const clearAll = useCallback(() => {
    setSearchState('');
    setFilters({});
    setSort(config.defaultSort ?? null);
  }, [config.defaultSort]);

  // ─── Compute filtered and sorted results ────────────────────────────────
  const filtered = useMemo(() => {
    let result = [...items];

    // Apply search filter (only if 2+ characters)
    if (search.length >= 2 && config.searchFields && config.searchFields.length > 0) {
      const query = search.toLowerCase();
      result = result.filter((item) =>
        config.searchFields!.some((field) => {
          const value = item[field];
          if (typeof value === 'string') {
            return value.toLowerCase().includes(query);
          }
          if (typeof value === 'number') {
            return String(value).includes(query);
          }
          return false;
        })
      );
    }

    // Apply active filters with AND logic
    const activeFilterKeys = Object.keys(filters).filter((key) => {
      const value = filters[key];
      return value !== '' && value !== null && value !== undefined;
    });

    for (const key of activeFilterKeys) {
      const value = filters[key];

      // Range filter: keys ending in _min or _max
      if (key.endsWith('_min')) {
        const baseField = key.slice(0, -4); // remove '_min'
        const minValue = Number(value);
        if (!isNaN(minValue)) {
          result = result.filter((item) => {
            const itemValue = Number(item[baseField]);
            return !isNaN(itemValue) && itemValue >= minValue;
          });
        }
      } else if (key.endsWith('_max')) {
        const baseField = key.slice(0, -4); // remove '_max'
        const maxValue = Number(value);
        if (!isNaN(maxValue)) {
          result = result.filter((item) => {
            const itemValue = Number(item[baseField]);
            return !isNaN(itemValue) && itemValue <= maxValue;
          });
        }
      } else {
        // Exact match for select/enum filters
        result = result.filter((item) => item[key] === value);
      }
    }

    // Apply sort
    if (sort) {
      result.sort((a, b) => {
        const aVal = a[sort.field];
        const bVal = b[sort.field];

        // Handle null/undefined
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return sort.direction === 'asc' ? -1 : 1;
        if (bVal == null) return sort.direction === 'asc' ? 1 : -1;

        // Numeric comparison
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        // String comparison
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (aStr < bStr) return sort.direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return sort.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [items, search, filters, sort, config.searchFields]);

  // ─── Count active filters ───────────────────────────────────────────────
  const activeCount = useMemo(() => {
    let count = 0;

    // Count active filter values (non-empty, non-null)
    for (const key of Object.keys(filters)) {
      const value = filters[key];
      if (value !== '' && value !== null && value !== undefined) {
        count++;
      }
    }

    // Count search as active if >= 2 chars
    if (search.length >= 2) {
      count++;
    }

    return count;
  }, [filters, search]);

  return {
    filtered,
    filters: { search, filters, sort },
    setFilter,
    setSearch,
    setSort: setSortHandler,
    clearAll,
    activeCount,
  };
}
