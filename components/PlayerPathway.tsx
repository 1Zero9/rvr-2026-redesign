import Link from 'next/link';

const STEPS = [
  { label: 'Academy', sub: 'Ages 4–6',  href: '/academy', active: false },
  { label: 'Youth',   sub: 'U7 – U11',  href: '/teams',   active: false },
  { label: 'Teen',    sub: 'U12 – U17', href: '/teams',   active: false },
  { label: 'Senior',  sub: '17+',       href: '/seniors', active: false },
];

interface PlayerPathwayProps {
  activeStep?: number;
  className?: string;
}

export default function PlayerPathway({ activeStep, className = '' }: PlayerPathwayProps) {
  return (
    <div className={`w-full ${className}`}>
      <p className="text-[10px] font-display font-black uppercase tracking-widest text-brand-charcoal/40 mb-3">
        The RVR Player Pathway
      </p>
      <div className="flex items-stretch">
        {STEPS.map((step, i) => {
          const isActive = activeStep === i;
          return (
            <Link
              key={step.label}
              href={step.href}
              className={`group flex-1 flex flex-col items-center justify-center py-3 px-2 text-center border-2 transition-all ${
                i > 0 ? '-ml-0.5' : ''
              } ${
                isActive
                  ? 'bg-brand-navy border-brand-neon z-10'
                  : 'bg-white border-brand-navy/20 hover:border-brand-navy/50 hover:bg-brand-neon/5 z-0'
              }`}
            >
              <span className={`font-display font-black text-xs uppercase leading-tight ${
                isActive ? 'text-brand-neon' : 'text-brand-charcoal group-hover:text-brand-navy'
              }`}>
                {step.label}
              </span>
              <span className={`text-[10px] mt-0.5 ${
                isActive ? 'text-brand-sky' : 'text-brand-charcoal/45'
              }`}>
                {step.sub}
              </span>
              {isActive && (
                <span className="text-[11px] font-bold text-brand-neon/70 uppercase tracking-wide mt-1">
                  You are here
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
