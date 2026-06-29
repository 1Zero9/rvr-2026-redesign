import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Bell,
  BookOpen,
  ClipboardList,
  Cog,
  FileText,
  MessageSquare,
  Shield,
  Trophy,
  Users,
  Shirt,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Admin Dashboard | RVR',
};

// ── Data ──────────────────────────────────────────────────────────────────────

async function getDashboardStats() {
  const [newRegs, newEnquiries, publishedAnnouncements] = await Promise.all([
    prisma.playerProfile.count({ where: { registrationStatus: 'NEW' } }),
    prisma.publicEnquiry.count({ where: { status: 'NEW' } }),
    prisma.announcement.count({ where: { isPublished: true } }),
  ]);
  return { newRegs, newEnquiries, publishedAnnouncements };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface NavCard {
  href: string;
  label: string;
  description: string;
  icon: React.ElementType;
  badge?: number;
  external?: boolean;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionCard({ card }: { card: NavCard }) {
  const Icon = card.icon;
  return (
    <Link
      href={card.href}
      className="group flex flex-col gap-3 rounded-xl border-2 border-brand-navy/15 bg-white p-5 transition hover:border-brand-navy hover:shadow-[3px_3px_0_#0B1F3B]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-brand-navy/20 bg-brand-cream group-hover:bg-brand-neon group-hover:border-brand-charcoal transition">
          <Icon className="h-4 w-4 text-brand-navy" aria-hidden="true" />
        </span>
        {card.badge !== undefined && card.badge > 0 && (
          <span className="bg-brand-neon text-brand-charcoal font-black text-[10px] px-1.5 py-0.5 min-w-[20px] text-center border border-brand-charcoal">
            {card.badge}
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const { newRegs, newEnquiries, publishedAnnouncements } = await getDashboardStats();

  const SITE_CARDS: NavCard[] = [
    {
      href: '/admin/announcements',
      label: 'Announcements',
      description: `${publishedAnnouncements} published — create, edit, and pin club news.`,
      icon: Bell,
    },
    {
      href: '/admin/registrations',
      label: 'Registrations',
      description: 'Review and process player registration submissions.',
      icon: ClipboardList,
      badge: newRegs,
    },
    {
      href: '/admin/enquiries',
      label: 'Enquiries',
      description: 'Public contact and callback requests from the website.',
      icon: MessageSquare,
      badge: newEnquiries,
    },
    {
      href: '/admin/moderation',
      label: 'Moderation',
      description: 'Review and approve player-submitted content.',
      icon: Shield,
    },
    {
      href: '/admin/boot-room',
      label: 'Boot Room',
      description: 'Kit and equipment management.',
      icon: Shirt,
    },
  ];

  const SUPER_CARDS: NavCard[] = [
    {
      href: '/competitions/admin',
      label: 'Competitions',
      description: 'Manage fixtures, results, pitches, and competition settings.',
      icon: Trophy,
    },
    {
      href: '/competitions/admin/users',
      label: 'Users',
      description: 'Manage competition admin accounts and role assignments.',
      icon: Users,
    },
    {
      href: '/admin/features',
      label: 'Features & Setup',
      description: 'Toggle site features and manage platform configuration.',
      icon: Cog,
    },
    {
      href: '/admin/docs',
      label: 'Docs',
      description: 'Internal documentation, guides, and reference materials.',
      icon: BookOpen,
    },
    {
      href: '#',
      label: 'Logs',
      description: 'Activity logs and audit trail — coming soon.',
      icon: FileText,
    },
  ];

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-10 text-brand-charcoal">
      <div className="mx-auto max-w-4xl space-y-12">

        {/* Header */}
        <div className="flex items-end justify-between border-b-2 border-brand-navy/10 pb-6">
          <div>
            <p className="font-display text-xs font-black uppercase tracking-widest text-brand-green mb-1">
              Rivervalley Rangers
            </p>
            <h1 className="font-display font-black italic text-4xl uppercase text-brand-navy leading-none">
              Admin
            </h1>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-zinc-400 hover:text-brand-navy transition-colors"
          >
            ← Back to site
          </Link>
        </div>

        {/* ── Site Admin ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="font-display font-black italic text-xl uppercase text-brand-navy">
              Site Admin
            </h2>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Content &amp; members
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SITE_CARDS.map((card) => (
              <SectionCard key={card.href} card={card} />
            ))}
          </div>
        </section>

        {/* ── Super Admin ────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="font-display font-black italic text-xl uppercase text-brand-navy">
              Super Admin
            </h2>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Platform, competitions &amp; users
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {SUPER_CARDS.map((card) => (
              <SectionCard key={card.label} card={card} />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
