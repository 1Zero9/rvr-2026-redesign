'use client';

import React, { useState, useTransition } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  User,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { registerPlayer } from '@/app/actions/registerPlayer';
import type { PlayerPosition } from '@/app/actions/registerPlayer';

// ---------------------------------------------------------------------------
// Step-scoped types
// ---------------------------------------------------------------------------

interface Step1State {
  firstName: string;
  lastName: string;
  yearOfBirth: string;
  position: PlayerPosition | '';
}

interface Step2State {
  parentName: string;
  email: string;
  phone: string;
}

interface Step3State {
  gdprConsent: boolean;
}

type WizardData = Step1State & Step2State & Step3State;

type SubmitStatus = 'idle' | 'success' | 'error';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const POSITIONS: PlayerPosition[] = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

const CURRENT_YEAR = new Date().getFullYear();

function parseYear(raw: string): number | null {
  if (raw.length !== 4) return null;
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < CURRENT_YEAR - 80 || n > CURRENT_YEAR - 4) return null;
  return n;
}

function inferAgeGroup(raw: string): string | null {
  const yob = parseYear(raw);
  if (yob === null) return null;
  const age = CURRENT_YEAR - yob;
  if (age <= 18) return `U${age}`;
  return 'Senior';
}

const BLANK: WizardData = {
  firstName: '',
  lastName: '',
  yearOfBirth: '',
  position: '',
  parentName: '',
  email: '',
  phone: '',
  gdprConsent: false,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlayerRecruitmentWizard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<WizardData>(BLANK);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof WizardData>(field: K, value: WizardData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function resetWizard() {
    setStep(1);
    setFormData(BLANK);
    setSubmitStatus('idle');
    setErrorMessage(null);
  }

  function isStepValid(): boolean {
    if (step === 1) {
      return (
        formData.firstName.trim().length >= 2 &&
        formData.lastName.trim().length >= 2 &&
        parseYear(formData.yearOfBirth) !== null &&
        formData.position !== ''
      );
    }
    if (step === 2) {
      return (
        formData.parentName.trim().length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) &&
        formData.phone.trim().length >= 7
      );
    }
    if (step === 3) {
      return formData.gdprConsent;
    }
    return false;
  }

  function handleNext() {
    if (step < 3 && isStepValid()) {
      setStep((prev) => (prev + 1) as 1 | 2 | 3);
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2 | 3);
      setErrorMessage(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isStepValid() || isPending) return;

    const yearOfBirth = parseYear(formData.yearOfBirth);
    if (yearOfBirth === null) return;

    startTransition(async () => {
      const result = await registerPlayer({
        firstName: formData.firstName,
        lastName: formData.lastName,
        yearOfBirth,
        position: formData.position as PlayerPosition,
        parentName: formData.parentName,
        parentEmail: formData.email,
        gdprConsent: formData.gdprConsent,
      });

      if (result.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.error);
      }
    });
  }

  const ageGroupHint = inferAgeGroup(formData.yearOfBirth);

  // ---------------------------------------------------------------------------
  // Success screen
  // ---------------------------------------------------------------------------

  if (submitStatus === 'success') {
    return (
      <section className="max-w-2xl mx-auto px-4 py-12">
        <div className="brutalist-card bg-white p-8 border-4 border-brand-charcoal shadow-brutalist text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-brand-neon border-3 border-brand-charcoal mx-auto mb-6 shadow-[4px_4px_0_#121212]">
            <CheckCircle2 className="w-10 h-10 text-brand-charcoal" />
          </div>
          <span className="font-display font-black text-[10px] uppercase tracking-widest text-brand-green">
            Registration Received
          </span>
          <h2 className="font-display font-black text-3xl uppercase italic text-brand-charcoal mt-2 mb-3">
            Welcome, {formData.firstName}!
          </h2>
          <p className="text-sm font-semibold text-zinc-600 leading-relaxed max-w-sm mx-auto mb-8">
            Your registration has been submitted to Rivervalley Rangers AFC.
            A member of the club team will be in touch within two working days.
          </p>
          <button
            type="button"
            onClick={resetWizard}
            className="btn-brutalist-neon px-6 py-3 text-xs"
          >
            Register Another Player
          </button>
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // Wizard
  // ---------------------------------------------------------------------------

  return (
    <section className="max-w-2xl mx-auto px-4 py-12 select-none">
      <div className="brutalist-card bg-white p-6 md:p-8 shadow-brutalist border-4 border-brand-charcoal">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b-2 border-brand-charcoal pb-4">
          <span className="font-display font-black text-sm uppercase italic text-brand-green">
            Player Registration
          </span>
          <span className="font-display font-black text-xs bg-brand-neon border-2 border-brand-charcoal px-3 py-1 rounded-full text-brand-charcoal">
            Step {step} of 3
          </span>
        </div>

        {/* Step progress bar */}
        <div className="flex gap-2 mb-8">
          {([1, 2, 3] as const).map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                n <= step ? 'bg-brand-green' : 'bg-zinc-200'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* STEP 1 — Player Profile */}
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                1. Player Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => set('firstName', e.target.value)}
                    className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="Enter first name"
                    autoComplete="given-name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => set('lastName', e.target.value)}
                    className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="Enter last name"
                    autoComplete="family-name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="yearOfBirth" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">
                  Year of Birth
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    id="yearOfBirth"
                    inputMode="numeric"
                    maxLength={4}
                    value={formData.yearOfBirth}
                    onChange={(e) => set('yearOfBirth', e.target.value.replace(/\D/g, ''))}
                    className="p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm w-32"
                    placeholder="e.g. 2016"
                  />
                  {ageGroupHint && (
                    <span className="font-display font-black text-xs uppercase px-3 py-1.5 rounded-full border-2 border-brand-green bg-[#E8F4F0] text-brand-green tracking-wide">
                      {ageGroupHint}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-display font-bold text-xs uppercase tracking-wide mb-2">
                  Preferred Position
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {POSITIONS.map((pos) => {
                    const selected = formData.position === pos;
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => set('position', pos)}
                        className={`p-3 text-left border-3 rounded-xl font-display font-black text-xs uppercase transition-all flex items-center justify-between ${
                          selected
                            ? 'bg-[#E8F4F0] border-brand-green text-brand-green shadow-[2px_2px_0px_0px_#121212]'
                            : 'border-zinc-200 hover:border-brand-charcoal text-zinc-600 bg-zinc-50'
                        }`}
                      >
                        <span>{pos}</span>
                        {selected && <Check className="w-4 h-4 text-brand-green" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 — Parent / Guardian Contact */}
          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                2. Parent / Guardian Details
              </h3>

              <div>
                <label htmlFor="parentName" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">
                  Parent / Guardian Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="parentName"
                    value={formData.parentName}
                    onChange={(e) => set('parentName', e.target.value)}
                    className="w-full p-3 pl-10 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="Enter full name"
                    autoComplete="name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => set('email', e.target.value)}
                    className="w-full p-3 pl-10 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="name@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block font-display font-bold text-xs uppercase tracking-wide mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className="w-full p-3 pl-10 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold text-sm"
                    placeholder="e.g. 087 123 4567"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Club Benefits & Consent */}
          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                3. Club Benefits &amp; Guardian Consent
              </h3>

              <div className="p-4 bg-[#E8F4F0] border-2 border-brand-green/30 rounded-2xl space-y-3">
                <span className="font-display font-black text-[10px] text-brand-green uppercase tracking-wider block">
                  Club Membership Benefits
                </span>
                <div className="space-y-2 text-xs font-semibold text-brand-charcoal">
                  {[
                    'Access to full-size floodlit Astro pitch facility.',
                    'Accredited FAI Club Mark charter structure.',
                    'Training delivered by qualified UEFA / FAI coaches.',
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-3 border-brand-charcoal rounded-2xl bg-white space-y-3 shadow-[3px_3px_0px_0px_#121212]">
                <h4 className="font-display font-black text-sm uppercase italic text-brand-charcoal">
                  GDPR Digital Media Consent
                </h4>
                <p className="font-sans text-xs text-zinc-600 leading-relaxed font-semibold">
                  I consent to the club using training and match day photographs containing my child on club
                  social media channels and training brochures.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="gdprConsent"
                    checked={formData.gdprConsent}
                    onChange={(e) => set('gdprConsent', e.target.checked)}
                    className="w-5 h-5 border-3 border-brand-charcoal rounded cursor-pointer accent-brand-neon focus:ring-2 focus:ring-brand-neon"
                  />
                  <label
                    htmlFor="gdprConsent"
                    className="font-display font-bold text-xs uppercase tracking-wider text-brand-charcoal cursor-pointer"
                  >
                    I agree to the GDPR consent terms
                  </label>
                </div>
              </div>

              {/* Server-side error display */}
              {submitStatus === 'error' && errorMessage && (
                <div className="flex items-start gap-3 rounded-xl border-3 border-red-400 bg-red-50 p-4">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-700">{errorMessage}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation controls */}
          <div className="flex items-center justify-between border-t-2 border-brand-charcoal pt-6 mt-6 gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="px-5 py-3 text-xs uppercase font-display font-black border-3 border-brand-charcoal rounded-xl shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none hover:bg-zinc-50 transition-all flex items-center gap-1.5 focus:ring-4 focus:ring-brand-green focus:outline-none disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid()}
                className="px-6 py-3.5 text-xs uppercase font-display font-black border-3 border-brand-charcoal bg-brand-neon text-brand-charcoal rounded-xl shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all flex items-center gap-1.5 focus:ring-4 focus:ring-brand-green focus:outline-none"
              >
                Next Step
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid() || isPending}
                className="px-6 py-3.5 text-xs uppercase font-display font-black border-3 border-brand-charcoal bg-brand-neon text-brand-charcoal rounded-xl shadow-[3px_3px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none transition-all flex items-center gap-1.5 focus:ring-4 focus:ring-brand-green focus:outline-none"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Registration
                    <Check className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </section>
  );
}
