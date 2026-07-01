import type { Metadata } from "next";
import Link from "next/link";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHeroNavy from "@/components/layout/PageHeroNavy";
import { MapPin, Car, Footprints, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Pitch Locations | Rivervalley Rangers AFC",
  description:
    "Find Rivervalley Rangers AFC pitches in Swords, Co. Dublin. Ward Rivervalley Park — our home ground for training and fixtures.",
};

const pitches = [
  {
    id: "ward-rivervalley",
    name: "Ward Rivervalley Park",
    type: "Grass Pitches",
    address: ["Ward Rivervalley Park", "Swords, Co. Dublin", "D17 W2X3"],
    description:
      "Our home ground and the heart of the club. Ward Rivervalley Park hosts youth training sessions, league fixtures, and blitzes across multiple grass pitches.",
    use: ["Youth training", "League matches", "Blitzes & tournaments"],
    notes: "Parking available at the park entrance. Facilities include changing rooms on site.",
    directionsUrl: "https://maps.google.com/?q=Ward+Rivervalley+Park,+Swords,+Co.+Dublin,+D17+W2X3",
    bookingUrl: undefined as string | undefined,
    icon: Footprints,
  },
];

export default function PitchLocationsPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Rivervalley Rangers AFC"
        title="Pitch Locations"
        description="Find us in Swords, Co. Dublin — Ward Rivervalley Park is our home ground for training, fixtures, and blitzes."
      />

      <section className="bg-brand-cream">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-14 space-y-8">

          {pitches.map((pitch) => (
            <div
              key={pitch.id}
              className="bg-white border-3 border-brand-charcoal shadow-brutalist"
            >
              {/* Header bar */}
              <div className="bg-brand-navy px-6 py-4 flex items-center gap-3">
                <pitch.icon className="w-5 h-5 text-brand-neon shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-sky/70">
                    {pitch.type}
                  </p>
                  <h2 className="font-display font-black italic text-xl uppercase text-brand-cream leading-tight">
                    {pitch.name}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 grid md:grid-cols-2 gap-8">

                {/* Left: address + description */}
                <div className="space-y-5">
                  <div className="flex gap-3">
                    <MapPin className="w-4 h-4 text-brand-neon mt-0.5 shrink-0" aria-hidden="true" />
                    <address className="not-italic text-sm text-brand-charcoal font-semibold leading-relaxed">
                      {pitch.address.map((line, i) => (
                        <span key={i} className="block">{line}</span>
                      ))}
                    </address>
                  </div>

                  <p className="text-sm text-brand-charcoal/70 leading-relaxed">
                    {pitch.description}
                  </p>

                  <div className="flex gap-3">
                    <Car className="w-4 h-4 text-brand-charcoal/40 mt-0.5 shrink-0" aria-hidden="true" />
                    <p className="text-xs text-brand-charcoal/50 leading-relaxed">{pitch.notes}</p>
                  </div>
                </div>

                {/* Right: usage tags + CTAs */}
                <div className="space-y-5">
                  <div>
                    <p className="font-display font-black text-[10px] uppercase tracking-widest text-brand-charcoal/40 mb-2">
                      Used For
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {pitch.use.map((u) => (
                        <span
                          key={u}
                          className="text-[11px] font-bold uppercase tracking-wide px-3 py-1 bg-brand-neon/15 text-brand-charcoal border border-brand-neon/40"
                        >
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <a
                      href={pitch.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                    >
                      <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      Get Directions
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {/* Footer note */}
          <p className="text-center text-xs text-brand-charcoal/40">
            Questions about locations or facilities?{" "}
            <Link href="/contact" className="underline hover:text-brand-navy transition-colors">
              Contact us →
            </Link>
          </p>

        </div>
      </section>
    </PublicPageShell>
  );
}
