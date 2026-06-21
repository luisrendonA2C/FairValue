export type OfferStatus =
  | 'received'
  | 'surpassed'
  | 'in_review'
  | 'selected'
  | 'not_selected';

export interface Offer {
  id: string;
  buyerId: string;
  vehicleId: string;
  eventId: string;
  amount: number;
  submissionDate: string; // ISO 8601
  status: OfferStatus;
}
