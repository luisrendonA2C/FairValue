'use client';

import { useState, useMemo } from 'react';
import { useMockData } from '@/hooks/useData';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import type { BadgeStatusColor } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';

// ─── Types ──────────────────────────────────────────────────────────────────

type ReviewStatus = 'pending' | 'approved' | 'rejected';

type DocumentType =
  | 'vehicle_title'
  | 'inspection_report'
  | 'spec_sheet'
  | 'insurance'
  | 'registration';

interface AdminDocument {
  id: string;
  dealerId: string;
  dealerName: string;
  vehicleId: string;
  vehicleName: string;
  documentType: DocumentType;
  uploadDate: string;
  reviewStatus: ReviewStatus;
  fileName: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 20;

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  vehicle_title: 'Vehicle Title',
  inspection_report: 'Inspection Report',
  spec_sheet: 'Spec Sheet',
  insurance: 'Insurance Certificate',
  registration: 'Registration',
};

const REVIEW_STATUS_MAP: Record<ReviewStatus, { label: string; color: BadgeStatusColor }> = {
  pending: { label: 'Pending', color: 'amber' },
  approved: { label: 'Approved', color: 'emerald' },
  rejected: { label: 'Rejected', color: 'navy' },
};

// ─── Mock Document Data ─────────────────────────────────────────────────────

const MOCK_DOCUMENTS: AdminDocument[] = [
  {
    id: 'adoc-001',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-001',
    vehicleName: '2023 Toyota RAV4 Hybrid',
    documentType: 'vehicle_title',
    uploadDate: '2024-11-01T10:30:00Z',
    reviewStatus: 'approved',
    fileName: 'titulo_rav4_2023.pdf',
  },
  {
    id: 'adoc-002',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-001',
    vehicleName: '2023 Toyota RAV4 Hybrid',
    documentType: 'inspection_report',
    uploadDate: '2024-11-02T14:00:00Z',
    reviewStatus: 'pending',
    fileName: 'inspeccion_rav4_nov2024.pdf',
  },
  {
    id: 'adoc-003',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-001',
    vehicleName: '2023 Toyota RAV4 Hybrid',
    documentType: 'spec_sheet',
    uploadDate: '2024-11-03T09:15:00Z',
    reviewStatus: 'pending',
    fileName: 'spec_sheet_rav4.png',
  },
  {
    id: 'adoc-004',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-002',
    vehicleName: '2022 BMW 330i',
    documentType: 'vehicle_title',
    uploadDate: '2024-10-28T11:00:00Z',
    reviewStatus: 'approved',
    fileName: 'titulo_bmw330i_2022.pdf',
  },
  {
    id: 'adoc-005',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-002',
    vehicleName: '2022 BMW 330i',
    documentType: 'inspection_report',
    uploadDate: '2024-10-29T16:45:00Z',
    reviewStatus: 'pending',
    fileName: 'inspeccion_bmw_oct2024.pdf',
  },
  {
    id: 'adoc-006',
    dealerId: 'dealer-002',
    dealerName: 'Motor City Costa Rica',
    vehicleId: 'vehicle-006',
    vehicleName: '2023 Hyundai Tucson',
    documentType: 'vehicle_title',
    uploadDate: '2024-11-05T08:20:00Z',
    reviewStatus: 'pending',
    fileName: 'titulo_tucson_2023.pdf',
  },
  {
    id: 'adoc-007',
    dealerId: 'dealer-002',
    dealerName: 'Motor City Costa Rica',
    vehicleId: 'vehicle-006',
    vehicleName: '2023 Hyundai Tucson',
    documentType: 'insurance',
    uploadDate: '2024-11-05T08:25:00Z',
    reviewStatus: 'rejected',
    fileName: 'seguro_tucson_expired.pdf',
  },
  {
    id: 'adoc-008',
    dealerId: 'dealer-002',
    dealerName: 'Motor City Costa Rica',
    vehicleId: 'vehicle-007',
    vehicleName: '2022 Nissan Frontier',
    documentType: 'registration',
    uploadDate: '2024-10-30T13:00:00Z',
    reviewStatus: 'approved',
    fileName: 'registro_frontier_2022.pdf',
  },
  {
    id: 'adoc-009',
    dealerId: 'dealer-002',
    dealerName: 'Motor City Costa Rica',
    vehicleId: 'vehicle-007',
    vehicleName: '2022 Nissan Frontier',
    documentType: 'spec_sheet',
    uploadDate: '2024-10-31T10:15:00Z',
    reviewStatus: 'pending',
    fileName: 'specs_frontier.pdf',
  },
  {
    id: 'adoc-010',
    dealerId: 'dealer-003',
    dealerName: 'Elite Autos CR',
    vehicleId: 'vehicle-010',
    vehicleName: '2022 Mercedes-Benz C 300 AMG',
    documentType: 'vehicle_title',
    uploadDate: '2024-11-06T09:00:00Z',
    reviewStatus: 'approved',
    fileName: 'titulo_c300_amg.pdf',
  },
  {
    id: 'adoc-011',
    dealerId: 'dealer-003',
    dealerName: 'Elite Autos CR',
    vehicleId: 'vehicle-010',
    vehicleName: '2022 Mercedes-Benz C 300 AMG',
    documentType: 'inspection_report',
    uploadDate: '2024-11-07T11:30:00Z',
    reviewStatus: 'pending',
    fileName: 'inspeccion_c300_nov2024.pdf',
  },
  {
    id: 'adoc-012',
    dealerId: 'dealer-003',
    dealerName: 'Elite Autos CR',
    vehicleId: 'vehicle-011',
    vehicleName: '2023 Honda Civic Type R',
    documentType: 'vehicle_title',
    uploadDate: '2024-08-10T14:00:00Z',
    reviewStatus: 'approved',
    fileName: 'titulo_civic_type_r.pdf',
  },
  {
    id: 'adoc-013',
    dealerId: 'dealer-003',
    dealerName: 'Elite Autos CR',
    vehicleId: 'vehicle-011',
    vehicleName: '2023 Honda Civic Type R',
    documentType: 'spec_sheet',
    uploadDate: '2024-08-11T09:45:00Z',
    reviewStatus: 'approved',
    fileName: 'specs_civic_type_r.pdf',
  },
  {
    id: 'adoc-014',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-003',
    vehicleName: '2023 Mercedes-Benz GLC 300',
    documentType: 'vehicle_title',
    uploadDate: '2024-11-08T08:00:00Z',
    reviewStatus: 'pending',
    fileName: 'titulo_glc300_2023.pdf',
  },
  {
    id: 'adoc-015',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-003',
    vehicleName: '2023 Mercedes-Benz GLC 300',
    documentType: 'registration',
    uploadDate: '2024-11-08T08:10:00Z',
    reviewStatus: 'pending',
    fileName: 'registro_glc300.pdf',
  },
  {
    id: 'adoc-016',
    dealerId: 'dealer-002',
    dealerName: 'Motor City Costa Rica',
    vehicleId: 'vehicle-008',
    vehicleName: '2023 BMW X3 xDrive30i',
    documentType: 'vehicle_title',
    uploadDate: '2024-11-09T10:00:00Z',
    reviewStatus: 'pending',
    fileName: 'titulo_x3_2023.pdf',
  },
  {
    id: 'adoc-017',
    dealerId: 'dealer-002',
    dealerName: 'Motor City Costa Rica',
    vehicleId: 'vehicle-008',
    vehicleName: '2023 BMW X3 xDrive30i',
    documentType: 'insurance',
    uploadDate: '2024-11-09T10:15:00Z',
    reviewStatus: 'approved',
    fileName: 'seguro_x3_vigente.pdf',
  },
  {
    id: 'adoc-018',
    dealerId: 'dealer-003',
    dealerName: 'Elite Autos CR',
    vehicleId: 'vehicle-012',
    vehicleName: '2024 Hyundai Santa Fe',
    documentType: 'vehicle_title',
    uploadDate: '2024-12-08T15:00:00Z',
    reviewStatus: 'pending',
    fileName: 'titulo_santafe_2024.pdf',
  },
  {
    id: 'adoc-019',
    dealerId: 'dealer-003',
    dealerName: 'Elite Autos CR',
    vehicleId: 'vehicle-012',
    vehicleName: '2024 Hyundai Santa Fe',
    documentType: 'inspection_report',
    uploadDate: '2024-12-09T09:00:00Z',
    reviewStatus: 'pending',
    fileName: 'inspeccion_santafe_dic2024.pdf',
  },
  {
    id: 'adoc-020',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-004',
    vehicleName: '2021 Toyota Land Cruiser Prado',
    documentType: 'spec_sheet',
    uploadDate: '2024-11-10T11:30:00Z',
    reviewStatus: 'rejected',
    fileName: 'specs_prado_incomplete.pdf',
  },
  {
    id: 'adoc-021',
    dealerId: 'dealer-001',
    dealerName: 'Auto Premium CR',
    vehicleId: 'vehicle-005',
    vehicleName: '2022 Honda CR-V',
    documentType: 'vehicle_title',
    uploadDate: '2024-12-05T11:00:00Z',
    reviewStatus: 'pending',
    fileName: 'titulo_crv_2022.pdf',
  },
  {
    id: 'adoc-022',
    dealerId: 'dealer-002',
    dealerName: 'Motor City Costa Rica',
    vehicleId: 'vehicle-009',
    vehicleName: '2023 Mitsubishi Outlander PHEV',
    documentType: 'vehicle_title',
    uploadDate: '2024-10-26T10:00:00Z',
    reviewStatus: 'approved',
    fileName: 'titulo_outlander_phev.pdf',
  },
  {
    id: 'adoc-023',
    dealerId: 'dealer-002',
    dealerName: 'Motor City Costa Rica',
    vehicleId: 'vehicle-009',
    vehicleName: '2023 Mitsubishi Outlander PHEV',
    documentType: 'inspection_report',
    uploadDate: '2024-10-27T14:30:00Z',
    reviewStatus: 'pending',
    fileName: 'inspeccion_outlander_oct2024.pdf',
  },
];

// ─── Page Component ─────────────────────────────────────────────────────────

export default function AdminDocumentsPage() {
  const { vehicles } = useMockData();

  // Document state
  const [documents, setDocuments] = useState<AdminDocument[]>(MOCK_DOCUMENTS);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dealerFilter, setDealerFilter] = useState<string>('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Notification
  const [notification, setNotification] = useState<string | null>(null);

  // Generate Vehicle Specs modal
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [generatingDocId, setGeneratingDocId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSpecs, setGeneratedSpecs] = useState<Record<string, string> | null>(null);

  // ─── Filter Logic ───────────────────────────────────────────────────────

  const filteredDocuments = useMemo(() => {
    let result = documents;

    if (statusFilter !== 'all') {
      result = result.filter((doc) => doc.reviewStatus === statusFilter);
    }

    if (dealerFilter !== 'all') {
      result = result.filter((doc) => doc.dealerId === dealerFilter);
    }

    return result;
  }, [documents, statusFilter, dealerFilter]);

  // ─── Pagination Logic ───────────────────────────────────────────────────

  const totalPages = Math.ceil(filteredDocuments.length / ITEMS_PER_PAGE);
  const paginatedDocuments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredDocuments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredDocuments, currentPage]);

  // Reset page when filters change
  const handleStatusFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleDealerFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDealerFilter(e.target.value);
    setCurrentPage(1);
  };

  // ─── Actions ────────────────────────────────────────────────────────────

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApprove = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, reviewStatus: 'approved' as ReviewStatus } : doc
      )
    );
    showNotification('Document approved successfully');
  };

  const handleReject = (docId: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, reviewStatus: 'rejected' as ReviewStatus } : doc
      )
    );
    showNotification('Document rejected');
  };

  const handleGenerateSpecs = (docId: string) => {
    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    setGeneratingDocId(docId);
    setGenerateModalOpen(true);
    setIsGenerating(true);
    setGeneratedSpecs(null);

    // Simulate extraction with 2-second delay
    setTimeout(() => {
      // Find the vehicle data to create realistic mock specs
      const vehicle = vehicles.find((v) => v.id === doc.vehicleId);

      setGeneratedSpecs({
        make: vehicle?.make ?? 'Toyota',
        model: vehicle?.model ?? 'RAV4',
        year: String(vehicle?.year ?? 2023),
        mileage: `${(vehicle?.mileage ?? 15000).toLocaleString()} km`,
        engine: vehicle?.engine ?? '2.0L 4-Cylinder',
        transmission: vehicle?.transmission ?? 'automatic',
        fuelType: vehicle?.fuelType ?? 'gasoline',
        color: vehicle?.color ?? 'White',
        vin: vehicle?.vin ?? 'JTMAB3FV5PD000000',
        bodyType: vehicle?.bodyType ?? 'sedan',
      });
      setIsGenerating(false);
    }, 2000);
  };

  const closeGenerateModal = () => {
    setGenerateModalOpen(false);
    setGeneratingDocId(null);
    setIsGenerating(false);
    setGeneratedSpecs(null);
  };

  // ─── Unique Dealers for Filter ──────────────────────────────────────────

  const dealerOptions = useMemo(() => {
    const uniqueDealers = Array.from(
      new Map(documents.map((d) => [d.dealerId, d.dealerName])).entries()
    );
    return [
      { value: 'all', label: 'All Dealers' },
      ...uniqueDealers.map(([id, name]) => ({ value: id, label: name })),
    ];
  }, [documents]);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // ─── Format Date ────────────────────────────────────────────────────────

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="bg-navy-dark text-white min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">
              Document Review
            </h1>
            <p className="text-sage/80 mt-1">
              Review and approve dealer-uploaded documents for vehicle verification
            </p>
          </div>
          <Badge
            variant="count"
            color="amber"
            label={`${filteredDocuments.filter((d) => d.reviewStatus === 'pending').length} pending`}
            size="md"
          />
        </div>

        {/* Success Notification */}
        {notification && (
          <div className="mb-4 px-4 py-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm animate-fade-in">
            {notification}
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Select
            label="Review Status"
            options={statusOptions}
            value={statusFilter}
            onChange={handleStatusFilter}
          />
          <Select
            label="Dealer"
            options={dealerOptions}
            value={dealerFilter}
            onChange={handleDealerFilter}
          />
        </div>

        {/* Documents Table */}
        <GlassPanel variant="dark" padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Dealer
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Document Type
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Upload Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-sage/70 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedDocuments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-sage/60 text-sm">
                      No documents found matching the current filters.
                    </td>
                  </tr>
                ) : (
                  paginatedDocuments.map((doc) => {
                    const statusInfo = REVIEW_STATUS_MAP[doc.reviewStatus];
                    return (
                      <tr
                        key={doc.id}
                        className="hover:bg-white/5 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-white">
                          {doc.dealerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-sage/80">
                          {doc.vehicleName}
                        </td>
                        <td className="px-6 py-4 text-sm text-sage/80">
                          {DOCUMENT_TYPE_LABELS[doc.documentType]}
                        </td>
                        <td className="px-6 py-4 text-sm text-sage/80">
                          {formatDate(doc.uploadDate)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant="status"
                            color={statusInfo.color}
                            label={statusInfo.label}
                            size="sm"
                          />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {doc.reviewStatus === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleApprove(doc.id)}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-400 hover:bg-red-500/10"
                                  onClick={() => handleReject(doc.id)}
                                >
                                  Reject
                                </Button>
                              </>
                            )}
                            {doc.documentType === 'spec_sheet' && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-amber hover:bg-amber/10"
                                onClick={() => handleGenerateSpecs(doc.id)}
                              >
                                Generate Specs
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
              <p className="text-sm text-sage/70">
                Page {currentPage} of {totalPages} ({filteredDocuments.length} documents)
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

        {/* Generate Vehicle Specs Modal */}
        <Modal
          open={generateModalOpen}
          onClose={closeGenerateModal}
          title="Generate Vehicle Specs from Document"
          actions={
            <>
              <Button variant="ghost" size="sm" onClick={closeGenerateModal}>
                Close
              </Button>
              {generatedSpecs && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    showNotification('Vehicle specs applied to form successfully');
                    closeGenerateModal();
                  }}
                >
                  Apply to Vehicle Form
                </Button>
              )}
            </>
          }
        >
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-10 h-10 border-3 border-amber/30 border-t-amber rounded-full animate-spin mb-4" />
              <p className="text-sm text-white-dark/70">
                Extracting vehicle specifications from document...
              </p>
              <p className="text-xs text-sage mt-1">
                This may take a few seconds
              </p>
            </div>
          ) : generatedSpecs ? (
            <div className="space-y-3">
              <p className="text-sm text-white-dark/70 mb-4">
                The following vehicle specifications were extracted from the document:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(generatedSpecs).map(([key, value]) => (
                  <div
                    key={key}
                    className="bg-sage/5 border border-sage/10 rounded-lg px-3 py-2"
                  >
                    <p className="text-xs text-sage font-medium uppercase">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-sm text-white-dark font-medium mt-0.5">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </div>
  );
}

