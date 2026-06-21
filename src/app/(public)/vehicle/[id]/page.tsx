'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { vehicles, offers, events } from '@/data';
import { getImageUrls } from '@/lib/imageProvider';
import { Gallery } from '@/components/shared/Gallery';
import { VehicleCard } from '@/components/shared/VehicleCard';
import { CountdownTimer } from '@/components/shared/CountdownTimer';
import { PrivacyNotice } from '@/components/shared/PrivacyNotice';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

// ─── Helpers ────────────────────────────────────────────────────────────────

function maskVin(vin: string): string {
  if (vin.length <= 4) return vin;
  return '*'.repeat(vin.length - 4) + vin.slice(-4);
}

function formatPrice(amount: number): string {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString('en-US')} km`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function timeAgo(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function getStatusBadge(status: string): { label: string; color: 'amber' | 'emerald' | 'sage' | 'navy' } {
  switch (status) {
    case 'active':
    case 'assigned_to_event':
      return { label: 'Active', color: 'emerald' };
    case 'scheduled':
      return { label: 'Scheduled', color: 'amber' };
    case 'closed':
    case 'finished':
      return { label: 'Closed', color: 'sage' };
    case 'in_review':
      return { label: 'In Review', color: 'navy' };
    default:
      return { label: capitalize(status), color: 'sage' };
  }
}

// ─── Mock anonymous offer history generator ─────────────────────────────────

function generateAnonymousOffers(vehicleId: string, basePrice: number) {
  const vehicleOffers = offers
    .filter((o) => o.vehicleId === vehicleId)
    .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());

  if (vehicleOffers.length >= 5) {
    return vehicleOffers.slice(0, 8).map((o, idx) => ({
      id: o.id,
      amount: o.amount,
      time: timeAgo(o.submissionDate),
      buyerLabel: `Buyer #${String(100 + idx).slice(-3)}`,
    }));
  }

  // If not enough real offers, generate some mock ones
  const mockOffers = [];
  const base = basePrice * 0.9;
  for (let i = 0; i < 7; i++) {
    const variance = Math.random() * 0.15 - 0.05;
    const amount = Math.round((base + base * variance) / 100) * 100;
    const hoursAgo = Math.floor(Math.random() * 48) + 1;
    mockOffers.push({
      id: `mock-offer-${vehicleId}-${i}`,
      amount,
      time: hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo / 24)}d ago`,
      buyerLabel: `Buyer #${String(200 + i).slice(-3)}`,
    });
  }
  return mockOffers.sort((a, b) => b.amount - a.amount);
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function VehicleDetailPage() {
  const params = useParams();
  const vehicleId = params.id as string;

  const { showToast } = useToast();
  const [isFavorited, setIsFavorited] = useState(false);
  const [offerAmount, setOfferAmount] = useState('');
  const [offerSubmitted, setOfferSubmitted] = useState(false);

  // Find the vehicle
  const vehicle = useMemo(() => vehicles.find((v) => v.id === vehicleId), [vehicleId]);

  // Get images for gallery
  const galleryImages = useMemo(() => {
    if (!vehicle) return [];
    return getImageUrls('vehicle', vehicle.imageIds[0] || vehicle.id);
  }, [vehicle]);

  // Get offers for this vehicle
  const vehicleOffers = useMemo(() => {
    return offers
      .filter((o) => o.vehicleId === vehicleId)
      .sort((a, b) => b.amount - a.amount);
  }, [vehicleId]);

  // Highest offer
  const highestOffer = useMemo(() => {
    if (vehicleOffers.length === 0) return null;
    return vehicleOffers[0];
  }, [vehicleOffers]);

  // Associated event
  const associatedEvent = useMemo(() => {
    if (!vehicle?.eventId) return null;
    return events.find((e) => e.id === vehicle.eventId) || null;
  }, [vehicle]);

  // Similar vehicles
  const similarVehicles = useMemo(() => {
    if (!vehicle) return [];
    return vehicles
      .filter(
        (v) =>
          v.id !== vehicle.id &&
          (v.bodyType === vehicle.bodyType || v.make === vehicle.make)
      )
      .slice(0, 3);
  }, [vehicle]);

  // Anonymous offer history
  const anonymousOffers = useMemo(() => {
    if (!vehicle) return [];
    return generateAnonymousOffers(vehicle.id, vehicle.price);
  }, [vehicle]);

  // Determine vehicle status for badge
  const vehicleStatusBadge = useMemo(() => {
    if (!vehicle) return { label: '', color: 'sage' as const };
    if (associatedEvent && associatedEvent.status === 'active') {
      return { label: 'In Event', color: 'emerald' as const };
    }
    return getStatusBadge(vehicle.status);
  }, [vehicle, associatedEvent]);

  // Handle offer submission
  const handleSubmitOffer = () => {
    if (!offerAmount) return;
    setOfferSubmitted(true);
    showToast(`Offer of $${Number(offerAmount).toLocaleString()} submitted successfully!`, 'success');
    setTimeout(() => setOfferSubmitted(false), 4000);
    setOfferAmount('');
  };

  // ─── 404 State ──────────────────────────────────────────────────────────────

  if (!vehicle) {
    return (
      <div className="bg-navy-dark min-h-screen text-white flex items-center justify-center pt-16">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Vehicle Not Found</h1>
          <p className="text-sage mb-8 max-w-md mx-auto">
            The vehicle you&apos;re looking for doesn&apos;t exist or has been removed from the marketplace.
          </p>
          <Link href="/inventory">
            <Button variant="primary" size="lg">Browse Inventory</Button>
          </Link>
        </div>
      </div>
    );
  }

  const suggestedMinimum = Math.round(vehicle.price * 0.85);

  return (
    <div className="bg-navy-dark min-h-screen text-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">

        {/* ─── Top Header Section ──────────────────────────────────────────── */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                <Badge
                  variant="status"
                  color={vehicleStatusBadge.color}
                  label={vehicleStatusBadge.label}
                  size="md"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sage text-sm">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
                  </svg>
                  VIN: {maskVin(vehicle.vin)}
                </span>
                <span className="w-px h-3 bg-white/20" />
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  San José, Costa Rica
                </span>
              </div>
            </div>

            {/* Favorite button */}
            <button
              onClick={() => setIsFavorited(!isFavorited)}
              className="self-start p-3 rounded-full backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group/fav"
              aria-label={isFavorited ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-6 h-6 transition-colors duration-200"
                fill={isFavorited ? '#ECA72C' : 'none'}
                stroke={isFavorited ? '#ECA72C' : 'currentColor'}
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* ─── Two-Column Layout ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT COLUMN (60%) */}
          <div className="lg:col-span-3 space-y-6">

            {/* Gallery */}
            <Gallery images={galleryImages} />

            {/* Vehicle Specs Grid */}
            <GlassPanel variant="dark" padding="lg">
              <h2 className="text-xl font-bold text-white mb-5">Vehicle Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <SpecCard label="Year" value={String(vehicle.year)} />
                <SpecCard label="Make" value={vehicle.make} />
                <SpecCard label="Model" value={vehicle.model} />
                <SpecCard label="Mileage" value={formatMileage(vehicle.mileage)} />
                <SpecCard label="Transmission" value={capitalize(vehicle.transmission)} />
                <SpecCard label="Fuel Type" value={capitalize(vehicle.fuelType)} />
                <SpecCard label="Engine" value={vehicle.engine} />
                <SpecCard label="Color" value={vehicle.color} />
                <SpecCard label="Body Type" value={capitalize(vehicle.bodyType)} />
                <SpecCard label="VIN" value={maskVin(vehicle.vin)} />
              </div>
            </GlassPanel>

            {/* Condition / Verification Panel */}
            <GlassPanel variant="dark" padding="lg">
              <h2 className="text-xl font-bold text-white mb-5">Verification Status</h2>
              <div className="space-y-3">
                <VerificationItem icon="shield" text="Fair Value verified" verified />
                <VerificationItem icon="document" text="Vehicle information reviewed" verified />
                <VerificationItem icon="folder" text="Dealer documentation reviewed" verified />
                <VerificationItem icon="camera" text="Images provided by dealer" verified />
                <VerificationItem icon="info" text="Final inspection recommended before purchase" verified={false} />
              </div>
            </GlassPanel>
          </div>

          {/* RIGHT COLUMN (40%) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Offer Panel (sticky on desktop) */}
            <div className="lg:sticky lg:top-24">
              <GlassPanel variant="dark" padding="lg" glow>
                <h3 className="text-lg font-semibold text-white mb-4">Current Offer</h3>

                {/* Highest offer display */}
                <div className="text-center py-4 mb-4 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-sage text-sm mb-1">Highest Offer</p>
                  <p className="text-3xl font-bold text-amber">
                    {highestOffer ? formatPrice(highestOffer.amount) : '—'}
                  </p>
                  <p className="text-sage text-xs mt-1">
                    {vehicleOffers.length} offer{vehicleOffers.length !== 1 ? 's' : ''} received
                  </p>
                </div>

                {/* Event countdown */}
                {associatedEvent && associatedEvent.status === 'active' && (
                  <div className="mb-4">
                    <p className="text-sage text-sm mb-3">Event ends in:</p>
                    <CountdownTimer targetDate={associatedEvent.endDate} />
                  </div>
                )}

                {/* Suggested minimum */}
                <div className="flex items-center justify-between py-3 border-t border-white/10">
                  <span className="text-sage text-sm">Suggested minimum</span>
                  <span className="text-white font-semibold">{formatPrice(suggestedMinimum)}</span>
                </div>

                {/* Offer input */}
                <div className="mt-4">
                  <label htmlFor="offer-amount" className="text-sage text-sm block mb-2">
                    Your offer (USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sage">$</span>
                    <input
                      id="offer-amount"
                      type="number"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                      placeholder={suggestedMinimum.toLocaleString()}
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-sage/50 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full mt-4"
                  onClick={handleSubmitOffer}
                  disabled={!offerAmount}
                >
                  Submit Offer
                </Button>

                {/* Success message */}
                {offerSubmitted && (
                  <div className="mt-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm text-center">
                    Offer submitted successfully!
                  </div>
                )}

                {/* Privacy disclaimers */}
                <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                  <p className="text-sage/80 text-xs leading-relaxed">
                    Offers are non-binding and used to qualify buyer interest.
                  </p>
                  <p className="text-sage/80 text-xs leading-relaxed">
                    Final negotiation and payment happen directly with the dealer outside Fair Value.
                  </p>
                  <p className="text-sage/80 text-xs leading-relaxed">
                    Dealer contact details unlock only after lead selection.
                  </p>
                </div>
              </GlassPanel>

              {/* Anonymous Offer History */}
              <GlassPanel variant="dark" padding="lg" className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Offer Activity</h3>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {anonymousOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <svg className="w-4 h-4 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{formatPrice(offer.amount)}</p>
                          <p className="text-sage text-xs">{offer.buyerLabel}</p>
                        </div>
                      </div>
                      <span className="text-sage/70 text-xs">{offer.time}</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </div>
          </div>
        </div>

        {/* ─── Related Vehicles Section ────────────────────────────────────── */}
        {similarVehicles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">Similar Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} variant="dark" showStatus />
              ))}
            </div>
          </section>
        )}

        {/* ─── Privacy Explanation Section ──────────────────────────────────── */}
        <section className="mt-16 pt-8 border-t border-white/10 pb-12">
          <h2 className="text-2xl font-bold text-white mb-4">How Fair Value Protects You</h2>
          <div className="max-w-3xl">
            <PrivacyNotice context="vehicle" className="mb-6" />
            <GlassPanel variant="dark" padding="lg">
              <div className="space-y-4 text-sage text-sm leading-relaxed">
                <p>
                  Fair Value operates as a lead-generation intermediary. We connect verified buyers with trusted dealerships
                  through a privacy-first model.
                </p>
                <p>
                  During active events, all identities remain anonymous. Offers are used to measure genuine buyer interest
                  and generate a qualified lead score. No personal data is shared with dealers until after the event closes
                  and the dealer selects their preferred leads.
                </p>
                <p>
                  Once selected, buyer contact details are unlocked for the dealer. From that point forward, negotiation,
                  inspection, and final purchase happen directly between buyer and dealer — entirely outside the Fair Value platform.
                </p>
                <p>
                  This model protects both parties: buyers are never spammed, and dealers only invest time in pre-qualified prospects.
                </p>
              </div>
            </GlassPanel>
          </div>
        </section>
      </div>
    </div>
  );
}

// ─── Sub Components ─────────────────────────────────────────────────────────

function SpecCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-white/5 border border-white/5">
      <p className="text-sage text-xs uppercase tracking-wide mb-1">{label}</p>
      <p className="text-white font-medium text-sm truncate">{value}</p>
    </div>
  );
}

function VerificationItem({
  icon,
  text,
  verified,
}: {
  icon: 'shield' | 'document' | 'folder' | 'camera' | 'info';
  text: string;
  verified: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          verified
            ? 'bg-emerald-500/10 border border-emerald-500/20'
            : 'bg-amber/10 border border-amber/20'
        }`}
      >
        {verified ? (
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-amber" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        )}
      </div>
      <span className={`text-sm ${verified ? 'text-white' : 'text-sage'}`}>{text}</span>
    </div>
  );
}
