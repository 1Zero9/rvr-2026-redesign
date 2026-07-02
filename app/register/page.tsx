import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import JoinPathSelector from "@/components/JoinPathSelector";
import { ShieldCheck, Calculator, Info, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Join the Club",
  description:
    "Register a player with Rivervalley Rangers AFC or sign up for an open training trial. All ages and abilities welcome in Swords, Co. Dublin.",
};

export default function RegisterPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Join the community · Swords, Co. Dublin"
        title="Your Team Is Waiting"
        description="From first kick to senior football — there's a place for every player at Rivervalley Rangers. Take the first step today."
      />

      {/* Trust + pricing strip */}
      <div className="bg-brand-cream border-b border-brand-navy/10">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3 text-sm text-brand-charcoal/70">
            <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" aria-hidden="true" />
            <span><strong className="text-brand-charcoal">100% Garda Vetted Coaches</strong> · FAI Club Mark Accredited</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-brand-charcoal/70 sm:ml-auto">
            <Calculator className="h-5 w-5 text-brand-navy shrink-0" aria-hidden="true" />
            <span>
              From <strong className="text-brand-charcoal">€115 half-season</strong> · Academy from <strong className="text-brand-charcoal">€120</strong> · {' '}
              <Link href="/membership-calculator" className="font-black text-brand-navy underline underline-offset-4 hover:text-brand-neon transition-colors">
                Calculate your cost →
              </Link>
            </span>
          </div>
        </div>
      </div>

      <JoinPathSelector />

      {/* DDSL Registration info */}
      <section className="bg-brand-cream border-t-2 border-brand-navy/10">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-brand-navy shrink-0" aria-hidden="true" />
            <h2 className="font-display font-black italic text-2xl uppercase tracking-tight text-brand-charcoal">
              DDSL Player Registration
            </h2>
          </div>
          <p className="text-brand-charcoal/70 text-sm leading-relaxed mb-6 max-w-2xl">
            All youth players aged <strong className="text-brand-charcoal">U8 and above</strong> must also be registered annually with the{' '}
            <strong className="text-brand-charcoal">Dublin District Schoolboys League (DDSL)</strong>. This is a separate process to your RVR club membership — the club manages it on your behalf at the start of each season.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white border-2 border-brand-navy/15 p-4 rounded-xl">
              <p className="font-display font-black text-xs uppercase tracking-widest text-brand-navy mb-1">Who needs it</p>
              <p className="text-sm text-brand-charcoal/70">All players in DDSL-affiliated teams — U8 through U18, boys and girls.</p>
            </div>
            <div className="bg-white border-2 border-brand-navy/15 p-4 rounded-xl">
              <p className="font-display font-black text-xs uppercase tracking-widest text-brand-navy mb-1">Academy players</p>
              <p className="text-sm text-brand-charcoal/70">Development Academy players (born 2020–2022) are <strong>not</strong> required to register with the DDSL.</p>
            </div>
            <div className="bg-white border-2 border-brand-navy/15 p-4 rounded-xl">
              <p className="font-display font-black text-xs uppercase tracking-widest text-brand-navy mb-1">Cost</p>
              <p className="text-sm text-brand-charcoal/70">A DDSL levy applies separately to club membership fees — see the membership calculator for details.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="https://www.ddsl.ie"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy underline underline-offset-4 hover:text-brand-green transition-colors"
            >
              More info at ddsl.ie
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </a>
            <span className="text-brand-charcoal/30 hidden sm:block">·</span>
            <span className="text-sm text-brand-charcoal/50">
              DDSL contact: <a href="mailto:admin@ddsl.ie" className="underline hover:text-brand-navy">admin@ddsl.ie</a> · 086 176 8790 (Mon &amp; Thu, 10am–3pm)
            </span>
          </div>
        </div>
      </section>
    </PublicPageShell>
  );
}
