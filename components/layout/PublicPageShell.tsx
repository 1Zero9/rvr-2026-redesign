import type { ReactNode } from 'react';
import Header from '@/components/Header';

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
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="bg-brand-navy border-t border-brand-sky/15">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Rivervalley Rangers AFC. All rights reserved.</p>
          <a
            href="https://www.1zero9.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-brand-neon hover:text-white transition-colors"
            aria-label="Built by 1Zero9Studio"
          >
            <img
              src="/marketing/109-logo-circle-white2.png"
              alt="1Zero9Studio"
              width={16}
              height={16}
              className="h-7 w-7 opacity-90 transition-opacity"
            />
            <span className="font-bold animate-pulse">Built by 1Zero9Studio</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
