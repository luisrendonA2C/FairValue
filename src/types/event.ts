export type EventStatus =
  | 'scheduled'
  | 'active'
  | 'closed'
  | 'in_review'
  | 'finished';

export interface Event {
  id: string;
  name: string;
  description: string;
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
  status: EventStatus;
  vehicleIds: string[];
  offerCount: number;
}
