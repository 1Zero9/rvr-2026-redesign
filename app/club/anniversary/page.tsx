import type { Metadata } from "next";
import Header from "@/components/Header";
import KitCompetition from "@/components/KitCompetition";

export const metadata: Metadata = {
  title: "40th Anniversary Kit Design | Rivervalley Rangers AFC",
  description:
    "Design the official Rivervalley Rangers AFC 40th anniversary shirt. Download the template, submit your entry, and vote for your favourite.",
};

export default function AnniversaryPage() {
  return (
    <div className="min-h-screen bg-brand-cream text-brand-charcoal">
      <Header />
      <main>
        <KitCompetition />
      </main>
    </div>
  );
}
