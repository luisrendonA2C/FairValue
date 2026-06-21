'use client';

import React, { useState, useRef, useCallback } from 'react';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import type { BadgeStatusColor } from '@/components/ui/Badge';

// ─── Types ──────────────────────────────────────────────────────────────────

type DocumentStatus = 'uploaded' | 'under_review' | 'reviewed' | 'approved';

type DocumentType =
  | 'vehicle_title'
  | 'inspection_report'
  | 'spec_sheet'
  | 'additional';

interface VehicleDocument {
  id: string;
  vehicleId: string;
  fileName: string;
  uploadDate: string;
  type: DocumentType;
  status: DocumentStatus;
}

interface VehicleGroup {
  vehicleId: string;
  vehicleName: string;
  documents: VehicleDocument[];
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const ACCEPTED_EXTENSIONS = '.pdf,.png,.jpg,.jpeg';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  vehicle_title: 'Título del Vehículo',
  inspection_report: 'Reporte de Inspección',
  spec_sheet: 'Hoja de Especificaciones',
  additional: 'Documento Adicional',
};

const STATUS_BADGE_MAP: Record<DocumentStatus, { label: string; color: BadgeStatusColor }> = {
  uploaded: { label: 'Subido', color: 'amber' },
  under_review: { label: 'En Revisión', color: 'navy' },
  reviewed: { label: 'Revisado', color: 'sage' },
  approved: { label: 'Aprobado', color: 'emerald' },
};

// ─── Mock Data ──────────────────────────────────────────────────────────────

const MOCK_DOCUMENTS: VehicleDocument[] = [
  {
    id: 'doc-001',
    vehicleId: 'vehicle-001',
    fileName: 'titulo_rav4_2023.pdf',
    uploadDate: '2024-11-01T10:30:00Z',
    type: 'vehicle_title',
    status: 'approved',
  },
  {
    id: 'doc-002',
    vehicleId: 'vehicle-001',
    fileName: 'inspeccion_rav4_nov2024.pdf',
    uploadDate: '2024-11-02T14:00:00Z',
    type: 'inspection_report',
    status: 'reviewed',
  },
  {
    id: 'doc-003',
    vehicleId: 'vehicle-001',
    fileName: 'spec_sheet_rav4.png',
    uploadDate: '2024-11-03T09:15:00Z',
    type: 'spec_sheet',
    status: 'under_review',
  },
  {
    id: 'doc-004',
    vehicleId: 'vehicle-002',
    fileName: 'titulo_bmw330i_2022.pdf',
    uploadDate: '2024-10-28T11:00:00Z',
    type: 'vehicle_title',
    status: 'approved',
  },
  {
    id: 'doc-005',
    vehicleId: 'vehicle-002',
    fileName: 'inspeccion_bmw_oct2024.pdf',
    uploadDate: '2024-10-29T16:45:00Z',
    type: 'inspection_report',
    status: 'under_review',
  },
  {
    id: 'doc-006',
    vehicleId: 'vehicle-003',
    fileName: 'titulo_glc300.pdf',
    uploadDate: '2024-11-05T08:20:00Z',
    type: 'vehicle_title',
    status: 'uploaded',
  },
  {
    id: 'doc-007',
    vehicleId: 'vehicle-003',
    fileName: 'seguro_glc300.jpg',
    uploadDate: '2024-11-05T08:25:00Z',
    type: 'additional',
    status: 'uploaded',
  },
];

const VEHICLE_NAMES: Record<string, string> = {
  'vehicle-001': '2023 Toyota RAV4 Hybrid',
  'vehicle-002': '2022 BMW 330i',
  'vehicle-003': '2023 Mercedes-Benz GLC 300',
};

// ─── Upload Slot Definition ─────────────────────────────────────────────────

interface UploadSlot {
  type: DocumentType;
  label: string;
  key: string;
}

const UPLOAD_SLOTS: UploadSlot[] = [
  { type: 'vehicle_title', label: 'Título del Vehículo', key: 'vehicle_title' },
  { type: 'inspection_report', label: 'Reporte de Inspección', key: 'inspection_report' },
  { type: 'spec_sheet', label: 'Hoja de Especificaciones', key: 'spec_sheet' },
  { type: 'additional', label: 'Documento Adicional 1', key: 'additional_1' },
  { type: 'additional', label: 'Documento Adicional 2', key: 'additional_2' },
  { type: 'additional', label: 'Documento Adicional 3', key: 'additional_3' },
  { type: 'additional', label: 'Documento Adicional 4', key: 'additional_4' },
  { type: 'additional', label: 'Documento Adicional 5', key: 'additional_5' },
];

// ─── Page Component ─────────────────────────────────────────────────────────

export default function DealerDocumentsPage() {
  const [documents, setDocuments] = useState<VehicleDocument[]>(MOCK_DOCUMENTS);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Group documents by vehicle
  const vehicleGroups: VehicleGroup[] = Object.keys(VEHICLE_NAMES).map((vehicleId) => ({
    vehicleId,
    vehicleName: VEHICLE_NAMES[vehicleId],
    documents: documents.filter((doc) => doc.vehicleId === vehicleId),
  }));

  // ─── File Validation ────────────────────────────────────────────────────

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Formato inválido. Solo se permiten archivos PDF, PNG o JPG.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'El archivo excede el límite de 10MB. Por favor suba un archivo más pequeño.';
    }
    return null;
  }, []);

  // ─── Upload Handler ─────────────────────────────────────────────────────

  const handleFileUpload = useCallback(
    (vehicleId: string, slotKey: string, docType: DocumentType, e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const errorKey = `${vehicleId}-${slotKey}`;
      const error = validateFile(file);

      if (error) {
        setErrors((prev) => ({ ...prev, [errorKey]: error }));
        return;
      }

      // Clear error
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[errorKey];
        return updated;
      });

      // Add document to state with "uploaded" status
      const newDoc: VehicleDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        vehicleId,
        fileName: file.name,
        uploadDate: new Date().toISOString(),
        type: docType,
        status: 'uploaded',
      };

      setDocuments((prev) => [...prev, newDoc]);

      // Reset input value so the same file can be re-uploaded
      if (fileInputRefs.current[errorKey]) {
        fileInputRefs.current[errorKey]!.value = '';
      }
    },
    [validateFile]
  );

  // ─── Format Date ────────────────────────────────────────────────────────

  const formatDate = (iso: string): string => {
    const date = new Date(iso);
    return date.toLocaleDateString('es-CR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Documentos</h1>
          <p className="text-sage text-sm">
            Gestione los documentos de sus vehículos. Suba títulos, reportes de inspección, hojas de especificaciones y documentos adicionales.
          </p>
        </div>

        {/* Vehicle Sections */}
        {vehicleGroups.map((group) => (
          <GlassPanel key={group.vehicleId} variant="dark" padding="lg">
            {/* Vehicle Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">{group.vehicleName}</h2>
              <Badge
                label={`${group.documents.length} documentos`}
                variant="count"
                color="navy"
                size="sm"
              />
            </div>

            {/* Existing Documents List */}
            {group.documents.length > 0 && (
              <div className="mb-6 space-y-2">
                <h3 className="text-sm font-medium text-sage mb-3">Documentos Subidos</h3>
                <div className="space-y-2">
                  {group.documents.map((doc) => {
                    const statusInfo = STATUS_BADGE_MAP[doc.status];
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* File Icon */}
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate">{doc.fileName}</p>
                            <p className="text-sage text-xs">
                              {DOCUMENT_TYPE_LABELS[doc.type]} • {formatDate(doc.uploadDate)}
                            </p>
                          </div>
                        </div>
                        <Badge
                          label={statusInfo.label}
                          color={statusInfo.color}
                          size="sm"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upload Areas */}
            <div>
              <h3 className="text-sm font-medium text-sage mb-3">Subir Documentos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {UPLOAD_SLOTS.map((slot) => {
                  const errorKey = `${group.vehicleId}-${slot.key}`;
                  const error = errors[errorKey];

                  return (
                    <div key={slot.key}>
                      <div
                        className="border-2 border-dashed border-white/20 rounded-xl p-4 text-center cursor-pointer hover:border-amber/50 transition-colors"
                        onClick={() => fileInputRefs.current[errorKey]?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            fileInputRefs.current[errorKey]?.click();
                          }
                        }}
                        aria-label={`Subir ${slot.label}`}
                      >
                        <div className="space-y-1">
                          <div className="w-8 h-8 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <p className="text-white text-xs font-medium">{slot.label}</p>
                          <p className="text-sage text-[10px]">PDF, PNG o JPG — Máx 10MB</p>
                        </div>
                        <input
                          ref={(el) => { fileInputRefs.current[errorKey] = el; }}
                          type="file"
                          accept={ACCEPTED_EXTENSIONS}
                          className="hidden"
                          onChange={(e) => handleFileUpload(group.vehicleId, slot.key, slot.type, e)}
                          aria-label={`Subir ${slot.label}`}
                        />
                      </div>
                      {error && (
                        <p className="mt-1 text-xs text-red-400" role="alert">{error}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>
    </GradientBackground>
  );
}
