import Header from "@/components/Header";
import FamilyRegistrationWizard from "@/components/membership/FamilyRegistrationWizard";

export default function FamilyRegistrationPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      <Header />
      <main>
        <FamilyRegistrationWizard />
      </main>
    </div>
  );
}
