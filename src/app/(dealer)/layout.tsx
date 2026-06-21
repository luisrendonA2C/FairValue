'use client';

import Navigation from '@/components/shared/Navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DealerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const userName = user?.name ?? 'Dealer';

  return (
    <>
      <Navigation role="dealer" userName={userName} />
      <main className="pt-16 flex-1 bg-navy-dark">{children}</main>
    </>
  );
}
