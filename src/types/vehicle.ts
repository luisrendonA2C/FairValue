export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid';

export type Transmission = 'automatic' | 'manual';

export type BodyType =
  | 'sedan'
  | 'suv'
  | 'truck'
  | 'coupe'
  | 'hatchback'
  | 'convertible'
  | 'van';

export type VehicleStatus =
  | 'draft'
  | 'pending_approval'
  | 'active'
  | 'assigned_to_event'
  | 'closed'
  | 'rejected';

export interface Vehicle {
  id: string;
  dealerId: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: FuelType;
  transmission: Transmission;
  engine: string;
  color: string;
  vin: string;
  bodyType: BodyType;
  price: number;
  description: string;
  status: VehicleStatus;
  imageIds: string[];
  views: number;
  submissionDate: string; // ISO 8601
  eventId?: string;
}
