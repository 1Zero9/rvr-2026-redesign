'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';

type MemberRole = 'adult-player' | 'student-over-18' | 'youth-player' | 'junior-academy' | 'volunteer';

interface Member {
  id: number;
  name: string;
  role: MemberRole;
}

const PRICING: Record<MemberRole, { label: string; price: number }> = {
  'adult-player': { label: 'Adult Player', price: 250 },
  'student-over-18': { label: 'Student Over 18', price: 250 },
  'youth-player': { label: 'Juvenile/Youth Player (U7-U18)', price: 250 },
  'junior-academy': { label: 'Junior Academy Player (U6 and Under)', price: 120 },
  'volunteer': { label: 'Non-Playing Volunteer/Mentor', price: 140 },
};

export default function MembershipCalculatorPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [nextId, setNextId] = useState(1);

  const addMember = (isAdult: boolean) => {
    const defaultRole: MemberRole = isAdult ? 'volunteer' : 'youth-player';
    const newMember: Member = {
      id: nextId,
      name: `Member #${nextId}`,
      role: defaultRole,
    };
    setMembers([...members, newMember]);
    setNextId(nextId + 1);
  };

  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id: number, fields: Partial<Member>) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, ...fields } : m)));
  };

  // Pricing calculations
  const getPrice = (role: MemberRole) => PRICING[role].price;

  const calculateTotal = () => {
    const adults = members.filter((m) => m.role === 'volunteer' || m.role === 'adult-player' || m.role === 'student-over-18');
    const kids = members.filter((m) => m.role === 'youth-player' || m.role === 'junior-academy');

    const subtotal = members.reduce((sum, m) => sum + getPrice(m.role), 0);
    let finalPrice = subtotal;
    let appliedCap = '';

    // Check 2 Parents + 2 or more Kids cap (€475 base)
    if (adults.length >= 2 && kids.length >= 2) {
      const sortedAdults = [...adults].sort((a, b) => getPrice(b.role) - getPrice(a.role));
      const sortedKids = [...kids].sort((a, b) => getPrice(b.role) - getPrice(a.role));

      // Calculate cost of first 2 adults and first 2 kids
      const normalPriceOfCappedPart =
        getPrice(sortedAdults[0].role) +
        getPrice(sortedAdults[1].role) +
        getPrice(sortedKids[0].role) +
        getPrice(sortedKids[1].role);

      if (normalPriceOfCappedPart > 475) {
        let remainingPrice = 0;
        // Remaining adults priced normally
        for (let i = 2; i < sortedAdults.length; i++) {
          remainingPrice += getPrice(sortedAdults[i].role);
        }
        // Remaining kids priced at discounted family rate of €50 each
        for (let i = 2; i < sortedKids.length; i++) {
          remainingPrice += 50;
        }
        finalPrice = 475 + remainingPrice;
        appliedCap = '2 Parents + 2+ Kids Cap Applied (€475 base)';
      }
    }
    // Check 1 Parent + 3 or more Kids cap (€415 base)
    else if (adults.length >= 1 && kids.length >= 3) {
      const sortedAdults = [...adults].sort((a, b) => getPrice(b.role) - getPrice(a.role));
      const sortedKids = [...kids].sort((a, b) => getPrice(b.role) - getPrice(a.role));

      const normalPriceOfCappedPart =
        getPrice(sortedAdults[0].role) +
        getPrice(sortedKids[0].role) +
        getPrice(sortedKids[1].role) +
        getPrice(sortedKids[2].role);

      if (normalPriceOfCappedPart > 415) {
        let remainingPrice = 0;
        // Remaining adults priced normally
        for (let i = 1; i < sortedAdults.length; i++) {
          remainingPrice += getPrice(sortedAdults[i].role);
        }
        // Remaining kids priced at discounted family rate of €50 each
        for (let i = 3; i < sortedKids.length; i++) {
          remainingPrice += 50;
        }
        finalPrice = 415 + remainingPrice;
        appliedCap = '1 Parent + 3+ Kids Cap Applied (€415 base)';
      }
    }

    // Double check that the capped price is actually cheaper than subtotal
    if (finalPrice > subtotal) {
      finalPrice = subtotal;
      appliedCap = '';
    }

    const savings = subtotal - finalPrice;

    return { subtotal, finalPrice, savings, appliedCap };
  };

  const { subtotal, finalPrice, savings, appliedCap } = calculateTotal();

  return (
    <div
      className="flex flex-col min-h-screen bg-brand-cream text-brand-charcoal"
      style={{
        backgroundImage: `linear-gradient(rgba(11,31,59,0.04) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(11,31,59,0.04) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }}
    >
      <Header />

      <main className="flex-grow max-w-6xl w-full mx-auto px-4 md:px-6 py-12">
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-brand-green text-white font-display font-black text-xs px-3 py-1.5 rounded-full uppercase tracking-wider mb-4 border-2 border-brand-charcoal">
            Registration Portal
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl uppercase italic tracking-tight leading-none text-brand-charcoal">
            Family Membership Pricing Calculator
          </h1>
          <p className="font-sans text-base md:text-lg font-semibold text-zinc-600 mt-3 max-w-xl mx-auto leading-relaxed">
            Register multiple family members together and unlock automated tiered pricing. The more you register, the more you save.
          </p>
        </div>

        {/* Desktop Split-Screen Grid (collapses to single column on mobile) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Family Builder Workspace */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl uppercase tracking-tight text-brand-charcoal">
                1. Build Your Family
              </h2>
              {/* Quick action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => addMember(true)}
                  className="px-4 py-2 text-xs font-display font-black uppercase border-2 border-brand-charcoal bg-white rounded-lg shadow-[2px_2px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none hover:bg-zinc-50 transition-all"
                >
                  + Add Adult
                </button>
                <button
                  onClick={() => addMember(false)}
                  className="px-4 py-2 text-xs font-display font-black uppercase border-2 border-brand-charcoal bg-brand-neon rounded-lg shadow-[2px_2px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none hover:bg-[#96f431] transition-all"
                >
                  + Add Youth
                </button>
              </div>
            </div>

            {members.length === 0 ? (
              <div className="brutalist-card p-12 text-center bg-white space-y-4">
                <p className="font-sans text-base font-semibold text-zinc-500">Your workspace is currently empty.</p>
                <p className="font-sans text-sm text-zinc-400">Click the buttons above to add parents, youth players, or volunteers.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="brutalist-card p-5 bg-white relative flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-brutalist transition-shadow">
                    
                    {/* Member Details */}
                    <div className="flex-grow space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-brand-green/10 border-2 border-brand-charcoal flex items-center justify-center font-display font-bold text-brand-green text-sm">
                          {member.id}
                        </span>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateMember(member.id, { name: e.target.value })}
                          className="font-display font-bold text-base text-brand-charcoal border-b-2 border-dashed border-zinc-300 focus:border-brand-green focus:outline-none bg-transparent py-0.5 px-1 w-full max-w-xs"
                          placeholder="Member Name"
                        />
                      </div>

                      {/* Select Membership Type Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(PRICING).map(([roleKey, value]) => {
                          const isSelected = member.role === roleKey;
                          return (
                            <button
                              key={roleKey}
                              onClick={() => updateMember(member.id, { role: roleKey as MemberRole })}
                              className={`p-2.5 text-xs text-left rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'bg-[#E8F4F0] border-brand-green font-bold text-brand-greenDark'
                                  : 'border-zinc-200 hover:border-brand-charcoal text-zinc-600 bg-zinc-50'
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <span>{value.label}</span>
                                <span className="font-display font-black text-brand-charcoal">€{value.price}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Delete Member Button */}
                    <button
                      onClick={() => removeMember(member.id)}
                      className="p-2 border-2 border-brand-charcoal rounded-lg bg-red-100 hover:bg-red-200 text-brand-charcoal md:self-center self-end shadow-[2px_2px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none transition-all"
                      aria-label={`Remove ${member.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" className="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                    </button>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Dynamic Calculations Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-brand-charcoal mb-6">
              2. Calculations Summary
            </h2>

            <div className="glass-frosted border-4 border-brand-charcoal rounded-2xl p-6 shadow-brutalist space-y-6">
              
              <div className="flex items-center justify-between border-b-2 border-brand-charcoal pb-4">
                <span className="font-display font-extrabold text-sm uppercase text-brand-charcoal">
                  Family Count
                </span>
                <span className="font-display font-black text-lg bg-white border-2 border-brand-charcoal px-3 py-0.5 rounded-md">
                  {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-zinc-600">
                <span className="font-sans text-sm font-semibold">Subtotal (raw fees)</span>
                <span className="font-display font-bold text-base">€{subtotal}</span>
              </div>

              {/* Discount / Cap Info */}
              {appliedCap && (
                <div className="p-3 bg-[#E8F4F0] border-2 border-brand-green/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-display font-black text-brand-green uppercase tracking-wider block">
                    {appliedCap}
                  </span>
                  <div className="flex items-center justify-between text-brand-greenDark font-bold text-sm">
                    <span>Discounted Savings</span>
                    <span>-€{savings}</span>
                  </div>
                </div>
              )}

              {/* Final Pricing */}
              <div className="border-t-2 border-brand-charcoal pt-4 space-y-2">
                <div className="flex items-center justify-between text-brand-charcoal">
                  <span className="font-display font-black text-base uppercase">Total Due</span>
                  <span className="font-display font-black text-3xl text-brand-green">€{finalPrice}</span>
                </div>
                {savings > 0 && (
                  <p className="text-right text-xs font-bold text-brand-green">
                    You save €{savings} today! 🎉
                  </p>
                )}
              </div>

              {/* Checkout CTA */}
              <button
                disabled={members.length === 0}
                onClick={() => alert(`Redirecting to Secure Stripe Checkout with final value: €${finalPrice}`)}
                className="w-full btn-brutalist-neon py-4 text-center text-base uppercase font-display font-black tracking-wide bg-brand-neon hover:bg-[#96f431] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                Proceed to Secure Stripe Checkout
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" className="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-wider text-center">
                <span>🛡️ PCI-DSS SSL Secure Checkout</span>
                <span>•</span>
                <span>Stripe Verified</span>
              </div>

            </div>

            {/* Price policy info */}
            <div className="mt-6 p-4 border-2 border-dashed border-zinc-300 rounded-xl bg-white space-y-2 text-xs">
              <span className="font-display font-bold text-brand-charcoal uppercase tracking-wider">
                Discount Policy Details:
              </span>
              <p className="text-zinc-500 font-semibold leading-relaxed">
                Families are capped at €415 when registering 1 adult guardian + 3 youth players. Families with 2 adult guardians + 2 or more youth players are capped at €475. Extra youth players beyond the cap are registered at a subsidized rate of €50 per player.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-brand-charcoal text-white border-t-4 border-brand-charcoal py-12">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-display font-black text-xl italic uppercase tracking-tight text-brand-neon mb-4">
              RIVERVALLEY RANGERS AFC
            </h4>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              Swords' leading community football club, established in 1981. Dedicated to equality, youth development, and inclusive sports.
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
    </div>
  );
}
