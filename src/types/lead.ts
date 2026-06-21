export type LeadLevel = 'Cold' | 'Medium' | 'Hot' | 'Priority';

export type LeadStatus =
  | 'generated'
  | 'released'
  | 'selected'
  | 'contacted'
  | 'appointment_scheduled'
  | 'not_interested'
  | 'closed_externally';

export type LeadReleaseStatus = 'unreleased' | 'released';

export interface Lead {
  id: string;
  buyerId: string;
  vehicleId: string;
  dealerId: string;
  eventId: string;
  offerId: string;
  score: number; // 0-100
  level: LeadLevel;
  reasons: string[];
  status: LeadStatus;
  releaseStatus: LeadReleaseStatus;
  isUnlocked: boolean;
  offerAmount: number;
}
