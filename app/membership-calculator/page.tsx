'use client';

import React, { useEffect, useState } from 'react';
import PublicPageShell from '@/components/layout/PublicPageShell';
import PageHeroNavy from '@/components/layout/PageHeroNavy';

type MemberRole =
  | 'underage-ndsl'
  | 'underage-ddsl'
  | 'underage-girls'
  | 'academy'
  | 'senior-full'
  | 'senior-half'
  | 'junior-half'
  | 'over35';

interface Member {
  id: number;
  name: string;
  role: MemberRole;
}

interface PricingEntry {
  label: string;
  price: number;
  isYouth: boolean;
  siblingDiscount: boolean;
  note?: string;
}

const PRICING: Record<MemberRole, PricingEntry> = {
  'underage-ndsl':  { label: 'Youth Boys NDSL (U8–U18)', price: 260, isYouth: true,  siblingDiscount: true  },
  'underage-ddsl':  { label: 'Youth Boys DDSL (U8–U18)', price: 230, isYouth: true,  siblingDiscount: true,
                      note: '+€30 payable direct to DDSL, explained at registration' },
  'underage-girls': { label: 'Youth Girls (U8–U18)',      price: 200, isYouth: true,  siblingDiscount: true  },
  'academy':        { label: 'Academy (U6 & Under)',      price: 120, isYouth: true,  siblingDiscount: false },
  'senior-full':    { label: 'Senior (Full Season)',      price: 290, isYouth: false, siblingDiscount: false,
                      note: '€110 upfront + 4 × €45 monthly, or pay in full' },
  'senior-half':    { label: 'Senior (Half Season)',      price: 145, isYouth: false, siblingDiscount: false },
  'junior-half':    { label: 'Junior (Half Season)',      price: 115, isYouth: false, siblingDiscount: false },
  'over35':         { label: "Over 35's (Full Season)",   price: 220, isYouth: false, siblingDiscount: false,
                      note: 'Pay in full or 5 monthly instalments' },
};

const SIBLING_RATE_2ND = 160;
const SIBLING_RATE_3RD = 110;

export default function MembershipCalculatorPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [nextId, setNextId] = useState(1);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);

  useEffect(() => {
    fetch('/api/features')
      .then((r) => r.json() as Promise<{ stripePayments?: boolean }>)
      .then((f) => setPaymentsEnabled(f.stripePayments === true))
      .catch(() => setPaymentsEnabled(false));
  }, []);

  const addMember = (isAdult: boolean) => {
    const defaultRole: MemberRole = isAdult ? 'senior-full' : 'underage-ddsl';
    setMembers((prev) => [...prev, { id: nextId, name: `Member #${nextId}`, role: defaultRole }]);
    setNextId((n) => n + 1);
  };

  const removeMember = (id: number) => setMembers((prev) => prev.filter((m) => m.id !== id));

  const updateMember = (id: number, fields: Partial<Member>) =>
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...fields } : m)));

  // Sibling discount: sort eligible youth by price desc; 2nd → €160, 3rd+ → €110
  const calculateTotal = () => {
    const eligible = members
      .filter((m) => PRICING[m.role].siblingDiscount)
      .sort((a, b) => PRICING[b.role].price - PRICING[a.role].price);

    const ineligible = members.filter((m) => !PRICING[m.role].siblingDiscount);

    let subtotal = 0;
    let discountTotal = 0;
    let siblingLines: { name: string; full: number; applied: number }[] = [];

    eligible.forEach((m, i) => {
      const full = PRICING[m.role].price;
      let applied: number;
      if (i === 0)      applied = full;
      else if (i === 1) applied = Math.min(full, SIBLING_RATE_2ND);
      else              applied = Math.min(full, SIBLING_RATE_3RD);
      subtotal += full;
      discountTotal += applied;
      siblingLines.push({ name: m.name, full, applied });
    });

    const ineligibleTotal = ineligible.reduce((s, m) => s + PRICING[m.role].price, 0);
    subtotal += ineligibleTotal;
    discountTotal += ineligibleTotal;

    const savings = subtotal - discountTotal;
    const siblingApplied = eligible.length >= 2;

    return { subtotal, finalPrice: discountTotal, savings, siblingApplied, siblingLines };
  };

  const { subtotal, finalPrice, savings, siblingApplied, siblingLines } = calculateTotal();

  const YOUTH_ROLES  = (['underage-ndsl', 'underage-ddsl', 'underage-girls', 'academy'] as MemberRole[]);
  const ADULT_ROLES  = (['senior-full', 'senior-half', 'junior-half', 'over35'] as MemberRole[]);

  return (
    <PublicPageShell>
      <PageHeroNavy
        eyebrow="Registration Portal"
        title="Family Membership Pricing"
        description="Build your family group and see your applicable membership fees and sibling discounts for 2025/26."
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Family Builder */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl uppercase tracking-tight text-brand-charcoal">
                1. Build Your Family
              </h2>
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
                <p className="font-sans text-sm text-zinc-400">Click the buttons above to add adults or youth players.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {members.map((member) => {
                  const siblingLine = siblingLines.find((s) => s.name === member.name);
                  const hasDiscount = siblingLine && siblingLine.applied < siblingLine.full;
                  return (
                    <div key={member.id} className="brutalist-card p-5 bg-white relative flex flex-col md:flex-row md:items-start justify-between gap-6 hover:shadow-brutalist transition-shadow">
                      <div className="flex-grow space-y-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-brand-green/10 border-2 border-brand-charcoal flex items-center justify-center font-display font-bold text-brand-green text-sm shrink-0">
                            {member.id}
                          </span>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => updateMember(member.id, { name: e.target.value })}
                            className="font-display font-bold text-base text-brand-charcoal border-b-2 border-dashed border-zinc-300 focus:border-brand-green focus:outline-none bg-transparent py-0.5 px-1 w-full max-w-xs"
                            placeholder="Member Name"
                          />
                          {hasDiscount && (
                            <span className="ml-auto shrink-0 text-[10px] font-black uppercase tracking-wide text-brand-green bg-brand-neon/20 px-2 py-0.5 rounded-full border border-brand-green/30">
                              Sibling rate
                            </span>
                          )}
                        </div>

                        {/* Youth options */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Youth</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {YOUTH_ROLES.map((roleKey) => {
                              const v = PRICING[roleKey];
                              const isSelected = member.role === roleKey;
                              return (
                                <button
                                  key={roleKey}
                                  onClick={() => updateMember(member.id, { role: roleKey })}
                                  className={`p-2.5 text-xs text-left rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? 'bg-[#E8F4F0] border-brand-green font-bold text-brand-green-dark'
                                      : 'border-zinc-200 hover:border-brand-charcoal text-zinc-600 bg-zinc-50'
                                  }`}
                                >
                                  <div className="flex justify-between items-center gap-2">
                                    <span className="leading-tight">{v.label}</span>
                                    <span className="font-display font-black text-brand-charcoal shrink-0">€{v.price}</span>
                                  </div>
                                  {v.note && isSelected && (
                                    <p className="mt-1 text-[10px] text-zinc-500 leading-snug">{v.note}</p>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Adult options */}
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Adult</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {ADULT_ROLES.map((roleKey) => {
                              const v = PRICING[roleKey];
                              const isSelected = member.role === roleKey;
                              return (
                                <button
                                  key={roleKey}
                                  onClick={() => updateMember(member.id, { role: roleKey })}
                                  className={`p-2.5 text-xs text-left rounded-lg border-2 transition-all ${
                                    isSelected
                                      ? 'bg-[#E8F4F0] border-brand-green font-bold text-brand-green-dark'
                                      : 'border-zinc-200 hover:border-brand-charcoal text-zinc-600 bg-zinc-50'
                                  }`}
                                >
                                  <div className="flex justify-between items-center gap-2">
                                    <span className="leading-tight">{v.label}</span>
                                    <span className="font-display font-black text-brand-charcoal shrink-0">€{v.price}</span>
                                  </div>
                                  {v.note && isSelected && (
                                    <p className="mt-1 text-[10px] text-zinc-500 leading-snug">{v.note}</p>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeMember(member.id)}
                        className="p-2 border-2 border-brand-charcoal rounded-lg bg-red-100 hover:bg-red-200 text-brand-charcoal md:self-start self-end shadow-[2px_2px_0px_0px_#121212] active:translate-y-0.5 active:shadow-none transition-all shrink-0"
                        aria-label={`Remove ${member.name}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <h2 className="font-display font-bold text-xl uppercase tracking-tight text-brand-charcoal mb-6">
              2. Cost Summary
            </h2>

            <div className="glass-frosted border-4 border-brand-charcoal rounded-2xl p-6 shadow-brutalist space-y-6">
              <div className="flex items-center justify-between border-b-2 border-brand-charcoal pb-4">
                <span className="font-display font-extrabold text-sm uppercase text-brand-charcoal">
                  Members
                </span>
                <span className="font-display font-black text-lg bg-white border-2 border-brand-charcoal px-3 py-0.5 rounded-md">
                  {members.length} {members.length === 1 ? 'Member' : 'Members'}
                </span>
              </div>

              {/* Per-member breakdown */}
              {members.length > 0 && (
                <div className="space-y-2">
                  {members.map((m) => {
                    const sl = siblingLines.find((s) => s.name === m.name);
                    const hasDiscount = sl && sl.applied < sl.full;
                    return (
                      <div key={m.id} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-600 font-semibold truncate mr-2">{m.name}</span>
                        <span className="shrink-0 font-display font-black text-brand-charcoal">
                          {hasDiscount ? (
                            <>
                              <span className="line-through text-zinc-400 font-normal text-xs mr-1">€{sl!.full}</span>
                              €{sl!.applied}
                            </>
                          ) : (
                            <>€{PRICING[m.role].price}</>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-between text-zinc-600 border-t border-zinc-200 pt-3">
                <span className="font-sans text-sm font-semibold">Full price total</span>
                <span className="font-display font-bold text-base">€{subtotal}</span>
              </div>

              {siblingApplied && savings > 0 && (
                <div className="p-3 bg-[#E8F4F0] border-2 border-brand-green/30 rounded-xl space-y-1">
                  <span className="text-[10px] font-display font-black text-brand-green uppercase tracking-wider block">
                    Sibling Discount Applied
                  </span>
                  <p className="text-[11px] text-zinc-600 font-semibold leading-snug">
                    2nd youth player €{SIBLING_RATE_2ND} · 3rd+ youth player €{SIBLING_RATE_3RD}
                  </p>
                  <div className="flex items-center justify-between text-brand-green font-bold text-sm mt-1">
                    <span>You save</span>
                    <span>-€{savings}</span>
                  </div>
                </div>
              )}

              <div className="border-t-2 border-brand-charcoal pt-4 space-y-2">
                <div className="flex items-center justify-between text-brand-charcoal">
                  <span className="font-display font-black text-base uppercase">Total Due</span>
                  <span className="font-display font-black text-3xl text-brand-green">€{finalPrice}</span>
                </div>
              </div>

              {paymentsEnabled ? (
                <p className="border-2 border-brand-green bg-[#D1E7DD] p-4 text-center text-sm font-bold text-[#0F5132]">
                  Online payment is enabled. Complete registration through the club registration workflow to continue to checkout.
                </p>
              ) : (
                <p className="border-2 border-brand-navy bg-brand-cream p-4 text-center text-sm font-bold text-brand-navy">
                  This calculator provides an estimate. Online membership payment is not currently available — register via the club system.
                </p>
              )}
            </div>

            <div className="mt-6 p-4 border-2 border-dashed border-zinc-300 rounded-xl bg-white space-y-2 text-xs">
              <span className="font-display font-bold text-brand-charcoal uppercase tracking-wider">
                Sibling Discount Policy (2025/26)
              </span>
              <p className="text-zinc-500 font-semibold leading-relaxed">
                Applies to Youth Boys NDSL, Youth Boys DDSL, and Youth Girls players. First child pays the full category fee. Second child is €160. Third child and beyond are €110 each. Academy players are priced separately.
              </p>
              <p className="text-zinc-400 font-semibold leading-relaxed">
                DDSL members pay an additional €30 direct to DDSL — this is separate and will be explained at registration. Senior full-season members can pay €110 upfront + 4 × €45 monthly or in full. Over 35&apos;s can pay in full or 5 monthly instalments.
              </p>
            </div>
          </div>

        </div>
      </section>
    </PublicPageShell>
  );
}
