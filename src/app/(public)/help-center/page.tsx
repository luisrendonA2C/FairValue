'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';

/* ─── FAQ Data ─── */

interface FAQItem {
  question: string;
  answer: string;
}

const buyerFAQs: FAQItem[] = [
  {
    question: 'How do offers work on Fair Value?',
    answer: 'During active events, you can submit offers on vehicles you\'re interested in. These offers are not binding purchases — they generate leads that dealers review. If a dealer selects your lead, mutual contact information is shared for direct negotiation.',
  },
  {
    question: 'How is the verification process handled?',
    answer: 'To ensure quality leads, buyers complete a simple verification process. This includes confirming your identity and contact information. Verified buyers receive higher lead scores, making dealers more likely to select their offers.',
  },
  {
    question: 'How is my privacy protected?',
    answer: 'Your personal information remains completely hidden during the offer process. Dealers only see anonymized offer details. Contact information is only shared after a dealer selects your lead, and always with your prior consent.',
  },
  {
    question: 'How does lead selection work?',
    answer: 'After an event closes, all offers are scored and ranked using multiple factors including offer amount, buyer verification level, and engagement history. Dealers then review ranked leads and choose which buyers to connect with.',
  },
  {
    question: 'Does payment happen on Fair Value?',
    answer: 'No. Fair Value never processes payments or sales. We are strictly an intermediary platform that connects qualified buyers with certified dealers. All negotiations, financing, and purchases happen directly between you and the dealer outside our platform.',
  },
  {
    question: 'Can I make offers on multiple vehicles?',
    answer: 'Yes! You can submit offers on as many vehicles as you\'re interested in during active events. Each offer generates an independent lead, giving you multiple opportunities to connect with dealers.',
  },
];

const dealerFAQs: FAQItem[] = [
  {
    question: 'How do I list vehicles on Fair Value?',
    answer: 'After registering and being verified as a certified dealer, you can upload your vehicle inventory through the dealer dashboard. Each vehicle goes through Fair Value\'s approval process to ensure quality listings. You can manage, update, and remove listings at any time.',
  },
  {
    question: 'How do I receive and review leads?',
    answer: 'When an event closes, leads are automatically scored and ranked in your dealer dashboard. You\'ll see relevant details about each offer without buyer identity information. From there, you select which leads you want to pursue.',
  },
  {
    question: 'How does lead selection work for dealers?',
    answer: 'After reviewing ranked leads, you choose which ones to accept. Once selected, mutual contact information is shared between you and the buyer. You can select multiple leads per vehicle to maximize your chances of closing a deal.',
  },
  {
    question: 'How does chat and communication work?',
    answer: 'Once a lead is selected, a secure communication channel opens between you and the buyer within the Fair Value platform. You can also exchange contact information to continue negotiations outside the platform.',
  },
  {
    question: 'How do events and offer periods work?',
    answer: 'Events are scheduled time windows during which buyers can submit offers on your vehicles. Events create urgency and concentrate buyer interest, resulting in higher-quality leads. You\'ll be notified when events start and end.',
  },
  {
    question: 'What are the costs for dealers?',
    answer: 'There are no upfront costs to list vehicles or receive leads. Fair Value operates on a model that aligns our success with yours — we only benefit when you connect with qualified buyers.',
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

function FAQCard({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <GlassPanel variant="dark" padding="none" className="overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-6 py-4 text-left cursor-pointer"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="font-heading font-semibold text-white text-sm md:text-base pr-4">
          {item.question}
        </span>
        <ChevronIcon open={open} />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5">
          <p className="text-sage-light text-sm leading-relaxed">{item.answer}</p>
        </div>
      </div>
    </GlassPanel>
  );
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

/* ─── Page ─── */

export default function HelpCenterPage() {
  return (
    <main className="bg-navy-dark min-h-screen text-white pt-16">
      {/* Hero */}
      <GradientBackground variant="navy-dark" className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-4">
            Help Center
          </h1>
          <p className="text-sage-light text-lg md:text-xl max-w-2xl mx-auto">
            Find answers to common questions about using Fair Value as a buyer or dealer.
          </p>
        </div>
      </GradientBackground>

      {/* Buyer FAQs */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber/15 border border-amber/30">
              <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <h2 className="font-heading text-2xl font-bold text-white">For Buyers</h2>
          </div>
          <div className="space-y-3 stagger-children">
            {buyerFAQs.map((faq) => (
              <FAQCard key={faq.question} item={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* Dealer FAQs */}
      <GradientBackground variant="navy-dark" className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber/15 border border-amber/30">
              <svg className="w-5 h-5 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </span>
            <h2 className="font-heading text-2xl font-bold text-white">For Dealers</h2>
          </div>
          <div className="space-y-3 stagger-children">
            {dealerFAQs.map((faq) => (
              <FAQCard key={faq.question} item={faq} />
            ))}
          </div>
        </div>
      </GradientBackground>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-sage-light mb-10">
            Our support team is ready to help. Reach out through any of these channels.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg mx-auto mb-10">
            <GlassPanel variant="dark" padding="md" className="flex flex-col items-center gap-3">
              <EmailIcon />
              <p className="text-white/60 text-xs uppercase tracking-wider">Email</p>
              <a href="mailto:info@fairvalue.cr" className="text-white font-medium text-sm hover:text-amber transition-colors">
                info@fairvalue.cr
              </a>
            </GlassPanel>

            <GlassPanel variant="dark" padding="md" className="flex flex-col items-center gap-3">
              <PhoneIcon />
              <p className="text-white/60 text-xs uppercase tracking-wider">Phone</p>
              <a href="tel:+50622000001" className="text-white font-medium text-sm hover:text-amber transition-colors">
                +506 2200-0001
              </a>
            </GlassPanel>
          </div>

          <Link href="/register">
            <Button variant="primary" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Floating Widgets */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* WhatsApp Widget */}
        <a
          href="https://wa.me/50622000001"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg hover:bg-emerald-600 transition-colors"
          aria-label="WhatsApp"
        >
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        
        {/* Chatbot Widget */}
        <button
          onClick={() => {}}
          className="w-14 h-14 rounded-full bg-amber flex items-center justify-center shadow-lg hover:bg-amber-dark transition-colors"
          aria-label="Chat support"
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </button>
      </div>
    </main>
  );
}
