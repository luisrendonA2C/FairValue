'use client';

import { useState, useMemo } from 'react';
import { useMockData } from '@/hooks/useData';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { DealerApprovalStatus } from '@/types';

const ITEMS_PER_PAGE = 20;

const statusBadgeColor: Record<DealerApprovalStatus, 'amber' | 'emerald' | 'sage' | 'navy'> = {
  pending_approval: 'amber',
  approved: 'emerald',
  suspended: 'sage',
  rejected: 'navy',
};

const statusLabels: Record<DealerApprovalStatus, string> = {
  pending_approval: 'Pending Approval',
  approved: 'Approved',
  suspended: 'Suspended',
  rejected: 'Rejected',
};

interface CreateDealerForm {
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  businessAddress: string;
}

interface FormErrors {
  businessName?: string;
  contactEmail?: string;
  contactPhone?: string;
  businessAddress?: string;
}

export default function AdminDealersPage() {
  const { dealers, updateDealerStatus } = useMockData();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Suspend confirmation modal
  const [suspendModalOpen, setSuspendModalOpen] = useState(false);
  const [suspendDealerId, setSuspendDealerId] = useState<string | null>(null);

  // Create dealer modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateDealerForm>({
    businessName: '',
    contactEmail: '',
    contactPhone: '',
    businessAddress: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Success notification
  const [notification, setNotification] = useState<string | null>(null);

  // Pagination logic
  const totalPages = Math.ceil(dealers.length / ITEMS_PER_PAGE);
  const paginatedDealers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return dealers.slice(start, start + ITEMS_PER_PAGE);
  }, [dealers, currentPage]);

  // Show notification with auto-dismiss
  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Approve dealer
  const handleApprove = (dealerId: string) => {
    updateDealerStatus(dealerId, 'approved');
    showNotification('Dealer approved successfully');
  };

  // Reject dealer
  const handleReject = (dealerId: string) => {
    updateDealerStatus(dealerId, 'rejected');
    showNotification('Dealer rejected');
  };

  // Suspend dealer (open confirmation)
  const handleSuspendClick = (dealerId: string) => {
    setSuspendDealerId(dealerId);
    setSuspendModalOpen(true);
  };

  // Confirm suspend
  const handleConfirmSuspend = () => {
    if (suspendDealerId) {
      updateDealerStatus(suspendDealerId, 'suspended');
      showNotification('Dealer suspended — vehicles hidden from public inventory');
    }
    setSuspendModalOpen(false);
    setSuspendDealerId(null);
  };

  // Validate create form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!createForm.businessName.trim()) {
      errors.businessName = 'Business name is required';
    }

    if (!createForm.contactEmail.trim()) {
      errors.contactEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.contactEmail)) {
      errors.contactEmail = 'Invalid email format';
    }

    if (!createForm.contactPhone.trim()) {
      errors.contactPhone = 'Phone number is required';
    }

    if (!createForm.businessAddress.trim()) {
      errors.businessAddress = 'Business address is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit create dealer form
  const handleCreateDealer = () => {
    if (!validateForm()) return;

    // In a real app, this would call an API. Here we just show success.
    showNotification(`Dealer "${createForm.businessName}" created successfully`);
    setCreateModalOpen(false);
    setCreateForm({
      businessName: '',
      contactEmail: '',
      contactPhone: '',
      businessAddress: '',
    });
    setFormErrors({});
  };

  // Format date
  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const suspendingDealer = dealers.find((d) => d.id === suspendDealerId);

  return (
    <div className="bg-navy-dark text-white min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">
              Dealer Management
            </h1>
            <p className="text-sage/80 mt-1">
              Manage dealership registrations, approvals, and statuses
            </p>
          </div>
          <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
            Create Dealer
          </Button>
        </div>

        {/* Success Notification */}
        {notification && (
          <div className="mb-4 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm animate-fade-in">
            {notification}
          </div>
        )}

        {/* Dealers Table */}
        <GlassPanel variant="dark" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Registration
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Vehicles
                  </th>
                  <th className="text-center px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedDealers.map((dealer) => (
                  <tr
                    key={dealer.id}
                    className="hover:bg-white/5 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-white">
                      {dealer.businessName}
                    </td>
                    <td className="px-6 py-4 text-sm text-sage/80">
                      {dealer.contactEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-sage/80">
                      {dealer.contactPhone}
                    </td>
                    <td className="px-6 py-4 text-sm text-sage/80">
                      {formatDate(dealer.registrationDate)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="status"
                        color={statusBadgeColor[dealer.approvalStatus]}
                        label={statusLabels[dealer.approvalStatus]}
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-white text-center">
                      {dealer.vehicleCount}
                    </td>
                    <td className="px-6 py-4 text-sm text-white text-center">
                      {dealer.leadCount}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {dealer.approvalStatus === 'pending_approval' && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleApprove(dealer.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:bg-red-500/10"
                              onClick={() => handleReject(dealer.id)}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                        {dealer.approvalStatus === 'approved' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-amber hover:bg-amber/10"
                            onClick={() => handleSuspendClick(dealer.id)}
                          >
                            Suspend
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <p className="text-sm text-sage/70">
                Page {currentPage} of {totalPages} ({dealers.length} dealers)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </GlassPanel>

        {/* Suspend Confirmation Modal */}
        <Modal
          open={suspendModalOpen}
          onClose={() => {
            setSuspendModalOpen(false);
            setSuspendDealerId(null);
          }}
          title="Confirm Suspension"
          variant="confirmation"
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSuspendModalOpen(false);
                  setSuspendDealerId(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="bg-red-500 hover:bg-red-600"
                onClick={handleConfirmSuspend}
              >
                Suspend Dealer
              </Button>
            </>
          }
        >
          <p className="text-sm text-white-dark/80">
            Are you sure you want to suspend{' '}
            <span className="font-semibold">
              {suspendingDealer?.businessName}
            </span>
            ? This will hide all their vehicles from the public inventory.
          </p>
        </Modal>

        {/* Create Dealer Modal */}
        <Modal
          open={createModalOpen}
          onClose={() => {
            setCreateModalOpen(false);
            setFormErrors({});
          }}
          title="Create New Dealer"
          actions={
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCreateModalOpen(false);
                  setFormErrors({});
                }}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateDealer}>
                Create Dealer
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Business Name"
              value={createForm.businessName}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, businessName: e.target.value }))
              }
              error={formErrors.businessName}
              required
            />
            <Input
              label="Contact Email"
              type="email"
              value={createForm.contactEmail}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, contactEmail: e.target.value }))
              }
              error={formErrors.contactEmail}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              value={createForm.contactPhone}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, contactPhone: e.target.value }))
              }
              error={formErrors.contactPhone}
              required
            />
            <Input
              label="Business Address"
              value={createForm.businessAddress}
              onChange={(e) =>
                setCreateForm((f) => ({ ...f, businessAddress: e.target.value }))
              }
              error={formErrors.businessAddress}
              required
            />
          </div>
        </Modal>
      </div>
    </div>
  );
}

