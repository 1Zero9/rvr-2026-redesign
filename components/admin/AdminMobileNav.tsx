'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Menu, X } from 'lucide-react';
import { signOutAction } from '@/lib/actions/sign-out';
import {
  SITE_NAV,
  SUPER_NAV,
  ROLE_LABELS,
  ROLE_STYLES,
  type AdminBadges,
} from '@/components/admin/nav-config';

export default function AdminMobileNav({
  badges,
  role,
  displayName,
  isSuperAdmin,
}: {
  badges: AdminBadges;
  role: string | null;
  displayName: string;
  isSuperAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const totalBadges = badges.ann + badges.reg + badges.enq;
  const navSections = [
    { heading: 'Content', items: SITE_NAV },
    ...(isSuperAdmin ? [{ heading: 'Platform', items: SUPER_NAV }] : []),
  ];

  return (
    <>
      {/* Top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-brand-navy border-b border-brand-sky/10 flex items-center px-3 gap-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative flex h-11 w-11 items-center justify-center rounded-lg text-brand-sky hover:bg-white/10 transition-colors"
          aria-label="Open admin menu"
          aria-expanded={open}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
          {totalBadges > 0 && (
            <span className="absolute top-1 right-1 bg-brand-neon text-brand-charcoal font-black text-[9px] px-1 min-w-[16px] text-center leading-[16px] rounded-full">
              {totalBadges}
            </span>
          )}
        </button>
        <Link
          href="/admin"
          className="font-display font-black italic text-sm uppercase text-brand-neon"
        >
          RVR Admin
        </Link>
        <Link
          href="/"
          className="ml-auto min-h-[44px] flex items-center px-2 text-xs font-bold text-brand-sky/50 hover:text-brand-sky transition-colors"
        >
          ← Site
        </Link>
      </div>

      {/* Drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-brand-navy/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="fixed top-0 left-0 bottom-0 w-72 max-w-[calc(100%-3rem)] bg-brand-navy border-r border-brand-sky/20 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between h-14 px-4 border-b border-brand-sky/10 shrink-0">
              <span className="font-display font-black italic text-sm uppercase text-brand-neon">
                RVR Admin
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-brand-sky hover:bg-white/10 transition-colors"
                aria-label="Close admin menu"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5" aria-label="Admin navigation">
              {navSections.map((section) => (
                <div key={section.heading}>
                  <p className="px-2 pt-2 pb-1 font-display font-black text-[9px] uppercase tracking-widest text-brand-sky/35">
                    {section.heading}
                  </p>
                  {section.items.map((item) => {
                    const count = item.badge ? badges[item.badge] : 0;
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 min-h-[48px] rounded-lg text-brand-sky/70 hover:text-white hover:bg-white/10 active:bg-white/10 transition-colors text-sm font-semibold"
                      >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span className="flex-1 truncate">{item.label}</span>
                        {count > 0 && (
                          <span className="bg-brand-neon text-brand-charcoal font-black text-[10px] px-1.5 min-w-[20px] text-center leading-[20px] rounded-sm shrink-0">
                            {count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="shrink-0 border-t border-brand-sky/10 px-3 py-4 space-y-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 min-h-[44px] w-full border-2 border-brand-neon bg-brand-neon/10 px-3 text-xs font-display font-black uppercase tracking-wide text-brand-neon hover:bg-brand-neon hover:text-brand-charcoal transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                View Live Site
              </Link>

              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  {role && (
                    <span
                      className={`inline-block text-[9px] font-black uppercase px-1.5 py-0.5 leading-tight rounded-sm ${
                        ROLE_STYLES[role] ?? 'bg-white/10 text-white/60'
                      }`}
                    >
                      {ROLE_LABELS[role] ?? role}
                    </span>
                  )}
                  <p className="text-xs text-brand-sky/50 truncate">{displayName}</p>
                </div>
                <form action={signOutAction} className="shrink-0">
                  <button
                    type="submit"
                    className="min-h-[44px] px-3 text-xs font-bold text-brand-sky/40 hover:text-red-400 transition-colors"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
