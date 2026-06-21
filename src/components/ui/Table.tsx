'use client';

import React from 'react';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
}

export interface TableProps {
  columns: TableColumn[];
  data: Record<string, unknown>[];
  pagination?: TablePagination;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  onPageChange?: (page: number) => void;
  className?: string;
}

export const Table: React.FC<TableProps> = ({
  columns,
  data,
  pagination,
  onSort,
  onPageChange,
  className = '',
}) => {
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');

  const handleSort = (key: string) => {
    if (!onSort) return;
    const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortDir(newDir);
    onSort(key, newDir);
  };

  const totalPages = pagination
    ? Math.ceil(pagination.total / pagination.pageSize)
    : 1;

  return (
    <div className={`rounded-xl overflow-hidden border border-white/10 ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy/10">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'px-4 py-3 text-left font-semibold text-sage-dark',
                    col.sortable ? 'cursor-pointer select-none hover:text-amber transition-colors' : '',
                  ].join(' ')}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  aria-sort={
                    col.sortable && sortKey === col.key
                      ? sortDir === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && sortKey === col.key && (
                      <span aria-hidden="true">
                        {sortDir === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={[
                  'transition-all duration-150',
                  'hover:bg-amber/5 hover:border-l-2 hover:border-l-amber',
                  rowIndex % 2 === 0 ? 'bg-transparent' : 'bg-white/3',
                ].join(' ')}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-foreground">
                    {row[col.key] != null ? String(row[col.key]) : '—'}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-sage"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 bg-navy/5">
          <span className="text-sm text-sage">
            Showing {(pagination.page - 1) * pagination.pageSize + 1}–
            {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange?.(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 text-sage hover:text-white"
              aria-label="Previous page"
            >
              ←
            </button>
            <span className="px-3 py-1 text-sm text-sage">
              {pagination.page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange?.(pagination.page + 1)}
              disabled={pagination.page >= totalPages}
              className="px-3 py-1 text-sm rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 text-sage hover:text-white"
              aria-label="Next page"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

Table.displayName = 'Table';

export default Table;
