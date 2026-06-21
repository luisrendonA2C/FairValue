/**
 * Centralized Image Provider utility
 *
 * Resolves image URLs by entity type and ID. All image URL logic is isolated here
 * so that changing the image source requires modifying only this file.
 *
 * Requirements: 30.3, 30.4, 30.5
 */

export type EntityType = 'vehicle' | 'user' | 'dealer' | 'event' | 'hero';

// ---------------------------------------------------------------------------
// Curated Unsplash vehicle images by body type
// Each vehicle ID maps to an array of 3-5 high-quality Unsplash photos
// ---------------------------------------------------------------------------

const UNSPLASH_BASE = 'https://images.unsplash.com';

const vehicleImages: Record<string, string[]> = {
  // Mapped by vehicle imageIds from mock data
  // Vehicle 001: Toyota RAV4 Hybrid — SUV
  'img-rav4-01': [
    `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=800&q=80`,
  ],
  // Vehicle 002: BMW 330i — Sedan
  'img-bmw330-01': [
    `${UNSPLASH_BASE}/photo-1555215695-3004980ad54e?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1494976388531-d1058494cdd8?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1618843479313-40f8afb4b4d8?w=800&q=80`,
  ],
  // Vehicle 003: Mercedes GLC 300 — SUV
  'img-glc-01': [
    `${UNSPLASH_BASE}/photo-1618843479313-40f8afb4b4d8?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=800&q=80`,
  ],
  // Vehicle 004: Land Cruiser Prado — SUV/Truck
  'img-prado-01': [
    `${UNSPLASH_BASE}/photo-1533473359331-0135ef1b58bf?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
  ],
  // Vehicle 005: Honda CR-V — SUV
  'img-crv-01': [
    `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=800&q=80`,
  ],
  // Vehicle 006: Hyundai Tucson — SUV
  'img-tucson-01': [
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
  ],
  // Vehicle 007: Nissan Frontier — Truck
  'img-frontier-01': [
    `${UNSPLASH_BASE}/photo-1533473359331-0135ef1b58bf?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
  ],
  // Vehicle 008: BMW X3 — SUV
  'img-x3-01': [
    `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1555215695-3004980ad54e?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1494976388531-d1058494cdd8?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1618843479313-40f8afb4b4d8?w=800&q=80`,
  ],
  // Vehicle 009: Mitsubishi Outlander PHEV — SUV
  'img-outlander-01': [
    `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
  ],
  // Vehicle 010: Mercedes C300 AMG — Sedan
  'img-c300-01': [
    `${UNSPLASH_BASE}/photo-1494976388531-d1058494cdd8?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1555215695-3004980ad54e?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1618843479313-40f8afb4b4d8?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=800&q=80`,
  ],
  // Vehicle 011: Honda Civic Type R — Hatchback/Sports
  'img-typer-01': [
    `${UNSPLASH_BASE}/photo-1544636331-e26879cd4d9b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1503376780353-7e6692767b70?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
  ],
  // Vehicle 012: Hyundai Santa Fe — SUV
  'img-santafe-01': [
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=800&q=80`,
  ],
  // Fallback IDs (vehicle-XXX format used as fallback)
  'vehicle-001': [
    `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=800&q=80`,
  ],
  'vehicle-002': [
    `${UNSPLASH_BASE}/photo-1555215695-3004980ad54e?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1494976388531-d1058494cdd8?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1618843479313-40f8afb4b4d8?w=800&q=80`,
  ],
  'vehicle-003': [
    `${UNSPLASH_BASE}/photo-1618843479313-40f8afb4b4d8?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
  ],
  'vehicle-004': [
    `${UNSPLASH_BASE}/photo-1533473359331-0135ef1b58bf?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=800&q=80`,
  ],
  'vehicle-005': [
    `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
  ],
  'vehicle-006': [
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=800&q=80`,
  ],
  'vehicle-007': [
    `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1533473359331-0135ef1b58bf?w=800&q=80`,
  ],
  'vehicle-008': [
    `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1555215695-3004980ad54e?w=800&q=80`,
  ],
  'vehicle-009': [
    `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
  ],
  'vehicle-010': [
    `${UNSPLASH_BASE}/photo-1494976388531-d1058494cdd8?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1555215695-3004980ad54e?w=800&q=80`,
  ],
  'vehicle-011': [
    `${UNSPLASH_BASE}/photo-1544636331-e26879cd4d9b?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1503376780353-7e6692767b70?w=800&q=80`,
  ],
  'vehicle-012': [
    `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=800&q=80`,
    `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=800&q=80`,
  ],
};

// ---------------------------------------------------------------------------
// User avatar images
// ---------------------------------------------------------------------------

const userImages: Record<string, string[]> = {
  'user-001': [`https://api.dicebear.com/7.x/avataaars/svg?seed=buyer1`],
  'user-002': [`https://api.dicebear.com/7.x/avataaars/svg?seed=buyer2`],
  'user-003': [`https://api.dicebear.com/7.x/avataaars/svg?seed=buyer3`],
  'user-004': [`https://api.dicebear.com/7.x/avataaars/svg?seed=buyer4`],
  'user-005': [`https://api.dicebear.com/7.x/avataaars/svg?seed=buyer5`],
  'user-006': [`https://api.dicebear.com/7.x/avataaars/svg?seed=buyer6`],
  'user-007': [`https://api.dicebear.com/7.x/avataaars/svg?seed=buyer7`],
  'user-008': [`https://api.dicebear.com/7.x/avataaars/svg?seed=buyer8`],
  'user-009': [`https://api.dicebear.com/7.x/avataaars/svg?seed=dealer1`],
  'user-010': [`https://api.dicebear.com/7.x/avataaars/svg?seed=dealer2`],
  'user-011': [`https://api.dicebear.com/7.x/avataaars/svg?seed=admin1`],
};

// ---------------------------------------------------------------------------
// Dealer images (dealership/showroom photos)
// ---------------------------------------------------------------------------

const dealerImages: Record<string, string[]> = {
  'dealer-001': [
    `${UNSPLASH_BASE}/photo-1567449303078-57ad995bd329?w=800&q=80`,
  ],
  'dealer-002': [
    `${UNSPLASH_BASE}/photo-1562519776-43a152c40a93?w=800&q=80`,
  ],
  'dealer-003': [
    `${UNSPLASH_BASE}/photo-1580273916550-e323be2ae537?w=800&q=80`,
  ],
  'dealer-004': [
    `${UNSPLASH_BASE}/photo-1549317661-bd32c8ce0db2?w=800&q=80`,
  ],
};

// ---------------------------------------------------------------------------
// Event images
// ---------------------------------------------------------------------------

const eventImages: Record<string, string[]> = {
  'evt-001': [
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
  ],
  'evt-002': [
    `${UNSPLASH_BASE}/photo-1544636331-e26879cd4d9b?w=800&q=80`,
  ],
  'evt-003': [
    `${UNSPLASH_BASE}/photo-1503376780353-7e6692767b70?w=800&q=80`,
  ],
};

// ---------------------------------------------------------------------------
// Hero / Special images (Costa Rica dealership)
// ---------------------------------------------------------------------------

const heroImages: Record<string, string[]> = {
  'costa-rica': [
    `/images/hero-costa-rica.png`,
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=1600&q=80`,
  ],
  'main': [
    `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=1600&q=80`,
    `${UNSPLASH_BASE}/photo-1503376780353-7e6692767b70?w=1600&q=80`,
  ],
};

// ---------------------------------------------------------------------------
// Premium Background Images — for login, sections, decorative panels
// High-quality Unsplash automotive photos curated for Fair Value
// ---------------------------------------------------------------------------

export const premiumBackgrounds = {
  // Login / Auth pages
  login: `${UNSPLASH_BASE}/photo-1618843479313-40f8afb4b4d8?w=1600&q=80`,
  register: `${UNSPLASH_BASE}/photo-1494976388531-d1058494cdd8?w=1600&q=80`,

  // Luxury sedans
  luxurySedan1: `${UNSPLASH_BASE}/photo-1555215695-3004980ad54e?w=1600&q=80`,
  luxurySedan2: `${UNSPLASH_BASE}/photo-1494976388531-d1058494cdd8?w=1600&q=80`,
  luxurySedan3: `${UNSPLASH_BASE}/photo-1617814076367-b759c7d7e738?w=1600&q=80`,

  // SUVs premium
  suvPremium1: `${UNSPLASH_BASE}/photo-1606664515524-ed2f786a0bd6?w=1600&q=80`,
  suvPremium2: `${UNSPLASH_BASE}/photo-1519641471654-76ce0107ad1b?w=1600&q=80`,

  // Sports / performance cars
  sportsCar1: `${UNSPLASH_BASE}/photo-1544636331-e26879cd4d9b?w=1600&q=80`,
  sportsCar2: `${UNSPLASH_BASE}/photo-1503376780353-7e6692767b70?w=1600&q=80`,
  sportsCar3: `${UNSPLASH_BASE}/photo-1618843479313-40f8afb4b4d8?w=1600&q=80`,

  // Showroom / dealership
  showroom1: `${UNSPLASH_BASE}/photo-1567449303078-57ad995bd329?w=1600&q=80`,
  showroom2: `${UNSPLASH_BASE}/photo-1562519776-43a152c40a93?w=1600&q=80`,

  // Dark moody cars (good for dark overlays)
  darkMoody1: `${UNSPLASH_BASE}/photo-1583121274602-3e2820c69888?w=1600&q=80`,
  darkMoody2: `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=1600&q=80`,
  darkMoody3: `${UNSPLASH_BASE}/photo-1558618666-fcd25c85f82e?w=1600&q=80`,

  // Aerial / wide shots
  aerial1: `${UNSPLASH_BASE}/photo-1533473359331-0135ef1b58bf?w=1600&q=80`,

  // Costa Rica hero (local asset)
  costaRica: `/images/hero-costa-rica.png`,
} as const;

/**
 * Get a premium background image URL by key.
 * Useful for login, register, hero sections, and decorative panels.
 */
export function getBackgroundImage(key: keyof typeof premiumBackgrounds): string {
  return premiumBackgrounds[key];
}

// ---------------------------------------------------------------------------
// Fallback URLs per entity type — never returns undefined, null, or empty
// ---------------------------------------------------------------------------

const FALLBACK_URLS: Record<EntityType, string> = {
  vehicle: `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
  user: `https://api.dicebear.com/7.x/avataaars/svg?seed=fallback`,
  dealer: `${UNSPLASH_BASE}/photo-1567449303078-57ad995bd329?w=800&q=80`,
  event: `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
  hero: `${UNSPLASH_BASE}/photo-1492144534655-ae79c964c9d7?w=1600&q=80`,
};

// ---------------------------------------------------------------------------
// Image mapping registry
// ---------------------------------------------------------------------------

const IMAGE_REGISTRY: Record<EntityType, Record<string, string[]>> = {
  vehicle: vehicleImages,
  user: userImages,
  dealer: dealerImages,
  event: eventImages,
  hero: heroImages,
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get a single image URL for an entity.
 * Always returns a valid string URL — never undefined, null, or empty.
 *
 * @param entityType - The type of entity (vehicle, user, dealer, event, hero)
 * @param entityId - The entity's unique identifier
 * @param index - Optional image index (defaults to 0 / first image)
 * @returns A valid image URL string
 */
export function getImageUrl(
  entityType: EntityType,
  entityId: string,
  index: number = 0
): string {
  const registry = IMAGE_REGISTRY[entityType];
  if (!registry) {
    return FALLBACK_URLS[entityType] || FALLBACK_URLS.vehicle;
  }

  const images = registry[entityId];
  if (!images || images.length === 0) {
    return getFallbackUrl(entityType);
  }

  // Clamp the index to the valid range
  const safeIndex = Math.max(0, Math.min(index, images.length - 1));
  return images[safeIndex];
}

/**
 * Get all image URLs for an entity.
 * Always returns a non-empty array — at minimum contains the fallback URL.
 *
 * @param entityType - The type of entity (vehicle, user, dealer, event, hero)
 * @param entityId - The entity's unique identifier
 * @returns An array of valid image URL strings (never empty)
 */
export function getImageUrls(
  entityType: EntityType,
  entityId: string
): string[] {
  const registry = IMAGE_REGISTRY[entityType];
  if (!registry) {
    return [getFallbackUrl(entityType)];
  }

  const images = registry[entityId];
  if (!images || images.length === 0) {
    return [getFallbackUrl(entityType)];
  }

  return [...images];
}

/**
 * Get the fallback/default image URL for an entity type.
 * Always returns a valid string URL — never undefined, null, or empty.
 *
 * @param entityType - The type of entity
 * @returns A valid fallback image URL string
 */
export function getFallbackUrl(entityType: EntityType): string {
  return FALLBACK_URLS[entityType] || FALLBACK_URLS.vehicle;
}
