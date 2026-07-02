import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3 } from 'lucide-react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata: Metadata = {
  title: 'Club History | Rivervalley Rangers AFC',
  description:
    'The history of Rivervalley Rangers AFC — founded in Swords in 1981, serving the community for over 40 years through youth football, senior teams, and grassroots development.',
};

const timeline = [
  {
    year: '1981',
    title: 'Rivervalley Rangers AFC founded',
    body: "The club was established to serve the Rivervalley housing estate and the growing Swords community. Starting with a small group of local volunteers and a handful of teams, the Rangers began building what would become one of north Dublin's most active grassroots football clubs.",
    status: 'verified' as const,
  },
  {
    year: 'Early 2000s',
    title: 'Development Academy launched',
    body: 'The Saturday morning Development Academy was introduced for children aged 4–7, offering their first experience of football in a fun, relaxed, and welcoming environment. Led by dedicated coaches, it has run without interruption for over 20 years and remains one of the longest-running youth academies in Swords.',
    status: 'verified' as const,
  },
  {
    year: '2006',
    title: '25th Anniversary — FAI Club of the Year',
    body: "Marking 25 years of community football, Rivervalley Rangers received a Club of the Month nomination — qualifying the club for the prestigious FAI Club of the Year award. A significant moment of national recognition for what local volunteers had built over a quarter century.",
    status: 'verified' as const,
  },
  {
    year: '2024',
    title: 'FAI Club Mark accreditation',
    body: "Rivervalley Rangers AFC was awarded FAI Club Mark accreditation, recognising the club's high standards in player welfare, governance, safeguarding, and community football. Supported by Circle K.",
    status: 'verified' as const,
  },
  {
    year: 'Ongoing',
    title: 'Archive in progress',
    body: 'Championships, cup runs, team launches, facility developments, international tours, and community milestones are being gathered from the club archive. These will be added as details are confirmed.',
    status: 'pending' as const,
  },
];

const stats = [
  { value: '1981', label: 'Year founded' },
  { value: '40+', label: 'Years in Swords' },
  { value: '22+', label: 'Active teams' },
  { value: '300+', label: 'Members' },
  { value: '4', label: 'Leagues' },
  { value: '20+', label: 'Academy years' },
];

const leagues = [
  { name: 'DDSL', full: 'Dublin District Schoolboys League', desc: 'Youth boys and girls, U8 through U18' },
  { name: 'NDSL', full: 'North Dublin Schoolboys League', desc: 'Additional youth competitive pathway' },
  { name: 'LSL', full: 'Leinster Senior League', desc: 'Competitive adult football' },
  { name: 'AFL', full: 'Amateur Football League', desc: 'Senior and Over 35s' },
];

function StatusLabel({ status }: { status: 'verified' | 'pending' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 px-3 py-1 font-display text-[10px] font-black uppercase tracking-wide ${
        status === 'pending'
          ? 'border-amber-700 bg-amber-50 text-amber-900'
          : 'border-brand-green bg-brand-neon/20 text-brand-green'
      }`}
    >
      {status === 'pending'
        ? <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
        : <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />}
      {status === 'pending' ? 'Archive pending' : 'Verified'}
    </span>
  );
}

export default function ClubHistoryPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Est. 1981 · Swords, Co. Dublin"
        title="Our History"
        backHref="/club"
        backLabel="Club information"
        description="Over 40 years of grassroots football in Swords — from a small community club to one of north Dublin's most active football organisations."
      />

      {/* ── Stats strip ─────────────────────────────────────────────────── */}
      <div className="bg-brand-neon border-b-4 border-brand-charcoal">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display font-black italic text-3xl sm:text-4xl text-brand-charcoal leading-none">
                  {s.value}
                </p>
                <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-charcoal/60 mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Origin story ─────────────────────────────────────────────────── */}
      <section className="bg-brand-cream border-b border-brand-navy/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal mb-6">
            Built by the community
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4 text-sm text-brand-charcoal/70 leading-relaxed font-medium">
              <p>
                Rivervalley Rangers AFC was founded in 1981 to serve the Rivervalley housing estate and the wider Swords community. What began with a small group of local volunteers and a handful of teams has grown into one of north Dublin&apos;s most active grassroots football clubs.
              </p>
              <p>
                The club has always been entirely volunteer-driven — coaches, committee members, and supporters giving their time freely to provide football for every age group, from four-year-olds taking their first kick to senior players competing in adult leagues.
              </p>
            </div>
            <div className="space-y-4 text-sm text-brand-charcoal/70 leading-relaxed font-medium">
              <p>
                Today, Rivervalley Rangers field over 22 teams across four leagues — the DDSL, NDSL, Leinster Senior League, and AFL — with more than 300 members ranging from the youngest Academy players to the Over 35s sides.
              </p>
              <p>
                The club has also competed in international tournaments, regularly sending teams abroad to represent Swords on the European stage — an experience that has enriched the development of players at every age group.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-brand-navy/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-charcoal mb-2">
            Club timeline
          </h2>
          <p className="text-brand-charcoal/50 text-sm mb-10">
            Key milestones from the club archive. Verified entries shown in green; unconfirmed milestones shown as pending.
          </p>

          <ol className="space-y-0">
            {timeline.map((item, index) => (
              <li
                key={`${item.year}-${item.title}`}
                className="relative grid gap-4 pb-10 pl-14 last:pb-0 sm:grid-cols-[8rem_1fr] sm:pl-16"
              >
                {index < timeline.length - 1 && (
                  <span
                    className="absolute left-[19px] top-12 h-[calc(100%-2rem)] w-1 bg-brand-navy/10 sm:left-[23px]"
                    aria-hidden="true"
                  />
                )}
                <span
                  className={`absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border-3 border-brand-navy font-display text-xs font-black sm:h-12 sm:w-12 ${
                    item.status === 'verified'
                      ? 'bg-brand-neon text-brand-charcoal'
                      : 'bg-white text-brand-navy'
                  }`}
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
                <p className="pt-2.5 font-display text-sm font-black uppercase text-brand-green sm:pt-3.5">
                  {item.year}
                </p>
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h3 className="font-display text-xl font-black uppercase text-brand-navy sm:text-2xl">
                      {item.title}
                    </h3>
                    <StatusLabel status={item.status} />
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-zinc-600 max-w-2xl">
                    {item.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Leagues ──────────────────────────────────────────────────────── */}
      <section className="bg-brand-navy border-b border-brand-sky/10">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
          <h2 className="font-display font-black italic text-3xl md:text-4xl uppercase tracking-tight text-brand-cream mb-2">
            Leagues &amp; competitions
          </h2>
          <p className="text-brand-sky/60 text-sm mb-8">
            Rivervalley Rangers currently compete across four separate competitions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {leagues.map((l) => (
              <div key={l.name} className="border-2 border-brand-sky/20 bg-brand-navy/60 p-5">
                <p className="font-display font-black text-brand-neon text-lg uppercase tracking-tight">
                  {l.name}
                </p>
                <p className="font-display font-black text-xs uppercase tracking-widest text-brand-sky/50 mt-0.5 mb-2">
                  {l.full}
                </p>
                <p className="text-sm text-brand-sky/70">{l.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="bg-brand-cream">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-display font-black italic text-2xl uppercase text-brand-charcoal">
              Be part of the story
            </p>
            <p className="text-brand-charcoal/60 text-sm mt-1">
              Join the club that has served Swords since 1981.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/register"
              className="btn-brutalist-neon inline-flex min-h-[44px] items-center justify-center gap-2 px-6 py-3 text-sm"
            >
              Register now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/club"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 border-3 border-brand-navy bg-white px-6 py-3 text-sm font-display font-black uppercase text-brand-navy hover:bg-brand-neon transition-colors"
            >
              Club overview
            </Link>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
