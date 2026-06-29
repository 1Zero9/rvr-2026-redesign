import Link from 'next/link';
import { prisma } from '@/lib/prisma';

const SITE_LINKS = [
  { href: '/admin/announcements', label: 'Announcements' },
  { href: '/admin/registrations', label: 'Registrations', badge: 'reg' as const },
  { href: '/admin/enquiries',     label: 'Enquiries',     badge: 'enq' as const },
  { href: '/admin/moderation',    label: 'Moderation'    },
  { href: '/admin/boot-room',     label: 'Boot Room'     },
];

const SUPER_LINKS = [
  { href: '/competitions/admin',       label: 'Competitions' },
  { href: '/competitions/admin/users', label: 'Users'        },
  { href: '/admin/features',           label: 'Features'     },
  { href: '/admin/docs',               label: 'Docs'         },
];

const BASE  = 'inline-flex min-h-10 items-center gap-1.5 border-2 px-3 font-display text-[11px] font-black uppercase tracking-wide transition';
const NAVY  = `${BASE} border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white`;
const SUPER_STYLE = `${BASE} border-brand-navy/40 text-brand-navy/60 hover:border-brand-navy hover:text-brand-navy hover:bg-brand-navy hover:text-white`;

export default async function AdminNav() {
  const [newRegCount, newEnqCount] = await Promise.all([
    prisma.playerProfile.count({ where: { registrationStatus: 'NEW' } }),
    prisma.publicEnquiry.count({ where: { status: 'NEW' } }),
  ]);

  const badges = { reg: newRegCount, enq: newEnqCount };

  return (
    <nav aria-label="Admin navigation" className="mb-8 space-y-2">
      {/* Site Admin row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pr-1 select-none">
          Site
        </span>
        <Link href="/admin" className={`${NAVY} border-brand-navy/30 text-brand-navy/50 hover:border-brand-navy hover:text-white hover:bg-brand-navy`}>
          ← Dashboard
        </Link>
        {SITE_LINKS.map((link) => {
          const count = link.badge ? badges[link.badge] : 0;
          return (
            <Link key={link.href} href={link.href} className={NAVY}>
              {link.label}
              {count > 0 && (
                <span className="bg-brand-neon text-brand-charcoal font-black text-[9px] px-1 py-0.5 min-w-[16px] text-center leading-none">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Super Admin row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 pr-1 select-none">
          Super
        </span>
        {SUPER_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={SUPER_STYLE}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
