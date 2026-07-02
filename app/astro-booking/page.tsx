import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

export const metadata = {
  title: 'Book the Astro',
  description: "Book the astro pitch in Swords, Co. Dublin via SportsKey. Suitable for 5-a-side, 7-a-side, and 11-a-side formats.",
};

const CARDS = [
  {
    title: 'The Pitch',
    body: 'Full-size 3G surface. Floodlit. Suitable for 5-a-side, 7-a-side, and 11-a-side formats.',
    extra: null,
  },
  {
    title: 'Location',
    body: 'Swords, Co. Dublin. 5 minutes from Swords town centre.',
    extra: null,
  },
  {
    title: 'How to Book',
    body: 'Bookings are managed directly through the SportsKey platform. Select your date and time, pay securely online.',
    extra: null,
  },
];

export default function AstroBookingPage() {
  return (
    <PublicPageShell>

      <PageHeroNavy
        title="Book the Astro"
        description="Astro Pitch · Swords, Co. Dublin"
      />

      {/* ── 2. Info cards ────────────────────────────────────────────── */}
      <section className="bg-brand-cream px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="border-3 border-brand-navy bg-brand-cream shadow-brutalist p-6"
            >
              <h2 className="font-display font-black italic text-xl text-brand-navy border-b-3 border-brand-navy pb-2 mb-3">
                {card.title}
              </h2>
              <p className="text-brand-charcoal text-sm leading-relaxed">
                {card.body}
              </p>
              {card.extra && (
                <p className="mt-3 text-xs font-mono font-bold text-brand-charcoal/60">
                  {card.extra}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. CTA block ─────────────────────────────────────────────── */}
      <section className="bg-brand-neon border-y-3 border-brand-navy px-4 py-12 text-center">
        <p className="font-display font-black italic text-3xl md:text-4xl text-brand-navy mb-8">
          Ready to book?
        </p>
        <a
          href="https://portal.sportskey.com/venues/st-finian-s-astro"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-brand-navy text-brand-neon font-display font-black italic text-xl px-8 py-4 border-3 border-brand-navy shadow-brutalist hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-transform min-h-[44px]"
        >
          Check Availability →
        </a>
      </section>

      {/* ── 4. Notice strip ──────────────────────────────────────────── */}
      <div className="bg-brand-cream border-y-3 border-brand-navy px-4 py-4">
        <p className="text-sm text-brand-charcoal text-center">
          Booking is managed via SportsKey.
          Rivervalley Rangers AFC is not responsible for availability or payment processing.
        </p>
      </div>

    </PublicPageShell>
  );
}
