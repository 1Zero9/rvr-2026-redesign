'use client';

import { useState } from 'react';
import PlayerRecruitmentWizard from '@/components/PlayerRecruitmentWizard';

const GOOGLE_FORM_URL =
  'https://docs.google.com/forms/d/1UwtC7hNz3_sgn5IJd6i3-asmMqiD4CAIjA0-RciycAo/viewform?embedded=true';

type Path = 'trial' | 'join';

export default function JoinPathSelector() {
  const [path, setPath] = useState<Path | null>(null);

  return (
    <div className="bg-brand-cream">

      {/* Choice cards */}
      <section className="max-w-3xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Trial */}
          <button
            type="button"
            onClick={() => setPath('trial')}
            className={`group text-left p-6 border-3 transition-all shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
              path === 'trial'
                ? 'bg-brand-navy border-brand-charcoal'
                : 'bg-white border-brand-charcoal hover:bg-brand-navy'
            }`}
          >
            <span className="text-3xl mb-3 block">🏃</span>
            <h2 className={`font-display font-black italic text-xl uppercase leading-tight mb-2 transition-colors ${
              path === 'trial' ? 'text-brand-neon' : 'text-brand-navy group-hover:text-brand-neon'
            }`}>
              Interested in a Trial
            </h2>
            <p className={`text-sm leading-relaxed transition-colors ${
              path === 'trial' ? 'text-brand-sky' : 'text-zinc-500 group-hover:text-brand-sky'
            }`}>
              New to RVR? Register for an open training session and we&apos;ll find the right team for you.
            </p>
          </button>

          {/* Join */}
          <button
            type="button"
            onClick={() => setPath('join')}
            className={`group text-left p-6 border-3 transition-all shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none ${
              path === 'join'
                ? 'bg-brand-navy border-brand-charcoal'
                : 'bg-white border-brand-charcoal hover:bg-brand-navy'
            }`}
          >
            <span className="text-3xl mb-3 block">⚽</span>
            <h2 className={`font-display font-black italic text-xl uppercase leading-tight mb-2 transition-colors ${
              path === 'join' ? 'text-brand-neon' : 'text-brand-navy group-hover:text-brand-neon'
            }`}>
              Join the Club
            </h2>
            <p className={`text-sm leading-relaxed transition-colors ${
              path === 'join' ? 'text-brand-sky' : 'text-zinc-500 group-hover:text-brand-sky'
            }`}>
              Already trialled or ready to register? Complete the membership form to join Rivervalley Rangers.
            </p>
          </button>

        </div>
      </section>

      {/* Trial section */}
      {path === 'trial' && (
        <section className="border-t-3 border-brand-neon bg-brand-cream px-4 pb-12">
          <div className="max-w-2xl mx-auto pt-8">
            <div className="w-full overflow-hidden border-3 border-brand-charcoal shadow-brutalist bg-white">
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
                href="https://docs.google.com/forms/d/1UwtC7hNz3_sgn5IJd6i3-asmMqiD4CAIjA0-RciycAo/viewform"
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
