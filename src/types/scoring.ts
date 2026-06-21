export interface ScoringWeights {
  offerAmount: number; // 0-100, default 40
  verification: number; // 0-100, default 25
  profileCompleteness: number; // 0-100, default 20
  timing: number; // 0-100, default 15
}

export interface LeadScoreResult {
  score: number; // 0-100
  level: 'Cold' | 'Medium' | 'Hot' | 'Priority';
  reasons: string[];
}

export interface ScoringInput {
  profile: {
    verificationStatus: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    profileCompleteness: number;
    budgetRange?: { min: number; max: number };
    documentCount: number;
  };
  offers: Array<{
    amount: number;
    timestamp: string;
    vehiclePrice: number;
    eventStartDate: string;
    eventEndDate: string;
  }>;
}
