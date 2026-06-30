'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';
import { registerPlayer, type PlayerGender } from '@/app/actions/registerPlayer';
import TurnstileWidget from '@/components/TurnstileWidget';

const CURRENT_YEAR = new Date().getFullYear();

function inferAgeGroup(raw: string): string | null {
  if (raw.length !== 4) return null;
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < CURRENT_YEAR - 80 || n > CURRENT_YEAR - 4) return null;
  const age = CURRENT_YEAR - n;
  return age <= 18 ? `U${age}` : 'Senior';
}

interface FormState {
  firstName:   string;
  lastName:    string;
  yearOfBirth: string;
  gender:      PlayerGender | '';
  parentName:  string;
  email:       string;
  phone:       string;
  notes:       string;
  gdprConsent: boolean;
}

const BLANK: FormState = {
  firstName: '', lastName: '', yearOfBirth: '', gender: '',
  parentName: '', email: '', phone: '', notes: '', gdprConsent: false,
};

const inputClass =
  'w-full px-4 py-3 rounded-xl border-2 border-brand-navy bg-white text-brand-charcoal font-sans text-base font-semibold placeholder:text-zinc-400 outline-none focus:ring-4 focus:ring-brand-neon transition-colors';

const labelClass = 'block text-xs font-black text-brand-navy uppercase tracking-wide mb-1.5 font-display';

export default function PlayerRecruitmentWizard() {
  const [form, setForm]                   = useState<FormState>(BLANK);
  const [submitted, setSubmitted]         = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [error, setError]                 = useState<string | null>(null);
  const [isPending, startTransition]      = useTransition();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  function set<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function isValid() {
    return (
      form.firstName.trim().length >= 2 &&
      form.lastName.trim().length >= 2 &&
      inferAgeGroup(form.yearOfBirth) !== null &&
      form.gender !== '' &&
      form.parentName.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
      form.phone.trim().length >= 7 &&
      form.gdprConsent
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid() || isPending) return;
    setError(null);
    startTransition(async () => {
      const result = await registerPlayer({
        firstName:      form.firstName,
        lastName:       form.lastName,
        yearOfBirth:    parseInt(form.yearOfBirth, 10),
        gender:         form.gender as PlayerGender,
        parentName:     form.parentName,
        parentEmail:    form.email,
        parentPhone:    form.phone,
        notes:          form.notes,
        gdprConsent:    form.gdprConsent,
        turnstileToken: turnstileToken ?? '',
      });
      if (result.ok) { setSubmittedName(result.firstName); setSubmitted(true); }
      else setError(result.error);
    });
  }

  const ageHint = inferAgeGroup(form.yearOfBirth);

  // ── Success ───────────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <section className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="rounded-2xl border-2 border-brand-navy bg-white p-10">
          <CheckCircle2 className="w-10 h-10 text-brand-green mx-auto mb-4" />
          <h2 className="font-display font-black text-3xl uppercase text-brand-navy mb-3">
            Thanks, {submittedName}!
          </h2>
          <p className="text-sm font-semibold text-zinc-600 leading-relaxed max-w-sm mx-auto mb-8">
            We&apos;ve got your details. A club coordinator will be in touch
            within two working days to discuss the next steps.
          </p>
          <button
            type="button"
            onClick={() => { setForm(BLANK); setSubmitted(false); setError(null); }}
            className="btn-brutalist-neon px-6 py-3 text-xs"
          >
            Register Another Player
          </button>
        </div>
      </section>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────

  return (
    <section className="max-w-xl mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} noValidate className="rounded-2xl border-2 border-brand-navy bg-white p-6 sm:p-8">

        {/* ── Player ──────────────────────────────────────────────── */}
        <p className="font-display font-black text-xs uppercase tracking-widest text-brand-neon mb-1">
          Step 1
        </p>
        <h2 className="font-display font-black text-3xl uppercase text-brand-navy mb-6">
          About the Player
        </h2>

        <div className="grid gap-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className={labelClass}>First Name</label>
              <input
                type="text" id="firstName"
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
                autoComplete="given-name"
                placeholder="First name"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="lastName" className={labelClass}>Last Name</label>
              <input
                type="text" id="lastName"
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
                autoComplete="family-name"
                placeholder="Last name"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="yearOfBirth" className={labelClass}>Year of Birth</label>
            <div className="flex items-center gap-3">
              <input
                type="text" id="yearOfBirth"
                inputMode="numeric" maxLength={4}
                value={form.yearOfBirth}
                onChange={(e) => set('yearOfBirth', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 2015"
                className="px-4 py-3 rounded-xl border-2 border-brand-navy bg-white font-sans text-base font-semibold placeholder:text-zinc-400 outline-none focus:ring-4 focus:ring-brand-neon transition-colors w-32"
              />
              {ageHint && (
                <span className="font-display font-black text-xs uppercase px-3 py-1.5 bg-brand-navy text-white tracking-wide rounded-full">
                  {ageHint}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className={labelClass}>Section</p>
            <div className="grid grid-cols-2 gap-3">
              {(['MALE', 'FEMALE'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('gender', g)}
                  className={`py-3 rounded-xl border-2 font-display font-black text-sm uppercase tracking-wide transition-all ${
                    form.gender === g
                      ? 'bg-brand-navy border-brand-navy text-white shadow-[3px_3px_0_#85E320]'
                      : 'border-brand-navy text-brand-navy hover:bg-brand-navy/5 bg-white'
                  }`}
                >
                  {g === 'MALE' ? '⚽ Boys' : '⚽ Girls'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="my-8 h-px bg-zinc-100" />

        {/* ── Parent ──────────────────────────────────────────────── */}
        <p className="font-display font-black text-xs uppercase tracking-widest text-brand-neon mb-1">
          Step 2
        </p>
        <h2 className="font-display font-black text-3xl uppercase text-brand-navy mb-6">
          Parent / Guardian
        </h2>

        <div className="grid gap-5">
          <div>
            <label htmlFor="parentName" className={labelClass}>Full Name</label>
            <input
              type="text" id="parentName"
              value={form.parentName}
              onChange={(e) => set('parentName', e.target.value)}
              autoComplete="name"
              placeholder="Parent or guardian name"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="email" className={labelClass}>Email</label>
              <input
                type="email" id="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                autoComplete="email"
                placeholder="name@example.com"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <input
                type="tel" id="phone"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                autoComplete="tel"
                placeholder="087 123 4567"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className={labelClass}>
              Anything else?{' '}
              <span className="text-zinc-400 normal-case font-sans font-normal tracking-normal">optional</span>
            </label>
            <textarea
              id="notes" rows={4}
              value={form.notes}
              onChange={(e) => set('notes', e.target.value)}
              placeholder="Previous club, preferred training nights, any questions…"
              className="w-full px-4 py-3 rounded-xl border-2 border-brand-navy bg-white font-sans text-base font-semibold placeholder:text-zinc-400 outline-none focus:ring-4 focus:ring-brand-neon transition-colors resize-none"
            />
          </div>
        </div>

        <div className="my-8 h-px bg-zinc-100" />

        {/* ── Consent + submit ────────────────────────────────────── */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.gdprConsent}
            onChange={(e) => set('gdprConsent', e.target.checked)}
            className="mt-0.5 w-5 h-5 rounded accent-brand-neon shrink-0"
          />
          <span className="text-xs text-zinc-500 leading-relaxed font-semibold">
            I consent to Rivervalley Rangers AFC storing these details to
            process this expression of interest, and to the use of match day
            and training photographs on club channels.
          </span>
        </label>

        {error && (
          <div className="mt-4 flex items-start gap-3 rounded-xl border-2 border-red-200 bg-red-50 p-4">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs font-semibold text-red-700">{error}</p>
          </div>
        )}

        <TurnstileWidget onToken={setTurnstileToken} action="player-registration" />

        <button
          type="submit"
          disabled={!isValid() || isPending}
          className="btn-brutalist-neon mt-6 w-full inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
            : <><Send className="w-4 h-4" /> Submit Expression of Interest</>
          }
        </button>

        <p className="mt-4 text-center text-xs text-zinc-400 font-semibold">
          A club coordinator will follow up within two working days.
        </p>

      </form>
    </section>
  );
}
