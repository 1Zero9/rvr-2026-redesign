'use client';

import { useState } from 'react';
import TurnstileWidget from '@/components/TurnstileWidget';

const FIELD = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';
const LABEL = 'block text-sm font-bold text-brand-charcoal mb-1';

export default function RefInterestForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'submitting') return;
    const form = event.currentTarget;
    const data = new FormData(form);
    setState('submitting');
    setMessage('');

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'JMO_INTEREST',
          name: data.get('fullname'),
          email: data.get('email'),
          phone: data.get('phone'),
          website: data.get('website'),
          turnstileToken,
          details: [
            `Age / year of birth: ${data.get('age') || 'Not supplied'}`,
            `Route: ${data.get('route') || 'Not sure yet'}`,
            `Background: ${data.get('notes') || 'Not supplied'}`,
          ].join('\n'),
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || 'Your interest could not be submitted.');
      }

      form.reset();
      setState('success');
      setMessage("Received — the club will be in touch about the next step.");
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Your interest could not be submitted.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ref-fullname" className={LABEL}>Full name *</label>
          <input id="ref-fullname" name="fullname" type="text" required minLength={2} autoComplete="name" className={FIELD} />
        </div>
        <div>
          <label htmlFor="ref-age" className={LABEL}>Age <span className="font-normal text-brand-charcoal/50">(or year of birth)</span></label>
          <input id="ref-age" name="age" type="text" inputMode="numeric" className={FIELD} />
        </div>
        <div>
          <label htmlFor="ref-email" className={LABEL}>Email *</label>
          <input id="ref-email" name="email" type="email" required autoComplete="email" className={FIELD} />
        </div>
        <div>
          <label htmlFor="ref-phone" className={LABEL}>Phone <span className="font-normal text-brand-charcoal/50">(optional)</span></label>
          <input id="ref-phone" name="phone" type="tel" autoComplete="tel" className={FIELD} />
        </div>
      </div>

      <div>
        <span className={LABEL}>Which route interests you?</span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Refereeing route">
          {['Young referee (JMO)', 'FAI Beginners Course', 'Not sure yet'].map((route) => (
            <label
              key={route}
              className="flex items-center gap-2 border-2 border-brand-charcoal/20 bg-white px-3 min-h-[44px] cursor-pointer has-[:checked]:border-brand-charcoal has-[:checked]:bg-brand-navy has-[:checked]:text-brand-cream text-sm font-bold transition-colors"
            >
              <input type="radio" name="route" value={route} className="accent-brand-neon" />
              {route}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="ref-notes" className={LABEL}>
          Anything we should know? <span className="font-normal text-brand-charcoal/50">(playing experience, availability…)</span>
        </label>
        <textarea id="ref-notes" name="notes" rows={3} className={`${FIELD} resize-y`} />
      </div>

      {/* Honeypot — real people never see or fill this */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="ref-website">Website</label>
        <input id="ref-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <TurnstileWidget onToken={setTurnstileToken} action="ref_interest" />

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full sm:w-auto bg-brand-neon text-brand-charcoal font-bold px-8 py-3 min-h-[48px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60"
      >
        {state === 'submitting' ? 'Sending…' : 'Submit My Interest'}
      </button>

      {message && (
        <p
          role={state === 'error' ? 'alert' : 'status'}
          className={`text-sm font-bold ${state === 'error' ? 'text-brand-maroon' : 'text-brand-green'}`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
