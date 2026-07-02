import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { GlobalRole } from '@prisma/client';
import { signOutAction } from '@/lib/actions/sign-out';
import {
  ArrowLeft,
  Bell,
  BookOpen,
  ClipboardList,
  Cog,
  MessageSquare,
  Shield,
  Shirt,
  Trophy,
  Users,
} from 'lucide-react';

const SITE_NAV = [
  { href: '/admin/announcements', label: 'Announcements', icon: Bell,           badge: 'ann' as const },
  { href: '/admin/registrations', label: 'Registrations', icon: ClipboardList,  badge: 'reg' as const },
  { href: '/admin/enquiries',     label: 'Enquiries',     icon: MessageSquare,  badge: 'enq' as const },
  { href: '/admin/moderation',    label: 'Moderation',    icon: Shield                                },
  { href: '/admin/boot-room',     label: 'Boot Room',     icon: Shirt                                 },
  { href: '/competitions/admin',  label: 'Competitions',  icon: Trophy                                },
];

const SUPER_NAV = [
  { href: '/competitions/admin/users', label: 'Users',    icon: Users    },
  { href: '/admin/features',           label: 'Features', icon: Cog      },
  { href: '/admin/docs',               label: 'Docs',     icon: BookOpen },
];

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  SITE_ADMIN:  'Site Admin',
};

const ROLE_STYLES: Record<string, string> = {
  SUPER_ADMIN: 'bg-brand-neon text-brand-charcoal',
  SITE_ADMIN:  'bg-brand-sky/20 text-brand-sky',
};

export default async function AdminSidebar() {
  const [session, annCount, regCount, enqCount] = await Promise.all([
    auth(),
    prisma.announcement.count({ where: { isPublished: false } }),
    prisma.playerProfile.count({ where: { registrationStatus: 'NEW' } }),
    prisma.publicEnquiry.count({ where: { status: 'NEW' } }),
  ]);

  const badges = { ann: annCount, reg: regCount, enq: enqCount };
  const user = session?.user as
    | { name?: string | null; email?: string | null; globalRole?: string | null }
    | undefined;
  const role = user?.globalRole ?? null;
  const isSuperAdmin = role === GlobalRole.SUPER_ADMIN;
  const displayName = user?.name ?? user?.email ?? '';

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
          className="flex items-center gap-2 text-xs text-brand-sky/40 hover:text-brand-sky/70 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Back to site
        </Link>

        {user && (
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
            <p className="text-xs text-brand-sky/50 truncate" title={user.email ?? ''}>
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
