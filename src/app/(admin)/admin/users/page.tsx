'use client';

import { useState, useMemo } from 'react';
import { useMockData } from '@/hooks/useData';
import { useFilters } from '@/hooks/useFilters';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { EmptyState } from '@/components/shared/EmptyState';
import type { User, VerificationStatus } from '@/types';

// ─── Constants ──────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'buyer', label: 'Buyer' },
  { value: 'dealer', label: 'Dealer' },
  { value: 'admin', label: 'Admin' },
];

const VERIFICATION_OPTIONS = [
  { value: '', label: 'All Verification' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'documents_uploaded', label: 'Documents Uploaded' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

const ACTIVE_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getVerificationBadgeColor(status: VerificationStatus) {
  switch (status) {
    case 'verified':
      return 'emerald';
    case 'rejected':
      return 'amber';
    case 'under_review':
      return 'navy';
    case 'documents_uploaded':
      return 'sage';
    case 'not_started':
    default:
      return 'sage';
  }
}

function formatVerificationStatus(status: VerificationStatus) {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminUsersPage() {
  const { users, updateVerificationStatus, toggleUserActive } = useMockData();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Prepare users with isActive as string for filter compatibility
  const usersWithStringActive = useMemo(
    () => users.map((u) => ({ ...u, isActiveStr: String(u.isActive) })),
    [users]
  );

  const {
    filtered,
    filters,
    setFilter,
    setSearch,
    clearAll,
  } = useFilters(usersWithStringActive, {
    searchFields: ['name', 'email'],
    defaultSort: { field: 'registrationDate', direction: 'desc' },
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  // Reset page when filters change
  const handleFilterChange = (key: string, value: string) => {
    if (key === 'isActiveStr') {
      setFilter('isActiveStr', value);
    } else {
      setFilter(key, value);
    }
    setCurrentPage(1);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    clearAll();
    setCurrentPage(1);
  };

  // Actions
  const handleToggleActive = (user: User) => {
    toggleUserActive(user.id);
  };

  const handleVerifyUser = (userId: string) => {
    updateVerificationStatus(userId, 'verified');
    // Update selected user state to reflect change
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, verificationStatus: 'verified' });
    }
  };

  // Keep selectedUser in sync with latest data
  const currentSelectedUser = useMemo(() => {
    if (!selectedUser) return null;
    return users.find((u) => u.id === selectedUser.id) || selectedUser;
  }, [users, selectedUser]);

  return (
    <div className="bg-navy-dark text-white min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-sage text-sm">
            View and manage all registered users on the platform.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Table Panel */}
          <div className="flex-1">
            <GlassPanel variant="dark" padding="md">
              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Input
                  type="text"
                  label="Search"
                  placeholder="Name or email..."
                  value={filters.search}
                  onChange={handleSearch}
                />
                <Select
                  label="Role"
                  options={ROLE_OPTIONS}
                  value={filters.filters.role ?? ''}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                />
                <Select
                  label="Verification"
                  options={VERIFICATION_OPTIONS}
                  value={filters.filters.verificationStatus ?? ''}
                  onChange={(e) => handleFilterChange('verificationStatus', e.target.value)}
                />
                <Select
                  label="Status"
                  options={ACTIVE_OPTIONS}
                  value={filters.filters.isActiveStr ?? ''}
                  onChange={(e) => handleFilterChange('isActiveStr', e.target.value)}
                />
              </div>

              {/* Clear Filters */}
              {filtered.length !== users.length && (
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-sage">
                    Showing {filtered.length} of {users.length} users
                  </span>
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-amber hover:text-amber-dark transition-colors"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Table or Empty State */}
              {paginatedUsers.length === 0 ? (
                <EmptyState
                  title="No users found"
                  message="No users match the current filters. Try adjusting your search or filter criteria."
                  action={{ label: 'Clear Filters', onClick: handleClearAll }}
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left">
                        <th className="pb-3 pr-4 text-sage font-medium">Name</th>
                        <th className="pb-3 pr-4 text-sage font-medium">Email</th>
                        <th className="pb-3 pr-4 text-sage font-medium">Role</th>
                        <th className="pb-3 pr-4 text-sage font-medium">Registered</th>
                        <th className="pb-3 pr-4 text-sage font-medium">Verification</th>
                        <th className="pb-3 text-sage font-medium">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <tr
                          key={user.id}
                          onClick={() => setSelectedUser(user)}
                          className={[
                            'border-b border-white/5 cursor-pointer transition-colors hover:bg-white/5',
                            currentSelectedUser?.id === user.id ? 'bg-white/10' : '',
                          ].join(' ')}
                        >
                          <td className="py-3 pr-4 text-white font-medium">
                            {user.name}
                          </td>
                          <td className="py-3 pr-4 text-sage text-xs">
                            {user.email}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              color={user.role === 'admin' ? 'amber' : user.role === 'dealer' ? 'navy' : 'sage'}
                            />
                          </td>
                          <td className="py-3 pr-4 text-sage text-xs">
                            {formatDate(user.registrationDate)}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              label={formatVerificationStatus(user.verificationStatus)}
                              color={getVerificationBadgeColor(user.verificationStatus)}
                              size="sm"
                            />
                          </td>
                          <td className="py-3">
                            <Badge
                              label={user.isActive ? 'Active' : 'Inactive'}
                              color={user.isActive ? 'emerald' : 'sage'}
                              size="sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <span className="text-xs text-sage">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </GlassPanel>
          </div>

          {/* Detail Panel */}
          {currentSelectedUser && (
            <div className="lg:w-96">
              <GlassPanel variant="dark" padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">User Details</h2>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-sage hover:text-white transition-colors"
                    aria-label="Close detail panel"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Info */}
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-sage uppercase tracking-wider mb-1">Name</p>
                    <p className="text-white font-medium">{currentSelectedUser.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sage uppercase tracking-wider mb-1">Email</p>
                    <p className="text-white text-sm">{currentSelectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sage uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-white text-sm">{currentSelectedUser.phone}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-sage uppercase tracking-wider mb-1">Role</p>
                      <Badge
                        label={currentSelectedUser.role.charAt(0).toUpperCase() + currentSelectedUser.role.slice(1)}
                        color={currentSelectedUser.role === 'admin' ? 'amber' : currentSelectedUser.role === 'dealer' ? 'navy' : 'sage'}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-sage uppercase tracking-wider mb-1">Active</p>
                      <Badge
                        label={currentSelectedUser.isActive ? 'Active' : 'Inactive'}
                        color={currentSelectedUser.isActive ? 'emerald' : 'sage'}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-sage uppercase tracking-wider mb-1">Registration Date</p>
                    <p className="text-white text-sm">{formatDate(currentSelectedUser.registrationDate)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-sage uppercase tracking-wider mb-1">Verification Status</p>
                    <Badge
                      label={formatVerificationStatus(currentSelectedUser.verificationStatus)}
                      color={getVerificationBadgeColor(currentSelectedUser.verificationStatus)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-sage uppercase tracking-wider mb-1">Email Verified</p>
                      <Badge
                        label={currentSelectedUser.emailVerified ? 'Yes' : 'No'}
                        color={currentSelectedUser.emailVerified ? 'emerald' : 'sage'}
                        size="sm"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-sage uppercase tracking-wider mb-1">Phone Verified</p>
                      <Badge
                        label={currentSelectedUser.phoneVerified ? 'Yes' : 'No'}
                        color={currentSelectedUser.phoneVerified ? 'emerald' : 'sage'}
                        size="sm"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-sage uppercase tracking-wider mb-1">Profile Completeness</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber rounded-full transition-all"
                          style={{ width: `${currentSelectedUser.profileCompleteness}%` }}
                        />
                      </div>
                      <span className="text-white text-xs font-medium">
                        {currentSelectedUser.profileCompleteness}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                  <Button
                    variant={currentSelectedUser.isActive ? 'outline' : 'primary'}
                    size="sm"
                    className="w-full"
                    onClick={() => handleToggleActive(currentSelectedUser)}
                  >
                    {currentSelectedUser.isActive ? 'Deactivate User' : 'Activate User'}
                  </Button>
                  {currentSelectedUser.verificationStatus !== 'verified' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full"
                      onClick={() => handleVerifyUser(currentSelectedUser.id)}
                    >
                      Verify User
                    </Button>
                  )}
                </div>
              </GlassPanel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

