'use client';

import Navigation from '@/components/shared/Navigation';
import { useAuth } from '@/hooks/useAuth';

export default function BuyerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userName = user?.name ?? 'Buyer';

  return (
    <>
      <Navigation role="buyer" userName={userName} />
      <main className="pt-16 flex-1 bg-navy-dark">{children}</main>
    </>
  );
}
