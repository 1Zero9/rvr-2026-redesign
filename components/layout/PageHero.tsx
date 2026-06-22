import type { ReactNode } from 'react';

interface PageHeroProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  maxWidth?: '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
}

const widthClasses = {
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
};

export default function PageHero({
  eyebrow,
  title,
  description,
  actions,
  maxWidth = '6xl',
}: PageHeroProps) {
  return (
    <section className="border-b-2 border-brand-navy/10">
      <div className={`mx-auto px-4 py-10 sm:px-6 lg:py-14 ${widthClasses[maxWidth]}`}>
        <div className="site-surface p-6 sm:p-8 lg:p-10">
          <div className="max-w-3xl">
            {eyebrow && (
              <div className="mb-4 inline-flex min-h-8 items-center rounded-full border-2 border-brand-navy bg-brand-neon px-4 font-display text-xs font-black uppercase tracking-wider text-brand-charcoal">
                {eyebrow}
              </div>
            )}
            <h1 className="font-display text-4xl font-black uppercase italic leading-none tracking-tight text-brand-navy sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && (
              <div className="mt-5 max-w-2xl text-base font-semibold leading-7 text-zinc-600 sm:text-lg">
                {description}
              </div>
            )}
            {actions && <div className="mt-7 flex flex-wrap gap-3">{actions}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
