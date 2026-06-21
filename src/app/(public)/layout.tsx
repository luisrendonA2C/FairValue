import Navigation from '@/components/shared/Navigation';
import Footer from '@/components/shared/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation role="public" />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
