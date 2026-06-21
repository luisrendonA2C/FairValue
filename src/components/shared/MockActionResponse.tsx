'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export type MockActionType =
  | 'payment'
  | 'document_upload'
  | 'ai_analysis'
  | 'kyc'
  | 'websocket';

export interface MockActionResponseProps {
  open: boolean;
  onClose: () => void;
  actionType: MockActionType;
  title?: string;
}

const actionConfig: Record<
  MockActionType,
  { icon: React.ReactNode; label: string; service: string }
> = {
  payment: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    label: 'Payment Processed',
    service: 'a payment gateway (Stripe, PayPal, etc.)',
  },
  document_upload: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    label: 'Document Uploaded',
    service: 'a document processing & OCR service',
  },
  ai_analysis: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    label: 'AI Analysis Complete',
    service: 'an AI/ML inference engine',
  },
  kyc: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: 'Identity Verified',
    service: 'a KYC verification provider',
  },
  websocket: {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
      </svg>
    ),
    label: 'Connection Established',
    service: 'a real-time WebSocket server',
  },
};

export const MockActionResponse: React.FC<MockActionResponseProps> = ({
  open,
  onClose,
  actionType,
  title,
}) => {
  const config = actionConfig[actionType];

  return (
    <Modal
      open={open}
      onClose={onClose}
      className="max-w-sm overflow-hidden"
    >
      <div className="flex flex-col items-center text-center px-2 py-4">
        {/* Amber action icon */}
        <div className="relative mb-5">
          <div className="w-16 h-16 rounded-full bg-amber/10 border border-amber/30 flex items-center justify-center text-amber mock-action-pulse">
            {config.icon}
          </div>
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-amber/5 mock-action-glow" aria-hidden="true" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-heading font-bold text-navy-dark mb-1">
          {title || config.label}
        </h3>

        {/* Success checkmark animation */}
        <div className="my-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mock-action-check-pop">
            <svg
              className="w-6 h-6 text-emerald-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                className="mock-action-check-draw"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Simulated success text */}
        <p className="text-sm text-sage leading-relaxed mb-1">
          Simulated successfully for demo purposes.
        </p>
        <p className="text-xs text-sage-light leading-relaxed mb-6">
          In production, this would connect to {config.service}.
        </p>

        {/* Dismiss button */}
        <Button
          variant="primary"
          size="md"
          onClick={onClose}
          className="w-full"
        >
          Understood
        </Button>
      </div>

      {/* CSS animations for this component */}
      <style jsx global>{`
        @keyframes mock-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes mock-glow {
          0%, 100% {
            opacity: 0;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }
        @keyframes mock-check-pop {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.15);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes mock-check-draw {
          0% {
            stroke-dashoffset: 24;
            opacity: 0;
          }
          40% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
        }
        .mock-action-pulse {
          animation: mock-pulse 2s ease-in-out infinite;
        }
        .mock-action-glow {
          animation: mock-glow 2s ease-in-out infinite;
        }
        .mock-action-check-pop {
          animation: mock-check-pop 0.5s ease-out 0.3s both;
        }
        .mock-action-check-draw {
          stroke-dasharray: 24;
          animation: mock-check-draw 0.6s ease-out 0.5s both;
        }
      `}</style>
    </Modal>
  );
};

MockActionResponse.displayName = 'MockActionResponse';

export default MockActionResponse;
