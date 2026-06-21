import type { Metadata } from "next";
import Header from "@/components/Header";
import KitCompetition from "@/components/KitCompetition";

export const metadata: Metadata = {
  title: "45th Anniversary Kit Design | Rivervalley Rangers AFC",
  description:
    "Design the official Rivervalley Rangers AFC 45th anniversary shirt. Download the template, submit your entry, and vote for your favourite.",
};

export default function AnniversaryPage() {
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
        <KitCompetition />
      </main>
    </div>
  );
}
