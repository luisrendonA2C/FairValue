export type DealerApprovalStatus =
  | 'pending_approval'
  | 'approved'
  | 'suspended'
  | 'rejected';

export interface Dealer {
  id: string;
  userId: string;
  businessName: string;
  contactEmail: string;
  contactPhone: string;
  businessAddress: string;
  registrationDate: string; // ISO 8601
  approvalStatus: DealerApprovalStatus;
  vehicleCount: number;
  leadCount: number;
}
