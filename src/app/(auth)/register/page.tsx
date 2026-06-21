'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { StepIndicator } from '@/components/shared/StepIndicator';
import { getBackgroundImage } from '@/lib/imageProvider';

const REGISTER_STEPS = [
  { id: 'info', label: 'Info' },
  { id: 'verify', label: 'Verify' },
  { id: 'done', label: 'Done' },
];

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  terms?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const heroImage = getBackgroundImage('register');

  function validate(): boolean {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    register({ name, email, phone, password });
    router.push('/buyer/dashboard');
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side — Hero background with overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        {/* Navy gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-navy-dark/80 to-navy/95" />

        {/* Logo & branding content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <div className="text-center">
            {/* Logo */}
            <div className="mb-6">
              <img
                src="/images/Logo_log_in.png"
                alt="Fair Value"
                className="w-24 h-24 mx-auto object-contain drop-shadow-[0_0_20px_rgba(236,167,44,0.5)]"
              />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Fair Value</h1>
            <p className="text-sage text-lg">Premium Vehicle Platform</p>
            <p className="text-white/50 text-sm mt-2">Operando desde Costa Rica</p>
          </div>
        </div>
      </div>

      {/* Right side — Register form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-navy-dark p-6 sm:p-10">
        <div className="w-full max-w-lg space-y-6">
          {/* Mobile logo (shown on small screens) */}
          <div className="lg:hidden text-center mb-6">
            <img
              src="/images/Logo_log_in.png"
              alt="Fair Value"
              className="w-16 h-16 mx-auto object-contain drop-shadow-[0_0_20px_rgba(236,167,44,0.5)] mb-3"
            />
            <h1 className="text-2xl font-bold text-white">Fair Value</h1>
          </div>

          {/* Step Indicator */}
          <StepIndicator
            steps={REGISTER_STEPS}
            currentStep="info"
            className="justify-center mb-2"
          />

          {/* Glass register form */}
          <GlassPanel variant="light" padding="lg" className="w-full">
            <h2 className="text-2xl font-semibold text-white mb-1">Create your account</h2>
            <p className="text-sage text-sm mb-6">Join the premium vehicle marketplace</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                type="text"
                label="Full Name"
                name="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                maxLength={100}
                required
                error={errors.name}
              />

              <Input
                type="email"
                label="Email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                maxLength={254}
                required
                error={errors.email}
              />

              <Input
                type="tel"
                label="Phone"
                name="phone"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                maxLength={20}
                required
                error={errors.phone}
              />

              <Input
                type="password"
                label="Password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                maxLength={128}
                required
                error={errors.password}
              />

              {/* Terms acceptance checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                    }}
                    className="mt-0.5 w-4 h-4 rounded border-sage/50 bg-white/5 text-amber focus:ring-amber/50 focus:ring-2 accent-amber"
                  />
                  <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                    I accept the{' '}
                    <span className="text-amber underline underline-offset-2">
                      Terms and Conditions
                    </span>{' '}
                    and{' '}
                    <span className="text-amber underline underline-offset-2">
                      Privacy Policy
                    </span>
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-xs text-red-500" role="alert">
                    {errors.terms}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
              >
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 border-t border-white/10" />
              <span className="px-3 text-xs text-sage">or</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Google sign up mock */}
            <Button
              variant="glass"
              size="md"
              className="w-full"
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              }
            >
              Sign up with Google
            </Button>
          </GlassPanel>

          {/* Link to login */}
          <p className="text-center text-sm text-sage">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-amber hover:text-amber-dark underline underline-offset-2 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
