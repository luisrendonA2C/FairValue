'use client';

import { useState, useMemo } from 'react';
import type { Message } from '@/types';
import { messages as mockMessages } from '@/data/messages';
import { users } from '@/data/users';

/**
 * useChat — mock messaging hook.
 *
 * - Pre-seeds messages filtered by threadId from mock data.
 * - Appends new messages with generated ID and current ISO timestamp.
 * - Rejects empty/whitespace-only messages.
 * - Truncates messages longer than 500 characters.
 * - isLocked is determined by whether pre-seeded messages exist for the threadId:
 *   - If no pre-seeded messages exist → locked (true)
 *   - If pre-seeded messages exist → unlocked (false)
 * - No persistence across page reloads.
 */
export function useChat(
  threadId: string,
  currentUserId: string
): {
  messages: Message[];
  sendMessage: (text: string) => void;
  isLocked: boolean;
} {
  // Determine initial messages from mock data for this thread
  const initialMessages = useMemo(
    () => mockMessages.filter((m) => m.threadId === threadId),
    [threadId]
  );

  const [threadMessages, setThreadMessages] = useState<Message[]>(initialMessages);

  // isLocked: if no pre-seeded messages exist for this threadId → locked (true)
  const isLocked = initialMessages.length === 0;

  // Resolve user name from mock data
  const currentUserName = useMemo(() => {
    const user = users.find((u) => u.id === currentUserId);
    return user?.name ?? 'Unknown User';
  }, [currentUserId]);

  const sendMessage = (text: string) => {
    // Reject empty or whitespace-only messages
    if (!text || text.trim() === '') return;

    // Do not send if chat is locked
    if (isLocked) return;

    // Truncate to 500 chars if needed
    const truncated = text.length > 500 ? text.slice(0, 500) : text;

    const newMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      threadId,
      senderId: currentUserId,
      senderName: currentUserName,
      text: truncated,
      timestamp: new Date().toISOString(),
    };

    setThreadMessages((prev) => [...prev, newMessage]);
  };

  return {
    messages: threadMessages,
    sendMessage,
    isLocked,
  };
}
