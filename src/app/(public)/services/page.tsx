'use client';

import React from 'react';
import Link from 'next/link';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

/* ─── Service Data ─── */

interface Service {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function NetworkIcon() {
  return (
    <svg className="w-8 h-8 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  );
}

function ListingIcon() {
  return (
    <svg className="w-8 h-8 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function VerifyIcon() {
  return (
    <svg className="w-8 h-8 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function LeadIcon() {
  return (
    <svg className="w-8 h-8 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function EventIcon() {
  return (
    <svg className="w-8 h-8 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg className="w-8 h-8 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
    </svg>
  );
}

const services: Service[] = [
  {
    title: 'Verified Dealer Network',
    description: 'Connect with trusted, certified dealerships across Costa Rica. Every dealer in our network undergoes rigorous verification to ensure quality and reliability.',
    icon: <NetworkIcon />,
  },
  {
    title: 'Vehicle Listing Support',
    description: 'A streamlined listing process that makes it easy for dealers to showcase their inventory. Upload, manage, and update vehicles with our intuitive tools.',
    icon: <ListingIcon />,
  },
  {
    title: 'Buyer Qualification',
    description: 'Only verified buyers participate in offer events. Our qualification process ensures dealers receive leads from serious, genuine purchasers.',
    icon: <VerifyIcon />,
  },
  {
    title: 'Ranked Lead System',
    description: 'Leads are scored and ranked using multiple factors including offer amount, buyer verification level, and engagement history — so dealers see the best first.',
    icon: <LeadIcon />,
  },
  {
    title: 'Event-Based Offers',
    description: 'Timed offer events create focused buyer interest and urgency. Concentrated activity windows produce higher-quality leads for every listed vehicle.',
    icon: <EventIcon />,
  },
  {
    title: 'Post-Match Communication',
    description: 'Once a lead is selected, a secure channel opens for direct communication between buyer and dealer to facilitate negotiation outside the platform.',
    icon: <ChatIcon />,
  },
];

/* ─── Page ─── */

export default function ServicesPage() {
  return (
    <main className="bg-navy-dark min-h-screen text-white pt-16">
      {/* Hero */}
      <GradientBackground variant="navy-dark" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
            Services & Support
          </h1>
          <p className="text-sage-light text-lg md:text-xl max-w-2xl mx-auto">
            Everything you need to buy or sell vehicles through Fair Value&apos;s trusted platform.
          </p>
        </div>
      </GradientBackground>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <GlassPanel
                key={service.title}
                variant="dark"
                padding="lg"
                className="flex flex-col gap-4 hover:border-amber/30 transition-all duration-300"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber/10 border border-amber/20">
                  {service.icon}
                </div>
                <h3 className="font-heading font-bold text-white text-lg">
                  {service.title}
                </h3>
                <p className="text-sage-light text-sm leading-relaxed">
                  {service.description}
                </p>
              </GlassPanel>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <GradientBackground variant="amber" className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-white/80 mb-8">
            Whether you&apos;re looking for your next vehicle or want to grow your dealership,
            Fair Value has you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/inventory">
              <Button variant="secondary" size="lg">
                Browse Inventory
              </Button>
            </Link>
            <Link href="/for-dealers">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-amber">
                For Dealers
              </Button>
            </Link>
          </div>
        </div>
      </GradientBackground>
    </main>
  );
}
