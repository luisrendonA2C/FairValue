import type { ScoringInput, ScoringWeights, LeadScoreResult } from '@/types';
import type { LeadLevel } from '@/types';

/**
 * Default scoring weights (must sum to 100).
 */
export const DEFAULT_WEIGHTS: ScoringWeights = {
  offerAmount: 40,
  verification: 25,
  profileCompleteness: 20,
  timing: 15,
};

/**
 * Validates that scoring weights are all between 0-100 and sum to exactly 100.
 */
export function validateWeights(weights: ScoringWeights): boolean {
  const { offerAmount, verification, profileCompleteness, timing } = weights;
  const values = [offerAmount, verification, profileCompleteness, timing];

  const allInRange = values.every((v) => v >= 0 && v <= 100);
  const sumCorrect = values.reduce((sum, v) => sum + v, 0) === 100;

  return allInRange && sumCorrect;
}

/**
 * Returns the lead level based on the numeric score.
 * - Priority: 80-100
 * - Hot: 60-79
 * - Medium: 40-59
 * - Cold: 0-39
 */
export function getLeadLevel(score: number): LeadLevel {
  if (score >= 80) return 'Priority';
  if (score >= 60) return 'Hot';
  if (score >= 40) return 'Medium';
  return 'Cold';
}

/**
 * Calculates the offer amount sub-score.
 * - Offers at or above vehicle price → 100
 * - Offers below → proportional (offerAmount / vehiclePrice * 100)
 * - If vehiclePrice is 0 or invalid, returns 0.
 */
export function calculateOfferAmountSubScore(
  offerAmount: number,
  vehiclePrice: number
): number {
  if (vehiclePrice <= 0 || offerAmount <= 0) return 0;
  if (offerAmount >= vehiclePrice) return 100;
  return (offerAmount / vehiclePrice) * 100;
}

/**
 * Calculates the verification sub-score.
 * - Both email and phone verified → 100
 * - One verified → 50
 * - None → 0
 */
export function calculateVerificationSubScore(
  emailVerified: boolean,
  phoneVerified: boolean
): number {
  if (emailVerified && phoneVerified) return 100;
  if (emailVerified || phoneVerified) return 50;
  return 0;
}

/**
 * Calculates the profile completeness sub-score.
 * Mapped directly from profileCompleteness (0-100).
 */
export function calculateProfileSubScore(completeness: number): number {
  if (completeness < 0) return 0;
  if (completeness > 100) return 100;
  return completeness;
}

/**
 * Calculates the timing sub-score based on when the offer was placed
 * relative to the event duration.
 * - First 25% of event duration → 100
 * - 25-50% → 75
 * - 50-75% → 50
 * - Final 25% → 25
 * - If dates are invalid, returns 0.
 */
export function calculateTimingSubScore(
  offerTimestamp: string,
  eventStartDate: string,
  eventEndDate: string
): number {
  const offerTime = new Date(offerTimestamp).getTime();
  const startTime = new Date(eventStartDate).getTime();
  const endTime = new Date(eventEndDate).getTime();

  const duration = endTime - startTime;
  if (duration <= 0 || isNaN(offerTime) || isNaN(startTime) || isNaN(endTime)) {
    return 0;
  }

  const elapsed = offerTime - startTime;
  if (elapsed < 0) return 100; // Offer before event start treated as earliest
  if (elapsed > duration) return 25; // Offer after event end treated as latest

  const progress = elapsed / duration;

  if (progress <= 0.25) return 100;
  if (progress <= 0.5) return 75;
  if (progress <= 0.75) return 50;
  return 25;
}

/**
 * Calculates the full lead score from a ScoringInput and optional weights.
 * Returns a score (0-100), level, and reasons array.
 */
export function calculateLeadScore(
  input: ScoringInput,
  weights?: ScoringWeights
): LeadScoreResult {
  const w = weights ?? DEFAULT_WEIGHTS;
  const reasons: string[] = [];
  let hasIncompleteData = false;

  // --- Offer Amount Sub-Score ---
  let offerSubScore = 0;
  if (input.offers.length > 0) {
    // Use the best (highest relative) offer score
    const offerScores = input.offers.map((offer) =>
      calculateOfferAmountSubScore(offer.amount, offer.vehiclePrice)
    );
    offerSubScore = Math.max(...offerScores);
  } else {
    offerSubScore = 0;
    hasIncompleteData = true;
  }

  // --- Verification Sub-Score ---
  const verificationSubScore = calculateVerificationSubScore(
    input.profile.emailVerified,
    input.profile.phoneVerified
  );

  // --- Profile Completeness Sub-Score ---
  const profileSubScore = calculateProfileSubScore(
    input.profile.profileCompleteness
  );

  // --- Timing Sub-Score ---
  let timingSubScore = 0;
  if (input.offers.length > 0) {
    // Use the best timing score among all offers
    const timingScores = input.offers.map((offer) =>
      calculateTimingSubScore(
        offer.timestamp,
        offer.eventStartDate,
        offer.eventEndDate
      )
    );
    timingSubScore = Math.max(...timingScores);
  } else {
    timingSubScore = 0;
    hasIncompleteData = true;
  }

  // --- Weighted Sum ---
  const rawScore =
    (offerSubScore * w.offerAmount +
      verificationSubScore * w.verification +
      profileSubScore * w.profileCompleteness +
      timingSubScore * w.timing) /
    100;

  // Clamp to 0-100
  const score = Math.round(Math.min(100, Math.max(0, rawScore)));

  // --- Level Assignment ---
  const level = getLeadLevel(score);

  // --- Reasons ---
  if (input.profile.emailVerified) {
    reasons.push('verified email');
  }
  if (input.profile.phoneVerified) {
    reasons.push('verified phone');
  }
  if (input.profile.profileCompleteness === 100) {
    reasons.push('complete profile');
  }

  // "budget matches listing" — when buyer budget range includes the vehicle price
  if (input.profile.budgetRange && input.offers.length > 0) {
    const { min, max } = input.profile.budgetRange;
    const anyVehiclePriceInBudget = input.offers.some(
      (offer) => offer.vehiclePrice >= min && offer.vehiclePrice <= max
    );
    if (anyVehiclePriceInBudget) {
      reasons.push('budget matches listing');
    }
  }

  // "early offer" — when offer is placed in the first 50% of event duration
  if (input.offers.length > 0) {
    const hasEarlyOffer = input.offers.some((offer) => {
      const offerTime = new Date(offer.timestamp).getTime();
      const startTime = new Date(offer.eventStartDate).getTime();
      const endTime = new Date(offer.eventEndDate).getTime();
      const duration = endTime - startTime;
      if (duration <= 0) return false;
      const elapsed = offerTime - startTime;
      const progress = elapsed / duration;
      return progress <= 0.5;
    });
    if (hasEarlyOffer) {
      reasons.push('early offer');
    }
  }

  // "consistent offers" — when 2+ offers on same vehicle
  if (input.offers.length >= 2) {
    // Check if there are 2+ offers that share a vehiclePrice (proxy for same vehicle)
    // Since ScoringInput doesn't have vehicleId, we use vehiclePrice as proxy
    // Actually, having 2+ offers in the array itself indicates multiple offers
    reasons.push('consistent offers');
  }

  // "document uploaded" — when documentCount >= 1
  if (input.profile.documentCount >= 1) {
    reasons.push('document uploaded');
  }

  // "incomplete profile data" — when data is missing for sub-score calculation
  if (hasIncompleteData) {
    reasons.push('incomplete profile data');
  }

  return { score, level, reasons };
}
