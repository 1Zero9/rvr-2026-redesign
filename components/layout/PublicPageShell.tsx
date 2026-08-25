import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/layout/Footer';
import CampaignBanner from '@/components/CampaignBanner';

interface PublicPageShellProps {
  children: ReactNode;
  className?: string;
}

export default function PublicPageShell({
  children,
  className = '',
}: PublicPageShellProps) {
  return (
    <div className={`site-canvas flex min-h-screen flex-col ${className}`}>
      {/* Skip-to-content link for this route tree is already provided once,
          globally, by app/layout.tsx — don't duplicate it here. */}
      <Header />
      <CampaignBanner />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
