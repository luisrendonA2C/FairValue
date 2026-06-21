export type UserRole = 'buyer' | 'dealer' | 'admin';

export type VerificationStatus =
  | 'not_started'
  | 'documents_uploaded'
  | 'under_review'
  | 'verified'
  | 'rejected';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  registrationDate: string; // ISO 8601
  isActive: boolean;
  profilePhoto?: string;
  verificationStatus: VerificationStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  // Buyer-specific
  budgetRange?: { min: number; max: number };
  preferredLocation?: string;
  vehiclePreferences?: {
    preferredType?: string;
    yearRange?: { min: number; max: number };
    preferredMake?: string;
  };
  profileCompleteness: number; // 0-100
}
