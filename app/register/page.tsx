import type { Metadata } from "next";
import Header from "@/components/Header";
import PlayerRecruitmentWizard from "@/components/PlayerRecruitmentWizard";

export const metadata: Metadata = {
  title: "Join the Club | Rivervalley Rangers AFC",
  description:
    "Register a player with Rivervalley Rangers AFC. Youth and senior pathways available across all age groups in Swords, Co. Dublin.",
};

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen bg-brand-cream text-brand-charcoal"
      style={{
        backgroundImage: `linear-gradient(rgba(11,31,59,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(11,31,59,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Header />
      <main>
        <PlayerRecruitmentWizard />
      </main>
    </div>
  );
}
