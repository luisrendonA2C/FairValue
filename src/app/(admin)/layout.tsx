'use client';

import Navigation from '@/components/shared/Navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userName = user?.name ?? 'Admin';

  return (
    <>
      <Navigation role="admin" userName={userName} />
      <main className="admin-content flex-1 bg-navy-dark">{children}</main>
    </>
  );
}

