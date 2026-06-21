'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

/* ─── Data ─── */

const steps = [
  {
    number: 1,
    title: 'Dealer Publica',
    description: 'El concesionario sube su inventario a la plataforma',
  },
  {
    number: 2,
    title: 'Fair Value Aprueba',
    description: 'Nuestro equipo verifica y aprueba cada vehículo',
  },
  {
    number: 3,
    title: 'Buyer Explora',
    description: 'Los compradores navegan el catálogo verificado',
  },
  {
    number: 4,
    title: 'Ofertas Activas',
    description: 'Durante eventos programados, los buyers hacen ofertas',
  },
  {
    number: 5,
    title: 'Evento Cierra',
    description: 'El período de ofertas termina y se identifican las mejores',
  },
  {
    number: 6,
    title: 'Leads Generados',
    description: 'Se calculan y rankean los leads por puntuación',
  },
  {
    number: 7,
    title: 'Dealer Selecciona',
    description: 'El concesionario elige sus mejores leads',
  },
  {
    number: 8,
    title: 'Negociación Externa',
    description: 'Comprador y dealer se contactan fuera de la plataforma',
  },
];

const buyerBenefits = [
  'Acceso a inventario verificado',
  'Protección de datos y privacidad',
  'Proceso de oferta justo y transparente',
  'Sin compromiso de compra',
];

const dealerBenefits = [
  'Leads calificados y rankeados',
  'Compradores verificados',
  'Sin costo inicial',
  'Herramientas de gestión',
];

const faqs = [
  {
    question: '¿Fair Value procesa pagos?',
    answer:
      'No. Fair Value no procesa pagos ni ventas. Somos una plataforma de intermediación que genera leads calificados para concesionarios. Toda transacción ocurre directamente entre comprador y concesionario, fuera de nuestra plataforma.',
  },
  {
    question: '¿Quién es el dueño del vehículo?',
    answer:
      'El concesionario mantiene la propiedad del vehículo en todo momento. Fair Value no participa en la transferencia de títulos ni en ninguna transacción de compraventa.',
  },
  {
    question: '¿Cómo se protegen mis datos?',
    answer:
      'Tu información personal permanece oculta durante todo el proceso de ofertas. Solo se comparten datos de contacto cuando un concesionario selecciona tu lead, y siempre con tu consentimiento previo.',
  },
  {
    question: '¿Qué pasa después del evento?',
    answer:
      'Los leads son rankeados por puntuación basada en múltiples factores. Los concesionarios revisan los leads disponibles y seleccionan aquellos con los que desean negociar directamente.',
  },
  {
    question: '¿Cómo me contacta el dealer?',
    answer:
      'Una vez que el dealer selecciona tu lead, se desbloquea la información de contacto mutua. A partir de ahí, la comunicación y negociación ocurren directamente entre ambas partes.',
  },
];

/* ─── Components ─── */

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 text-amber transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <GlassPanel variant="dark" padding="none" className="overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-white text-sm md:text-base">
          {question}
        </span>
        <ChevronIcon open={open} />
      </button>
      {open && (
        <div className="px-6 pb-4">
          <p className="text-sage-light text-sm leading-relaxed">{answer}</p>
        </div>
      )}
    </GlassPanel>
  );
}

/* ─── Page ─── */

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen pt-16 bg-navy-dark">
      {/* 1. Hero Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
            ¿Cómo Funciona Fair Value?
          </h1>
          <p className="text-sage-light text-lg md:text-xl max-w-2xl mx-auto">
            Un modelo de intermediación transparente que conecta compradores y concesionarios
          </p>
        </div>
      </section>

      {/* 2. 8-Step Visual Flow */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <GlassPanel key={step.number} variant="light" padding="md" className="flex flex-col gap-3">
                {/* Number badge */}
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber text-white font-heading font-bold text-sm">
                  {step.number}
                </span>
                {/* Title */}
                <h3 className="font-heading font-semibold text-white text-base">
                  {step.title}
                </h3>
                {/* Description */}
                <p className="text-sage-light text-sm leading-relaxed">
                  {step.description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Disclaimer Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <GlassPanel variant="dark" padding="lg" className="border-l-4 border-l-amber">
            <p className="font-heading font-bold text-white text-lg mb-3">
              Fair Value es una plataforma intermediaria
            </p>
            <p className="text-sage-light text-sm md:text-base leading-relaxed">
              No procesamos pagos ni ventas. La compra del vehículo ocurre directamente entre
              comprador y concesionario, fuera de nuestra plataforma. Las ofertas generan leads
              y conexiones, no transacciones vinculantes.
            </p>
          </GlassPanel>
        </div>
      </section>

      {/* 4. Benefits Sections */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Buyers */}
            <GlassPanel variant="dark" padding="lg">
              <h2 className="font-heading font-bold text-white text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Para Compradores
              </h2>
              <ul className="space-y-3">
                {buyerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="text-amber font-bold mt-0.5">✓</span>
                    <span className="text-white/80 text-sm md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </GlassPanel>

            {/* Dealers */}
            <GlassPanel variant="dark" padding="lg">
              <h2 className="font-heading font-bold text-white text-xl md:text-2xl mb-6 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber/10">
                  <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </span>
                Para Concesionarios
              </h2>
              <ul className="space-y-3">
                {dealerBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <span className="text-amber font-bold mt-0.5">✓</span>
                    <span className="text-white/80 text-sm md:text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </GlassPanel>
          </div>
        </div>
      </section>

      {/* 5. FAQ Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-10">
            Preguntas Frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <GradientBackground variant="amber" className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-8">
            ¿Listo para empezar?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/inventory">
              <Button variant="secondary" size="lg">
                Explorar Vehículos
              </Button>
            </Link>
            <Link href="/register">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-amber"
              >
                Registrarse
              </Button>
            </Link>
          </div>
        </div>
      </GradientBackground>
    </main>
  );
}
