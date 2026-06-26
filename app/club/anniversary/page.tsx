import type { Metadata } from "next";
import PublicPageShell from "@/components/layout/PublicPageShell";
import KitCompetition from "@/components/KitCompetition";

export const metadata: Metadata = {
  title: "45th Anniversary Kit Design | Rivervalley Rangers AFC",
  description:
    "Design the official Rivervalley Rangers AFC 45th anniversary shirt. Download the template, submit your entry, and vote for your favourite.",
};

export default function AnniversaryPage() {
  return (
    <PublicPageShell>
      <KitCompetition />
    </PublicPageShell>
  );
}
