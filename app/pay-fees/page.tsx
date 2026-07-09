import type { Metadata } from "next";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import ClubZapCheckoutModal from "@/components/ClubZapCheckoutModal";

export const metadata: Metadata = {
  title: "Pay Membership & Fees",
  description:
    "Pay your Rivervalley Rangers AFC club membership or team fees securely through the club payment portal.",
};

export default function PayFeesPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Club payments"
        title="Membership & Fees"
        description="Pay your club membership or settle team and training fees securely through the club payment portal."
      />
      <ClubZapCheckoutModal productKeys={["membership", "fees"]} />
    </PublicPageShell>
  );
}
