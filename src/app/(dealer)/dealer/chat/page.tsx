'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ChatThread } from '@/components/shared/ChatThread';
import { users } from '@/data/users';
import { leads } from '@/data/leads';

const THREAD_ID = 'thread-001';

/**
 * Dealer Chat Page
 *
 * Chat interface per selected lead (buyer-dealer pair).
 * Displays buyer's unlocked profile info (name, phone) in header.
 * Shows locked state when lead not yet selected.
 */
export default function DealerChatPage() {
  const { user } = useAuth();

  const currentUserId = user?.id ?? '';
  const { messages, sendMessage, isLocked } = useChat(THREAD_ID, currentUserId);

  // Find the lead associated with this thread to get buyer info
  // thread-001 is buyer-007 ↔ dealer-user-003
  const buyerId = 'buyer-007';
  const lead = leads.find(
    (l) => l.buyerId === buyerId && l.isUnlocked
  );
  const buyer = users.find((u) => u.id === buyerId);

  // Determine if buyer info should be shown (lead is unlocked)
  const showBuyerInfo = lead?.isUnlocked && buyer;

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Chat</h1>

          {isLocked ? (
            <p className="text-sm text-sage mt-1">
              Chat disponible después de seleccionar un lead
            </p>
          ) : showBuyerInfo ? (
            <div className="mt-2 flex items-center gap-3">
              {/* Buyer avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-amber">
                  {buyer.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-white">{buyer.name}</p>
                <p className="text-xs text-sage">{buyer.phone}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-sage mt-1">
              Conectado con comprador
            </p>
          )}
        </div>

        {/* Chat container */}
        <GlassPanel variant="dark" padding="none" className="flex-1 min-h-[500px]">
          <ChatThread
            messages={messages}
            onSend={sendMessage}
            isLocked={isLocked}
            currentUserId={currentUserId}
            className="h-full"
          />
        </GlassPanel>
      </div>
    </GradientBackground>
  );
}
