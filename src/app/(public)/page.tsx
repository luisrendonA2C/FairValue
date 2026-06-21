'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeroSection } from '@/components/shared/HeroSection';
import { VehicleCard } from '@/components/shared/VehicleCard';
import { EventCard } from '@/components/shared/EventCard';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { vehicles, events } from '@/data';
import { getImageUrl } from '@/lib/imageProvider';
import { useWatchlist } from '@/hooks/useWatchlist';

// ─── How It Works Steps ─────────────────────────────────────────────────────

const steps = [
  {
    number: 1,
    title: 'Dealer publica',
    description: 'El concesionario sube los vehículos con fotos, especificaciones y precio sugerido.',
  },
  {
    number: 2,
    title: 'Fair Value aprueba',
    description: 'Nuestro equipo revisa y aprueba cada vehículo para garantizar calidad.',
  },
  {
    number: 3,
    title: 'Buyer explora y oferta',
    description: 'Compradores verificados exploran el inventario y envían ofertas durante eventos.',
  },
  {
    number: 4,
    title: 'Evento cierra',
    description: 'Al finalizar el evento, los leads se califican y rankean automáticamente.',
  },
  {
    number: 5,
    title: 'Conexión externa',
    description: 'El dealer selecciona leads y la negociación ocurre fuera de la plataforma.',
  },
];

// ─── Stats Data ─────────────────────────────────────────────────────────────

const stats = [
  { value: '500+', label: 'Vehículos' },
  { value: '150+', label: 'Compradores' },
  { value: '50+', label: 'Dealers' },
  { value: '98%', label: 'Satisfacción' },
];

// ─── Footer Links ───────────────────────────────────────────────────────────

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Events', href: '/events' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Login', href: '/login' },
  { label: 'Register', href: '/register' },
];

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const { isFavorited, toggleFavorite } = useWatchlist();

  const heroImage = getImageUrl('hero', 'costa-rica');

  // Featured vehicles: active or assigned_to_event, limit 6
  const featuredVehicles = vehicles
    .filter((v) => v.status === 'active' || v.status === 'assigned_to_event')
    .slice(0, 6);

  // Upcoming events: up to 3 (active or scheduled)
  const upcomingEvents = events
    .filter((e) => e.status === 'active' || e.status === 'scheduled')
    .slice(0, 3);

  const handleSearch = (query: string) => {
    router.push(`/inventory?search=${encodeURIComponent(query)}`);
  };

  return (
    <main className="min-h-screen">
      {/* ─── 1. Hero Section ──────────────────────────────────────────── */}
      <HeroSection
        backgroundImage={heroImage}
        headline="Fair Value"
        subheadline="Subastas de vehículos de concesionarios certificados en Costa Rica. Ofertá, competí y conectá con el dealer, todo en un solo lugar. Encontrá los mejores vehículos al mejor precio, desde la comodidad de tu casa."
        onSearch={handleSearch}
        ctaText="Explorar Inventario"
        ctaHref="/inventory"
      />

      {/* ─── 2. How It Works ─────────────────────────────────────────── */}
      <GradientBackground variant="navy-dark" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            ¿Cómo Funciona?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 stagger-children">
            {steps.map((step) => (
              <GlassPanel key={step.number} variant="light" padding="md" className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber text-white font-bold text-lg mb-3">
                  {step.number}
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{step.description}</p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </GradientBackground>

      {/* ─── 3. Featured Vehicles ────────────────────────────────────── */}
      <section className="bg-navy-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Vehículos Destacados
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {featuredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                onFavorite={toggleFavorite}
                isFavorited={isFavorited(vehicle.id)}
              />
            ))}
          </div>
          <div className="text-center mt-10">
            <a
              href="/inventory"
              className="inline-block px-8 py-3 rounded-full bg-amber hover:bg-amber-dark text-white font-semibold text-lg transition-colors duration-200 shadow-glow"
            >
              Ver Todo el Inventario
            </a>
          </div>
        </div>
      </section>

      {/* ─── 4. Upcoming Events ──────────────────────────────────────── */}
      <GradientBackground variant="navy-dark" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-white font-heading text-3xl md:text-4xl font-bold text-center mb-12">
            Próximos Eventos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto stagger-children">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                showCountdown={event.status === 'active'}
              />
            ))}
          </div>
        </div>
      </GradientBackground>

      {/* ─── 5. Stats / Trust ────────────────────────────────────────── */}
      <section className="bg-navy-dark py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => (
              <StatCard key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 border border-white/20 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-amber"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z"
                />
              </svg>
              <span className="text-white font-semibold">Dealers Verificados</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/10 border border-white/20 shadow-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-amber"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                />
              </svg>
              <span className="text-white font-semibold">Datos Protegidos</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Costa Rica Panel ─────────────────────────────────────── */}
      <section
        className="relative w-full py-24"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-navy-dark/80" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <GlassPanel variant="dark" padding="lg">
            <h2 className="text-white font-heading text-3xl font-bold mb-4">
              Operando desde Costa Rica
            </h2>
            <p className="text-white/80 text-lg leading-relaxed">
              Nuestra plataforma conecta concesionarios verificados en todo el territorio nacional.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* ─── 7. Dealer CTA ───────────────────────────────────────────── */}
      <GradientBackground variant="amber" className="py-24">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-white font-heading text-3xl md:text-4xl font-bold mb-4">
            ¿Eres concesionario?
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Únete a Fair Value y recibe leads calificados de compradores verificados
          </p>
          <a
            href="/register"
            className="inline-block px-8 py-3 rounded-full bg-navy hover:bg-navy-dark text-white font-semibold text-lg transition-colors duration-200 shadow-xl"
          >
            Registrar Concesionario
          </a>
        </div>
      </GradientBackground>

      {/* ─── 8. Footer ───────────────────────────────────────────────── */}
      <footer className="bg-navy-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Logo & tagline */}
            <div>
              <img src="/images/logo-fair-value.png" alt="Fair Value" className="h-10 w-auto mb-3" />
              <p className="text-white/60 text-sm">
                Premium Vehicle Marketplace — Costa Rica
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
                Navegación
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-amber text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
                Contacto
              </h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li>info@fairvalue.cr</li>
                <li>+506 2200-0001</li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div>
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
                Legal
              </h4>
              <ul className="space-y-2 mb-6">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-white/60 hover:text-amber text-sm transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                {/* Instagram */}
                <a href="#" aria-label="Instagram" className="text-white/40 hover:text-amber transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                {/* Facebook */}
                <a href="#" aria-label="Facebook" className="text-white/40 hover:text-amber transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                {/* LinkedIn */}
                <a href="#" aria-label="LinkedIn" className="text-white/40 hover:text-amber transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-white/40 text-sm">
              © 2026 Fair Value. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
