import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeEuro,
  BookOpen,
  Flag,
  GraduationCap,
  ShieldCheck,
  Users,
} from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import RefInterestForm from './_components/RefInterestForm';

export const metadata: Metadata = {
  title: 'Become a Referee',
  description:
    'Become a football referee with Rivervalley Rangers — the young referee (JMO) route, the FAI Beginners Course, and the pathway from Swords to UEFA level.',
  alternates: { canonical: '/club/refereeing' },
};

const ROUTES = [
  {
    icon: Users,
    title: 'The Young Referee — JMO',
    who: 'From age 16',
    points: [
      'Referee small-sided games (U7–U11) at Rivervalley Park with an experienced adult mentor beside you.',
      'Part of the DDSL Junior Match Officials programme — building confidence, leadership, and game knowledge.',
      'Paid per game under the FAI referees’ expenses agreement — around €22 for a small-sided game and €26 for 7v7.',
    ],
  },
  {
    icon: GraduationCap,
    title: 'The FAI Beginners Course',
    who: 'Teens and adults',
    points: [
      'A short FAI-run course covering the Laws of the Game, finishing with a written exam.',
      'Pass it and you register as an FAI referee with your local referees’ branch, taking appointments in DDSL and grassroots football.',
      'Courses run through the year — the club will point you to the next intake when you get in touch.',
    ],
  },
];

const LADDER = [
  { stage: 'Club small-sided games', detail: 'JMO at Rivervalley Park — mentored, paid, low pressure.' },
  { stage: 'DDSL & grassroots', detail: 'Qualified FAI referee taking schoolboys/girls league appointments.' },
  { stage: 'Junior & amateur leagues', detail: 'Adult football — LSL and junior leagues, assessments and promotion.' },
  { stage: 'National panels', detail: 'League of Ireland appointments for the top performers.' },
  { stage: 'FIFA & UEFA', detail: 'International list referees, nominated through the FAI — European nights start in places like Swords.' },
];

const TRAINING = [
  { icon: BookOpen, label: 'Laws of the Game', text: 'The IFAB laws — taught on the course, and free to study any time at theifab.com.' },
  { icon: ShieldCheck, label: 'Safeguarding & vetting', text: 'Standard safeguarding requirements apply, as with every role in the club.' },
  { icon: Flag, label: 'Mentoring', text: 'Young referees are never thrown in alone — an experienced mentor supports your first games.' },
  { icon: BadgeEuro, label: 'Match fees', text: 'Refereeing pays from your very first game — set nationally by the FAI expenses agreement.' },
];

export default function RefereeingPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        backHref="/club"
        backLabel="Club"
        eyebrow="Get Involved"
        title="Become a Referee"
        description="Love the game but done playing — or never played at all? Refereeing is football's best-kept secret: paid, respected, and a genuine pathway from Rivervalley Park to European nights."
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 space-y-12">

        {/* Two routes in */}
        <section aria-labelledby="routes-heading">
          <h2 id="routes-heading" className="font-display font-black italic text-2xl sm:text-3xl uppercase text-brand-navy mb-5">
            Two ways in
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROUTES.map((route) => {
              const Icon = route.icon;
              return (
                <article key={route.title} className="border-3 border-brand-charcoal bg-white p-5 shadow-brutalist-charcoal">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-brand-charcoal bg-brand-neon">
                      <Icon className="h-5 w-5 text-brand-charcoal" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display font-black uppercase text-brand-navy leading-tight">{route.title}</h3>
                      <p className="text-xs font-bold text-brand-green uppercase tracking-wide">{route.who}</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm font-semibold text-zinc-700">
                    {route.points.map((point) => (
                      <li key={point} className="flex gap-2">
                        <span className="text-brand-green shrink-0" aria-hidden="true">✓</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
        </section>

        {/* What it takes */}
        <section aria-labelledby="training-heading">
          <h2 id="training-heading" className="font-display font-black italic text-2xl sm:text-3xl uppercase text-brand-navy mb-5">
            What it takes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TRAINING.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex gap-3 border-2 border-brand-navy/15 bg-white p-4">
                  <Icon className="h-5 w-5 shrink-0 text-brand-green mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-bold text-sm text-brand-charcoal">{item.label}</p>
                    <p className="text-xs text-zinc-600 mt-0.5 leading-relaxed">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* The ladder */}
        <section aria-labelledby="ladder-heading">
          <h2 id="ladder-heading" className="font-display font-black italic text-2xl sm:text-3xl uppercase text-brand-navy mb-2">
            How far can it go?
          </h2>
          <p className="text-sm text-zinc-600 font-semibold mb-5 max-w-2xl">
            Every referee in Ireland — including the ones on TV — started at the bottom of this
            ladder. Ireland always needs referees, so promotion is genuinely open to anyone
            willing to put the games in.
          </p>
          <ol className="space-y-0">
            {LADDER.map((step, i) => (
              <li key={step.stage} className="relative flex gap-4 pb-5 last:pb-0">
                {i < LADDER.length - 1 && (
                  <span aria-hidden="true" className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-brand-navy/15" />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center border-2 border-brand-charcoal bg-brand-neon font-display font-black text-sm">
                  {i + 1}
                </span>
                <div className="pt-1">
                  <p className="font-display font-black uppercase text-sm text-brand-navy">{step.stage}</p>
                  <p className="text-xs text-zinc-600 mt-0.5">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Interest form */}
        <section
          id="apply"
          aria-labelledby="apply-heading"
          className="border-3 border-brand-charcoal bg-white p-5 sm:p-8 shadow-brutalist-charcoal scroll-mt-20"
        >
          <h2 id="apply-heading" className="font-display font-black italic text-2xl sm:text-3xl uppercase text-brand-navy mb-2">
            Submit your interest
          </h2>
          <p className="text-sm text-zinc-600 font-semibold mb-6">
            No commitment — tell us you&rsquo;re curious and the club will talk you through the
            next step, whether that&rsquo;s a JMO taster or the next FAI course intake.
          </p>
          <RefInterestForm />
        </section>

        {/* Related */}
        <p className="text-sm font-semibold text-zinc-600">
          Prefer coaching or volunteering instead?{' '}
          <Link href="/get-involved" className="inline-flex items-center gap-1 font-bold text-brand-navy underline underline-offset-2 hover:text-brand-green">
            See all ways to get involved <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </p>
      </div>
    </PublicPageShell>
  );
}
