'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/hooks/useData';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { StepIndicator } from '@/components/shared/StepIndicator';
import type { VerificationStatus } from '@/types';

// ─── Constants ──────────────────────────────────────────────────────────────

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.pdf';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const VERIFICATION_STEPS = [
  { id: 'not_started', label: 'Not Started' },
  { id: 'documents_uploaded', label: 'Documents Uploaded' },
  { id: 'under_review', label: 'Under Review' },
  { id: 'verified', label: 'Verified' },
];

type BadgeColor = 'sage' | 'amber' | 'navy' | 'emerald';

function getStatusBadge(status: VerificationStatus): { label: string; color: BadgeColor } {
  switch (status) {
    case 'not_started':
      return { label: 'Not Started', color: 'sage' };
    case 'documents_uploaded':
      return { label: 'Documents Uploaded', color: 'amber' };
    case 'under_review':
      return { label: 'Under Review', color: 'navy' };
    case 'verified':
      return { label: 'Verified', color: 'emerald' };
    case 'rejected':
      return { label: 'Rejected', color: 'sage' };
    default:
      return { label: 'Unknown', color: 'sage' };
  }
}

// ─── Page Component ─────────────────────────────────────────────────────────

export default function BuyerVerificationPage() {
  const { user } = useAuth();
  const { users, updateVerificationStatus } = useMockData();

  // Get verification status from DataContext (centralized state)
  const currentUser = users.find((u) => u.id === user?.id);
  const contextVerificationStatus = currentUser?.verificationStatus ?? user?.verificationStatus ?? 'not_started';

  // Local verification status mirrors context for auto-transitions
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(
    contextVerificationStatus
  );

  // Sync from context when admin changes verification status externally
  useEffect(() => {
    setVerificationStatus(contextVerificationStatus);
  }, [contextVerificationStatus]);

  // File states
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [addressFile, setAddressFile] = useState<File | null>(null);
  const [identityError, setIdentityError] = useState<string>('');
  const [addressError, setAddressError] = useState<string>('');

  // Email/phone verification mock
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // File refs
  const identityInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Auto-transition to under_review after both docs uploaded
  useEffect(() => {
    if (identityFile && addressFile && verificationStatus === 'not_started') {
      setVerificationStatus('documents_uploaded');
      if (user?.id) updateVerificationStatus(user.id, 'documents_uploaded');
      const timer = setTimeout(() => {
        setVerificationStatus('under_review');
        if (user?.id) updateVerificationStatus(user.id, 'under_review');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [identityFile, addressFile, verificationStatus, user?.id, updateVerificationStatus]);

  // ─── File Validation ────────────────────────────────────────────────────

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Invalid file format. Please upload JPEG, PNG, or PDF only.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File exceeds 5MB limit. Please upload a smaller file.';
    }
    return null;
  }, []);

  const handleIdentityFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const error = validateFile(file);
      if (error) {
        setIdentityError(error);
        setIdentityFile(null);
      } else {
        setIdentityError('');
        setIdentityFile(file);
      }
    },
    [validateFile]
  );

  const handleAddressFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const error = validateFile(file);
      if (error) {
        setAddressError(error);
        setAddressFile(null);
      } else {
        setAddressError('');
        setAddressFile(file);
      }
    },
    [validateFile]
  );

  // ─── Code Input Handlers ───────────────────────────────────────────────

  const handleCodeChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d?$/.test(value)) return;
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
    },
    [verificationCode]
  );

  const handleCodeKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
        codeInputRefs.current[index - 1]?.focus();
      }
    },
    [verificationCode]
  );

  const handleVerifyCode = useCallback(() => {
    const code = verificationCode.join('');
    if (code.length === 6) {
      setIsCodeVerified(true);
    }
  }, [verificationCode]);

  // ─── Re-upload (rejected state) ────────────────────────────────────────

  const handleReUpload = useCallback(() => {
    setVerificationStatus('not_started');
    if (user?.id) updateVerificationStatus(user.id, 'not_started');
    setIdentityFile(null);
    setAddressFile(null);
    setIdentityError('');
    setAddressError('');
  }, [user?.id, updateVerificationStatus]);

  // ─── Render ─────────────────────────────────────────────────────────────

  const statusBadge = getStatusBadge(verificationStatus);

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-white">Identity Verification</h1>
          <p className="text-sage text-sm">
            Complete your verification to participate in events and make offers.
          </p>
          <Badge label={statusBadge.label} color={statusBadge.color} size="md" />
        </div>

        {/* Step Indicator */}
        <GlassPanel variant="dark" padding="md">
          <StepIndicator
            steps={VERIFICATION_STEPS}
            currentStep={verificationStatus === 'rejected' ? 'not_started' : verificationStatus}
          />
        </GlassPanel>

        {/* Rejection Notice */}
        {verificationStatus === 'rejected' && (
          <GlassPanel variant="dark" padding="md">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Verification Rejected</h3>
                <p className="text-sage text-sm mt-1">
                  Your documents could not be verified. Please re-upload valid documents.
                </p>
              </div>
              <Button variant="primary" onClick={handleReUpload}>
                Re-upload Documents
              </Button>
            </div>
          </GlassPanel>
        )}

        {/* Document Upload Sections */}
        {(verificationStatus === 'not_started' || verificationStatus === 'rejected') && (
          <div className="space-y-6">
            {/* Identity Document Upload */}
            <GlassPanel variant="dark" padding="lg">
              <h2 className="text-lg font-semibold text-white mb-2">Identity Document</h2>
              <p className="text-sage text-sm mb-4">
                Government ID (front/back), Passport, or Driver&apos;s License
              </p>
              <div
                className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-amber/50 transition-colors"
                onClick={() => identityInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') identityInputRef.current?.click();
                }}
              >
                {identityFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium">{identityFile.name}</p>
                    <p className="text-sage text-xs">
                      {(identityFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm">Click or drag to upload</p>
                    <p className="text-sage text-xs">JPEG, PNG, or PDF — Max 5MB</p>
                  </div>
                )}
                <input
                  ref={identityInputRef}
                  type="file"
                  accept={ACCEPTED_EXTENSIONS}
                  className="hidden"
                  onChange={handleIdentityFileChange}
                  aria-label="Upload identity document"
                />
              </div>
              {identityError && (
                <p className="mt-2 text-sm text-red-400" role="alert">{identityError}</p>
              )}
            </GlassPanel>

            {/* Address Document Upload */}
            <GlassPanel variant="dark" padding="lg">
              <h2 className="text-lg font-semibold text-white mb-2">Proof of Address</h2>
              <p className="text-sage text-sm mb-4">
                Utility bill, Bank statement, or Government correspondence
              </p>
              <div
                className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center cursor-pointer hover:border-amber/50 transition-colors"
                onClick={() => addressInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') addressInputRef.current?.click();
                }}
              >
                {addressFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-white text-sm font-medium">{addressFile.name}</p>
                    <p className="text-sage text-xs">
                      {(addressFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-white text-sm">Click or drag to upload</p>
                    <p className="text-sage text-xs">JPEG, PNG, or PDF — Max 5MB</p>
                  </div>
                )}
                <input
                  ref={addressInputRef}
                  type="file"
                  accept={ACCEPTED_EXTENSIONS}
                  className="hidden"
                  onChange={handleAddressFileChange}
                  aria-label="Upload proof of address"
                />
              </div>
              {addressError && (
                <p className="mt-2 text-sm text-red-400" role="alert">{addressError}</p>
              )}
            </GlassPanel>
          </div>
        )}

        {/* Status Messages for intermediate states */}
        {verificationStatus === 'documents_uploaded' && (
          <GlassPanel variant="dark" padding="lg">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber/20 flex items-center justify-center animate-pulse">
                <svg className="w-6 h-6 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Documents Received</h3>
              <p className="text-sage text-sm">
                Your documents are being processed. Moving to review shortly...
              </p>
            </div>
          </GlassPanel>
        )}

        {verificationStatus === 'under_review' && (
          <GlassPanel variant="dark" padding="lg">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-navy/40 flex items-center justify-center">
                <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Under Review</h3>
              <p className="text-sage text-sm">
                Your documents are currently being reviewed. This typically takes 1-2 business days.
              </p>
            </div>
          </GlassPanel>
        )}

        {verificationStatus === 'verified' && (
          <GlassPanel variant="dark" padding="lg">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white">Verified</h3>
              <p className="text-sage text-sm">
                Your identity has been successfully verified. You can now participate in events.
              </p>
            </div>
          </GlassPanel>
        )}

        {/* Email/Phone Verification Mock */}
        <GlassPanel variant="dark" padding="lg">
          <h2 className="text-lg font-semibold text-white mb-2">Email &amp; Phone Verification</h2>
          <p className="text-sage text-sm mb-6">
            Enter the 6-digit verification code sent to your email/phone.
          </p>

          {isCodeVerified ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-emerald-400 font-medium text-sm">Verified</span>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 6-digit code input */}
              <div className="flex items-center justify-center gap-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { codeInputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    className="w-11 h-13 text-center text-lg font-bold rounded-lg bg-white/5 border border-white/20 text-white focus:border-amber focus:ring-2 focus:ring-amber/30 outline-none transition-all"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>

              <div className="flex justify-center">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleVerifyCode}
                  disabled={verificationCode.join('').length < 6}
                >
                  Verify
                </Button>
              </div>
            </div>
          )}
        </GlassPanel>
      </div>
    </GradientBackground>
  );
}
