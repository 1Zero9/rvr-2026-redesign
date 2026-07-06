import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { GlobalRole } from '@prisma/client';
import {
  SITE_NAV,
  SUPER_NAV,
  type AdminBadges,
  type AdminNavItem,
} from '@/components/admin/nav-config';

export const metadata: Metadata = {
  title: 'Admin Dashboard | RVR',
};

function SectionCard({ card, badges }: { card: AdminNavItem; badges: AdminBadges }) {
  const Icon = card.icon;
  const count = card.badge ? badges[card.badge] : 0;
  return (
    <Link
      href={card.href}
      className="group flex flex-col gap-3 rounded-xl border-2 border-brand-navy/15 bg-white p-5 transition hover:border-brand-navy hover:shadow-mid-brutalist"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-navy/20 bg-brand-cream group-hover:bg-brand-neon group-hover:border-brand-charcoal transition">
          <Icon className="h-4 w-4 text-brand-navy" aria-hidden="true" />
        </span>
        {count > 0 && (
          <span className="bg-brand-neon text-brand-charcoal font-black text-[10px] px-1.5 py-0.5 min-w-[20px] text-center border border-brand-charcoal">
            {count}
          </span>
        )}
      </div>
      <div>
        <h3 className="font-display font-black text-sm uppercase tracking-wide text-brand-navy group-hover:text-brand-charcoal">
          {card.label}
        </h3>
        <p className="mt-0.5 text-xs text-zinc-500 leading-snug font-semibold">
          {card.description}
        </p>
      </div>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [annCount, regCount, enqCount, shirtCount, listingCount, session] = await Promise.all([
    prisma.announcement.count({ where: { isPublished: false } }),
    prisma.playerProfile.count({ where: { registrationStatus: 'NEW' } }),
    prisma.publicEnquiry.count({ where: { status: 'NEW' } }),
    prisma.shirtSubmission.count({ where: { moderationStatus: 'PENDING' } }),
    prisma.bootRoomListing.count({ where: { moderationStatus: 'PENDING' } }),
    auth(),
  ]);

  const badges: AdminBadges = { ann: annCount, reg: regCount, enq: enqCount, appr: shirtCount + listingCount };
  const role = (session?.user as { globalRole?: string | null } | undefined)?.globalRole;
  const isSuperAdmin = role === GlobalRole.SUPER_ADMIN;

  const cards = isSuperAdmin ? [...SITE_NAV, ...SUPER_NAV] : SITE_NAV;

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-10 text-brand-charcoal">
      <div className="mx-auto max-w-4xl space-y-8">

        {/* Header */}
        <div className="border-b-2 border-brand-navy/10 pb-6">
          <p className="font-display text-xs font-black uppercase tracking-widest text-brand-green mb-1">
            Rivervalley Rangers
          </p>
          <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy leading-none">
            Admin Dashboard
          </h1>
        </div>

        {/* Unified card grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cards.map((card) => (
            <SectionCard key={card.href} card={card} badges={badges} />
          ))}
        </div>

      </div>
    </main>
  );
}
