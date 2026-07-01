import type { Metadata } from "next";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Open Training Trials | Rivervalley Rangers AFC",
  description:
    "Register your interest for Rivervalley Rangers AFC open training sessions. All ages welcome — complete the form to secure your place.",
};

const GOOGLE_FORM_URL =
  "https://docs.google.com/forms/d/1UwtC7hNz3_sgn5IJd6i3-asmMqiD4CAIjA0-RciycAo/viewform?embedded=true";

export default function TrialsPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Rivervalley Rangers AFC"
        title="Open Training"
        description="Register your interest for our open training sessions. All ages welcome — complete the form below."
        accentColor="bg-brand-neon"
      />

      <section className="bg-brand-cream px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Google Form embed — swap this iframe for the in-site form when ready */}
          <div className="w-full overflow-hidden rounded-none border-3 border-brand-charcoal shadow-brutalist bg-white">
            <iframe
              src={GOOGLE_FORM_URL}
              title="Open Training Registration"
              width="100%"
              height="900"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="block w-full"
            >
              Loading form…
            </iframe>
          </div>

          {/* Fallback direct link */}
          <p className="mt-4 text-center text-xs text-brand-charcoal/40">
            Form not showing?{" "}
            <a
              href="https://docs.google.com/forms/d/1UwtC7hNz3_sgn5IJd6i3-asmMqiD4CAIjA0-RciycAo/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-navy transition-colors"
            >
              Open it directly →
            </a>
          </p>

          <p className="mt-6 text-center text-xs text-brand-charcoal/40">
            Already a registered club member?{" "}
            <Link href="/register" className="underline hover:text-brand-navy transition-colors">
              Use the main registration form
            </Link>
          </p>
        </div>
      </section>
    </PublicPageShell>
  );
}
