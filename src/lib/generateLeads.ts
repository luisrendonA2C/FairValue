import type { Lead, Offer, Vehicle, User, Event } from '@/types';
import type { ScoringWeights } from '@/types/scoring';
import { calculateLeadScore } from './leadScoring';

/**
 * Generates Lead entries for all offers in an event using actual buyer profiles.
 * Runs calculateLeadScore for each offer with real buyer data.
 *
 * @param event - The event being closed
 * @param eventOffers - All offers associated with this event
 * @param vehicles - All vehicles (to look up price and dealerId)
 * @param users - All users (to look up buyer profiles)
 * @param weights - Optional scoring weights from Admin Settings
 * @returns Array of Lead objects with calculated scores and levels
 */
export function generateLeadsForEvent(
  event: Event,
  eventOffers: Offer[],
  vehicles: Vehicle[],
  users: User[],
  weights?: ScoringWeights
): Lead[] {
  const leads: Lead[] = [];

  // Group offers by buyer to aggregate multiple offers per buyer
  const offersByBuyer = new Map<string, Offer[]>();
  for (const offer of eventOffers) {
    const existing = offersByBuyer.get(offer.buyerId) ?? [];
    existing.push(offer);
    offersByBuyer.set(offer.buyerId, existing);
  }

  // Process each offer individually to generate one lead per offer
  for (const offer of eventOffers) {
    const vehicle = vehicles.find((v) => v.id === offer.vehicleId);
    const buyer = users.find((u) => u.id === offer.buyerId);

    if (!vehicle || !buyer) continue;

    // Gather all offers from this buyer in this event for scoring context
    const buyerOffersInEvent = offersByBuyer.get(offer.buyerId) ?? [offer];

    // Build ScoringInput from real buyer profile data
    const scoringInput = {
      profile: {
        verificationStatus: buyer.verificationStatus,
        emailVerified: buyer.emailVerified,
        phoneVerified: buyer.phoneVerified,
        profileCompleteness: buyer.profileCompleteness,
        documentCount: buyer.verificationStatus === 'verified' ? 2 : 
                       buyer.verificationStatus === 'documents_uploaded' ? 1 : 0,
        budgetRange: buyer.budgetRange,
      },
      offers: buyerOffersInEvent.map((o) => {
        const offerVehicle = vehicles.find((v) => v.id === o.vehicleId);
        return {
          amount: o.amount,
          vehiclePrice: offerVehicle?.price ?? 0,
          timestamp: o.submissionDate,
          eventStartDate: event.startDate,
          eventEndDate: event.endDate,
        };
      }),
    };

    const result = calculateLeadScore(scoringInput, weights);

    const lead: Lead = {
      id: `lead-gen-${event.id}-${offer.id}`,
      buyerId: offer.buyerId,
      vehicleId: offer.vehicleId,
      dealerId: vehicle.dealerId,
      eventId: event.id,
      offerId: offer.id,
      score: result.score,
      level: result.level,
      reasons: result.reasons,
      status: 'generated',
      releaseStatus: 'unreleased',
      isUnlocked: false,
      offerAmount: offer.amount,
    };

    leads.push(lead);
  }

  // Sort leads by score descending (highest score first)
  leads.sort((a, b) => b.score - a.score);

  return leads;
}
