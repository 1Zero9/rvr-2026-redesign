'use client';

import { useState } from 'react';
import { UserPlus, ClipboardList } from 'lucide-react';
import PlayerRecruitmentWizard from '@/components/PlayerRecruitmentWizard';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/1UwtC7hNz3_sgn5IJd6i3-asmMqiD4CAIjA0-RciycAo/viewform?embedded=true';
const GOOGLE_FORM_DIRECT =
  'https://docs.google.com/forms/d/1UwtC7hNz3_sgn5IJd6i3-asmMqiD4CAIjA0-RciycAo/viewform';

type Path = 'trial' | 'join';

export default function JoinPathSelector() {
  const [path, setPath] = useState<Path | null>(null);

  return (
    <div className="bg-brand-cream">

      {/* Emotional intro */}
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-2 text-center">
        <p className="font-display font-black italic text-2xl md:text-3xl uppercase text-brand-charcoal leading-tight mb-3">
          The friendships start here.
        </p>
        <p className="text-brand-charcoal/55 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
          Never kicked a ball before? Coming back after a break? Ready to transfer from another club?
          Whatever your story — we&apos;ll find the right team for you.
        </p>
      </section>

      {/* Choice cards */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">

          {/* Join — primary action */}
          <button
            type="button"
            onClick={() => setPath('join')}
            className={`group flex flex-col items-center text-center p-6 border-3 transition-all shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none order-first ${
              path === 'join'
                ? 'bg-brand-navy border-brand-charcoal'
                : 'bg-brand-navy border-brand-charcoal hover:bg-brand-charcoal'
            }`}
          >
            <span className="mb-2 inline-flex items-center px-2 py-0.5 rounded-full bg-brand-neon/20 border border-brand-neon/40 font-display font-black text-[9px] uppercase tracking-widest text-brand-neon">
              Most popular
            </span>
            <ClipboardList
              className="w-8 h-8 mb-3 text-brand-neon"
              aria-hidden="true"
            />
            <h2 className="font-display font-black italic text-xl uppercase leading-tight mb-2 text-white">
              Join the Club
            </h2>
            <p className="text-sm leading-relaxed text-brand-sky/80">
              Already trialled or ready to register? Complete the membership form to join Rivervalley Rangers.
            </p>
          </button>

          {/* Trial — secondary action */}
          <button
            type="button"
            onClick={() => setPath('trial')}
            className={`group flex flex-col items-center text-center p-6 border-2 transition-all ${
              path === 'trial'
                ? 'bg-brand-navy border-brand-navy'
                : 'bg-white border-brand-navy/25 hover:border-brand-navy/60 hover:bg-brand-navy/3'
            }`}
          >
            <UserPlus
              className={`w-8 h-8 mb-3 transition-colors ${
                path === 'trial' ? 'text-brand-neon' : 'text-brand-navy/60 group-hover:text-brand-navy'
              }`}
              aria-hidden="true"
            />
            <h2 className={`font-display font-black italic text-xl uppercase leading-tight mb-2 transition-colors ${
              path === 'trial' ? 'text-brand-neon' : 'text-brand-navy/70 group-hover:text-brand-navy'
            }`}>
              Interested in a Trial
            </h2>
            <p className={`text-sm leading-relaxed transition-colors ${
              path === 'trial' ? 'text-brand-sky' : 'text-zinc-400 group-hover:text-zinc-600'
            }`}>
              New to RVR? Register for an open training session and we&apos;ll find the right team for you.
            </p>
          </button>

        </div>
      </section>

      {/* Trial section */}
      {path === 'trial' && (
        <section className="border-t-3 border-brand-neon bg-brand-cream px-4 pb-12">
          <div className="max-w-2xl mx-auto pt-8">

            {/* Mobile: open directly — iframe scrolling is unreliable on mobile */}
            <div className="sm:hidden flex flex-col items-center gap-4 py-8 border-3 border-brand-charcoal shadow-brutalist bg-white px-6 text-center">
              <UserPlus className="w-10 h-10 text-brand-navy" aria-hidden="true" />
              <p className="font-display font-black italic text-lg uppercase text-brand-navy leading-tight">
                Open Training Registration
              </p>
              <p className="text-sm text-zinc-500">
                Tap below to open the form — it works best in your browser on mobile.
              </p>
              <a
                href={GOOGLE_FORM_DIRECT}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center min-h-[48px] px-6 bg-brand-navy text-brand-neon font-display font-black italic uppercase text-sm border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Open Form →
              </a>
            </div>

            {/* Desktop: embedded iframe */}
            <div className="hidden sm:block w-full overflow-hidden border-3 border-brand-charcoal shadow-brutalist bg-white">
              <iframe
                src={GOOGLE_FORM_URL}
                title="Open Training Registration"
                width="100%"
                height="900"
                frameBorder="0"
                className="block w-full"
              >
                Loading form…
              </iframe>
            </div>

            <p className="mt-4 text-center text-xs text-brand-charcoal/40">
              Form not showing?{' '}
              <a
                href={GOOGLE_FORM_DIRECT}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-brand-navy transition-colors"
              >
                Open it directly →
              </a>
            </p>
          </div>
        </section>
      )}

      {/* Join section */}
      {path === 'join' && (
        <section className="border-t-3 border-brand-neon">
          <PlayerRecruitmentWizard />
        </section>
      )}

    </div>
  );
}
