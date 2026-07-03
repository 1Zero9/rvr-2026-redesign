import type { Metadata } from 'next';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import TeletextFixtures from '@/components/TeletextFixtures';
import { CLUB_SEASON } from '@/config/club-season';

export const metadata: Metadata = {
  title: 'Matchday Centre',
  description: `Every upcoming Rivervalley Rangers fixture — all youth, senior, and Over 35s teams in one place, ${CLUB_SEASON.currentSeason} season.`,
};

export default function MatchdayPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow={<><Trophy className="h-4 w-4" aria-hidden="true" /> {CLUB_SEASON.currentSeason} Season</>}
        title="Matchday Centre"
        description="Every upcoming fixture for every RVR team — filter by your team, or take in the whole club at once."
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-6">
        <TeletextFixtures />

        {/* Sponsorship slot */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-3 border-brand-charcoal bg-white p-5 shadow-brutalist">
          <div>
            <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-green mb-1">
              Sponsorship opportunity
            </p>
            <p className="font-display font-black italic text-xl uppercase text-brand-charcoal leading-tight">
              Put your name on Matchday
            </p>
            <p className="text-sm text-brand-muted mt-1">
              The Matchday Centre is seen by every player and parent, every week of the
              season. Your brand could be here.
            </p>
          </div>
          <Link
            href="/sponsorship"
            className="shrink-0 inline-flex min-h-[48px] items-center gap-2 border-3 border-brand-charcoal bg-brand-navy px-6 text-sm font-display font-black italic uppercase text-brand-neon shadow-brutalist-charcoal hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Sponsor This Page →
          </Link>
        </div>

        <p className="text-xs text-brand-muted">
          Looking for results and league tables? Visit the{' '}
          <Link href="/fixtures" className="font-bold text-brand-navy underline underline-offset-2 hover:text-brand-green">
            full match centre
          </Link>.
        </p>
      </div>
    </PublicPageShell>
  );
}
