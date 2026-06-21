'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

export type NavigationRole = 'public' | 'buyer' | 'dealer' | 'admin';

export interface NavigationProps {
  role: NavigationRole;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  userName?: string;
}

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const publicLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Inventory', href: '/inventory' },
  { label: 'Events', href: '/events' },
  { label: 'Locations', href: '/locations' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Help', href: '/help-center' },
];

const buyerLinks: NavLink[] = [
  { label: 'Dashboard', href: '/buyer/dashboard' },
  { label: 'Watchlist', href: '/buyer/watchlist' },
  { label: 'Offers', href: '/buyer/offers' },
  { label: 'Chat', href: '/buyer/chat' },
];

const dealerLinks: NavLink[] = [
  { label: 'Dashboard', href: '/dealer/dashboard' },
  { label: 'Vehicles', href: '/dealer/vehicles' },
  { label: 'Documents', href: '/dealer/documents' },
  { label: 'Leads', href: '/dealer/leads' },
  { label: 'Chat', href: '/dealer/chat' },
];

const adminLinks: NavLink[] = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Users', href: '/admin/users', icon: <UsersIcon /> },
  { label: 'Dealers', href: '/admin/dealers', icon: <DealersIcon /> },
  { label: 'Vehicles', href: '/admin/vehicles', icon: <VehiclesIcon /> },
  { label: 'Events', href: '/admin/events', icon: <EventsIcon /> },
  { label: 'Offers', href: '/admin/offers', icon: <OffersIcon /> },
  { label: 'Leads', href: '/admin/leads', icon: <LeadsIcon /> },
  { label: 'Content', href: '/admin/content', icon: <ContentIcon /> },
  { label: 'Settings', href: '/admin/settings', icon: <SettingsIcon /> },
];

/* ============================================
   Icons (inline SVG for zero-dependency)
   ============================================ */

function DashboardIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}

function DealersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  );
}

function VehiclesIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25M3.375 14.25a1.125 1.125 0 01-1.125-1.125V6.375a1.125 1.125 0 011.125-1.125h16.5a1.125 1.125 0 011.125 1.125v6.75a1.125 1.125 0 01-1.125 1.125" />
    </svg>
  );
}

function EventsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
    </svg>
  );
}

function OffersIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
  );
}

function LeadsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

/* ============================================
   Logo Component
   ============================================ */

function Logo() {
  return (
    <Link href="/" className="block shrink-0" style={{ height: '28px', width: '120px' }}>
      <img
        src="/images/logo-fair-value.png"
        alt="Fair Value"
        style={{ height: '28px', width: '120px', objectFit: 'contain' }}
      />
    </Link>
  );
}

/* ============================================
   Avatar Component (inline for Navigation)
   ============================================ */

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-8 h-8 rounded-full bg-amber/20 border border-amber/40 flex items-center justify-center">
      <span className="text-xs font-semibold text-amber">{initials}</span>
    </div>
  );
}

/* ============================================
   Mobile Overlay Menu
   ============================================ */

function MobileMenu({
  links,
  activePath,
  onClose,
  userName,
  role,
  onNavigate,
  onSignOut,
}: {
  links: NavLink[];
  activePath: string;
  onClose: () => void;
  userName?: string;
  role: NavigationRole;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 glass-dark flex flex-col animate-fade-in">
      <div className="flex items-center justify-between p-4">
        <Logo />
        <button
          onClick={onClose}
          className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex-1 flex flex-col items-center justify-center gap-2 px-6 stagger-children">
        {links.map((link) => {
          const isActive = activePath === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate(link.href);
                }
                onClose();
              }}
              className={`
                w-full text-center py-3 px-6 rounded-xl text-lg font-medium
                transition-all duration-200
                ${isActive
                  ? 'text-amber bg-amber/10 border border-amber/30'
                  : 'text-white hover:text-amber hover:bg-white/5'
                }
              `}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        {role === 'public' ? (
          <Link
            href="/login"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault();
                onNavigate('/login');
              }
              onClose();
            }}
            className="block w-full text-center py-3 px-6 bg-amber text-white font-semibold rounded-xl hover:bg-amber-dark transition-colors"
          >
            Sign In
          </Link>
        ) : (
          <div className="flex items-center justify-between">
            {userName && (
              <div className="flex items-center gap-3">
                <UserAvatar name={userName} />
                <span className="text-white text-sm font-medium">{userName}</span>
              </div>
            )}
            <button
              onClick={() => {
                if (onSignOut) onSignOut();
                onClose();
              }}
              className="flex items-center gap-2 text-sage-light hover:text-white transition-colors text-sm"
            >
              <SignOutIcon />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   Public Navigation (Top bar with glassmorphism on scroll)
   ============================================ */

function PublicNavigation({
  activePath,
  mobileMenuOpen,
  setMobileMenuOpen,
  onNavigate,
}: {
  activePath: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onNavigate?: (path: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-300
          ${scrolled ? 'bg-navy-dark shadow-lg border-b border-white/10' : 'bg-navy-dark/80 backdrop-blur-sm'}
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-1">
              {publicLinks.map((link) => {
                const isActive = activePath === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(link.href); } : undefined}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'text-amber'
                        : 'text-white/80 hover:text-white relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-amber after:transition-all after:duration-200 hover:after:w-3/4 after:rounded-full'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* CTA + Mobile Hamburger */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate('/login'); } : undefined}
                className="hidden md:inline-flex px-5 py-2 bg-amber text-white text-sm font-semibold rounded-lg hover:bg-amber-dark hover:shadow-glow transition-all duration-200"
              >
                Sign In
              </Link>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <HamburgerIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <MobileMenu
          links={publicLinks}
          activePath={activePath}
          onClose={() => setMobileMenuOpen(false)}
          role="public"
          onNavigate={onNavigate}
        />
      )}
    </>
  );
}

/* ============================================
   Authenticated Top Navigation (Buyer / Dealer)
   ============================================ */

function AuthenticatedNavigation({
  links,
  activePath,
  userName,
  mobileMenuOpen,
  setMobileMenuOpen,
  role,
  onNavigate,
  onSignOut,
}: {
  links: NavLink[];
  activePath: string;
  userName?: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  role: NavigationRole;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
}) {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />

            {/* Desktop links */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive = activePath === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(link.href); } : undefined}
                    className={`
                      px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'text-amber border-b-2 border-amber'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* User area + Mobile Hamburger */}
            <div className="flex items-center gap-4">
              {/* Desktop user info */}
              <div className="hidden md:flex items-center gap-3">
                {userName && (
                  <>
                    <UserAvatar name={userName} />
                    <span className="text-white text-sm font-medium">{userName}</span>
                  </>
                )}
                <button
                  onClick={() => onSignOut?.()}
                  className="flex items-center gap-1.5 text-sage-light hover:text-white transition-colors text-sm ml-2"
                >
                  <SignOutIcon />
                  <span>Sign Out</span>
                </button>
              </div>

              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <HamburgerIcon />
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <MobileMenu
          links={links}
          activePath={activePath}
          onClose={() => setMobileMenuOpen(false)}
          userName={userName}
          role={role}
          onNavigate={onNavigate}
          onSignOut={onSignOut}
        />
      )}
    </>
  );
}

/* ============================================
   Admin Sidebar Navigation
   ============================================ */

function AdminNavigation({
  activePath,
  userName,
  mobileMenuOpen,
  setMobileMenuOpen,
  onNavigate,
  onSignOut,
}: {
  activePath: string;
  userName?: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onNavigate?: (path: string) => void;
  onSignOut?: () => void;
}) {
  return (
    <>
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-navy-dark z-40">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Logo />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {adminLinks.map((link) => {
            const isActive = activePath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(link.href); } : undefined}
                className={`
                  relative flex items-center gap-3 px-4 py-2.5 mb-1 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'text-amber bg-amber/10'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-amber rounded-r-full" />
                )}
                {link.icon}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom user section */}
        <div className="p-4 border-t border-white/10">
          {userName && (
            <div className="flex items-center gap-3 mb-3">
              <UserAvatar name={userName} />
              <span className="text-white text-sm font-medium truncate">{userName}</span>
            </div>
          )}
          <button
            onClick={() => onSignOut?.()}
            className="flex items-center gap-2 text-sage-light hover:text-white transition-colors text-sm w-full px-2 py-1.5 rounded-lg hover:bg-white/5"
          >
            <SignOutIcon />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Top bar - Desktop (admin name + sign out for top area) */}
      <header className="hidden md:flex fixed top-0 left-64 right-0 h-16 items-center justify-end px-6 bg-navy-dark border-b border-white/5 z-30">
        {userName && (
          <div className="flex items-center gap-3">
            <span className="text-white/70 text-sm">{userName}</span>
            <button
              onClick={() => onSignOut?.()}
              className="text-sage-light hover:text-white transition-colors"
              aria-label="Sign out"
            >
              <SignOutIcon />
            </button>
          </div>
        )}
      </header>

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 glass-dark">
        <div className="flex items-center justify-between h-16 px-4">
          <Logo />
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <HamburgerIcon />
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <MobileMenu
          links={adminLinks}
          activePath={activePath}
          onClose={() => setMobileMenuOpen(false)}
          userName={userName}
          role="admin"
          onNavigate={onNavigate}
          onSignOut={onSignOut}
        />
      )}
    </>
  );
}

/* ============================================
   Main Navigation Component
   ============================================ */

export const Navigation: React.FC<NavigationProps> = ({
  role,
  currentPath,
  onNavigate,
  userName,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const { showToast } = useToast();
  const activePath = currentPath ?? pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    showToast('Signed out successfully');
    router.push('/');
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePath]);

  switch (role) {
    case 'public':
      return (
        <PublicNavigation
          activePath={activePath}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onNavigate={onNavigate}
        />
      );
    case 'buyer':
      return (
        <AuthenticatedNavigation
          links={buyerLinks}
          activePath={activePath}
          userName={userName}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          role="buyer"
          onNavigate={onNavigate}
          onSignOut={handleSignOut}
        />
      );
    case 'dealer':
      return (
        <AuthenticatedNavigation
          links={dealerLinks}
          activePath={activePath}
          userName={userName}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          role="dealer"
          onNavigate={onNavigate}
          onSignOut={handleSignOut}
        />
      );
    case 'admin':
      return (
        <AdminNavigation
          activePath={activePath}
          userName={userName}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          onNavigate={onNavigate}
          onSignOut={handleSignOut}
        />
      );
    default:
      return null;
  }
};

Navigation.displayName = 'Navigation';

export default Navigation;
