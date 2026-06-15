import type { Metadata } from "next";
import Header from "@/components/Header";
import {
  BellRing,
  CalendarDays,
  Clock3,
  Download,
  MapPin,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Matchday Hub | Rivervalley Rangers AFC",
  description:
    "Mobile-first fixture and result hub for Rivervalley Rangers AFC teams.",
};

interface ProcessedScore {
  home: number;
  away: number;
  mercyRuleApplied: boolean;
}

interface MatchFixture {
  id: string;
  divisionLevel: string;
  homeSquad: string;
  awaySquad: string;
  matchDate: string;
  kickoffTime: string;
  pitchLocation: string;
  processedScore: ProcessedScore | null;
}

const fixtures: MatchFixture[] = [
  {
    id: "fixture-u8-green",
    divisionLevel: "U8 Small Sided Game",
    homeSquad: "Rivervalley Rangers U8 Green",
    awaySquad: "Malahide United U8",
    matchDate: "2026-06-20",
    kickoffTime: "09:30",
    pitchLocation: "Ward Astro",
    processedScore: {
      home: 5,
      away: 0,
      mercyRuleApplied: true,
    },
  },
  {
    id: "fixture-u10-hoops",
    divisionLevel: "U10 7v7 League",
    homeSquad: "Rivervalley Rangers U10 Hoops",
    awaySquad: "Swords Celtic U10",
    matchDate: "2026-06-20",
    kickoffTime: "10:45",
    pitchLocation: "Ridgewood Park",
    processedScore: null,
  },
  {
    id: "fixture-u11-girls",
    divisionLevel: "U11 Girls League",
    homeSquad: "Portmarnock AFC U11 Girls",
    awaySquad: "Rivervalley Rangers U11 Girls",
    matchDate: "2026-06-22",
    kickoffTime: "18:30",
    pitchLocation: "Rathingle",
    processedScore: {
      home: 2,
      away: 4,
      mercyRuleApplied: false,
    },
  },
  {
    id: "fixture-u15-premier",
    divisionLevel: "U15 Premier",
    homeSquad: "Rivervalley Rangers U15",
    awaySquad: "Baldoyle United U15",
    matchDate: "2026-06-23",
    kickoffTime: "19:15",
    pitchLocation: "Ward Astro",
    processedScore: {
      home: 3,
      away: 1,
      mercyRuleApplied: false,
    },
  },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${value}T00:00:00`));
}

function MatchCard({ fixture }: { fixture: MatchFixture }) {
  return (
    <article className="rounded-2xl border-4 border-brand-charcoal bg-white p-5 shadow-[6px_6px_0_#121212]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display text-xs font-black uppercase tracking-wide text-brand-green">
            {fixture.divisionLevel}
          </p>
          <h2 className="mt-3 font-display text-xl font-black uppercase leading-tight text-brand-charcoal">
            {fixture.homeSquad}
          </h2>
          <p className="mt-1 font-display text-sm font-black uppercase text-zinc-400">
            versus
          </p>
          <h3 className="mt-1 font-display text-xl font-black uppercase leading-tight text-brand-charcoal">
            {fixture.awaySquad}
          </h3>
        </div>

        <div className="shrink-0 rounded-2xl border-3 border-brand-charcoal bg-brand-cream px-4 py-3 text-center">
          {fixture.processedScore ? (
            <>
              <div className="flex items-center justify-center gap-2 font-display text-4xl font-black tabular-nums leading-none tracking-tight text-brand-charcoal">
                <span>{fixture.processedScore.home}</span>
                <span className="text-zinc-300">-</span>
                <span>{fixture.processedScore.away}</span>
              </div>
              {fixture.processedScore.mercyRuleApplied && (
                <p className="mt-2 rounded-full border-2 border-brand-charcoal bg-brand-neon px-2 py-1 font-display text-[10px] font-black uppercase">
                  Mercy Rule
                </p>
              )}
            </>
          ) : (
            <p className="font-display text-3xl font-black uppercase text-zinc-300">
              vs
            </p>
          )}
        </div>
      </div>

      <div className="mt-5 grid gap-3 border-t-2 border-dashed border-zinc-200 pt-4 text-sm font-bold text-zinc-700">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-brand-green" aria-hidden="true" />
          {formatDate(fixture.matchDate)}
        </span>
        <span className="flex items-center gap-2">
          <Clock3 className="h-4 w-4 text-brand-green" aria-hidden="true" />
          {fixture.kickoffTime}
        </span>
        <span className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-brand-green" aria-hidden="true" />
          {fixture.pitchLocation}
        </span>
      </div>
    </article>
  );
}

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />

      <main>
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-3xl">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-2 font-display text-xs font-black uppercase tracking-wide">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Matchday Hub
              </span>
              <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tight md:text-6xl">
                Fixtures and processed scores
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-relaxed text-zinc-700 md:text-lg">
                Compact match cards for parents, players, and supporters on the
                move. Youth scores display the processed result supplied by the
                data layer.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
          <div className="grid gap-5">
            {fixtures.map((fixture) => (
              <MatchCard key={fixture.id} fixture={fixture} />
            ))}
          </div>
        </section>

        <section className="border-y-4 border-brand-charcoal bg-brand-charcoal">
          <div className="mx-auto max-w-6xl px-6 py-12 text-white lg:py-16">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-brand-neon bg-brand-neon">
                  <Smartphone className="h-7 w-7 text-brand-charcoal" aria-hidden="true" />
                </span>
                <p className="font-display text-sm font-black uppercase text-brand-neon">
                  Live away-match notifications
                </p>
                <h2 className="mt-2 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">
                  Install the official DDSL Scoreboard App.
                </h2>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-relaxed text-zinc-300 md:text-base">
                  Get live away-match updates, fixture changes, and result alerts
                  directly on your phone.
                </p>
              </div>

              <div className="rounded-2xl border-4 border-brand-neon bg-white p-5 text-brand-charcoal shadow-[6px_6px_0_#85E320] md:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <BellRing className="mt-1 h-6 w-6 shrink-0 text-brand-green" aria-hidden="true" />
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase">
                      Follow every fixture
                    </h3>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-700">
                      Parents and supporters should install the app before away
                      fixtures so match notifications arrive on time.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href="https://apps.apple.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brutalist-green inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Apple App Store
                  </a>
                  <a
                    href="https://play.google.com/store"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-brutalist-neon inline-flex items-center justify-center gap-2 px-5 py-3 text-sm"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
                    Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
