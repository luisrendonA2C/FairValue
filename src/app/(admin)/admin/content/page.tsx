'use client';

import React, { useState, useCallback } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// ─── Types ──────────────────────────────────────────────────────────────────

interface HowItWorksStep {
  title: string;
  description: string;
}

interface ContentState {
  // Homepage
  homepageHeadline: string;
  homepageSubheadline: string;
  heroBannerUrl: string;
  featuredVehicleIds: string;
  howItWorksSteps: HowItWorksStep[];
  // Catalog
  catalogPageTitle: string;
  // Events
  eventDescriptions: string[];
  // Promotional
  promotionalBannerText: string;
  promotionalBannerVisible: boolean;
}

// ─── Character Limits ───────────────────────────────────────────────────────

const LIMITS = {
  homepageHeadline: 100,
  homepageSubheadline: 200,
  catalogPageTitle: 100,
  eventDescription: 500,
  promotionalBannerText: 200,
  stepTitle: 50,
  stepDescription: 150,
} as const;

// ─── Default Values ─────────────────────────────────────────────────────────

const DEFAULT_CONTENT: ContentState = {
  homepageHeadline: 'Fair Value — Premium Vehicle Marketplace',
  homepageSubheadline: 'Conectamos compradores verificados con dealers de confianza a través de eventos de ofertas justos y transparentes.',
  heroBannerUrl: '/images/hero-costa-rica.png',
  featuredVehicleIds: 'vehicle-001, vehicle-002, vehicle-003, vehicle-004, vehicle-005, vehicle-006',
  howItWorksSteps: [
    { title: 'Publicar Vehículos', description: 'El dealer publica sus vehículos con fotos y especificaciones completas.' },
    { title: 'Aprobación Fair Value', description: 'Nuestro equipo revisa y aprueba cada vehículo para garantizar calidad.' },
    { title: 'Explorar y Ofertar', description: 'Los compradores exploran el catálogo y colocan ofertas durante eventos activos.' },
    { title: 'Cierre del Evento', description: 'Al finalizar el evento, se generan leads calificados basados en las ofertas.' },
    { title: 'Conexión Externa', description: 'Dealer y comprador se conectan para negociar y cerrar la venta externamente.' },
  ],
  catalogPageTitle: 'Inventario de Vehículos Premium',
  eventDescriptions: [
    'Subasta de vehículos premium con los mejores precios del mercado costarricense.',
    'Evento exclusivo de ofertas para vehículos SUV y sedanes de lujo.',
    'Gran subasta de fin de año con descuentos especiales y financiamiento.',
  ],
  promotionalBannerText: '✦ Nuevo: Eventos semanales con vehículos exclusivos. ¡Regístrate hoy!',
  promotionalBannerVisible: true,
};

// ─── Character Counter Component ────────────────────────────────────────────

function CharCounter({ current, max }: { current: number; max: number }) {
  const isNearLimit = current > max * 0.85;
  const isOverLimit = current > max;

  return (
    <span
      className={[
        'text-xs font-mono',
        isOverLimit ? 'text-red-500 font-bold' : isNearLimit ? 'text-amber' : 'text-sage',
      ].join(' ')}
    >
      {current}/{max}
    </span>
  );
}

// ─── Textarea with Counter ──────────────────────────────────────────────────

function TextAreaWithCounter({
  label,
  value,
  onChange,
  maxLength,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxLength: number;
  rows?: number;
  placeholder?: string;
}) {
  const isOverLimit = value.length > maxLength;
  const isNearLimit = value.length > maxLength * 0.85;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">{label}</label>
        <CharCounter current={value.length} max={maxLength} />
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className={[
          'w-full rounded-lg px-4 py-3 text-sm outline-none transition-all duration-200',
          'bg-white/5 border resize-none',
          isOverLimit
            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
            : isNearLimit
              ? 'border-amber focus:border-amber focus:ring-2 focus:ring-amber/30'
              : 'border-sage/30 hover:border-sage/50 focus:border-navy focus:ring-2 focus:ring-navy/20',
          'text-white placeholder:text-sage/60',
        ].join(' ')}
      />
      {isOverLimit && (
        <p className="text-xs text-red-500">Excede el límite de {maxLength} caracteres</p>
      )}
    </div>
  );
}

// ─── Input with Counter ─────────────────────────────────────────────────────

function InputWithCounter({
  label,
  value,
  onChange,
  maxLength,
  placeholder,
  type = 'text',
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  maxLength: number;
  placeholder?: string;
  type?: 'text' | 'url';
}) {
  const isOverLimit = value.length > maxLength;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-white">{label}</label>
        <CharCounter current={value.length} max={maxLength} />
      </div>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength + 50}
        placeholder={placeholder}
        error={isOverLimit ? `Excede el límite de ${maxLength} caracteres` : undefined}
        className=""
      />
    </div>
  );
}

// ─── Admin Content Page ─────────────────────────────────────────────────────

export default function AdminContentPage() {
  const [content, setContent] = useState<ContentState>(DEFAULT_CONTENT);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Check if any character limit is exceeded
  const hasExceededLimits = useCallback(() => {
    if (content.homepageHeadline.length > LIMITS.homepageHeadline) return true;
    if (content.homepageSubheadline.length > LIMITS.homepageSubheadline) return true;
    if (content.catalogPageTitle.length > LIMITS.catalogPageTitle) return true;
    if (content.promotionalBannerText.length > LIMITS.promotionalBannerText) return true;
    for (const desc of content.eventDescriptions) {
      if (desc.length > LIMITS.eventDescription) return true;
    }
    for (const step of content.howItWorksSteps) {
      if (step.title.length > LIMITS.stepTitle) return true;
      if (step.description.length > LIMITS.stepDescription) return true;
    }
    // Validate featured vehicle IDs count
    const ids = content.featuredVehicleIds.split(',').map((s) => s.trim()).filter(Boolean);
    if (ids.length > 8) return true;
    return false;
  }, [content]);

  const updateField = <K extends keyof ContentState>(key: K, value: ContentState[K]) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  const updateStep = (index: number, field: 'title' | 'description', value: string) => {
    setContent((prev) => {
      const steps = [...prev.howItWorksSteps];
      steps[index] = { ...steps[index], [field]: value };
      return { ...prev, howItWorksSteps: steps };
    });
  };

  const updateEventDescription = (index: number, value: string) => {
    setContent((prev) => {
      const descs = [...prev.eventDescriptions];
      descs[index] = value;
      return { ...prev, eventDescriptions: descs };
    });
  };

  const handleSave = () => {
    if (hasExceededLimits()) return;
    setIsSaving(true);
    // Simulate save delay
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 600);
  };

  const featuredIds = content.featuredVehicleIds.split(',').map((s) => s.trim()).filter(Boolean);
  const featuredCountExceeded = featuredIds.length > 8;

  return (
    <div className="bg-navy-dark text-white p-6 lg:p-8 overflow-y-auto min-h-screen">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
              Gestión de Contenido
            </h1>
            <p className="text-sage mt-1">Administra el contenido público de la plataforma</p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            disabled={hasExceededLimits() || isSaving}
            loading={isSaving}
          >
            Guardar Cambios
          </Button>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-2">
            <div className="bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">Contenido actualizado exitosamente</span>
            </div>
          </div>
        )}

        {/* Validation Warning */}
        {hasExceededLimits() && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span>Uno o más campos exceden el límite de caracteres. Corrija los campos marcados en rojo antes de guardar.</span>
          </div>
        )}

        <div className="space-y-8">
          {/* ─── Section 1: Homepage Content ──────────────────── */}
          <GlassPanel variant="dark" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-white">Página Principal</h2>
                <p className="text-xs text-sage">Contenido del Hero y secciones de la landing page</p>
              </div>
            </div>

            <div className="space-y-5">
              <InputWithCounter
                label="Headline principal"
                value={content.homepageHeadline}
                onChange={(val) => updateField('homepageHeadline', val)}
                maxLength={LIMITS.homepageHeadline}
                placeholder="Título principal del hero..."
              />

              <TextAreaWithCounter
                label="Subheadline"
                value={content.homepageSubheadline}
                onChange={(val) => updateField('homepageSubheadline', val)}
                maxLength={LIMITS.homepageSubheadline}
                rows={2}
                placeholder="Descripción breve del modelo de intermediación..."
              />

              <div className="space-y-1">
                <label className="text-sm font-medium text-white">URL del Hero Banner</label>
                <Input
                  type="text"
                  value={content.heroBannerUrl}
                  onChange={(e) => updateField('heroBannerUrl', e.target.value)}
                  placeholder="https://... o /images/..."
                  className=""
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-white">Vehículos Destacados (IDs separados por coma)</label>
                  <span className={[
                    'text-xs font-mono',
                    featuredCountExceeded ? 'text-red-500 font-bold' : 'text-sage',
                  ].join(' ')}>
                    {featuredIds.length}/8 vehículos
                  </span>
                </div>
                <Input
                  type="text"
                  value={content.featuredVehicleIds}
                  onChange={(e) => updateField('featuredVehicleIds', e.target.value)}
                  placeholder="vehicle-001, vehicle-002, ..."
                  error={featuredCountExceeded ? 'Máximo 8 vehículos destacados permitidos' : undefined}
                  className=""
                />
              </div>
            </div>
          </GlassPanel>

          {/* ─── Section 2: How It Works Steps ───────────────── */}
          <GlassPanel variant="dark" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-white">Cómo Funciona (5 pasos)</h2>
                <p className="text-xs text-sage">Títulos y descripciones de cada paso del proceso</p>
              </div>
            </div>

            <div className="space-y-6">
              {content.howItWorksSteps.map((step, index) => (
                <div key={index} className="p-4 rounded-xl bg-white/5 border border-sage/10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-white">Paso {index + 1}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-sage">Título</label>
                        <CharCounter current={step.title.length} max={LIMITS.stepTitle} />
                      </div>
                      <input
                        type="text"
                        value={step.title}
                        onChange={(e) => updateStep(index, 'title', e.target.value)}
                        className={[
                          'w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 border',
                          'bg-white/5 text-white placeholder:text-sage/60',
                          step.title.length > LIMITS.stepTitle
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-sage/30 focus:border-navy focus:ring-2 focus:ring-navy/20',
                        ].join(' ')}
                        placeholder="Título del paso..."
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-sage">Descripción</label>
                        <CharCounter current={step.description.length} max={LIMITS.stepDescription} />
                      </div>
                      <input
                        type="text"
                        value={step.description}
                        onChange={(e) => updateStep(index, 'description', e.target.value)}
                        className={[
                          'w-full rounded-lg px-3 py-2 text-sm outline-none transition-all duration-200 border',
                          'bg-white/5 text-white placeholder:text-sage/60',
                          step.description.length > LIMITS.stepDescription
                            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
                            : 'border-sage/30 focus:border-navy focus:ring-2 focus:ring-navy/20',
                        ].join(' ')}
                        placeholder="Descripción breve del paso..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* ─── Section 3: Catalog Page ─────────────────────── */}
          <GlassPanel variant="dark" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-white">Página de Catálogo</h2>
                <p className="text-xs text-sage">Título y configuración de la página de inventario</p>
              </div>
            </div>

            <InputWithCounter
              label="Título de la página de catálogo"
              value={content.catalogPageTitle}
              onChange={(val) => updateField('catalogPageTitle', val)}
              maxLength={LIMITS.catalogPageTitle}
              placeholder="Título para la página de inventario..."
            />
          </GlassPanel>

          {/* ─── Section 4: Event Descriptions ───────────────── */}
          <GlassPanel variant="dark" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-white">Descripciones de Eventos</h2>
                <p className="text-xs text-sage">Texto descriptivo para cada evento de la plataforma</p>
              </div>
            </div>

            <div className="space-y-5">
              {content.eventDescriptions.map((desc, index) => (
                <TextAreaWithCounter
                  key={index}
                  label={`Evento ${index + 1}`}
                  value={desc}
                  onChange={(val) => updateEventDescription(index, val)}
                  maxLength={LIMITS.eventDescription}
                  rows={3}
                  placeholder="Descripción del evento..."
                />
              ))}
            </div>
          </GlassPanel>

          {/* ─── Section 5: Promotional Banner ───────────────── */}
          <GlassPanel variant="dark" padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-navy/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-heading font-semibold text-white">Banner Promocional</h2>
                <p className="text-xs text-sage">Texto y visibilidad del banner promocional en la plataforma</p>
              </div>
            </div>

            <div className="space-y-5">
              <TextAreaWithCounter
                label="Texto del banner promocional"
                value={content.promotionalBannerText}
                onChange={(val) => updateField('promotionalBannerText', val)}
                maxLength={LIMITS.promotionalBannerText}
                rows={2}
                placeholder="Texto promocional para el banner..."
              />

              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-sage/10">
                <div>
                  <p className="text-sm font-medium text-white">Visibilidad del Banner</p>
                  <p className="text-xs text-sage mt-0.5">
                    {content.promotionalBannerVisible ? 'El banner es visible para los visitantes' : 'El banner está oculto'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateField('promotionalBannerVisible', !content.promotionalBannerVisible)}
                  className={[
                    'relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
                    content.promotionalBannerVisible ? 'bg-emerald-500' : 'bg-sage/30',
                  ].join(' ')}
                  role="switch"
                  aria-checked={content.promotionalBannerVisible}
                  aria-label="Toggle promotional banner visibility"
                >
                  <span
                    className={[
                      'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      content.promotionalBannerVisible ? 'translate-x-5' : 'translate-x-0',
                    ].join(' ')}
                  />
                </button>
              </div>
            </div>
          </GlassPanel>

          {/* ─── Bottom Save Button ──────────────────────────── */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-navy/5 border border-navy/10">
            <p className="text-sm text-sage">
              Los cambios se reflejan en las páginas públicas durante la sesión actual.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={hasExceededLimits() || isSaving}
              loading={isSaving}
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
    </div>
  );
}

