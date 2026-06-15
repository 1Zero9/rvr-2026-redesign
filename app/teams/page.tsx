import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Teams | Rivervalley Rangers AFC",
  description:
    "All squads and age-group formats at Rivervalley Rangers AFC — Girls and Women, Boys and Men, Junior Academy, and Inclusive Football.",
};

const formats = [
  {
    label: "Girls and Women",
    ageRange: "All ages",
    summary:
      "Senior women's and girls academy pathways. Girls teams listed first in line with our equality commitment.",
    href: "/teams?section=girls-women",
    accent: "bg-brand-neon",
    badge: "Equality First",
  },
  {
    label: "Junior Academy",
    ageRange: "U7 – U12",
    summary:
      "Foundation football focused on ball mastery, movement, and fun. No league tables below U11.",
    href: "/teams?section=junior-academy",
    accent: "bg-[#E0F2FE]",
    badge: "Development",
  },
  {
    label: "Youth Competitive",
    ageRange: "U13 – U18",
    summary:
      "DDSL and FAI league teams across all age groups. High-performance coaching and fitness modules.",
    href: "/teams?section=youth-competitive",
    accent: "bg-[#FEF3C7]",
    badge: "Competitive",
  },
  {
    label: "Boys and Men",
    ageRange: "All ages",
    summary:
      "Senior men's squads competing in the LSL and DWSL, plus the full boys academy from U7.",
    href: "/teams?section=seniors",
    accent: "bg-white",
    badge: "Senior",
  },
  {
    label: "Inclusive Football",
    ageRange: "Open",
    summary:
      "Pan-disability sessions, sensory football, and our Football For All programme. Everyone plays.",
    href: "/football-for-all",
    accent: "bg-[#E9D5FF]",
    badge: "Football For All",
  },
];

export default function TeamsPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />

      <main>
        {/* Page header */}
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-2xl">
              <span className="mb-4 inline-block rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-1.5 font-display text-xs font-black uppercase tracking-wider">
                Squad Directory
              </span>
              <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
                All Teams
              </h1>
              <p className="mt-5 text-base font-semibold leading-relaxed text-zinc-600 md:text-lg">
                Select a format below to view squad information, schedules, and
                coaching staff. Full team pages are being published ahead of the
                2026/27 season.
              </p>
            </div>
          </div>
        </section>

        {/* Format directory grid */}
        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {formats.map((format) => (
              <Link
                key={format.label}
                href={format.href}
                className="brutalist-card group flex flex-col justify-between p-6 focus-visible:outline-4 focus-visible:outline-brand-neon"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <span
                      className={`inline-block rounded-full border-2 border-brand-charcoal px-3 py-1 font-display text-[10px] font-black uppercase tracking-wider ${format.accent}`}
                    >
                      {format.badge}
                    </span>
                    <span className="rounded-full border border-zinc-300 bg-zinc-100 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-wide text-zinc-600">
                      {format.ageRange}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-tight">
                    {format.label}
                  </h2>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-600">
                    {format.summary}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 font-display text-xs font-black uppercase text-brand-green group-hover:gap-3 transition-all">
                  View squads
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Under construction notice */}
          <div className="mt-10 rounded-2xl border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist">
            <p className="font-display text-sm font-black uppercase tracking-wide text-brand-neon">
              Under Construction
            </p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-300">
              Individual squad pages — rosters, fixtures, and coaching staff —
              will be live before the 2026/27 season registration window opens.
              Contact the club directly for current squad information.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
