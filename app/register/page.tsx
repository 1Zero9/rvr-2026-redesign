import type { Metadata } from "next";
import PlayerRecruitmentWizard from "@/components/PlayerRecruitmentWizard";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Join the Club | Rivervalley Rangers AFC",
  description:
    "Register a player with Rivervalley Rangers AFC. Youth and senior pathways available across all age groups in Swords, Co. Dublin.",
};

export default function RegisterPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow="Join RVR"
        title="Player Registration"
        description="Tell us about the player and the right club contact will follow up with the next available pathway."
        maxWidth="4xl"
      />
      <PlayerRecruitmentWizard />
    </PublicPageShell>
  );
}
