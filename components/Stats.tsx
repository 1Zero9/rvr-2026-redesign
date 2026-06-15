'use client';

import React from 'react';

export default function Stats() {
  const statsData = [
    {
      badge: 'Since 1981',
      title: '45 Yrs',
      desc: 'Strong community football legacy in Dublin.',
      badgeBg: 'bg-brand-green text-white',
      cardBg: 'bg-white hover:bg-zinc-50',
      shadowColor: 'hover:shadow-brutalist',
    },
    {
      badge: 'Parity Channels',
      title: '18+',
      desc: 'Active teams across all divisions & formats.',
      badgeBg: 'bg-brand-neon text-brand-charcoal',
      cardBg: 'bg-[#E8F4F0] hover:bg-[#DCECE7] text-brand-greenDark',
      shadowColor: 'hover:shadow-brutalist-green',
    },
    {
      badge: 'Swords Community',
      title: '350+',
      desc: 'Active local players developing weekly.',
      badgeBg: 'bg-brand-green text-white',
      cardBg: 'bg-white hover:bg-zinc-50',
      shadowColor: 'hover:shadow-brutalist',
    },
    {
      badge: 'UEFA/FAI Certified',
      title: '25+',
      desc: 'Qualified coaches delivering football excellence.',
      badgeBg: 'bg-brand-navy text-white',
      cardBg: 'bg-[#FAF5ED] hover:bg-[#F3EBE0]',
      shadowColor: 'hover:shadow-brutalist',
    },
    {
      badge: '100% Secure',
      title: 'Vetted',
      desc: '100% Garda Vetted coaches prioritizing child safety.',
      badgeBg: 'bg-brand-green text-white',
      cardBg: 'bg-brand-neon hover:bg-[#96f431] text-brand-charcoal',
      shadowColor: 'hover:shadow-brutalist-green',
      isSpecial: true,
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-24 select-none">
      
      {/* Section Header */}
      <div className="text-center mb-16 relative">
        <h2 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight leading-none text-brand-charcoal">
          RVR BY THE NUMBERS
        </h2>
        {/* Playful underline accent */}
        <div className="h-3.5 w-48 bg-brand-neon mx-auto border-3 border-brand-navy -rotate-1 shadow-sm mt-3"></div>
        
        {/* Decorative Cute-alism scribbles/details */}
        <div className="absolute top-0 right-1/4 hidden lg:block text-brand-green text-3xl font-display font-bold italic rotate-12">
          ⚽ Pitch Pride!
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {statsData.map((stat, idx) => (
          <div
            key={idx}
            className={`brutalist-card p-6 flex flex-col justify-between h-56 relative overflow-hidden group cursor-default ${stat.cardBg} ${stat.shadowColor}`}
          >
            {/* Playful decorative element on the Vetted card */}
            {stat.isSpecial && (
              <>
                {/* Visual badge/sticker background decoration */}
                <div className="absolute -right-8 -top-8 w-24 h-24 bg-brand-green/10 rounded-full group-hover:scale-125 transition-transform duration-300 pointer-events-none"></div>
                <div className="absolute right-2 bottom-2 text-4xl opacity-20 group-hover:rotate-12 group-hover:scale-110 transition-all pointer-events-none">
                  🛡️
                </div>
              </>
            )}

            <div>
              {/* Badge */}
              <span
                className={`inline-block font-display font-extrabold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider mb-4 border-2 border-brand-navy ${stat.badgeBg}`}
              >
                {stat.badge}
              </span>
              
              {/* Stat text */}
              <h3 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tighter italic leading-none mb-3">
                {stat.title}
              </h3>
            </div>

            {/* Description */}
            <p className="font-sans text-xs md:text-sm font-semibold leading-snug">
              {stat.desc}
            </p>
          </div>
        ))}
      </div>
      
    </section>
  );
}
