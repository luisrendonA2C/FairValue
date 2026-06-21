'use client';

import React, { useState, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMockData } from '@/hooks/useData';
import { GradientBackground } from '@/components/ui/GradientBackground';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { getImageUrl } from '@/lib/imageProvider';
import type { VehicleStatus, FuelType, Transmission } from '@/types';
import type { BadgeStatusColor } from '@/components/ui/Badge';

// ─── Constants ──────────────────────────────────────────────────────────────

const VEHICLE_LIFECYCLE_STEPS = [
  { id: 'draft', label: 'Draft' },
  { id: 'pending_approval', label: 'Pending' },
  { id: 'active', label: 'Active' },
  { id: 'assigned_to_event', label: 'In Event' },
  { id: 'closed', label: 'Closed' },
];

const STATUS_BADGE_CONFIG: Record<VehicleStatus, { label: string; color: BadgeStatusColor; className?: string }> = {
  draft: { label: 'Draft', color: 'sage' },
  pending_approval: { label: 'Pending Approval', color: 'navy' },
  active: { label: 'Active', color: 'emerald' },
  assigned_to_event: { label: 'In Event', color: 'amber' },
  closed: { label: 'Closed', color: 'sage' },
  rejected: { label: 'Rejected', color: 'amber', className: 'bg-red-500/15 text-red-700 border-red-500/30' },
};

const FUEL_OPTIONS = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
];

const TRANSMISSION_OPTIONS = [
  { value: 'automatic', label: 'Automatic' },
  { value: 'manual', label: 'Manual' },
];

// ─── Form State ─────────────────────────────────────────────────────────────

interface VehicleFormData {
  make: string;
  model: string;
  year: string;
  mileage: string;
  fuelType: string;
  transmission: string;
  price: string;
  description: string;
  images: File[];
}

interface FormErrors {
  make?: string;
  model?: string;
  year?: string;
  mileage?: string;
  fuelType?: string;
  transmission?: string;
  price?: string;
  description?: string;
  images?: string;
}

const INITIAL_FORM: VehicleFormData = {
  make: '',
  model: '',
  year: '',
  mileage: '',
  fuelType: '',
  transmission: '',
  price: '',
  description: '',
  images: [],
};

// ─── Page Component ─────────────────────────────────────────────────────────

export default function DealerVehiclesPage() {
  const { user } = useAuth();
  const { vehicles, offers, dealers, addVehicle } = useMockData();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<VehicleFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Find dealer linked to current user
  const currentDealer = useMemo(
    () => dealers.find((d) => d.userId === user?.id),
    [dealers, user]
  );

  // Filter vehicles by the current dealer
  const dealerVehicles = useMemo(() => {
    if (!currentDealer) return [];
    return vehicles
      .filter((v) => v.dealerId === currentDealer.id)
      .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime());
  }, [vehicles, currentDealer]);

  // Count offers per vehicle
  const offerCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    offers.forEach((o) => {
      map[o.vehicleId] = (map[o.vehicleId] || 0) + 1;
    });
    return map;
  }, [offers]);

  // ─── Form Handlers ──────────────────────────────────────────────────

  function validateForm(): FormErrors {
    const newErrors: FormErrors = {};
    if (!form.make.trim()) newErrors.make = 'Make is required';
    if (!form.model.trim()) newErrors.model = 'Model is required';

    const yearNum = parseInt(form.year, 10);
    if (!form.year.trim()) {
      newErrors.year = 'Year is required';
    } else if (isNaN(yearNum) || yearNum < 1990 || yearNum > new Date().getFullYear() + 1) {
      newErrors.year = 'Enter a valid year (1990 - current)';
    }

    const mileageNum = parseInt(form.mileage, 10);
    if (!form.mileage.trim()) {
      newErrors.mileage = 'Mileage is required';
    } else if (isNaN(mileageNum) || mileageNum < 0) {
      newErrors.mileage = 'Enter a valid mileage';
    }

    if (!form.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!form.transmission) newErrors.transmission = 'Transmission is required';

    const priceNum = parseFloat(form.price);
    if (!form.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(priceNum) || priceNum <= 0) {
      newErrors.price = 'Enter a valid price';
    }

    if (!form.description.trim()) newErrors.description = 'Description is required';

    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage('');

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    if (!currentDealer) return;

    addVehicle({
      dealerId: currentDealer.id,
      make: form.make.trim(),
      model: form.model.trim(),
      year: parseInt(form.year, 10),
      mileage: parseInt(form.mileage, 10),
      fuelType: form.fuelType as FuelType,
      transmission: form.transmission as Transmission,
      engine: '',
      color: '',
      vin: '',
      bodyType: 'sedan',
      price: parseFloat(form.price),
      description: form.description.trim(),
      status: 'pending_approval',
      imageIds: [],
    });

    setForm(INITIAL_FORM);
    setErrors({});
    setShowForm(false);
    setSuccessMessage('Vehicle submitted successfully! It is now pending approval.');
  }

  function handleInputChange(field: keyof VehicleFormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      // Clear error on change
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const validFiles: File[] = [];
    let imageError = '';

    for (let i = 0; i < files.length && validFiles.length < 10; i++) {
      const file = files[i];
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        validFiles.push(file);
      } else {
        imageError = 'Only JPEG and PNG images are allowed';
      }
    }

    if (validFiles.length + form.images.length > 10) {
      imageError = 'Maximum 10 images allowed';
      validFiles.splice(10 - form.images.length);
    }

    setForm((prev) => ({ ...prev, images: [...prev.images, ...validFiles] }));
    if (imageError) {
      setErrors((prev) => ({ ...prev, images: imageError }));
    } else {
      setErrors((prev) => ({ ...prev, images: undefined }));
    }
  }

  function removeImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  // ─── Render ─────────────────────────────────────────────────────────

  return (
    <GradientBackground variant="navy-dark" className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Vehicles</h1>
            <p className="text-sage-light text-sm mt-1">
              Manage your vehicle inventory
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setShowForm(!showForm);
              setSuccessMessage('');
            }}
          >
            {showForm ? 'Back to List' : '+ Add Vehicle'}
          </Button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <GlassPanel variant="dark" padding="md" className="mb-6 border-emerald-500/30">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-emerald-300 text-sm">{successMessage}</p>
            </div>
          </GlassPanel>
        )}

        {/* Add Vehicle Form */}
        {showForm && (
          <GlassPanel variant="dark" padding="lg" className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-6">Add New Vehicle</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Make"
                  placeholder="e.g. Toyota"
                  value={form.make}
                  onChange={handleInputChange('make')}
                  error={errors.make}
                  required
                />
                <Input
                  label="Model"
                  placeholder="e.g. RAV4"
                  value={form.model}
                  onChange={handleInputChange('model')}
                  error={errors.model}
                  required
                />
                <Input
                  label="Year"
                  type="number"
                  placeholder="e.g. 2023"
                  value={form.year}
                  onChange={handleInputChange('year')}
                  error={errors.year}
                  required
                />
                <Input
                  label="Mileage (km)"
                  type="number"
                  placeholder="e.g. 12000"
                  value={form.mileage}
                  onChange={handleInputChange('mileage')}
                  error={errors.mileage}
                  required
                />
                <Select
                  label="Fuel Type"
                  placeholder="Select fuel type"
                  options={FUEL_OPTIONS}
                  value={form.fuelType}
                  onChange={handleInputChange('fuelType')}
                  error={errors.fuelType}
                />
                <Select
                  label="Transmission"
                  placeholder="Select transmission"
                  options={TRANSMISSION_OPTIONS}
                  value={form.transmission}
                  onChange={handleInputChange('transmission')}
                  error={errors.transmission}
                />
                <Input
                  label="Price (USD)"
                  type="number"
                  placeholder="e.g. 42000"
                  value={form.price}
                  onChange={handleInputChange('price')}
                  error={errors.price}
                  required
                />
              </div>

              {/* Description */}
              <div className="relative w-full">
                <textarea
                  value={form.description}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, description: e.target.value }));
                    if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
                  }}
                  placeholder="Describe the vehicle..."
                  rows={4}
                  className={[
                    'w-full rounded-md px-4 py-3 text-sm outline-none transition-all duration-200',
                    'bg-white/5 backdrop-blur-sm border text-white placeholder:text-sage/60',
                    errors.description
                      ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                      : 'border-sage/30 hover:border-sage/50 focus:border-amber focus:ring-2 focus:ring-amber/30',
                  ].join(' ')}
                />
                <label className="absolute -top-2 left-3 px-1 text-xs font-medium text-sage bg-navy-dark/80 rounded">
                  Description *
                </label>
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500" role="alert">{errors.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-sage mb-2">
                  Images (up to 10, JPEG/PNG)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-sage/40 text-sage text-sm hover:border-amber hover:text-amber transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Choose Files
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-sage">
                    {form.images.length}/10 selected
                  </span>
                </div>
                {form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {form.images.map((file, idx) => (
                      <div key={idx} className="relative group">
                        <div className="w-16 h-16 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center overflow-hidden">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.images && (
                  <p className="mt-1 text-xs text-red-500" role="alert">{errors.images}</p>
                )}
              </div>

              {/* Submit */}
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="lg">
                  Submit Vehicle
                </Button>
              </div>
            </form>
          </GlassPanel>
        )}

        {/* Vehicle List */}
        {!showForm && (
          <div className="space-y-4">
            {dealerVehicles.length === 0 ? (
              <GlassPanel variant="dark" padding="lg" className="text-center">
                <p className="text-sage-light">No vehicles yet. Add your first vehicle to get started.</p>
              </GlassPanel>
            ) : (
              dealerVehicles.map((vehicle) => {
                const imageUrl = getImageUrl('vehicle', vehicle.imageIds[0] || vehicle.id);
                const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
                const badgeConfig = STATUS_BADGE_CONFIG[vehicle.status];
                const offerCount = offerCountMap[vehicle.id] || 0;

                return (
                  <GlassPanel key={vehicle.id} variant="dark" padding="md" className="hover:border-white/20 transition-all">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Thumbnail */}
                      <div className="w-full md:w-40 h-28 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-white font-semibold text-base truncate">
                            {title}
                          </h3>
                          <Badge
                            variant="status"
                            color={badgeConfig.color}
                            label={badgeConfig.label}
                            size="sm"
                            className={badgeConfig.className}
                          />
                        </div>

                        {/* Stats row */}
                        <div className="flex items-center gap-4 mt-2 text-sm text-sage-light">
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>
                            {vehicle.views} views
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            {offerCount} offers
                          </span>
                          <span className="text-white font-medium">
                            ${vehicle.price.toLocaleString()}
                          </span>
                        </div>

                        {/* Step Indicator */}
                        <div className="mt-3">
                          <StepIndicator
                            steps={VEHICLE_LIFECYCLE_STEPS}
                            currentStep={vehicle.status}
                            orientation="horizontal"
                          />
                        </div>
                      </div>
                    </div>
                  </GlassPanel>
                );
              })
            )}
          </div>
        )}
      </div>
    </GradientBackground>
  );
}
