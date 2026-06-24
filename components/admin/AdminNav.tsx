import Link from 'next/link';
import { prisma } from '@/lib/prisma';

const LINKS = [
  { href: '/admin/announcements',  label: 'Announcements'  },
  { href: '/admin/registrations',  label: 'Registrations', badge: true },
  { href: '/admin/enquiries',      label: 'Enquiries'      },
  { href: '/admin/features',       label: 'Features'       },
  { href: '/admin/moderation',     label: 'Moderation'     },
  { href: '/admin/boot-room',      label: 'Boot Room'      },
  { href: '/admin/docs',           label: 'Docs'           },
];

export default async function AdminNav() {
  const newRegCount = await prisma.playerProfile.count({
    where: { registrationStatus: 'NEW' },
  });

  return (
    <nav
      aria-label="Admin navigation"
      className="mb-8 flex flex-wrap gap-2 border-b-2 border-brand-navy/10 pb-4"
    >
      {LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex min-h-11 items-center gap-2 border-2 border-brand-navy px-4 font-display text-xs font-black uppercase text-brand-navy transition hover:bg-brand-navy hover:text-white"
        >
          {link.label}
          {link.badge && newRegCount > 0 && (
            <span className="bg-brand-neon text-brand-charcoal font-black text-[10px] px-1.5 py-0.5 min-w-[18px] text-center">
              {newRegCount}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
