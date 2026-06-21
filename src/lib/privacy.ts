import type { EventStatus, LeadStatus, User, Dealer, Event } from '@/types';

/**
 * Privacy & Data Unlock Utility
 *
 * Centralizes all privacy logic for the Fair Value platform:
 * - Buyer anonymization during active/upcoming events
 * - Dealer identity hiding during active events
 * - Data lock/unlock state determination
 * - Unlock transitions on lead selection
 */

/**
 * Determines whether buyer data should be anonymized based on event status and unlock state.
 * Buyers are anonymized during scheduled, active, and closed events (until lead is selected).
 */
export function shouldAnonymizeBuyer(
  eventStatus: EventStatus,
  isUnlocked: boolean
): boolean {
  if (isUnlocked) return false;
  // Anonymize during scheduled (upcoming), active, closed, and in_review events
  // Only reveal when finished OR explicitly unlocked
  return eventStatus !== 'finished';
}

/**
 * Determines whether dealer identity should be anonymized.
 * Dealers are hidden during scheduled (upcoming) and active events.
 */
export function shouldAnonymizeDealer(eventStatus: EventStatus): boolean {
  return eventStatus === 'scheduled' || eventStatus === 'active';
}

/**
 * Determines if data should be locked (blurred/overlaid).
 * Data is locked when the event is not finished and the lead has not been unlocked.
 */
export function isDataLocked(
  eventStatus: EventStatus,
  leadStatus?: LeadStatus,
  isUnlocked?: boolean
): boolean {
  // If explicitly unlocked via lead selection, data is not locked
  if (isUnlocked) return false;

  // Data is unlocked only when event is finished OR lead has been selected
  if (eventStatus === 'finished') return false;
  if (leadStatus === 'selected' || leadStatus === 'contacted' || leadStatus === 'appointment_scheduled') {
    return false;
  }

  return true;
}

/**
 * Returns an anonymized buyer name like "Buyer #N".
 * The index is derived from the buyer's position in the user list for the given event,
 * or based on a hash of the buyerId for consistency.
 */
export function getAnonymizedBuyerName(
  buyerId: string,
  eventId: string,
  users: User[],
  events: Event[]
): string {
  const event = events.find((e) => e.id === eventId);

  // If no event found or event is finished, return real name
  if (!event) {
    const user = users.find((u) => u.id === buyerId);
    return user?.name ?? 'Unknown Buyer';
  }

  if (event.status === 'finished') {
    const user = users.find((u) => u.id === buyerId);
    return user?.name ?? 'Unknown Buyer';
  }

  // Generate a consistent numeric index from the buyerId
  const buyerIndex = generateConsistentIndex(buyerId);
  return `Buyer #${buyerIndex}`;
}

/**
 * Returns an anonymized dealer name ("Verified Dealer") during active/upcoming events,
 * or the real business name otherwise.
 */
export function getAnonymizedDealerName(
  dealerId: string,
  eventId: string,
  dealers: Dealer[],
  events: Event[]
): string {
  const event = events.find((e) => e.id === eventId);
  const dealer = dealers.find((d) => d.id === dealerId);

  // If no event found, return real name
  if (!event) {
    return dealer?.businessName ?? 'Unknown Dealer';
  }

  // Only anonymize during scheduled/active events
  if (shouldAnonymizeDealer(event.status)) {
    return 'Verified Dealer';
  }

  return dealer?.businessName ?? 'Unknown Dealer';
}

/**
 * Generates a consistent numeric index from a string ID.
 * Uses a simple hash to ensure the same ID always produces the same number.
 */
function generateConsistentIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    const char = id.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Return a positive number between 1 and 999
  return (Math.abs(hash) % 999) + 1;
}

/**
 * Returns the buyer display data based on lock state.
 * When locked: anonymized name, no contact info.
 * When unlocked: full name, email, phone.
 */
export function getBuyerDisplayData(
  buyerId: string,
  eventId: string,
  users: User[],
  events: Event[],
  isUnlocked: boolean
): { name: string; email: string | null; phone: string | null } {
  const user = users.find((u) => u.id === buyerId);
  const event = events.find((e) => e.id === eventId);

  if (!user) {
    return { name: 'Unknown Buyer', email: null, phone: null };
  }

  const anonymize = shouldAnonymizeBuyer(event?.status ?? 'active', isUnlocked);

  if (anonymize) {
    return {
      name: getAnonymizedBuyerName(buyerId, eventId, users, events),
      email: null,
      phone: null,
    };
  }

  return {
    name: user.name,
    email: user.email,
    phone: user.phone,
  };
}

/**
 * Returns the dealer display data based on lock state.
 * When locked: "Verified Dealer", no contact info.
 * When unlocked: full business name, email, phone.
 */
export function getDealerDisplayData(
  dealerId: string,
  eventId: string,
  dealers: Dealer[],
  events: Event[]
): { name: string; email: string | null; phone: string | null } {
  const dealer = dealers.find((d) => d.id === dealerId);
  const event = events.find((e) => e.id === eventId);

  if (!dealer) {
    return { name: 'Unknown Dealer', email: null, phone: null };
  }

  const anonymize = shouldAnonymizeDealer(event?.status ?? 'active');

  if (anonymize) {
    return {
      name: 'Verified Dealer',
      email: null,
      phone: null,
    };
  }

  return {
    name: dealer.businessName,
    email: dealer.contactEmail,
    phone: dealer.contactPhone,
  };
}
