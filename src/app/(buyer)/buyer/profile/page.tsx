'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';

// ─── Types ──────────────────────────────────────────────────────────────────

interface ProfileFormState {
  name: string;
  email: string;
  phone: string;
  budgetMin: string;
  budgetMax: string;
  preferredLocation: string;
  preferredType: string;
  preferredMake: string;
}

interface LeadScoreData {
  score: number;
  level: 'Priority' | 'Hot' | 'Medium' | 'Cold';
  levelColor: 'priority' | 'hot' | 'medium' | 'cold';
  reasons: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getLeadScoreFromUser(user: {
  emailVerified: boolean;
  phoneVerified: boolean;
  verificationStatus: string;
  profileCompleteness: number;
  budgetRange?: { min: number; max: number };
  preferredLocation?: string;
}): LeadScoreData {
  const reasons: string[] = [];
  let score = 0;

  // Email verification (15 pts)
  if (user.emailVerified) {
    score += 15;
    reasons.push('Verified email');
  }

  // Phone verification (15 pts)
  if (user.phoneVerified) {
    score += 15;
    reasons.push('Verified phone number');
  }

  // Identity verification (20 pts)
  if (user.verificationStatus === 'verified') {
    score += 20;
    reasons.push('Identity verified');
  } else if (user.verificationStatus === 'under_review') {
    score += 10;
    reasons.push('Verification in progress');
  }

  // Profile completeness (20 pts scaled)
  const profilePoints = Math.round((user.profileCompleteness / 100) * 20);
  score += profilePoints;
  if (user.profileCompleteness >= 80) {
    reasons.push('Complete profile');
  } else if (user.profileCompleteness >= 50) {
    reasons.push('Partially complete profile');
  }

  // Budget defined (15 pts)
  if (user.budgetRange) {
    score += 15;
    reasons.push('Budget range defined');
  }

  // Location preference (15 pts)
  if (user.preferredLocation) {
    score += 15;
    reasons.push('Location preference set');
  }

  // Determine level
  let level: LeadScoreData['level'];
  let levelColor: LeadScoreData['levelColor'];

  if (score >= 80) {
    level = 'Priority';
    levelColor = 'priority';
  } else if (score >= 60) {
    level = 'Hot';
    levelColor = 'hot';
  } else if (score >= 40) {
    level = 'Medium';
    levelColor = 'medium';
  } else {
    level = 'Cold';
    levelColor = 'cold';
  }

  return { score, level, levelColor, reasons };
}

const REQUIRED_FIELDS: { key: keyof ProfileFormState; label: string }[] = [
  { key: 'name', label: 'Full Name' },
  { key: 'email', label: 'Email Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'budgetMin', label: 'Budget Range' },
  { key: 'preferredLocation', label: 'Preferred Location' },
];

function calculateCompletion(form: ProfileFormState): {
  percentage: number;
  missing: string[];
} {
  const missing: string[] = [];

  for (const field of REQUIRED_FIELDS) {
    if (field.key === 'budgetMin') {
      if (!form.budgetMin || !form.budgetMax) {
        missing.push(field.label);
      }
    } else if (!form[field.key]) {
      missing.push(field.label);
    }
  }

  const filled = REQUIRED_FIELDS.length - missing.length;
  const percentage = Math.round((filled / REQUIRED_FIELDS.length) * 100);

  return { percentage, missing };
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function BuyerProfilePage() {
  const { user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState<ProfileFormState>({
    name: '',
    email: '',
    phone: '',
    budgetMin: '',
    budgetMax: '',
    preferredLocation: '',
    preferredType: '',
    preferredMake: '',
  });

  // Populate form from user data
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        budgetMin: user.budgetRange?.min?.toString() || '',
        budgetMax: user.budgetRange?.max?.toString() || '',
        preferredLocation: user.preferredLocation || '',
        preferredType: user.vehiclePreferences?.preferredType || '',
        preferredMake: user.vehiclePreferences?.preferredMake || '',
      });
    }
  }, [user]);

  const handleChange = (field: keyof ProfileFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  if (!user) {
    return (
      <GradientBackground variant="navy-dark" className="min-h-screen flex items-center justify-center">
        <p className="text-white/60 text-lg">Please log in to view your profile.</p>
      </GradientBackground>
    );
  }

  const leadScore = getLeadScoreFromUser(user);
  const { percentage: completionPercentage, missing: missingFields } = calculateCompletion(form);

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">My Profile</h1>
          <p className="text-sage text-sm mt-1">Manage your account information and preferences</p>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">Changes saved successfully</span>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Avatar + Basic Info */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <GlassPanel variant="dark" padding="lg">
              <div className="flex flex-col items-center text-center">
                <Avatar name={form.name || user.name} size="xl" src={user.profilePhoto} />
                <h2 className="mt-4 text-xl font-semibold text-white">{form.name || user.name}</h2>
                <p className="text-sage text-sm">{form.email || user.email}</p>
              </div>
            </GlassPanel>

            {/* Basic Info Form */}
            <GlassPanel variant="dark" padding="lg">
              <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  required
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  required
                />
              </div>
            </GlassPanel>

            {/* Profile Completion */}
            <GlassPanel variant="dark" padding="lg">
              <h3 className="text-lg font-semibold text-white mb-4">Profile Completion</h3>
              <ProgressBar value={completionPercentage} label={`${completionPercentage}% Complete`} />
              {missingFields.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs text-sage uppercase tracking-wide font-medium">Missing required fields:</p>
                  {missingFields.map((field) => (
                    <div
                      key={field}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber/10 border border-amber/20"
                    >
                      <svg className="w-4 h-4 text-amber shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-sm text-amber">{field}</span>
                    </div>
                  ))}
                </div>
              )}
            </GlassPanel>
          </div>

          {/* Right Column: Preferences + Lead Score */}
          <div className="space-y-6">
            {/* Preferences */}
            <GlassPanel variant="dark" padding="lg">
              <h3 className="text-lg font-semibold text-white mb-4">Preferences</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Budget Min ($)"
                    type="number"
                    value={form.budgetMin}
                    onChange={handleChange('budgetMin')}
                    required
                  />
                  <Input
                    label="Budget Max ($)"
                    type="number"
                    value={form.budgetMax}
                    onChange={handleChange('budgetMax')}
                    required
                  />
                </div>
                <Input
                  label="Preferred Location"
                  value={form.preferredLocation}
                  onChange={handleChange('preferredLocation')}
                  required
                />
                <Input
                  label="Preferred Vehicle Type"
                  value={form.preferredType}
                  onChange={handleChange('preferredType')}
                  placeholder="e.g. SUV, Sedan, Truck"
                />
                <Input
                  label="Preferred Make"
                  value={form.preferredMake}
                  onChange={handleChange('preferredMake')}
                  placeholder="e.g. Toyota, BMW, Mercedes"
                />
              </div>
            </GlassPanel>

            {/* Lead Score */}
            <GlassPanel variant="dark" padding="lg" glow>
              <h3 className="text-lg font-semibold text-white mb-4">Lead Score</h3>

              {/* Score Display */}
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-white">{leadScore.score}</div>
                <Badge variant="level" color={leadScore.levelColor} label={leadScore.level} size="md" />
              </div>

              {/* Score Bar */}
              <ProgressBar value={leadScore.score} variant="scored" />

              {/* Reasons */}
              <div className="mt-5">
                <p className="text-xs text-sage uppercase tracking-wide font-medium mb-2">Score Breakdown</p>
                <ul className="space-y-2">
                  {leadScore.reasons.map((reason) => (
                    <li key={reason} className="flex items-center gap-2 text-sm text-white/80">
                      <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </GlassPanel>

            {/* Save Button */}
            <Button variant="primary" size="lg" className="w-full" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </GradientBackground>
  );
}
