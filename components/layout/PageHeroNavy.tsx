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
  accentColor = 'bg-brand-green',
}: PageHeroNavyProps) {
  return (
    <>
      <div className="relative overflow-hidden bg-brand-navy">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(133,227,32,0.12) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(133,227,32,0.12) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative mx-auto max-w-2xl px-4 pt-6 pb-8">
          {backHref && backLabel && (
            <Link
              href={backHref}
              className="inline-block text-brand-sky text-sm mb-5 hover:text-brand-neon transition-colors"
            >
              ← {backLabel}
            </Link>
          )}
          {eyebrow && (
            <div className="mb-2 inline-flex items-center gap-1.5 font-display text-xs font-black uppercase tracking-widest text-brand-sky/80">
              {eyebrow}
            </div>
          )}
          <h1 className="font-display font-black italic text-4xl md:text-5xl uppercase tracking-tight leading-none text-brand-neon mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-brand-sky text-sm mb-3">{description}</p>
          )}
          {actions && (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {actions}
            </div>
          )}
          {links && <div className="mt-4">{links}</div>}
        </div>
      </div>
      <div className={`h-1 w-full ${accentColor}`} />
    </>
  );
}
