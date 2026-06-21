'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getRedirectPath } from '@/hooks/useAuth';
import type { UserRole } from '@/types';

interface RouteGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

/**
 * RouteGuard — protects routes by checking mock authentication state.
 * 
 * - If user is not authenticated → redirects to /login
 * - If user is authenticated but has the wrong role → redirects to their correct dashboard
 * - If user has an allowed role → renders children
 */
export function RouteGuard({ allowedRoles, children }: RouteGuardProps) {
  const { isAuthenticated, role } = useAuth();
  const router = useRouter();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00335E] to-[#1a1a2e]">
        <div className="text-center p-8 rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-xl max-w-md w-full mx-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#ECA72C]/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#ECA72C]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Acceso Restringido
          </h2>
          <p className="text-white/70 mb-6">
            Necesitas iniciar sesión para acceder a esta sección.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full px-6 py-3 bg-[#ECA72C] text-white font-medium rounded-xl hover:bg-[#d4952a] transition-colors duration-200"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    // User is authenticated but doesn't have the right role — redirect to their dashboard
    router.push(getRedirectPath(role));
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00335E] to-[#1a1a2e]">
        <div className="text-center p-8">
          <div className="w-10 h-10 mx-auto border-4 border-[#ECA72C] border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-white/70 text-sm">Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
