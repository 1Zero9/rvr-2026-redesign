import Link from 'next/link';
import { GlobalRole } from '@prisma/client';
import { signOutAction } from '@/lib/actions/sign-out';
import { ExternalLink } from 'lucide-react';
import {
  SITE_NAV,
  SUPER_NAV,
  ROLE_LABELS,
  ROLE_STYLES,
  type AdminBadges,
} from '@/components/admin/nav-config';

export default function AdminSidebar({
  badges,
  role,
  displayName,
  email,
}: {
  badges: AdminBadges;
  role: string | null;
  displayName: string;
  email: string;
}) {
  const isSuperAdmin = role === GlobalRole.SUPER_ADMIN;

  return (
    <aside className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 bg-brand-navy border-r border-brand-sky/10 overflow-hidden">
      {/* Logo */}
      <div className="flex items-center h-14 px-4 border-b border-brand-sky/10 shrink-0">
        <Link
          href="/admin"
          className="font-display font-black italic text-sm uppercase tracking-wide text-brand-neon hover:text-white transition-colors"
        >
          RVR Admin
        </Link>
      </div>

      {/* Nav */}
      <nav
        className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5"
        aria-label="Admin navigation"
      >
        <p className="px-2 pb-1 font-display font-black text-[9px] uppercase tracking-widest text-brand-sky/35">
          Content
        </p>

        {SITE_NAV.map((item) => {
          const count = item.badge ? badges[item.badge] : 0;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 min-h-[40px] rounded-lg text-brand-sky/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-semibold"
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 truncate">{item.label}</span>
              {count > 0 && (
                <span className="bg-brand-neon text-brand-charcoal font-black text-[9px] px-1.5 min-w-[18px] text-center leading-[18px] rounded-sm shrink-0">
                  {count}
                </span>
              )}
            </Link>
          );
        })}

        {isSuperAdmin && (
          <>
            <div className="pt-5 pb-1">
              <p className="px-2 font-display font-black text-[9px] uppercase tracking-widest text-brand-sky/35">
                Platform
              </p>
            </div>
            {SUPER_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 min-h-[40px] rounded-lg text-brand-sky/50 hover:text-white hover:bg-white/10 transition-colors text-sm font-semibold"
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-brand-sky/10 px-3 py-4 space-y-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 min-h-[40px] w-full border-2 border-brand-neon bg-brand-neon/10 px-3 text-xs font-display font-black uppercase tracking-wide text-brand-neon hover:bg-brand-neon hover:text-brand-charcoal transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          View Live Site
        </Link>

        {displayName && (
          <div className="space-y-1.5">
            {role && (
              <span
                className={`inline-block text-[9px] font-black uppercase px-1.5 py-0.5 leading-tight rounded-sm ${
                  ROLE_STYLES[role] ?? 'bg-white/10 text-white/60'
                }`}
              >
                {ROLE_LABELS[role] ?? role}
              </span>
            )}
            <p className="text-xs text-brand-sky/50 truncate" title={email}>
              {displayName}
            </p>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-xs font-bold text-brand-sky/40 hover:text-red-400 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        )}
      </div>
    </aside>
  );
}
