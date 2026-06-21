'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getRedirectPath } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { getBackgroundImage } from '@/lib/imageProvider';
import type { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const heroImage = getBackgroundImage('login');

  function validate(): boolean {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    login(email, password);
    // Default redirect to buyer dashboard after login
    router.push(getRedirectPath('buyer'));
  }

  function handleRoleSwitch(role: UserRole) {
    switchRole(role);
    router.push(getRedirectPath(role));
  }

  return (
    <div className="min-h-screen flex animate-fadeIn">
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

      {/* Right side — Login form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-navy-dark via-navy to-navy-dark p-6 sm:p-10">
        <div className="w-full max-w-lg space-y-8">
          {/* Mobile logo (shown on small screens) */}
          <div className="lg:hidden text-center mb-8">
            <img
              src="/images/Logo_log_in.png"
              alt="Fair Value"
              className="w-16 h-16 mx-auto object-contain drop-shadow-[0_0_20px_rgba(236,167,44,0.5)] mb-3"
            />
            <h1 className="text-2xl font-bold text-white">Fair Value</h1>
          </div>

          {/* Glass login form */}
          <GlassPanel variant="light" padding="lg" className="w-full animate-slideUp">
            <h2 className="text-2xl font-semibold text-white mb-1">Welcome back</h2>
            <p className="text-sage text-sm mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full mt-2"
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 border-t border-white/10" />
              <span className="px-3 text-xs text-sage">or</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Google sign in mock */}
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
              Sign in with Google
            </Button>
          </GlassPanel>

          {/* Role shortcut demo cards */}
          <div className="space-y-3">
            <p className="text-center text-xs text-sage/70 uppercase tracking-wider font-medium">
              Quick Demo Access
            </p>
            <div className="grid grid-cols-3 gap-3 stagger-children">
              {/* Buyer Demo */}
              <button
                onClick={() => handleRoleSwitch('buyer')}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-amber/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-amber/10 group-hover:bg-amber/20 flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-amber"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/80 font-medium group-hover:text-white transition-colors">
                  Buyer Demo
                </span>
              </button>

              {/* Dealer Demo */}
              <button
                onClick={() => handleRoleSwitch('dealer')}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-amber/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-amber/10 group-hover:bg-amber/20 flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-amber"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/80 font-medium group-hover:text-white transition-colors">
                  Dealer Demo
                </span>
              </button>

              {/* Admin Demo */}
              <button
                onClick={() => handleRoleSwitch('admin')}
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-amber/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-amber/10 group-hover:bg-amber/20 flex items-center justify-center transition-colors">
                  <svg
                    className="w-5 h-5 text-amber"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-xs text-white/80 font-medium group-hover:text-white transition-colors">
                  Admin Demo
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
