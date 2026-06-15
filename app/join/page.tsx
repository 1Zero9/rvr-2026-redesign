import type { Metadata } from "next";
import Header from "@/components/Header";
import PlayerRecruitmentForm from "@/components/PlayerRecruitmentForm";

export const metadata: Metadata = {
  title: "Join the Academy | Rivervalley Rangers AFC",
  description:
    "Register your interest in joining Rivervalley Rangers AFC. Youth and senior pathways available across all age groups.",
};

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />
      <main>
        <PlayerRecruitmentForm />
      </main>
    </div>
  );
}
