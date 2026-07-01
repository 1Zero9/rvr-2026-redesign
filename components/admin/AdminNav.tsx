import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth, signOut } from '@/auth';
import { GlobalRole } from '@prisma/client';

const SITE_LINKS = [
  { href: '/admin/announcements', label: 'Announcements', badge: 'ann' as const },
  { href: '/admin/registrations', label: 'Registrations',  badge: 'reg' as const },
  { href: '/admin/enquiries',     label: 'Enquiries',       badge: 'enq' as const },
  { href: '/admin/moderation',    label: 'Moderation'       },
  { href: '/admin/boot-room',     label: 'Boot Room'        },
];

const SUPER_LINKS = [
  { href: '/competitions/admin',       label: 'Competitions' },
  { href: '/competitions/admin/users', label: 'Users'        },
  { href: '/admin/features',           label: 'Features'     },
  { href: '/admin/docs',               label: 'Docs'         },
];

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SITE_ADMIN:  'Site Admin',
};

const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-brand-neon text-brand-charcoal',
  SITE_ADMIN:  'bg-brand-sky/20 text-brand-sky',
};

export default async function AdminNav() {
  const [session, annCount, regCount, enqCount] = await Promise.all([
    auth(),
    prisma.announcement.count({ where: { isPublished: false } }),
    prisma.playerProfile.count({ where: { registrationStatus: 'NEW' } }),
    prisma.publicEnquiry.count({ where: { status: 'NEW' } }),
  ]);

  const badges = { ann: annCount, reg: regCount, enq: enqCount };

  const user = session?.user as { name?: string | null; email?: string | null; globalRole?: string | null } | undefined;
  const role = user?.globalRole ?? null;
  const isSuperAdmin = role === GlobalRole.SUPER_ADMIN;
  const displayName = user?.name ?? user?.email ?? '';

  return (
    <header className="w-full bg-brand-navy text-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center gap-4">

        {/* Brand */}
        <Link
          href="/admin"
          className="font-display font-black italic text-sm uppercase tracking-wide text-brand-neon shrink-0 hover:text-white transition-colors"
        >
          RVR Admin
        </Link>

        <span className="h-4 w-px bg-white/20 shrink-0" />

        {/* Site links */}
        <nav className="flex items-center gap-0.5 overflow-x-auto" aria-label="Site admin">
          {SITE_LINKS.map((link) => {
            const count = link.badge ? badges[link.badge] : 0;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative flex items-center gap-1.5 px-3 h-8 text-xs font-bold uppercase tracking-wide text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap"
              >
                {link.label}
                {count > 0 && (
                  <span className="bg-brand-neon text-brand-charcoal font-black text-[9px] px-1 min-w-[16px] text-center leading-4 rounded-sm">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {isSuperAdmin && (
          <>
            <span className="h-4 w-px bg-white/20 shrink-0" />
            {/* Super links — only SUPER_ADMIN sees these */}
            <nav className="flex items-center gap-0.5 overflow-x-auto" aria-label="Super admin">
              {SUPER_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 h-8 flex items-center text-xs font-bold uppercase tracking-wide text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </>
        )}

        {/* Right side — user info + sign out */}
        <div className="ml-auto flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="text-xs font-bold text-white/30 hover:text-white/60 transition-colors whitespace-nowrap hidden sm:block"
          >
            ← Site
          </Link>

          {user && (
            <div className="flex items-center gap-2">
              {role && (
                <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 leading-tight rounded-sm ${ROLE_STYLES[role] ?? 'bg-white/10 text-white/60'}`}>
                  {ROLE_LABELS[role] ?? role}
                </span>
              )}
              <span className="text-xs text-white/60 max-w-[120px] truncate hidden md:block" title={user.email ?? ''}>
                {displayName}
              </span>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/admin/login' });
                }}
              >
                <button
                  type="submit"
                  className="text-xs font-bold text-white/40 hover:text-brand-maroon transition-colors whitespace-nowrap"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
