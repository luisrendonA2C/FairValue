'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/types';
import { users } from '@/data/users';

// ─── Types ──────────────────────────────────────────────────────────────────

interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  register: (data: RegisterData) => void;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'fair_value_session';

interface StoredSession {
  userId: string;
  role: UserRole;
}

function getStoredSession(): StoredSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (parsed.userId && parsed.role) return parsed;
    return null;
  } catch {
    return null;
  }
}

function storeSession(userId: string, role: UserRole): void {
  if (typeof window === 'undefined') return;
  const session: StoredSession = { userId, role };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Returns the redirect path for a given role.
 */
export function getRedirectPath(role: UserRole): string {
  switch (role) {
    case 'buyer':
      return '/buyer/dashboard';
    case 'dealer':
      return '/dealer/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/buyer/dashboard';
  }
}

// ─── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate session from localStorage on mount
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      const found = users.find((u) => u.id === session.userId);
      if (found) {
        setUser(found);
      }
    }
    setIsHydrated(true);
  }, []);

  const login = useCallback((email: string, _password: string) => {
    // Find user by email in mock data (password not validated — demo only)
    let found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    // If not found, simulate success using the first buyer user (for demo purposes)
    if (!found) {
      found = users.find((u) => u.role === 'buyer');
    }

    if (found) {
      setUser(found);
      storeSession(found.id, found.role);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearSession();
  }, []);

  const switchRole = useCallback((targetRole: UserRole) => {
    // Find a user in mock data with the target role
    const found = users.find((u) => u.role === targetRole && u.isActive);
    if (found) {
      setUser(found);
      storeSession(found.id, found.role);
    }
  }, []);

  const register = useCallback((data: RegisterData) => {
    // Create a new mock user object with provided data, role='buyer'
    const newUser: User = {
      id: `buyer-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: 'buyer',
      registrationDate: new Date().toISOString(),
      isActive: true,
      verificationStatus: 'not_started',
      emailVerified: false,
      phoneVerified: false,
      profileCompleteness: 20,
    };

    setUser(newUser);
    storeSession(newUser.id, newUser.role);
  }, []);

  const role: UserRole = user?.role ?? 'buyer';
  const isAuthenticated = user !== null;

  const value: AuthContextValue = {
    user,
    role,
    isAuthenticated,
    login,
    logout,
    switchRole,
    register,
  };

  // Avoid hydration mismatch — render children only after client-side mount
  if (!isHydrated) {
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { RegisterData, AuthContextValue };
