import Link from 'next/link';
import type { ReactNode } from 'react';

interface PageHeroNavyProps {
  title: string;
  eyebrow?: ReactNode;
  description?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  links?: ReactNode;
  accentColor?: string;
}

export default function PageHeroNavy({
  title,
  eyebrow,
  description,
  backHref,
  backLabel,
  actions,
  links,
  accentColor = 'bg-brand-neon',
}: PageHeroNavyProps) {
  return (
    <>
      <div className="relative overflow-hidden bg-brand-navy">
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-brand-navy/60 to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-4xl px-5 pt-10 pb-14 md:pt-14 md:pb-18">
          {backHref && backLabel && (
            <Link
              href={backHref}
              className="inline-flex items-center gap-1.5 text-brand-sky/70 text-sm mb-6 hover:text-brand-neon transition-colors font-semibold"
            >
              ← {backLabel}
            </Link>
          )}
          {eyebrow && (
            <div className="mb-3 inline-flex items-center gap-1.5 font-display text-[11px] font-black uppercase tracking-widest text-brand-sky/60">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display font-black italic text-5xl md:text-6xl lg:text-7xl uppercase tracking-tight leading-none text-brand-neon mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-brand-sky/80 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
              {description}
            </p>
          )}
          {actions && (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {actions}
            </div>
          )}
          {links && <div className="mt-5">{links}</div>}
        </div>
      </div>
      <div className={`h-1 w-full ${accentColor}`} />
    </>
  );
}
