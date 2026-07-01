import type { Metadata } from "next";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import JoinPathSelector from "@/components/JoinPathSelector";

export const metadata: Metadata = {
  title: "Join Rivervalley Rangers AFC",
  description:
    "Register a player with Rivervalley Rangers AFC or sign up for an open training trial. All ages and abilities welcome in Swords, Co. Dublin.",
};

export default function RegisterPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Rivervalley Rangers AFC"
        title="Get Involved"
        description="Whether you're brand new or ready to sign up — choose your path below."
      />
      <JoinPathSelector />
    </PublicPageShell>
  );
}
