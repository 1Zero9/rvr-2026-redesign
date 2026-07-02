import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import JoinPathSelector from "@/components/JoinPathSelector";
import { ShieldCheck, Calculator } from "lucide-react";

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
    </PublicPageShell>
  );
}
