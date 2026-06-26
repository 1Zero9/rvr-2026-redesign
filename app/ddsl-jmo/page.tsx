'use client';

import React, { useState } from 'react';
import PublicPageShell from '@/components/layout/PublicPageShell';

export default function JMOPage() {
  const [submitState, setSubmitState] = useState<
    'idle' | 'submitting' | 'success' | 'error'
  >('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitState === 'submitting') return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setSubmitState('submitting');
    setSubmitMessage('');

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
          details: [
            `Date of birth: ${data.get('dob') || 'Not supplied'}`,
            `Background: ${data.get('notes') || 'Not supplied'}`,
          ].join('\n'),
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || 'The application could not be submitted.');
      }

      form.reset();
      setSubmitState('success');
      setSubmitMessage('Your JMO interest form has been received by the club team.');
    } catch (error) {
      setSubmitState('error');
      setSubmitMessage(
        error instanceof Error ? error.message : 'The application could not be submitted.',
      );
    }
  }

  return (
    <PublicPageShell>
      <main className="flex-grow bg-brand-cream text-brand-charcoal">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-[#FAF8F5] py-16 md:py-24 border-b-4 border-brand-charcoal">
          {/* Background Cute-alism grid mesh and dots */}
          <div className="absolute inset-0 z-0 opacity-40 bg-[radial-gradient(#121212_1.5px,transparent_1.5px)] bg-[size:24px_24px]"></div>
          
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Hero Left: Headlines & Action Buttons */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Special program tag */}
              <div className="inline-flex items-center gap-2 bg-brand-ddsl text-white font-display font-black text-xs px-4 py-2 rounded-xl border-3 border-brand-charcoal shadow-[3px_3px_0px_0px_#121212] -rotate-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-brand-neon">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.195-.39.687-.39.882 0l2.4 4.883 5.385.782c.439.064.615.608.297.917l-3.9 3.801 1.222 5.384c.099.436-.356.767-.745.562L12 17.587l-4.819 2.533c-.39.205-.846-.126-.745-.562l1.223-5.384-3.9-3.801c-.318-.309-.142-.853.297-.917l5.384-.782 2.4-4.884z" />
                </svg>
                DDSL BORN TO LEAD PROGRAM
              </div>

              {/* Kinetic Big Bold Title */}
              <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl leading-tight uppercase italic tracking-tighter skew-x-[-3deg] text-brand-charcoal">
                BORN TO LEAD: <br className="hidden sm:inline" />
                <span className="text-brand-ddsl">STEP UP,</span> BLOW THE WHISTLE, & <span className="underline decoration-brand-neon decoration-wavy decoration-4">OWN THE PITCH.</span>
              </h1>

              <p className="font-sans text-lg md:text-xl font-semibold text-zinc-700 leading-relaxed max-w-xl">
                Are you 16 or older? Build confidence, learn leadership, gain elite FAI credentials, and earn extra income. Join our Junior Match Officials squad.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 sm:items-center max-w-md">
                <a href="#apply" className="btn-brutalist-neon px-8 py-4 text-center text-lg shadow-brutalist bg-brand-neon hover:bg-[#96f431] flex items-center justify-center gap-2">
                  Become a JMO
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </a>
                <a href="#parents" className="btn-brutalist-green px-8 py-4 text-center text-lg bg-brand-ddsl hover:bg-[#004f3a] text-white flex items-center justify-center gap-2">
                  Parent Info Hub
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-5 h-5 text-brand-neon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </a>
              </div>

            </div>

            {/* Hero Right: Premium Custom Whistle Artwork / Referee Placeholder */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-sm aspect-square brutalist-card bg-brand-ddsl p-8 flex flex-col justify-between overflow-hidden shadow-brutalist group">
                
                {/* Dynamic pitch outline in card background */}
                <div className="absolute inset-0 border-[3px] border-white/10 rounded-xl m-4 pointer-events-none"></div>
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 pointer-events-none"></div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-[3px] border-white/10 pointer-events-none"></div>

                {/* Starburst badge sticker */}
                <div className="absolute top-4 right-4 bg-brand-neon text-brand-charcoal font-display font-black text-[10px] px-2.5 py-1 rounded-md border-2 border-brand-charcoal uppercase tracking-wider rotate-6">
                  DDSL Approved
                </div>

                {/* Whistle Illustration */}
                <div className="flex-grow flex items-center justify-center relative z-10">
                  <svg viewBox="0 0 100 100" className="w-44 h-44 text-brand-neon drop-shadow-[4px_4px_0px_#121212] group-hover:rotate-12 transition-transform duration-300">
                    {/* Whistle mouthpiece */}
                    <path d="M70,35 L90,35 L90,55 L70,55 Z" fill="currentColor" stroke="#121212" strokeWidth="4" strokeLinejoin="miter" />
                    {/* Whistle body */}
                    <path d="M30,30 C55,30 70,35 70,55 C70,75 55,80 30,80 C15,80 10,70 10,55 C10,40 15,30 30,30 Z" fill="currentColor" stroke="#121212" strokeWidth="4" />
                    {/* Whistle loop */}
                    <circle cx="20" cy="55" r="6" fill="#FAF8F5" stroke="#121212" strokeWidth="4" />
                    {/* Sound vent */}
                    <rect x="42" y="30" width="10" height="8" rx="2" fill="#121212" />
                    {/* Referee stripes detail in whistle */}
                    <line x1="30" y1="42" x2="30" y2="68" stroke="#121212" strokeWidth="4" strokeLinecap="round" />
                    <line x1="42" y1="45" x2="42" y2="65" stroke="#121212" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </div>

                <div className="relative z-10 text-white mt-auto">
                  <p className="font-display font-black text-2xl uppercase italic tracking-tight leading-none">
                    JUNIOR MATCH
                  </p>
                  <p className="font-display font-black text-3xl uppercase italic tracking-tight text-brand-neon leading-none">
                    OFFICIALS PORTAL
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>


        {/* BENEFITS GRID SECTION */}
        <section className="py-20 max-w-6xl mx-auto px-6 border-b-4 border-brand-charcoal">
          
          <div className="text-center mb-16">
            <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tighter text-brand-charcoal">
              WHY BECOME AN RVR JUNIOR REFEREE?
            </h2>
            <div className="h-2 w-32 bg-brand-ddsl mx-auto mt-4 border-2 border-brand-charcoal -rotate-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1: Earn While You Learn */}
            <div className="brutalist-card p-8 bg-white flex flex-col justify-between min-h-[320px] hover:shadow-brutalist-neon">
              <div>
                {/* Custom SVG Icon - Money */}
                <div className="w-14 h-14 bg-brand-neon rounded-xl border-3 border-brand-charcoal flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#121212]">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand-charcoal" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <circle cx="12" cy="12" r="3" />
                    <line x1="6" y1="12" x2="6.01" y2="12" strokeLinecap="round" />
                    <line x1="18" y1="12" x2="18.01" y2="12" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="font-display font-black text-2xl uppercase italic leading-tight text-brand-charcoal mb-4">
                  Earn While You Learn
                </h3>
                <p className="font-sans text-sm font-semibold text-zinc-600 leading-relaxed">
                  Earn official FAI-approved match fees for officiating U7 to U11 league fixtures on Saturday and Sunday mornings. Consistent weekend match schedules available.
                </p>
              </div>
              <span className="font-display font-extrabold text-xs text-brand-ddsl uppercase mt-6 block">
                €20 - €35 Per Match →
              </span>
            </div>

            {/* Card 2: Complete Gear & Kit */}
            <div className="brutalist-card p-8 bg-[#E8F4F0] flex flex-col justify-between min-h-[320px] hover:shadow-brutalist-green">
              <div>
                {/* Custom SVG Icon - Shirt & Whistle */}
                <div className="w-14 h-14 bg-brand-green text-white rounded-xl border-3 border-brand-charcoal flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#121212]">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20.38 3.46L16 2a4 4 0 01-8 0L3.62 3.46a2 2 0 00-1.34 2.23l1.5 10a2 2 0 002 1.71h12.44a2 2 0 002-1.71l1.5-10a2 2 0 00-1.34-2.23z" />
                    <path d="M12 2v4" />
                    <circle cx="12" cy="14" r="2" />
                  </svg>
                </div>
                <h3 className="font-display font-black text-2xl uppercase italic leading-tight text-brand-greenDark mb-4">
                  Complete Gear Provided
                </h3>
                <p className="font-sans text-sm font-semibold text-brand-greenDark/80 leading-relaxed">
                  Every certified JMO is equipped with official FAI/DDSL referee gear: neon club match jersey, digital referee watch, record cards, and whistles.
                </p>
              </div>
              <span className="font-display font-extrabold text-xs text-brand-greenDark uppercase mt-6 block">
                100% Sponsor Covered →
              </span>
            </div>

            {/* Card 3: Full On-Field Mentorship */}
            <div className="brutalist-card p-8 bg-white flex flex-col justify-between min-h-[320px] hover:shadow-brutalist-neon">
              <div>
                {/* Custom SVG Icon - Mentor / Handshake */}
                <div className="w-14 h-14 bg-brand-neon rounded-xl border-3 border-brand-charcoal flex items-center justify-center mb-6 shadow-[3px_3px_0px_0px_#121212]">
                  <svg viewBox="0 0 24 24" className="w-8 h-8 text-brand-charcoal" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <h3 className="font-display font-black text-2xl uppercase italic leading-tight text-brand-charcoal mb-4">
                  Full On-Field Mentorship
                </h3>
                <p className="font-sans text-sm font-semibold text-zinc-600 leading-relaxed">
                  You will never stand alone. Every JMO is paired with a qualified RVR Referee Mentor who observes matches, guides rules, and guards sideline behavior.
                </p>
              </div>
              <span className="font-display font-extrabold text-xs text-brand-ddsl uppercase mt-6 block">
                RVR Mentor Assigned →
              </span>
            </div>

          </div>
        </section>


        {/* HOW IT WORKS TIMELINE */}
        <section className="py-20 bg-[#FAF8F5] border-b-4 border-brand-charcoal">
          <div className="max-w-6xl mx-auto px-6">
            
            <div className="text-center mb-16">
              <h2 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tighter text-brand-charcoal">
                THE 4-STEP PATHWAY TO JMO
              </h2>
              <div className="h-2 w-32 bg-brand-neon mx-auto mt-4 border-2 border-brand-charcoal rotate-1"></div>
            </div>

            {/* Timeline Row/Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
              
              {/* Step 1 */}
              <div className="brutalist-card p-6 bg-white relative hover:scale-102 transition-transform shadow-brutalist">
                <div className="absolute top-4 right-4 font-display font-black text-5xl text-brand-ddsl/20 select-none">
                  01
                </div>
                <h3 className="font-display font-black text-xl uppercase italic text-brand-ddsl mb-4">
                  Turn 16 Years
                </h3>
                <p className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">
                  Eligibility requirement
                </p>
                <p className="font-sans text-sm font-semibold text-zinc-600 leading-normal">
                  You must be at least 16 years old to begin refereeing under DDSL and FAI rules. Open to boys and girls.
                </p>
              </div>

              {/* Step 2 */}
              <div className="brutalist-card p-6 bg-white relative hover:scale-102 transition-transform shadow-brutalist">
                <div className="absolute top-4 right-4 font-display font-black text-5xl text-brand-ddsl/20 select-none">
                  02
                </div>
                <h3 className="font-display font-black text-xl uppercase italic text-brand-ddsl mb-4">
                  Register Online
                </h3>
                <p className="font-sans text-xs font-bold text-brand-neon uppercase bg-brand-charcoal px-2 py-0.5 rounded border border-brand-charcoal w-fit tracking-wide mb-3">
                  Online Portal
                </p>
                <p className="font-sans text-sm font-semibold text-zinc-600 leading-normal">
                  Fill out our JMO application form. Ensure you have parent/guardian consent if you are under 18.
                </p>
              </div>

              {/* Step 3 */}
              <div className="brutalist-card p-6 bg-white relative hover:scale-102 transition-transform shadow-brutalist">
                <div className="absolute top-4 right-4 font-display font-black text-5xl text-brand-ddsl/20 select-none">
                  03
                </div>
                <h3 className="font-display font-black text-xl uppercase italic text-brand-ddsl mb-4">
                  FAI Seminar Course
                </h3>
                <p className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">
                  Certification Phase
                </p>
                <p className="font-sans text-sm font-semibold text-zinc-600 leading-normal">
                  Complete the FAI referee seminar course sponsored by RVR. Learn rules, player management, and match reporting.
                </p>
              </div>

              {/* Step 4 */}
              <div className="brutalist-card p-6 bg-brand-neon relative hover:scale-102 transition-transform shadow-brutalist-green">
                <div className="absolute top-4 right-4 font-display font-black text-5xl text-brand-green/20 select-none">
                  04
                </div>
                <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal mb-4">
                  Own the Pitch
                </h3>
                <p className="font-sans text-xs font-bold text-brand-green uppercase bg-white px-2 py-0.5 rounded border border-brand-charcoal w-fit tracking-wide mb-3">
                  Official Match
                </p>
                <p className="font-sans text-sm font-extrabold text-brand-charcoal leading-normal">
                  Referee your first Small Sided Game (SSG) with your RVR mentor standing on the sideline assisting you!
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* PARENT TRUST & SAFETY GUARD */}
        <section id="parents" className="py-20 max-w-6xl mx-auto px-6">
          <div className="brutalist-card bg-white p-8 md:p-12 shadow-brutalist relative overflow-hidden">
            
            {/* Custom SVG Icon - Safety Shield */}
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-ddsl/5 rounded-full pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="w-16 h-16 bg-brand-ddsl text-brand-neon rounded-2xl border-3 border-brand-charcoal flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_#121212]">
                  <svg viewBox="0 0 24 24" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <h3 className="font-display font-black text-3xl uppercase italic text-brand-charcoal leading-none">
                  PARENT TRUST
                </h3>
                <h3 className="font-display font-black text-3xl uppercase italic text-brand-ddsl leading-none mb-4">
                  & SAFETY GUARD
                </h3>
                <p className="font-sans text-xs font-bold text-brand-charcoal bg-brand-neon border-2 border-brand-charcoal px-3 py-1 rounded-full uppercase tracking-wider">
                  Zero Tolerance Policy
                </p>
              </div>

              <div className="lg:col-span-8 space-y-6">
                
                <div className="border-l-4 border-brand-ddsl pl-6 space-y-2">
                  <h4 className="font-display font-bold text-lg text-brand-charcoal uppercase">
                    1. Safeguarding Young Officials
                  </h4>
                  <p className="font-sans text-sm font-semibold text-zinc-600 leading-relaxed">
                    Rivervalley Rangers AFC adheres strictly to the FAI Zero Tolerance policy for referee abuse. Sidelining guidelines are strictly enforced by club observers, and any aggressive behavior from parents or coaches results in immediate expulsion and review.
                  </p>
                </div>

                <div className="border-l-4 border-brand-ddsl pl-6 space-y-2">
                  <h4 className="font-display font-bold text-lg text-brand-charcoal uppercase">
                    2. Liability & Insurance Protection
                  </h4>
                  <p className="font-sans text-sm font-semibold text-zinc-600 leading-relaxed">
                    Every Junior Match Official is fully insured under the DDSL Player Programme and Club Liability Scheme during match activities, training sessions, and travel to affiliated Dublin venues.
                  </p>
                </div>

                <div className="border-l-4 border-brand-ddsl pl-6 space-y-2">
                  <h4 className="font-display font-bold text-lg text-brand-charcoal uppercase">
                    3. Under-18 Match Day Protection
                  </h4>
                  <p className="font-sans text-sm font-semibold text-zinc-600 leading-relaxed">
                    A designated adult Child Protection Liaison Officer is present at every home tournament and league session to support minors, ensuring safety, and clear communications.
                  </p>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* APPLICATION FORM BLOCK */}
        <section id="apply" className="py-20 bg-brand-charcoal text-white border-t-4 border-brand-charcoal">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-8">
            <h2 className="font-display font-black text-4xl sm:text-5xl uppercase italic text-brand-neon tracking-tight">
              APPLY FOR THE RVR JMO SQUAD
            </h2>
            <p className="font-sans text-lg text-zinc-300">
              Submit your details below to register interest in the upcoming FAI Referee Certification Seminar. An RVR Coordinator will contact you shortly.
            </p>

            <form onSubmit={handleSubmit} className="text-left space-y-6 bg-white text-brand-charcoal p-8 border-4 border-brand-charcoal rounded-2xl shadow-brutalist">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullname" className="block font-display font-bold text-sm uppercase tracking-wide mb-2">Full Name</label>
                  <input required type="text" id="fullname" name="fullname" autoComplete="name" className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold" placeholder="Enter full name" />
                </div>
                <div>
                  <label htmlFor="dob" className="block font-display font-bold text-sm uppercase tracking-wide mb-2">Date of Birth</label>
                  <input required type="date" id="dob" name="dob" autoComplete="bday" className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block font-display font-bold text-sm uppercase tracking-wide mb-2">Email Address</label>
                  <input required type="email" id="email" name="email" autoComplete="email" className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold" placeholder="name@example.com" />
                </div>
                <div>
                  <label htmlFor="phone" className="block font-display font-bold text-sm uppercase tracking-wide mb-2">Phone Number</label>
                  <input required type="tel" id="phone" name="phone" autoComplete="tel" className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold" placeholder="Your phone number" />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block font-display font-bold text-sm uppercase tracking-wide mb-2">Club Background / Experience (Optional)</label>
                <textarea id="notes" name="notes" rows={3} className="w-full p-3 border-3 border-brand-charcoal rounded-xl focus:outline-none focus:ring-3 focus:ring-brand-neon font-sans font-semibold" placeholder="Do you play for an RVR squad? Tell us briefly..."></textarea>
              </div>

              <div className="flex items-start gap-3">
                <input required type="checkbox" id="consent" name="consent" className="mt-1 w-5 h-5 border-3 border-brand-charcoal rounded cursor-pointer accent-brand-neon" />
                <label htmlFor="consent" className="font-sans text-xs font-semibold text-zinc-600 leading-snug">
                  I confirm that I am aged 16 or older, or have received permission from my parent/guardian to submit my details for referee training.
                </label>
              </div>

              <div className="sr-only" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              {submitMessage && (
                <p
                  role={submitState === 'error' ? 'alert' : 'status'}
                  className={`rounded-xl border-2 p-4 text-sm font-bold ${
                    submitState === 'error'
                      ? 'border-red-700 bg-red-50 text-red-800'
                      : 'border-brand-green bg-[#D1E7DD] text-[#0F5132]'
                  }`}
                >
                  {submitMessage}
                </p>
              )}

              <button disabled={submitState === 'submitting'} type="submit" className="w-full btn-brutalist-neon py-4 text-lg bg-brand-neon hover:bg-[#96f431] disabled:cursor-wait disabled:opacity-60">
                {submitState === 'submitting' ? 'Submitting…' : 'Submit Application Form'}
              </button>

            </form>
          </div>
        </section>

      </main>

      {/* Page footer */}
      <footer className="bg-brand-charcoal text-white border-t-4 border-brand-charcoal py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-display font-black text-xl italic uppercase tracking-tight text-brand-neon mb-4">
              RIVERVALLEY RANGERS AFC
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Swords&apos; leading community football club, established in 1981. Dedicated to equality, youth development, and inclusive sports.
            </p>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Our Locations
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>📍 Ward Rivervalley Park, Swords, Co. Dublin</li>
              <li>🏟️ Ward Rivervalley All-Weather Astro Pitch</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm uppercase tracking-wider text-white mb-4">
              Legal & Safety
            </h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li>✓ 100% Garda Vetted Coaches</li>
              <li>✓ Child Safeguarding Statement</li>
              <li>✓ FAI Club Mark Accredited</li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-12 pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Rivervalley Rangers AFC. All rights reserved.</p>
          <p>Dublin Football Pride Since 1981</p>
        </div>
      </footer>
    </PublicPageShell>
  );
}
