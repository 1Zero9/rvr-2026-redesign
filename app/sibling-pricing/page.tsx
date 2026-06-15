import Header from "@/components/Header";
import SiblingRosterPricingSelector from "@/components/membership/SiblingRosterPricingSelector";

export default function SiblingPricingPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <main>
        <SiblingRosterPricingSelector />
      </main>
    </div>
  );
}
