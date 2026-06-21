'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { ChatThread } from '@/components/shared/ChatThread';

const THREAD_ID = 'thread-buyer-dealer-001';

export default function BuyerChatPage() {
  const { user } = useAuth();

  const currentUserId = user?.id ?? '';
  const { messages, sendMessage, isLocked } = useChat(THREAD_ID, currentUserId);

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Chat</h1>
          <p className="text-sm text-sage mt-1">
            {isLocked
              ? 'Your chat will unlock once a Dealer selects your lead'
              : 'Connected with Dealer'}
          </p>
        </div>

        {/* Chat container */}
        <GlassPanel variant="dark" padding="none" className="h-[calc(100vh-200px)] min-h-[500px]">
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
