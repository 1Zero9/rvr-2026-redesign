import Link from "next/link";
import type { ReactNode } from "react";

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
  const defaultNav: NavItem[] = [
    { href: "/competitions/admin", label: "Dashboard" },
    { href: "/competitions/admin/new", label: "New Competition" },
  ];
  const items = nav ?? defaultNav;

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col">
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar — desktop */}
        <aside className="hidden md:flex flex-col w-52 shrink-0 border-r-3 border-brand-navy/20 pt-6 px-4 gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-[44px] px-3 flex items-center font-bold text-sm text-brand-charcoal hover:text-brand-navy hover:bg-brand-navy/5 rounded transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 py-6 px-4 md:px-8">
          {title && (
            <h1 className="font-display font-black italic text-3xl uppercase text-brand-navy mb-6">
              {title}
            </h1>
          )}
          {children}
        </main>
      </div>

      {/* Bottom nav — mobile */}
      <nav className="md:hidden sticky bottom-0 bg-brand-navy border-t-3 border-brand-charcoal flex">
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 min-h-[52px] flex items-center justify-center text-brand-sky text-xs font-bold uppercase hover:text-brand-neon transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
