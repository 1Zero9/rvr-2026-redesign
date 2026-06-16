'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, ShieldCheck, UserPlus } from 'lucide-react';

const navItems = [
  {
    label: 'Home',
    path: '/',
    ariaLabel: 'Go to Home',
    icon: Home,
  },
  {
    label: 'Matches',
    path: '/teams/matches',
    ariaLabel: 'View Fixtures and Results',
    icon: Calendar,
  },
  {
    label: 'Safeguarding',
    path: '/club/safeguarding',
    ariaLabel: 'View Safeguarding and Child Welfare',
    icon: ShieldCheck,
  },
  {
    label: 'Register',
    path: '/register',
    ariaLabel: 'Register a Player',
    icon: UserPlus,
  },
] as const;

export default function MobileNavBar() {
  const pathname = usePathname();

  return (
    <nav
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[360px] max-w-[calc(100%-2rem)] bg-brand-navy text-white border border-brand-sky/20 rounded-2xl shadow-brutalist flex items-center justify-around py-2 px-3 animate-bounce-spring"
      aria-label="Mobile navigation"
    >
      {navItems.map(({ label, path, ariaLabel, icon: Icon }) => {
        const isActive = pathname === path;

        return (
          <Link
            key={path}
            href={path}
            aria-label={ariaLabel}
            className={`tap-target-comfort flex flex-col items-center justify-center rounded-xl transition-all focus:ring-4 focus:ring-brand-neon focus:outline-none ${
              isActive
                ? 'text-brand-neon bg-white/10 scale-105'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Icon className="w-6 h-6" aria-hidden="true" />
            <span className="text-[10px] font-display font-bold uppercase tracking-wider mt-1 select-none">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
