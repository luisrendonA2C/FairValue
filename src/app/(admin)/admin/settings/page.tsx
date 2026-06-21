'use client';

import React, { useState, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DEFAULT_WEIGHTS, validateWeights } from '@/lib/leadScoring';
import type { ScoringWeights } from '@/types/scoring';

// ─── Toggle Switch Component ────────────────────────────────────────────────

interface ToggleSwitchProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group">
      <div className="flex-1">
        <span className="text-sm font-medium text-white block">{label}</span>
        {description && (
          <span className="text-xs text-sage mt-0.5 block">{description}</span>
        )}
      </div>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={[
            'w-11 h-6 rounded-full transition-colors duration-200',
            checked ? 'bg-amber' : 'bg-sage/30',
          ].join(' ')}
        />
        <div
          className={[
            'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0',
          ].join(' ')}
        />
      </div>
    </label>
  );
}

// ─── Admin Settings Page ────────────────────────────────────────────────────

export default function AdminSettingsPage() {
  // Platform settings state
  const [platformName, setPlatformName] = useState('Fair Value');
  const [contactEmail, setContactEmail] = useState('admin@fairvalue.cr');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);

  // Operational parameters
  const [eventDefaultDuration, setEventDefaultDuration] = useState('7');
  const [maxOffersPerBuyer, setMaxOffersPerBuyer] = useState('5');
  const [leadUnlockLimit, setLeadUnlockLimit] = useState('10');

  // Scoring weights state
  const [weights, setWeights] = useState<ScoringWeights>({ ...DEFAULT_WEIGHTS });

  // Load saved weights from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fairvalue_scoring_weights');
      if (stored) {
        const parsed = JSON.parse(stored) as ScoringWeights;
        if (
          parsed.offerAmount + parsed.verification + parsed.profileCompleteness + parsed.timing === 100
        ) {
          setWeights(parsed);
        }
      }
    } catch {
      // Use defaults if localStorage is unavailable
    }
  }, []);

  // UI state
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');

  // Calculate sum of weights
  const weightsSum =
    weights.offerAmount + weights.verification + weights.profileCompleteness + weights.timing;

  const isWeightsValid = validateWeights(weights);

  // Email validation
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle weight change
  const handleWeightChange = (
    field: keyof ScoringWeights,
    value: string
  ) => {
    const numValue = value === '' ? 0 : Math.min(100, Math.max(0, parseInt(value, 10) || 0));
    setWeights((prev) => ({ ...prev, [field]: numValue }));
  };

  // Handle platform name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 100) {
      setNameError('El nombre no puede exceder 100 caracteres');
    } else {
      setNameError('');
    }
    setPlatformName(value.slice(0, 100));
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContactEmail(value);
    if (value && !validateEmail(value)) {
      setEmailError('Formato de email inválido');
    } else {
      setEmailError('');
    }
  };

  // Check if save is allowed
  const canSave =
    isWeightsValid &&
    !emailError &&
    !nameError &&
    platformName.trim() !== '' &&
    contactEmail.trim() !== '' &&
    validateEmail(contactEmail);

  // Handle save
  const handleSave = () => {
    if (!canSave) return;

    // Persist scoring weights in localStorage for cross-page access
    try {
      localStorage.setItem('fairvalue_scoring_weights', JSON.stringify(weights));
    } catch {
      // localStorage unavailable — weights still work in-memory for the session
    }

    // Persist in memory (simulated)
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="bg-navy-dark text-white p-6 lg:p-8 overflow-y-auto min-h-screen">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
            Configuración
          </h1>
          <p className="text-sage mt-1">
            Ajustes generales de la plataforma y configuración de scoring
          </p>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="mb-6 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium flex items-center gap-2 animate-in fade-in duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Configuración guardada exitosamente
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Platform Settings Section */}
          <div className="space-y-6">
            <GlassPanel variant="dark" padding="lg">
              <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Configuración de Plataforma
              </h3>

              <div className="space-y-5">
                <Input
                  label="Nombre de la Plataforma"
                  value={platformName}
                  onChange={handleNameChange}
                  maxLength={100}
                  error={nameError}
                  placeholder="Ej: Fair Value"
                  required
                />

                <Input
                  type="email"
                  label="Email de Contacto"
                  value={contactEmail}
                  onChange={handleEmailChange}
                  error={emailError}
                  placeholder="admin@fairvalue.cr"
                  required
                />
              </div>
            </GlassPanel>

            {/* Notification Preferences */}
            <GlassPanel variant="dark" padding="lg">
              <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </span>
                Notificaciones
              </h3>

              <div className="space-y-4">
                <ToggleSwitch
                  label="Notificaciones por Email"
                  description="Recibir alertas por correo electrónico"
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <div className="border-t border-sage/10" />
                <ToggleSwitch
                  label="Notificaciones en App"
                  description="Mostrar notificaciones dentro de la plataforma"
                  checked={inAppNotifications}
                  onChange={setInAppNotifications}
                />
              </div>
            </GlassPanel>

            {/* Operational Parameters */}
            <GlassPanel variant="dark" padding="lg">
              <h3 className="text-lg font-heading font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>
                </span>
                Parámetros Operacionales
              </h3>

              <div className="space-y-5">
                <Input
                  type="number"
                  label="Duración por defecto de evento (días)"
                  value={eventDefaultDuration}
                  onChange={(e) => setEventDefaultDuration(e.target.value)}
                  placeholder="7"
                />

                <Input
                  type="number"
                  label="Máximo de ofertas por comprador por evento"
                  value={maxOffersPerBuyer}
                  onChange={(e) => setMaxOffersPerBuyer(e.target.value)}
                  placeholder="5"
                />

                <Input
                  type="number"
                  label="Límite de desbloqueo de leads por dealer"
                  value={leadUnlockLimit}
                  onChange={(e) => setLeadUnlockLimit(e.target.value)}
                  placeholder="10"
                />
              </div>
            </GlassPanel>
          </div>

          {/* Scoring Configuration Section */}
          <div className="space-y-6">
            <GlassPanel variant="dark" padding="lg">
              <h3 className="text-lg font-heading font-semibold text-white mb-2 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber/10 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                </span>
                Configuración de Scoring
              </h3>
              <p className="text-sm text-sage mb-6">
                Ajusta los pesos del algoritmo de scoring de leads. Los 4 valores deben sumar exactamente 100.
              </p>

              <div className="space-y-5">
                <Input
                  type="number"
                  label="Peso: Monto de Oferta"
                  value={String(weights.offerAmount)}
                  onChange={(e) => handleWeightChange('offerAmount', e.target.value)}
                  placeholder="0-100"
                />

                <Input
                  type="number"
                  label="Peso: Verificación"
                  value={String(weights.verification)}
                  onChange={(e) => handleWeightChange('verification', e.target.value)}
                  placeholder="0-100"
                />

                <Input
                  type="number"
                  label="Peso: Completitud de Perfil"
                  value={String(weights.profileCompleteness)}
                  onChange={(e) => handleWeightChange('profileCompleteness', e.target.value)}
                  placeholder="0-100"
                />

                <Input
                  type="number"
                  label="Peso: Timing"
                  value={String(weights.timing)}
                  onChange={(e) => handleWeightChange('timing', e.target.value)}
                  placeholder="0-100"
                />
              </div>

              {/* Dynamic Sum Display */}
              <div className="mt-6 pt-4 border-t border-sage/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Suma Total:</span>
                  <span
                    className={[
                      'text-lg font-bold tabular-nums',
                      weightsSum === 100
                        ? 'text-emerald-600'
                        : 'text-red-500',
                    ].join(' ')}
                  >
                    {weightsSum} / 100
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-2 h-2 rounded-full bg-sage/10 overflow-hidden">
                  <div
                    className={[
                      'h-full rounded-full transition-all duration-300',
                      weightsSum === 100
                        ? 'bg-emerald-500'
                        : weightsSum > 100
                          ? 'bg-red-500'
                          : 'bg-amber',
                    ].join(' ')}
                    style={{ width: `${Math.min(100, (weightsSum / 100) * 100)}%` }}
                  />
                </div>

                {/* Inline Error */}
                {weightsSum !== 100 && (
                  <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Los pesos deben sumar exactamente 100 (actual: {weightsSum})
                  </p>
                )}
              </div>
            </GlassPanel>

            {/* Defaults Reference */}
            <GlassPanel variant="dark" padding="md">
              <h4 className="text-sm font-heading font-semibold text-white mb-3 flex items-center gap-2">
                <svg className="w-4 h-4 text-amber inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
                Valores por Defecto
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between items-center px-3 py-2 bg-sage/5 rounded-lg">
                  <span className="text-sage">Monto de Oferta</span>
                  <span className="font-bold text-white">{DEFAULT_WEIGHTS.offerAmount}</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-sage/5 rounded-lg">
                  <span className="text-sage">Verificación</span>
                  <span className="font-bold text-white">{DEFAULT_WEIGHTS.verification}</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-sage/5 rounded-lg">
                  <span className="text-sage">Perfil</span>
                  <span className="font-bold text-white">{DEFAULT_WEIGHTS.profileCompleteness}</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-sage/5 rounded-lg">
                  <span className="text-sage">Timing</span>
                  <span className="font-bold text-white">{DEFAULT_WEIGHTS.timing}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-amber hover:text-amber-dark text-xs"
                onClick={() => setWeights({ ...DEFAULT_WEIGHTS })}
              >
                Restaurar valores por defecto
              </Button>
            </GlassPanel>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex items-center justify-end gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={() => {
              setPlatformName('Fair Value');
              setContactEmail('admin@fairvalue.cr');
              setEmailNotifications(true);
              setInAppNotifications(true);
              setEventDefaultDuration('7');
              setMaxOffersPerBuyer('5');
              setLeadUnlockLimit('10');
              setWeights({ ...DEFAULT_WEIGHTS });
              setEmailError('');
              setNameError('');
            }}
          >
            Restablecer Todo
          </Button>
          <Button
            variant="primary"
            size="lg"
            disabled={!canSave}
            onClick={handleSave}
          >
            Guardar Configuración
          </Button>
        </div>
    </div>
  );
}

