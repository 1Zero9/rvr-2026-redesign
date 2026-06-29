import Link from 'next/link';
import { prisma } from '@/lib/prisma';

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

export default async function AdminNav() {
  const [annCount, regCount, enqCount] = await Promise.all([
    prisma.announcement.count({ where: { isPublished: false } }),
    prisma.playerProfile.count({ where: { registrationStatus: 'NEW' } }),
    prisma.publicEnquiry.count({ where: { status: 'NEW' } }),
  ]);

  const badges = { ann: annCount, reg: regCount, enq: enqCount };

  return (
    <header className="w-full bg-brand-navy text-white">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center gap-6">

        {/* Brand */}
        <Link
          href="/admin"
          className="font-display font-black italic text-sm uppercase tracking-wide text-brand-neon shrink-0 hover:text-white transition-colors"
        >
          RVR Admin
        </Link>

        <span className="h-4 w-px bg-white/20 shrink-0" />

        {/* Site links */}
        <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Site admin">
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

        <span className="h-4 w-px bg-white/20 shrink-0" />

        {/* Super links */}
        <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Super admin">
          {SUPER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 h-8 flex items-center text-xs font-bold uppercase tracking-wide text-white/40 hover:text-white/70 hover:bg-white/10 rounded transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Back to site — pushed to the right */}
        <Link
          href="/"
          className="ml-auto shrink-0 text-xs font-bold text-white/40 hover:text-white transition-colors whitespace-nowrap"
        >
          ← rivervalleyrangers.ie
        </Link>

      </div>
    </header>
  );
}
