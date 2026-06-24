'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { registerPlayer, type PlayerGender } from '@/app/actions/registerPlayer';

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
  'w-full px-4 py-3 rounded-xl border-2 border-zinc-200 bg-white text-brand-charcoal font-sans text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 transition-colors';

export default function PlayerRecruitmentWizard() {
  const [form, setForm]                   = useState<FormState>(BLANK);
  const [submitted, setSubmitted]         = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [error, setError]                 = useState<string | null>(null);
  const [isPending, startTransition]      = useTransition();

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
        firstName:   form.firstName,
        lastName:    form.lastName,
        yearOfBirth: parseInt(form.yearOfBirth, 10),
        gender:      form.gender as PlayerGender,
        parentName:  form.parentName,
        parentEmail: form.email,
        parentPhone: form.phone,
        notes:       form.notes,
        gdprConsent: form.gdprConsent,
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
        <div className="bg-white border-t-4 border-brand-neon shadow-brutalist p-10">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-brand-neon border-3 border-brand-charcoal mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-brand-charcoal" />
          </div>
          <p className="font-display font-black text-xs uppercase tracking-widest text-brand-green mb-2">
            Expression of Interest Received
          </p>
          <h2 className="font-display font-black text-3xl uppercase italic text-brand-charcoal mb-3">
            Thanks, {submittedName}!
          </h2>
          <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto mb-8">
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
      <form onSubmit={handleSubmit} noValidate className="bg-white shadow-brutalist border-t-4 border-brand-neon">

        {/* ── Player ──────────────────────────────────────────────── */}
        <div className="px-6 pt-8 pb-6 md:px-8">
          <p className="font-display font-black text-xs uppercase tracking-widest text-brand-neon mb-1">
            Step 1
          </p>
          <h2 className="font-display font-black italic text-2xl text-brand-charcoal mb-6">
            About the Player
          </h2>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label htmlFor="firstName" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">
                First Name
              </label>
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
              <label htmlFor="lastName" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">
                Last Name
              </label>
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

          <div className="mb-4">
            <label htmlFor="yearOfBirth" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">
              Year of Birth
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text" id="yearOfBirth"
                inputMode="numeric" maxLength={4}
                value={form.yearOfBirth}
                onChange={(e) => set('yearOfBirth', e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 2015"
                className="px-4 py-3 rounded-xl border-2 border-zinc-200 bg-white font-sans text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 transition-colors w-32"
              />
              {ageHint && (
                <span className="font-display font-black text-xs uppercase px-3 py-1.5 bg-brand-navy text-white tracking-wide rounded-full">
                  {ageHint}
                </span>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">Section</p>
            <div className="grid grid-cols-2 gap-3">
              {(['MALE', 'FEMALE'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('gender', g)}
                  className={`py-3 rounded-xl border-2 font-display font-black text-sm uppercase tracking-wide transition-all ${
                    form.gender === g
                      ? 'bg-brand-navy border-brand-navy text-white shadow-[3px_3px_0_#85E320]'
                      : 'border-zinc-200 text-zinc-400 hover:border-zinc-400 hover:text-zinc-600 bg-white'
                  }`}
                >
                  {g === 'MALE' ? '⚽ Boys' : '⚽ Girls'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-6 md:mx-8 h-px bg-zinc-100" />

        {/* ── Parent ──────────────────────────────────────────────── */}
        <div className="px-6 py-6 md:px-8">
          <p className="font-display font-black text-xs uppercase tracking-widest text-brand-neon mb-1">
            Step 2
          </p>
          <h2 className="font-display font-black italic text-2xl text-brand-charcoal mb-6">
            Parent / Guardian
          </h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="parentName" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
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
                <label htmlFor="email" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">
                  Email
                </label>
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
                <label htmlFor="phone" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">
                  Phone
                </label>
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
              <label htmlFor="notes" className="block text-xs font-bold text-zinc-500 uppercase tracking-wide mb-1.5">
                Anything else?{' '}
                <span className="text-zinc-400 normal-case font-normal tracking-normal">optional</span>
              </label>
              <textarea
                id="notes" rows={3}
                value={form.notes}
                onChange={(e) => set('notes', e.target.value)}
                placeholder="Previous club, preferred training nights, any questions…"
                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 bg-white font-sans text-sm font-medium placeholder:text-zinc-400 focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        <div className="mx-6 md:mx-8 h-px bg-zinc-100" />

        {/* ── Consent + submit ────────────────────────────────────── */}
        <div className="px-6 py-6 md:px-8">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.gdprConsent}
              onChange={(e) => set('gdprConsent', e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded accent-brand-neon shrink-0"
            />
            <span className="text-xs text-zinc-500 leading-relaxed">
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

          <button
            type="submit"
            disabled={!isValid() || isPending}
            className="mt-6 w-full py-4 font-display font-black text-sm uppercase tracking-wide bg-brand-neon text-brand-charcoal border-3 border-brand-charcoal shadow-brutalist hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center gap-2 min-h-[44px]"
          >
            {isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              : 'Submit Expression of Interest →'
            }
          </button>

          <p className="mt-4 text-center text-xs text-zinc-400">
            A club coordinator will follow up within two working days.
          </p>
        </div>

      </form>
    </section>
  );
}
