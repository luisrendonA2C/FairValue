import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';

// ─── Types ──────────────────────────────────────────────────────────────────

type AuditActionType = 'admin' | 'registration' | 'approval' | 'event' | 'lead' | 'config';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  description: string;
  actor: string;
  actionType: AuditActionType;
}

// ─── Mock Audit Log Data ────────────────────────────────────────────────────

const auditLogEntries: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2024-12-15 16:45',
    description: 'Admin approved dealer Auto Premium CR',
    actor: 'Admin Luis',
    actionType: 'approval',
  },
  {
    id: 'audit-002',
    timestamp: '2024-12-15 16:20',
    description: 'User buyer-001 registered',
    actor: 'System',
    actionType: 'registration',
  },
  {
    id: 'audit-003',
    timestamp: '2024-12-15 15:55',
    description: 'Vehicle 2023 Toyota RAV4 approved',
    actor: 'Admin María',
    actionType: 'approval',
  },
  {
    id: 'audit-004',
    timestamp: '2024-12-15 15:30',
    description: "Event 'Subasta Premium Diciembre' status changed to active",
    actor: 'Admin Luis',
    actionType: 'event',
  },
  {
    id: 'audit-005',
    timestamp: '2024-12-15 14:48',
    description: 'Lead lead-001 released to dealer',
    actor: 'System',
    actionType: 'lead',
  },
  {
    id: 'audit-006',
    timestamp: '2024-12-15 14:10',
    description: 'Scoring weights updated (40/25/20/15)',
    actor: 'Admin Luis',
    actionType: 'config',
  },
  {
    id: 'audit-007',
    timestamp: '2024-12-15 13:35',
    description: 'Admin deactivated user buyer-006',
    actor: 'Admin María',
    actionType: 'admin',
  },
  {
    id: 'audit-008',
    timestamp: '2024-12-15 12:50',
    description: 'Dealer Motor City CR documents verified',
    actor: 'Admin Luis',
    actionType: 'approval',
  },
  {
    id: 'audit-009',
    timestamp: '2024-12-15 11:22',
    description: 'User buyer-003 registered',
    actor: 'System',
    actionType: 'registration',
  },
  {
    id: 'audit-010',
    timestamp: '2024-12-15 10:45',
    description: "Event 'Subasta Fin de Año' created",
    actor: 'Admin María',
    actionType: 'event',
  },
  {
    id: 'audit-011',
    timestamp: '2024-12-14 17:30',
    description: 'Vehicle 2022 Hyundai Tucson rejected — missing documentation',
    actor: 'Admin Luis',
    actionType: 'approval',
  },
  {
    id: 'audit-012',
    timestamp: '2024-12-14 16:15',
    description: 'Lead lead-004 released to dealer Autos del Valle',
    actor: 'System',
    actionType: 'lead',
  },
  {
    id: 'audit-013',
    timestamp: '2024-12-14 15:40',
    description: 'Admin activated user dealer-002',
    actor: 'Admin Luis',
    actionType: 'admin',
  },
  {
    id: 'audit-014',
    timestamp: '2024-12-14 14:55',
    description: 'User buyer-005 registered',
    actor: 'System',
    actionType: 'registration',
  },
  {
    id: 'audit-015',
    timestamp: '2024-12-14 14:10',
    description: "Event 'Subasta Premium Diciembre' status changed to scheduled",
    actor: 'Admin María',
    actionType: 'event',
  },
  {
    id: 'audit-016',
    timestamp: '2024-12-14 13:20',
    description: 'Vehicle 2024 BMW X3 approved',
    actor: 'Admin Luis',
    actionType: 'approval',
  },
  {
    id: 'audit-017',
    timestamp: '2024-12-14 12:00',
    description: 'Dealer Autos del Valle approved',
    actor: 'Admin María',
    actionType: 'approval',
  },
  {
    id: 'audit-018',
    timestamp: '2024-12-14 10:45',
    description: 'Lead lead-007 released to dealer Motor City CR',
    actor: 'System',
    actionType: 'lead',
  },
  {
    id: 'audit-019',
    timestamp: '2024-12-14 09:30',
    description: 'Platform scoring configuration reset to defaults',
    actor: 'Admin Luis',
    actionType: 'config',
  },
  {
    id: 'audit-020',
    timestamp: '2024-12-13 18:15',
    description: 'User buyer-008 registered',
    actor: 'System',
    actionType: 'registration',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function getActionTypeBadge(actionType: AuditActionType) {
  const map: Record<AuditActionType, { label: string; color: 'amber' | 'navy' | 'emerald' | 'sage' }> = {
    admin: { label: 'Admin', color: 'amber' },
    registration: { label: 'Registration', color: 'navy' },
    approval: { label: 'Approval', color: 'emerald' },
    event: { label: 'Event', color: 'sage' },
    lead: { label: 'Lead', color: 'navy' },
    config: { label: 'Config', color: 'amber' },
  };
  return map[actionType];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AdminAuditLogPage() {
  // Data is already sorted descending chronological
  const entries = auditLogEntries;

  return (
    <div className="bg-navy-dark text-white min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            Audit Log
          </h1>
          <p className="text-sage text-sm">
            Registro de las 20 acciones más recientes en la plataforma.
          </p>
        </div>

        {/* Audit Table */}
        <GlassPanel variant="dark" padding="md">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="pb-3 pr-4 text-sage font-medium w-44">Timestamp</th>
                  <th className="pb-3 pr-4 text-sage font-medium">Description</th>
                  <th className="pb-3 pr-4 text-sage font-medium w-32">Actor</th>
                  <th className="pb-3 text-sage font-medium w-28">Type</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => {
                  const badge = getActionTypeBadge(entry.actionType);
                  return (
                    <tr
                      key={entry.id}
                      className="border-b border-white/5 transition-colors hover:bg-white/5"
                    >
                      <td className="py-3 pr-4">
                        <span className="font-mono text-xs text-white/80">
                          {entry.timestamp}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-white">
                        {entry.description}
                      </td>
                      <td className="py-3 pr-4 text-sage text-xs">
                        {entry.actor}
                      </td>
                      <td className="py-3">
                        <Badge
                          label={badge.label}
                          color={badge.color}
                          size="sm"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Info */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <p className="text-xs text-sage">
              Mostrando las {entries.length} entradas más recientes — ordenadas por fecha descendente.
            </p>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

