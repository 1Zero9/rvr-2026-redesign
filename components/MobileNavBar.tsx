'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function MobileNavBar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Home',
      path: '/',
      ariaLabel: 'Go to Home Page',
      // Custom SVG House Icon
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <path d="M9 22V12h6v10" />
        </svg>
      ),
    },
    {
      label: 'Fees',
      path: '/membership-calculator',
      ariaLabel: 'Calculate Family Registration Fees',
      // Custom SVG Calculator/Card Icon
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="10" x2="22" y2="10" />
          <line x1="7" y1="15" x2="17" y2="15" />
        </svg>
      ),
    },
    {
      label: 'Ref JMO',
      path: '/ddsl-jmo',
      ariaLabel: 'Join DDSL JMO Referee Program',
      // Custom SVG Whistle Icon
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M18 10h3v4h-3z" />
          <path d="M9 6c4 0 9 1 9 4c0 4-5 6-9 6C5 16 3 14 3 10c0-4 2-4 6-4z" />
          <circle cx="6" cy="10" r="1.5" />
          <rect x="11" y="6" width="3" height="2" fill="currentColor" />
        </svg>
      ),
    },
    {
      label: 'Inclusive',
      path: '/football-for-all',
      ariaLabel: 'View Football For All Adaptive Programs',
      // Custom SVG Handshake/Inclusive Icon
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87" />
          <path d="M16 3.13a4 4 0 010 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <nav 
      className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[360px] max-w-[calc(100%-2rem)] bg-brand-charcoal text-white border-4 border-brand-charcoal rounded-2xl shadow-brutalist flex items-center justify-around py-2 px-3 animate-bounce-spring"
      aria-label="Mobile Bottom Navigation"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.path;

        return (
          <a
            key={item.path}
            href={item.path}
            aria-label={item.ariaLabel}
            className={`tap-target-comfort flex flex-col items-center justify-center rounded-xl transition-all focus:ring-4 focus:ring-brand-green-aaa focus:outline-none ${
              isActive 
                ? 'text-brand-neon bg-white/10 font-bold scale-105' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-display font-bold uppercase tracking-wider mt-1 select-none">
              {item.label}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
