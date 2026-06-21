'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@/types';

export interface ChatThreadProps {
  messages: Message[];
  onSend: (text: string) => void;
  isLocked: boolean;
  currentUserId: string;
  className?: string;
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }) + ' ' + date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export const ChatThread: React.FC<ChatThreadProps> = ({
  messages,
  onSend,
  isLocked,
  currentUserId,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLocked) return;
    onSend(trimmed);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isSender = msg.senderId === currentUserId;
          return (
            <div
              key={msg.id}
              className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={[
                  'max-w-[75%] rounded-2xl px-4 py-2.5',
                  isSender
                    ? 'bg-amber/90 text-navy-dark'
                    : 'backdrop-blur-md bg-white/10 border border-white/20 text-white',
                ].join(' ')}
              >
                <p className="text-xs text-sage mb-0.5">{msg.senderName}</p>
                <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                <p className="text-xs text-sage mt-1 text-right">
                  {formatTimestamp(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Locked state overlay */}
      {isLocked && (
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          {/* Lock icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 text-sage"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
          <p className="text-sm text-sage">Awaiting Dealer selection</p>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/10 p-3 flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value.slice(0, 500))}
          onKeyDown={handleKeyDown}
          placeholder={isLocked ? 'Chat locked' : 'Type a message...'}
          disabled={isLocked}
          maxLength={500}
          className={[
            'flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder:text-sage/60',
            'focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/30',
            'transition-all duration-200',
            isLocked ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        />
        <button
          onClick={handleSend}
          disabled={isLocked || !inputValue.trim()}
          aria-label="Send message"
          className={[
            'p-2.5 rounded-lg transition-all duration-200',
            'text-amber hover:bg-amber/10',
            isLocked || !inputValue.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:scale-105',
          ].join(' ')}
        >
          {/* Send icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

ChatThread.displayName = 'ChatThread';

export default ChatThread;
