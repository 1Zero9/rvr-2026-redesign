import type { Metadata } from 'next';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import PublicEnquiryForm from '@/components/forms/PublicEnquiryForm';

export const metadata: Metadata = {
  title: 'Walking Football',
  description: 'Walking Football at Rivervalley Rangers AFC — open to all adults. No running required. Stay active, social, and connected to the game in Swords, Dublin.',
};

const BENEFITS = [
  {
    icon: '🫀',
    title: 'Heart Health',
    body: 'Low-intensity aerobic exercise that improves cardiovascular fitness without putting stress on joints.',
  },
  {
    icon: '🦵',
    title: 'Easy on the Joints',
    body: 'No running, no jumping, no slide tackles — walking pace means knees, hips, and ankles stay comfortable.',
  },
  {
    icon: '🤝',
    title: 'Social & Connected',
    body: 'Meet people from across Swords and the wider Fingal area. Tea and chat after every session.',
  },
  {
    icon: '⚽',
    title: 'Still Football',
    body: 'Real tactics, real goals, real competition — just at a pace that works for you. All abilities welcome.',
  },
];

const RULES = [
  'No running — walking pace only at all times',
  'No physical contact or slide tackles',
  'No heading the ball',
  'Smaller pitches, smaller teams (typically 6-a-side)',
  'Adapted offside rule — more freedom to play',
  'Players over 55 welcome; no upper age limit',
];

export default function WalkingFootballPage() {
  return (
    <PublicPageShell>
      <PageHeroNavy
        backHref="/football-for-all"
        backLabel="Football For All"
        title="Walking Football"
        description="Football for everyone, at any pace. Stay active, make friends, and enjoy the beautiful game — no running required."
        links={
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="border border-brand-sky/30 bg-white/10 p-4">
              <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">Venue</p>
              <p className="text-brand-cream text-sm font-semibold">Rivervalley Astro, Swords</p>
            </div>
            <div className="border border-brand-sky/30 bg-white/10 p-4">
              <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">Sessions</p>
              <p className="text-brand-cream text-sm font-semibold">Every Monday night, 8–9pm</p>
            </div>
            <div className="border border-brand-sky/30 bg-white/10 p-4">
              <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">Cost</p>
              <p className="text-brand-cream text-sm font-semibold">€5 per week</p>
            </div>
            <div className="border border-brand-sky/30 bg-white/10 p-4">
              <p className="text-brand-neon font-display font-black text-xs uppercase tracking-widest mb-1">Open to</p>
              <p className="text-brand-cream text-sm font-semibold">All adults · All abilities</p>
            </div>
          </div>
        }
      />

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-3xl px-4 py-10 space-y-10">

          {/* What is Walking Football */}
          <section className="bg-white rounded-2xl border-2 border-brand-navy p-6 sm:p-8">
            <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy mb-4">
              What is Walking Football?
            </h2>
            <div className="space-y-3 text-sm font-semibold text-zinc-700 leading-relaxed">
              <p>
                Walking Football is one of the fastest growing sports in Ireland — and for good reason. It&apos;s the real game, played at walking pace, designed specifically for adults who want to stay active without the physical demands of traditional football.
              </p>
              <p>
                At Rivervalley Rangers AFC we run walking football sessions open to all adults, whether you played the game for decades or haven&apos;t kicked a ball since school. Our coaches create a welcoming, sociable environment where everyone can enjoy the sport.
              </p>
              <p>
                Sessions are led by FAI-qualified coaches and are covered by the club&apos;s full insurance and Garda Vetting policy. All participants are welcome — men and women, all fitness levels, all backgrounds.
              </p>
            </div>
          </section>

          {/* Benefits grid */}
          <section>
            <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy border-l-4 border-brand-green pl-3 mb-5">
              Why Walking Football?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="bg-white rounded-2xl border-2 border-brand-navy p-5 flex gap-4"
                >
                  <span className="text-3xl shrink-0 select-none" aria-hidden="true">{b.icon}</span>
                  <div>
                    <h3 className="font-display font-black uppercase text-brand-navy text-sm mb-1">{b.title}</h3>
                    <p className="text-xs font-semibold text-zinc-600 leading-relaxed">{b.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Rules / how it works */}
          <section className="bg-brand-navy rounded-2xl p-6 sm:p-8">
            <h2 className="font-display font-black italic text-2xl uppercase text-brand-neon mb-5">
              How It Works
            </h2>
            <ul className="space-y-3">
              {RULES.map((rule) => (
                <li key={rule} className="flex items-start gap-3 text-sm font-semibold text-brand-sky">
                  <span className="text-brand-neon font-black mt-0.5 shrink-0">✓</span>
                  {rule}
                </li>
              ))}
            </ul>
          </section>

          {/* Enquiry form */}
          <section>
            <h2 className="font-display font-black italic text-2xl uppercase text-brand-navy border-l-4 border-brand-green pl-3 mb-5">
              Get in Touch
            </h2>
            <PublicEnquiryForm
              type="WALKING_FOOTBALL_INTEREST"
              title="Express Interest"
              description="Interested in joining our Walking Football sessions? Drop us a note and we'll be in touch with session times and next steps."
              detailsLabel="Tell us a little about yourself (optional)"
              detailsPlaceholder="e.g. Previous football experience, any mobility considerations, best time to call…"
              submitLabel="Send Enquiry"
              successMessage="Thanks for getting in touch! A member of the Walking Football team will contact you shortly with session details."
            />
          </section>

      </div>
    </PublicPageShell>
  );
}
