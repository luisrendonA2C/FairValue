'use client';

import React from 'react';
import Link from 'next/link';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

/* ─── Data ─── */

const steps = [
  {
    number: 1,
    title: 'List Your Vehicles',
    description: 'Upload your inventory with photos, specs, and pricing. Our team reviews and approves each listing for quality.',
  },
  {
    number: 2,
    title: 'Get Offers',
    description: 'During scheduled events, verified buyers submit offers on your vehicles. More visibility means more leads.',
  },
  {
    number: 3,
    title: 'Review Leads',
    description: 'After events close, leads are scored and ranked. Review buyer interest levels, offer amounts, and qualification scores.',
  },
  {
    number: 4,
    title: 'Connect with Buyers',
    description: 'Select your preferred leads and unlock mutual contact information. Negotiate and close deals directly.',
  },
];

interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const benefits: Benefit[] = [
  {
    title: 'Qualified Leads',
    description: 'Every lead is scored and ranked. Only verified buyers with genuine intent reach your dashboard.',
    icon: (
      <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'No Upfront Cost',
    description: 'List vehicles and receive leads without paying anything upfront. Our model aligns success with yours.',
    icon: (
      <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
  {
    title: 'Privacy Protection',
    description: 'Buyer and dealer identities remain hidden during events. Data is shared only after mutual consent.',
    icon: (
      <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    title: 'Verified Buyers',
    description: 'All buyers complete identity and intent verification before participating in offer events.',
    icon: (
      <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Event Exposure',
    description: 'Scheduled events concentrate buyer attention on your vehicles, generating multiple high-quality leads simultaneously.',
    icon: (
      <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
  },
  {
    title: 'Dashboard Analytics',
    description: 'Track vehicle performance, lead activity, and conversion metrics with comprehensive dealer analytics.',
    icon: (
      <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

const requirements = [
  'Valid business license (patente comercial)',
  'Physical location in Costa Rica',
  'Complete vehicle documentation for all listings',
  'Compliance with Fair Value quality standards',
];

/* ─── Page ─── */

export default function ForDealersPage() {
  return (
    <main className="bg-navy-dark min-h-screen text-white pt-16">
      {/* Hero */}
      <GradientBackground variant="navy-dark" className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
            Grow Your Dealership with Fair Value
          </h1>
          <p className="text-sage-light text-lg md:text-xl max-w-2xl mx-auto mb-8">
            Receive qualified, ranked buyer leads without upfront costs. 
            Join Costa Rica&apos;s premium vehicle intermediation platform.
          </p>
          <Link href="/register">
            <Button variant="primary" size="lg">
              Apply as Verified Dealer
            </Button>
          </Link>
        </div>
      </GradientBackground>

      {/* How It Works */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-12">
            How It Works for Dealers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <GlassPanel key={step.number} variant="light" padding="md" className="flex flex-col gap-3 relative">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber text-white font-heading font-bold text-sm">
                  {step.number}
                </span>
                <h3 className="font-heading font-semibold text-white text-base">
                  {step.title}
                </h3>
                <p className="text-sage-light text-sm leading-relaxed">
                  {step.description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <GradientBackground variant="navy-dark" className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-12">
            Why Dealers Choose Fair Value
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {benefits.map((benefit) => (
              <GlassPanel
                key={benefit.title}
                variant="dark"
                padding="md"
                className="flex flex-col gap-3 hover:border-amber/30 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber/10 border border-amber/20">
                  {benefit.icon}
                </div>
                <h3 className="font-heading font-bold text-white text-base">
                  {benefit.title}
                </h3>
                <p className="text-sage-light text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </GradientBackground>

      {/* Requirements */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-10">
            Requirements to Join
          </h2>
          <GlassPanel variant="dark" padding="lg" className="border-l-4 border-l-amber">
            <ul className="space-y-4">
              {requirements.map((req) => (
                <li key={req} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="text-white text-sm md:text-base">{req}</span>
                </li>
              ))}
            </ul>
          </GlassPanel>
        </div>
      </section>

      {/* CTA Section */}
      <GradientBackground variant="amber" className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-white/80 mb-8">
            Join Costa Rica&apos;s leading platform for connecting verified dealers with qualified buyers.
          </p>
          <Link href="/register">
            <Button variant="secondary" size="lg">
              Apply as Verified Dealer
            </Button>
          </Link>
        </div>
      </GradientBackground>
    </main>
  );
}
