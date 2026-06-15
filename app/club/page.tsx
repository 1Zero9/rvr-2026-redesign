import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Club | Rivervalley Rangers AFC",
  description:
    "Rivervalley Rangers AFC — Swords community football club founded in 1981. Our story, values, and club information.",
};

const sections = [
  {
    label: "Safeguarding",
    description:
      "Child welfare policy, Garda Vetting records, and welfare contact information.",
    href: "/club/safeguarding",
  },
  {
    label: "Contact",
    description:
      "Reach the club committee, coaching staff, or general enquiries.",
    href: "/contact",
  },
];

export default function ClubPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />

      <main>
        {/* Page header */}
        <section className="border-b-4 border-brand-charcoal bg-white">
          <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
            <div className="max-w-3xl">
              <span className="mb-4 inline-block rounded-full border-3 border-brand-charcoal bg-brand-neon px-4 py-1.5 font-display text-xs font-black uppercase tracking-wider">
                Est. 1981
              </span>
              <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tighter md:text-6xl">
                Our Club
              </h1>
              <p className="mt-5 text-base font-semibold leading-relaxed text-zinc-700 md:text-lg">
                Rivervalley Rangers AFC has served the Swords community since
                1981. We run teams across all age groups and formats, with an
                equality-first structure that puts girls and women at the centre
                of how we operate.
              </p>
            </div>
          </div>
        </section>

        {/* Club values */}
        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="grid gap-6 md:grid-cols-3">
            <article className="brutalist-card bg-white p-6">
              <h2 className="font-display text-xl font-black uppercase tracking-tight">
                Community First
              </h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-700">
                Every decision at Rivervalley Rangers puts local families and
                players first. The club is run by volunteers from the Swords
                area who give their time to develop football in North Dublin.
              </p>
            </article>

            <article className="brutalist-card bg-white p-6">
              <h2 className="font-display text-xl font-black uppercase tracking-tight">
                Equality in Sport
              </h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-700">
                Girls and women's teams are listed first across all club
                communications and are represented equally at every level of
                the academy and senior structure.
              </p>
            </article>

            <article className="brutalist-card bg-white p-6">
              <h2 className="font-display text-xl font-black uppercase tracking-tight">
                Safe and Vetted
              </h2>
              <p className="mt-3 text-sm font-semibold leading-relaxed text-zinc-700">
                All coaches and volunteers hold current Garda Vetting approval
                and completed FAI Safeguarding 1 certification. Child welfare
                is a non-negotiable standard at this club.
              </p>
            </article>
          </div>

          {/* Club links */}
          <nav
            aria-label="Club information sections"
            className="mt-10 grid gap-4 sm:grid-cols-2"
          >
            {sections.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="brutalist-card group flex items-center justify-between bg-white p-5 focus-visible:outline-4 focus-visible:outline-brand-neon"
              >
                <div>
                  <p className="font-display text-lg font-black uppercase tracking-tight">
                    {s.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-zinc-600">
                    {s.description}
                  </p>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 shrink-0 text-brand-green group-hover:translate-x-1 transition-transform"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            ))}
          </nav>
        </section>
      </main>
    </div>
  );
}
