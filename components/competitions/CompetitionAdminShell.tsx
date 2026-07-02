import Link from 'next/link';
import type { ReactNode } from 'react';

interface NavItem {
  href: string;
  label: string;
}

export function CompetitionAdminShell({
  children,
  nav,
  title,
}: {
  children: ReactNode;
  nav?: NavItem[];
  title?: string;
}) {
  return (
    <div className="flex flex-col min-h-full">
      {/* Horizontal sub-nav — shown only when nav items are provided */}
      {nav && nav.length > 0 && (
        <div className="bg-white border-b border-brand-navy/10 sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <nav
              className="flex overflow-x-auto gap-0"
              aria-label="Section navigation"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="shrink-0 flex items-center px-4 min-h-[44px] font-display font-black text-xs uppercase tracking-wide whitespace-nowrap text-brand-navy/50 hover:text-brand-navy border-b-2 border-transparent hover:border-brand-navy transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        {title && (
          <h1 className="font-display font-black italic text-3xl uppercase text-brand-navy mb-6">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
