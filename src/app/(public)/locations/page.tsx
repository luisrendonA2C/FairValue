'use client';

import React from 'react';
import Link from 'next/link';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

/* ─── Location Data ─── */

interface DealerLocation {
  city: string;
  vehicles: number;
  categories: string[];
  top: string;
  left: string;
}

const locations: DealerLocation[] = [
  { city: 'San José', vehicles: 18, categories: ['SUVs', 'Sedans', 'Hatchbacks'], top: '45%', left: '60%' },
  { city: 'Escazú', vehicles: 12, categories: ['SUVs', 'Luxury', 'Sedans'], top: '46%', left: '58%' },
  { city: 'Heredia', vehicles: 9, categories: ['Sedans', 'Compact', 'SUVs'], top: '43%', left: '59%' },
  { city: 'Alajuela', vehicles: 15, categories: ['SUVs', 'Pickups', 'Sedans'], top: '42%', left: '57%' },
  { city: 'Cartago', vehicles: 7, categories: ['Sedans', 'SUVs', 'Compact'], top: '47%', left: '64%' },
  { city: 'Guanacaste', vehicles: 10, categories: ['Pickups', 'SUVs', '4x4'], top: '25%', left: '27%' },
  { city: 'Puntarenas', vehicles: 6, categories: ['SUVs', 'Pickups', 'Sedans'], top: '44%', left: '42%' },
  { city: 'Limón', vehicles: 5, categories: ['SUVs', '4x4', 'Pickups'], top: '43%', left: '85%' },
];

/* ─── Components ─── */

function MapPin({ location }: { location: DealerLocation }) {
  return (
    <div
      className="absolute group"
      style={{ top: location.top, left: location.left }}
    >
      {/* Pulse animation */}
      <span className="absolute -inset-2 rounded-full bg-amber/30 animate-ping" />
      {/* Pin dot */}
      <span className="relative block w-4 h-4 rounded-full bg-amber border-2 border-white shadow-lg" />
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
        <div className="bg-navy-dark/95 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 whitespace-nowrap shadow-xl">
          <p className="text-white text-xs font-semibold">{location.city}</p>
          <p className="text-amber text-xs">{location.vehicles} vehicles</p>
        </div>
      </div>
    </div>
  );
}

function LocationCard({ location }: { location: DealerLocation }) {
  return (
    <GlassPanel variant="dark" padding="md" className="flex flex-col gap-3 hover:border-amber/30 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading font-bold text-white text-lg">{location.city}</h3>
          <p className="text-sage-light text-xs mt-0.5">Certified Vehicle Center</p>
        </div>
        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-amber/15 border border-amber/30">
          <span className="text-amber text-xs font-semibold">{location.vehicles} active</span>
        </span>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-1.5">
        {location.categories.map((cat) => (
          <span
            key={cat}
            className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-white/70 text-xs"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* CTA */}
      <Link href="/inventory" className="mt-auto">
        <Button variant="primary" size="sm" className="w-full mt-2">
          View Vehicles
        </Button>
      </Link>
    </GlassPanel>
  );
}

/* ─── Page ─── */

export default function LocationsPage() {
  return (
    <main className="bg-navy-dark min-h-screen text-white pt-16">
      {/* Hero */}
      <GradientBackground variant="navy-dark" className="py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-3">
            Red de Concesionarios Certificados
          </h1>
          <p className="text-sage-light text-lg md:text-xl max-w-2xl mx-auto mb-1">
            Certified Dealer Network
          </p>
          <p className="text-sage-light/80 text-base max-w-xl mx-auto">
            Fair Value connects buyers with verified vehicle centers across Costa Rica.
          </p>
        </div>
      </GradientBackground>

      {/* Map Section */}
      <section className="py-10">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-2xl font-bold text-white text-center mb-10">
            Our Coverage Across Costa Rica
          </h2>

          {/* Premium dark map — real OpenStreetMap embed */}
          <div className="relative w-full max-w-6xl mx-auto aspect-[16/9] lg:aspect-[2/1] rounded-2xl overflow-hidden border border-white/10">
            {/* Real map using OpenStreetMap dark tiles via iframe */}
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=-86.5%2C8.0%2C-82.5%2C11.5&layer=mapnik"
              className="absolute inset-0 w-full h-full border-0 grayscale brightness-[0.3] contrast-[1.2] saturate-[0.3]"
              title="Costa Rica Map"
              loading="lazy"
            />
            {/* Dark overlay for pins visibility */}
            <div className="absolute inset-0 bg-navy-dark/40 pointer-events-none" />

            {/* Location pins with glow */}
            <div className="absolute inset-0 pointer-events-none">
              {locations.map((loc) => (
                <MapPin key={loc.city} location={loc} />
              ))}
            </div>

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-navy-dark/80 to-transparent pointer-events-none" />

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-3 backdrop-blur-sm bg-black/40 rounded-lg px-3 py-2 pointer-events-none">
              <span className="w-3 h-3 rounded-full bg-amber animate-pulse" />
              <span className="text-white/80 text-xs font-medium">Certified Dealer Location</span>
            </div>

            {/* Zoom indicator */}
            <div className="absolute top-4 right-4 flex flex-col gap-1 pointer-events-none">
              <div className="w-7 h-7 rounded bg-black/40 backdrop-blur-sm border border-white/20 text-white/70 text-sm flex items-center justify-center">+</div>
              <div className="w-7 h-7 rounded bg-black/40 backdrop-blur-sm border border-white/20 text-white/70 text-sm flex items-center justify-center">−</div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Cards Grid */}
      <GradientBackground variant="navy-dark" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-2xl font-bold text-white text-center mb-10">
            All Locations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((loc) => (
              <LocationCard key={loc.city} location={loc} />
            ))}
          </div>
        </div>
      </GradientBackground>

      {/* CTA Section — with premium car background */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-navy-dark/75 backdrop-blur-[2px]" />
            {/* Content */}
            <div className="relative z-10 py-16 px-8 text-center">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
                Find Your Next Vehicle
              </h2>
              <p className="text-white/70 mb-8 max-w-lg mx-auto">
                Browse certified inventory across all locations or apply to join our dealer network.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/inventory">
                  <Button variant="primary" size="lg">
                    Explore Available Vehicles
                  </Button>
                </Link>
                <Link href="/for-dealers">
                  <Button variant="outline" size="lg">
                    Apply as Verified Dealer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
