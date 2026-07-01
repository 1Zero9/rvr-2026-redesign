import type { Metadata } from "next";
import Link from "next/link";
import PlayerRecruitmentWizard from "@/components/PlayerRecruitmentWizard";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";

export const metadata: Metadata = {
  title: "Join the Club | Rivervalley Rangers AFC",
  description:
    "Register a player with Rivervalley Rangers AFC. Youth and senior pathways available across all age groups in Swords, Co. Dublin.",
};

export default function RegisterPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Join RVR"
        title="Player Registration"
        description="Tell us about the player and the right club contact will follow up with the next available pathway."
      />

      {/* Trials callout — prominent split at the top */}
      <div className="bg-brand-neon border-b-3 border-brand-charcoal">
        <div className="mx-auto max-w-2xl px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div>
            <p className="font-display font-black italic text-sm uppercase tracking-wide text-brand-charcoal leading-tight">
              Interested in Trials / Open Training?
            </p>
            <p className="text-xs text-brand-charcoal/70 mt-0.5">
              Use our separate trials form — it takes 2 minutes.
            </p>
          </div>
          <Link
            href="/trials"
            className="shrink-0 inline-flex items-center min-h-[40px] px-5 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all whitespace-nowrap"
          >
            Register for Trials →
          </Link>
        </div>
      </div>

      <PlayerRecruitmentWizard />
    </PublicPageShell>
  );
}
