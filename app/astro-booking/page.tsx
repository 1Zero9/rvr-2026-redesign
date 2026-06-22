import type { Metadata } from "next";
import { clubZapPaymentMap } from "@/config/payments";
import { CalendarDays, Clock, MapPin, PhoneCall, ShieldCheck, Zap } from "lucide-react";
import PublicPageShell from "@/components/layout/PublicPageShell";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Book Astro Pitch | Rivervalley Rangers AFC",
  description:
    "Book the Rivervalley Rangers AFC all-weather astro pitch in Swords, Dublin. Available for club training, schools, and community hire.",
};

const features = [
  { label: "Full-size all-weather surface", icon: Zap },
  { label: "Floodlit for evening sessions", icon: Clock },
  { label: "Ward Rivervalley Park, Swords", icon: MapPin },
  { label: "FAI Club Mark facility", icon: ShieldCheck },
];

const slots = [
  { day: "Monday – Friday", time: "17:00 – 21:00" },
  { day: "Saturday", time: "09:00 – 18:00" },
  { day: "Sunday", time: "10:00 – 17:00" },
];

export default function AstroBookingPage() {
  return (
    <PublicPageShell>
      <PageHero
        eyebrow={<><CalendarDays className="h-4 w-4" aria-hidden="true" /> Pitch Hire</>}
        title="Book Astro Pitch"
        description="Ward Rivervalley all-weather astro pitch for club training, school groups, and community hire."
      />

        {/* Main content */}
        <section className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2">

            {/* Facility features */}
            <div className="brutalist-card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-brand-charcoal">
                Facility Details
              </h2>
              <ul className="mt-6 space-y-4">
                {features.map(({ label, icon: Icon }) => (
                  <li key={label} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border-2 border-brand-charcoal bg-brand-neon">
                      <Icon className="h-4 w-4 text-brand-charcoal" aria-hidden="true" />
                    </span>
                    <span className="font-display text-sm font-black uppercase text-brand-charcoal">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Availability */}
            <div className="brutalist-card p-6 sm:p-8">
              <h2 className="font-display text-2xl font-black uppercase leading-tight tracking-tight text-brand-charcoal">
                Available Slots
              </h2>
              <ul className="mt-6 space-y-3">
                {slots.map((slot) => (
                  <li
                    key={slot.day}
                    className="flex items-center justify-between rounded-xl border-2 border-zinc-200 bg-brand-cream px-4 py-3"
                  >
                    <span className="font-display text-sm font-black uppercase text-brand-charcoal">
                      {slot.day}
                    </span>
                    <span className="font-mono text-xs font-bold text-zinc-600">
                      {slot.time}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs font-semibold text-zinc-500">
                Slots subject to club training schedules. Confirm availability
                before booking.
              </p>
            </div>
          </div>

          {/* Booking CTA block */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {/* Online booking */}
            <div className="rounded-2xl border-4 border-brand-charcoal bg-brand-charcoal p-6 text-white shadow-brutalist">
              <p className="font-display text-sm font-black uppercase tracking-wide text-brand-neon">
                Book Online
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-300">
                Club sessions and structured hire can be reserved through the
                club portal.
              </p>
              <a
                href={clubZapPaymentMap.camps.targetUrl}
                aria-label={clubZapPaymentMap.camps.title}
                className="btn-brutalist-neon mt-5 inline-block px-6 py-3 text-sm"
              >
                Reserve via Club Portal
              </a>
            </div>

            {/* Phone enquiry */}
            <div className="rounded-2xl border-4 border-brand-charcoal bg-white p-6 shadow-brutalist">
              <p className="font-display text-sm font-black uppercase tracking-wide text-brand-green">
                Phone Enquiry
              </p>
              <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">
                For school groups, one-off community bookings, or weekend
                availability, contact the club directly.
              </p>
              <a
                href="mailto:info@rvrafc.ie"
                className="btn-brutalist-green mt-5 inline-flex items-center gap-2 px-6 py-3 text-sm"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                Email the Club
              </a>
            </div>
          </div>
        </section>
    </PublicPageShell>
  );
}
