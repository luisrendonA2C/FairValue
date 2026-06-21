'use client';

import React from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'range';
  options?: { value: string; label: string }[];
}

export interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onClear: () => void;
  activeCount: number;
  className?: string;
}

export function FilterPanel({
  filters,
  values,
  onChange,
  onClear,
  activeCount,
  className = '',
}: FilterPanelProps) {
  return (
    <div
      className={[
        'rounded-2xl p-4 space-y-4',
        'backdrop-blur-md bg-white/5 border border-white/10',
        'dark:bg-white/5 dark:border-white/10',
        'bg-white border-sage/20',
        className,
      ].join(' ')}
    >
      {/* Header with active count and clear button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-sage">Filters</h3>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full bg-amber text-white">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-medium text-amber hover:text-amber-dark transition-colors duration-200"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter controls */}
      <div className="space-y-3">
        {filters.map((filter) => {
          switch (filter.type) {
            case 'text':
              return (
                <Input
                  key={filter.key}
                  type="text"
                  label={filter.label}
                  value={values[filter.key] ?? ''}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                  className="w-full"
                />
              );

            case 'select':
              return (
                <Select
                  key={filter.key}
                  label={filter.label}
                  options={filter.options ?? []}
                  value={values[filter.key] ?? ''}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                  placeholder={`Select ${filter.label}`}
                  className="w-full"
                />
              );

            case 'range':
              return (
                <div key={filter.key} className="space-y-1">
                  <label className="text-xs font-medium text-sage">
                    {filter.label}
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={values[`${filter.key}_min`] ?? ''}
                      onChange={(e) =>
                        onChange(`${filter.key}_min`, e.target.value)
                      }
                      className="flex-1"
                    />
                    <span className="text-sage text-xs">–</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={values[`${filter.key}_max`] ?? ''}
                      onChange={(e) =>
                        onChange(`${filter.key}_max`, e.target.value)
                      }
                      className="flex-1"
                    />
                  </div>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}

FilterPanel.displayName = 'FilterPanel';

export default FilterPanel;
