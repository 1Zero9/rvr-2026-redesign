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
    </div>
  );
}
