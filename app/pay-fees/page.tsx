import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import ClubZapCheckoutModal from "@/components/ClubZapCheckoutModal";
import { ShieldCheck, Calculator, Info, ExternalLink, Megaphone } from "lucide-react";

export const metadata: Metadata = {
  title: "Pay Membership & Fees",
  description:
    "Pay your Rivervalley Rangers AFC club membership or team fees securely through the club payment portal.",
};

export default function PayFeesPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Club payments · Secure checkout"
        title="Pay Membership & Fees"
        description="Pay your club membership or settle team and training fees securely through the club payment portal."
      />

      {/* Trust + pricing strip */}
      <div className="bg-brand-cream border-b border-brand-navy/10">
        <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <div className="flex items-center gap-3 text-sm text-brand-charcoal/70">
            <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" aria-hidden="true" />
            <span><strong className="text-brand-charcoal">Secure checkout</strong> · handled through the club payment portal</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-brand-charcoal/70 sm:ml-auto">
            <Calculator className="h-5 w-5 text-brand-navy shrink-0" aria-hidden="true" />
            <span>
              Not sure what you owe? {' '}
              <Link href="/membership-calculator" className="font-black text-brand-navy underline underline-offset-4 hover:text-brand-neon transition-colors">
                Calculate your cost →
              </Link>
            </span>
          </div>
        </div>
      </div>

      <ClubZapCheckoutModal productKeys={["membership", "fees"]} />

      {/* 2026/27 Underage Membership Registration */}
      <section className="bg-white border-t-2 border-brand-navy/10">
        <div className="max-w-3xl mx-auto px-4 py-10 sm:px-6">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-5 w-5 text-brand-navy shrink-0" aria-hidden="true" />
            <h2 className="font-display font-black italic text-2xl uppercase tracking-tight text-brand-charcoal">
              2026/27 Underage Registration Now Open
            </h2>
          </div>
          <p className="text-brand-charcoal/70 text-sm leading-relaxed mb-6 max-w-2xl">
            River Valley Rangers AFC underage membership registration for the{' '}
            <strong className="text-brand-charcoal">2026/27 season</strong> is now open through ClubZap.
          </p>

          <div className="overflow-x-auto mb-6 rounded-xl border-2 border-brand-navy/15">
            <table className="w-full text-sm text-left">
              <thead className="bg-brand-navy text-white">
                <tr>
                  <th className="px-4 py-3 font-display font-black uppercase tracking-wide text-xs">Category</th>
                  <th className="px-4 py-3 font-display font-black uppercase tracking-wide text-xs">Paid in full</th>
                  <th className="px-4 py-3 font-display font-black uppercase tracking-wide text-xs">Or 4 monthly payments of</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/10 bg-white">
                <tr>
                  <td className="px-4 py-3 font-semibold text-brand-charcoal">Schoolboys DDSL (U8–U18)</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">€240</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">€60</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-brand-charcoal">Schoolgirls</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">€220</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">€55</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-brand-charcoal">Second child</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">€170</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">€42.50</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-brand-charcoal">Third child</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">€120</td>
                  <td className="px-4 py-3 text-brand-charcoal/80">€30</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-brand-charcoal/60 text-xs leading-relaxed mb-6 max-w-2xl">
            The payment option can be selected at checkout, with monthly payments debited automatically.
          </p>

          <a
            href="https://rvrafc.ie/membership_products"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center min-h-[48px] px-6 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all gap-2"
          >
            Register for 2026/27
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

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
