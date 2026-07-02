import type { ReactNode } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/layout/Footer';

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
      {/* Skip-to-content — visible on keyboard focus only */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:inline-flex focus:min-h-[44px] focus:items-center focus:px-4 focus:bg-brand-neon focus:text-brand-charcoal focus:font-display focus:font-black focus:uppercase focus:text-sm focus:border-3 focus:border-brand-charcoal focus:shadow-brutalist"
      >
        Skip to main content
      </a>

      <Header />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
