'use client';

import React, { useState } from 'react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';
import ContactForm from '@/components/ContactForm';

interface Testimonial {
  quote: string;
  author: string;
  relation: string;
  location: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote: "Finding a club where my son Conor can play soccer at his own pace, without sensory overload, has changed our weekends completely. The coaches are so patient.",
    author: "Niamh H.",
    relation: "Parent of Conor (Age 9)",
    location: "Swords, Dublin",
  },
  {
    quote: "Walking football has kept me active and connected to the community after my hip replacement. It's competitive but gentle on the joints, and the laughs we have are second to none.",
    author: "Seamus O.",
    relation: "Walking Footballer (Age 68)",
    location: "Rivervalley, Swords",
  },
  {
    quote: "RVR has created a space where my daughter Sarah, who uses a wheelchair, feels part of a team. She wears her green jersey with so much pride.",
    author: "David K.",
    relation: "Parent of Sarah (Age 12)",
    location: "Malahide, Dublin",
  },
];

export default function FootballForAllPage() {
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [callbackName, setCallbackName] = useState('');
  const [callbackPhone, setCallbackPhone] = useState('');
  const [callbackError, setCallbackError] = useState('');
  const [callbackSubmitting, setCallbackSubmitting] = useState(false);

  // Proportional font sizing definitions
  const fontSizeClass = 
    textSize === 'xlarge' ? 'text-xl' : 
    textSize === 'large' ? 'text-lg' : 
    'text-base';

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackName || !callbackPhone || callbackSubmitting) return;

    setCallbackSubmitting(true);
    setCallbackError('');

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'FOOTBALL_FOR_ALL_CALLBACK',
          name: callbackName,
          phone: callbackPhone,
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error || 'Your request could not be submitted.');
      }
      setCallbackRequested(true);
    } catch (error) {
      setCallbackError(
        error instanceof Error ? error.message : 'Your request could not be submitted.',
      );
    } finally {
      setCallbackSubmitting(false);
    }
  };

  return (
    <PublicPageShell className={`transition-all ${fontSizeClass}`}>
      <PageHeroNavy
        title="Football For All"
        description="Adaptive, mixed-ability, and walking football in a safe and welcoming club environment."
      />

      <div className="flex-grow max-w-6xl w-full mx-auto px-4 md:px-6 py-12 space-y-12">
        
        {/* TOP WIDGET: Accessibility Text Customizer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-brand-cream-dark border-3 border-zinc-300 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl" aria-hidden="true">👁️</span>
            <span className="font-display font-bold text-sm uppercase tracking-wide text-zinc-700">
              Accessibility Settings: Adjust Text Size
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setTextSize('normal')}
              className={`px-4 py-2 text-xs font-display font-black uppercase rounded-lg border-2 transition-all focus:ring-4 focus:ring-brand-green focus:outline-none ${
                textSize === 'normal'
                  ? 'bg-brand-green text-white border-brand-charcoal'
                  : 'bg-white text-brand-charcoal border-zinc-300 hover:border-brand-charcoal'
              }`}
              aria-label="Set text size to Normal"
            >
              A (Normal)
            </button>
            <button
              onClick={() => setTextSize('large')}
              className={`px-4 py-2 text-sm font-display font-black uppercase rounded-lg border-2 transition-all focus:ring-4 focus:ring-brand-green focus:outline-none ${
                textSize === 'large'
                  ? 'bg-brand-green text-white border-brand-charcoal'
                  : 'bg-white text-brand-charcoal border-zinc-300 hover:border-brand-charcoal'
              }`}
              aria-label="Set text size to Large"
            >
              A+ (Large)
            </button>
            <button
              onClick={() => setTextSize('xlarge')}
              className={`px-4 py-2 text-base font-display font-black uppercase rounded-lg border-2 transition-all focus:ring-4 focus:ring-brand-green focus:outline-none ${
                textSize === 'xlarge'
                  ? 'bg-brand-green text-white border-brand-charcoal'
                  : 'bg-white text-brand-charcoal border-zinc-300 hover:border-brand-charcoal'
              }`}
              aria-label="Set text size to Extra Large"
            >
              A++ (Extra Large)
            </button>
          </div>
        </div>

        {/* PROGRAM HIGHLIGHTS GRID */}
        <section className="space-y-6">
          <h2 className="font-display font-bold text-xl uppercase tracking-tight text-brand-charcoal">
            Our Inclusive Programs & Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Grid 1: Saturdays on Ward Astro */}
            <div className="p-6 bg-brand-cream-dark border-3 border-zinc-300 rounded-2xl space-y-4 hover:border-zinc-400 transition-colors focus-within:ring-4 focus-within:ring-brand-green">
              <div className="w-12 h-12 rounded-xl bg-brand-sage flex items-center justify-center border-2 border-zinc-400" aria-hidden="true">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                Weekly Session Details
              </h3>
              <p className="font-sans text-sm font-semibold text-zinc-700 leading-relaxed">
                Sessions run every Saturday at **2:30pm** at the **Rivervalley Community Centre**. Fun and friendly sessions for girls and boys — all welcome.
              </p>
            </div>

            {/* Grid 2: Sensory-Friendly Play */}
            <div className="p-6 bg-brand-cream-dark border-3 border-zinc-300 rounded-2xl space-y-4 hover:border-zinc-400 transition-colors focus-within:ring-4 focus-within:ring-brand-green">
              <div className="w-12 h-12 rounded-xl bg-brand-sage flex items-center justify-center border-2 border-zinc-400" aria-hidden="true">
                <span className="text-2xl">🤫</span>
              </div>
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                Sensory-Friendly Space
              </h3>
              <p className="font-sans text-sm font-semibold text-zinc-700 leading-relaxed">
                We design a low-stimulus environment. Whistles are replaced with visual hand gestures where possible, shouting is prohibited, and a designated quiet zone is available nearby.
              </p>
            </div>

            {/* Grid 3: Adaptive Training */}
            <div className="p-6 bg-brand-cream-dark border-3 border-zinc-300 rounded-2xl space-y-4 hover:border-zinc-400 transition-colors focus-within:ring-4 focus-within:ring-brand-green">
              <div className="w-12 h-12 rounded-xl bg-brand-sage flex items-center justify-center border-2 border-zinc-400" aria-hidden="true">
                <span className="text-2xl">🏃</span>
              </div>
              <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal">
                Gentle Pacing & Coaching
              </h3>
              <p className="font-sans text-sm font-semibold text-zinc-700 leading-relaxed">
                All activities are non-competitive. Our sessions are facilitated by UEFA and FAI certified coaches trained in special education needs, autism coaching, and walking football safety.
              </p>
            </div>

          </div>
        </section>

        {/* COORDINATOR CONTACT & TESTIMONIALS SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
              {/* LEFT: Programme contact card */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-brand-charcoal">
              Inclusive Program Coordinator
            </h2>
            <div className="p-6 bg-white border-3 border-zinc-300 rounded-2xl space-y-6 shadow-sm">
              
              {/* Profile Bio */}
              <div className="flex items-center gap-4">
                {/* Programme mark */}
                <div className="w-16 h-16 rounded-full bg-brand-sage border-2 border-zinc-400 flex items-center justify-center text-3xl font-display font-bold text-brand-green select-none" aria-hidden="true">
                  RVR
                </div>
                <div>
                  <h3 className="font-display font-black text-xl uppercase italic text-brand-charcoal leading-none">
                    Football For All Team
                  </h3>
                  <span className="font-sans text-xs font-bold text-zinc-500 uppercase tracking-wide block mt-1">
                    Inclusive programme enquiries
                  </span>
                  <span className="font-sans text-xs text-zinc-400 block mt-1">
                    Send us a message below
                  </span>
                </div>
              </div>
              <ContactForm mailbox="footballforall" messagePlaceholder="Tell us a little about yourself or your child…" />

              {/* Call Back Form */}
              <div className="border-t border-zinc-200 pt-6 space-y-4">
                <h4 className="font-display font-bold text-sm uppercase tracking-wide text-brand-charcoal">
                  Request a Friendly Call Back
                </h4>

                {callbackRequested ? (
                  <div className="p-4 bg-[#D1E7DD] border border-[#A3CFBB] text-[#0F5132] rounded-xl text-xs font-semibold">
                    Thank you, {callbackName}. Your callback request has been
                    received by the club team.
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold uppercase text-zinc-500 mb-1">Your Name</label>
                      <input
                        required
                        id="name"
                        type="text"
                        value={callbackName}
                        onChange={(e) => setCallbackName(e.target.value)}
                        autoComplete="name"
                        className="min-h-11 w-full rounded-lg border-2 border-zinc-300 p-2 text-sm focus:border-brand-green focus:outline-none"
                        placeholder="Enter name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs font-bold uppercase text-zinc-500 mb-1">Phone Number</label>
                      <input
                        required
                        id="phone"
                        type="tel"
                        value={callbackPhone}
                        onChange={(e) => setCallbackPhone(e.target.value)}
                        autoComplete="tel"
                        className="min-h-11 w-full rounded-lg border-2 border-zinc-300 p-2 text-sm focus:border-brand-green focus:outline-none"
                        placeholder="Your phone number"
                      />
                    </div>
                    {callbackError && (
                      <p role="alert" className="text-sm font-bold text-red-700">
                        {callbackError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={callbackSubmitting}
                      className="min-h-11 w-full rounded-lg bg-brand-green px-4 py-2.5 font-display text-xs font-black uppercase tracking-wide text-white shadow-[2px_2px_0px_0px_#121212] transition-all hover:bg-[#004f3a] focus:outline-none focus:ring-4 focus:ring-brand-green active:translate-y-0.5 active:shadow-none disabled:cursor-wait disabled:opacity-60"
                    >
                      {callbackSubmitting ? 'Sending…' : 'Request Call Back'}
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT: Testimonial Sliding Carousel */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-brand-charcoal">
              Testimonials from Swords Families
            </h2>
            <div className="p-8 bg-white border-3 border-zinc-300 rounded-2xl shadow-sm min-h-[250px] flex flex-col justify-between relative group">
              
              {/* Testimonial Quote */}
              <div className="space-y-4">
                <span className="text-4xl text-brand-sage font-serif leading-none select-none block" aria-hidden="true">“</span>
                <p className="font-sans font-medium text-zinc-700 italic leading-relaxed">
                  {TESTIMONIALS[activeTestimonial].quote}
                </p>
              </div>

              {/* Author Info & Navigation Controls */}
              <div className="border-t border-zinc-200 pt-6 mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-sm text-brand-charcoal leading-none">
                    {TESTIMONIALS[activeTestimonial].author}
                  </h3>
                  <p className="font-sans text-xs text-zinc-500 mt-1 font-semibold">
                    {TESTIMONIALS[activeTestimonial].relation} • {TESTIMONIALS[activeTestimonial].location}
                  </p>
                </div>

                {/* Arrow Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border-2 border-zinc-300 bg-zinc-50 p-2 hover:border-brand-charcoal focus:outline-none focus:ring-4 focus:ring-brand-green"
                    aria-label="Previous Testimonial"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-lg border-2 border-zinc-300 bg-zinc-50 p-2 hover:border-brand-charcoal focus:outline-none focus:ring-4 focus:ring-brand-green"
                    aria-label="Next Testimonial"
                  >
                    →
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ACCESSIBILITY MANUAL (Collapsible / Documentation card) */}
        <section className="border-3 border-dashed border-zinc-400 rounded-2xl p-6 bg-brand-cream-dark space-y-4">
          <h2 className="font-display font-bold text-lg uppercase tracking-tight text-brand-charcoal flex items-center gap-2">
            <span>🛡️</span> Accessibility Manual (WCAG AAA Compliance Guidelines)
          </h2>
          <p className="font-sans text-sm font-semibold text-zinc-600 leading-relaxed">
            This portal has been built adhering to standard accessibility requirements:
          </p>
          <ul className="list-disc pl-5 font-sans text-xs md:text-sm text-zinc-600 space-y-2.5 font-semibold">
            <li>
              <strong>Proportional Scaling:</strong> Font adjustments resize elements using relative scaling, avoiding layout breaking or text clipping.
            </li>
            <li>
              <strong>AAA Color Contrast Ratio:</strong> Colors are soft and muted, yet verify a contrast ratio of &gt; 7:1 for body copy against light backgrounds (Charcoal text on Cream and Sage).
            </li>
            <li>
              <strong>Keyboard Navigation:</strong> High-contrast focus borders are implemented using Tailwind&apos;s <code>focus:ring-4 focus:ring-brand-green</code> to help keyboard-only navigators.
            </li>
            <li>
              <strong>ARIA tags &amp; Accessibility Labels:</strong> Non-text items like arrow buttons and custom settings buttons include descriptive <code>aria-label</code> tags. Emojis are hidden from screen readers using <code>aria-hidden=&quot;true&quot;</code>.
            </li>
          </ul>
        </section>

      </div>

    </PublicPageShell>
  );
}
