import Header from "@/components/Header";
import FunRunRegistrationWizard from "@/components/campaigns/FunRunRegistrationWizard";
import type { FunRunCampaign } from "@/types/campaigns";

const campaign: FunRunCampaign = {
  id: "rvr-colour-fun-run-2026",
  slug: "colour-fun-run-camp",
  title: "RVR Colour Fun Run Camp",
  dateLabel: "August 2026",
  locationLabel: "Ward Rivervalley Park",
  registrationFeeCents: 1500,
  targetAmountCents: 800000,
  raisedAmountCents: 326500,
  provider: "SPOTFUND",
  providerCampaignUrl: "https://www.spotfund.com/",
  merchItems: [
    {
      id: "sunglasses",
      name: "Branded sunglasses",
      description: "Green RVR frames for the colour zone and the team photo.",
      priceCents: 600,
      active: true,
    },
    {
      id: "powder-pack",
      name: "Powder packet",
      description: "Extra colour packet for the finish line celebration.",
      priceCents: 400,
      active: true,
    },
  ],
};

export default function ColourFunRunPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <main>
        <FunRunRegistrationWizard campaign={campaign} />
      </main>
    </div>
  );
}
