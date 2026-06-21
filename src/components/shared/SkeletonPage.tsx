'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/Skeleton';

export interface SkeletonPageProps {
  variant: 'grid' | 'table' | 'detail';
  className?: string;
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }, (_, i) => (
        <Skeleton key={i} variant="card" />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {/* Header row */}
      <Skeleton variant="table-row" height="2.5rem" />
      {/* Data rows */}
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} variant="table-row" />
      ))}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Large image placeholder */}
      <Skeleton variant="image" height="20rem" />
      {/* Text lines */}
      <div className="space-y-3">
        <Skeleton variant="text" width="60%" height="1.5rem" />
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="45%" />
      </div>
      {/* Card skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton variant="card" height="8rem" />
        <Skeleton variant="card" height="8rem" />
      </div>
    </div>
  );
}

export function SkeletonPage({ variant, className = '' }: SkeletonPageProps) {
  return (
    <div className={['w-full animate-in fade-in duration-300', className].join(' ')} aria-busy="true" aria-label="Loading content">
      {variant === 'grid' && <GridSkeleton />}
      {variant === 'table' && <TableSkeleton />}
      {variant === 'detail' && <DetailSkeleton />}
    </div>
  );
}

SkeletonPage.displayName = 'SkeletonPage';

export default SkeletonPage;
