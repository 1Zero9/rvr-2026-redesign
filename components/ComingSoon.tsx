import React from 'react';
import Link from 'next/link';

interface ComingSoonProps {
  section: string;
  description?: string;
}

export default function ComingSoon({ section, description }: ComingSoonProps) {
  return (
    <main className="flex-grow flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <div className="max-w-lg w-full">
        <span className="inline-block bg-brand-neon text-brand-charcoal font-display font-black text-xs px-4 py-1.5 rounded-full uppercase tracking-wider border-2 border-brand-charcoal mb-6">
          Under Construction
        </span>

        <h1 className="font-display font-black text-5xl md:text-7xl uppercase italic tracking-tighter leading-none text-brand-charcoal mb-4">
          {section}
        </h1>

        <div className="h-3 w-32 bg-brand-neon border-2 border-brand-charcoal -rotate-1 mx-auto mb-8" />

        <p className="font-sans text-base md:text-lg font-semibold text-zinc-500 mb-10 leading-relaxed">
          {description ?? 'This section is being built. Check back soon for updates.'}
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 font-display font-black text-sm uppercase tracking-wide border-2 border-brand-charcoal bg-brand-charcoal text-white px-6 py-3 rounded-xl shadow-[3px_3px_0px_0px_#A7F432] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#A7F432] transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </main>
  );
}
