"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, ShieldCheck, Users, X } from "lucide-react";
import { ASSET_PATHS } from "@/config/assets";
import { useState } from "react";

const pathwayLinks = [
  {
    href: "/teams?section=girls-women",
    label: "Girls & Women",
    description: "Girls teams and women pathway",
  },
  {
    href: "/teams?section=junior-academy",
    label: "Junior Academy",
    description: "U7 to U12 foundation football",
  },
  {
    href: "/teams?section=youth-competitive",
    label: "Youth Competitive",
    description: "U13 to U18 league teams",
  },
  {
    href: "/teams?section=seniors",
    label: "Seniors",
    description: "Adult squads and senior football",
  },
  {
    href: "/football-for-all",
    label: "Inclusive",
    description: "Accessible football for all players",
  },
];

const utilityLinks = [
  { href: "/club/safeguarding", label: "Safeguarding" },
  { href: "/membership-calculator", label: "Fees" },
  { href: "/shop", label: "Shop" },
];

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <header className="relative sticky top-0 z-50 border-b-4 border-brand-charcoal bg-brand-cream/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={closeDrawer}>
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-brand-charcoal bg-brand-green font-display text-sm font-black italic text-brand-neon shadow-[2px_2px_0_#121212] sm:hidden">
            RVR
          </span>
          <Image
            src={ASSET_PATHS.crestMaster}
            alt="Rivervalley Rangers AFC crest"
            width={44}
            height={44}
            className="hidden sm:block"
            priority
          />
          <span className="grid leading-none">
            <span className="font-display text-lg font-black uppercase italic tracking-tight text-brand-charcoal md:text-xl">
              Rivervalley
            </span>
            <span className="font-display text-xs font-bold uppercase tracking-wider text-brand-green">
              Rangers AFC
            </span>
          </span>
        </Link>

        <span className="absolute right-4 top-1 font-mono text-[10px] uppercase tracking-widest bg-neutral-900 text-white px-1.5 py-0.5 rounded lg:hidden">
          v2026.06.15-ALPHA
        </span>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {pathwayLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border-2 border-transparent px-3 py-2 font-display text-sm font-black uppercase text-brand-charcoal transition hover:border-brand-charcoal hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {utilityLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-xs font-black uppercase tracking-wide text-brand-charcoal hover:text-brand-green"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/astro-booking" className="btn-brutalist-neon px-5 py-2.5 text-sm">
            Book Astro
          </Link>
        </div>

        <button
          type="button"
          aria-label={drawerOpen ? "Close main navigation" : "Open main navigation"}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((open) => !open)}
          className="rounded-xl border-3 border-brand-charcoal bg-brand-neon p-2 shadow-[3px_3px_0_#121212] transition active:translate-y-0.5 active:shadow-[1px_1px_0_#121212] lg:hidden"
        >
          {drawerOpen ? (
            <X className="h-6 w-6 text-brand-charcoal" />
          ) : (
            <Menu className="h-6 w-6 text-brand-charcoal" />
          )}
        </button>
      </div>

      {drawerOpen && (
        <div className="fixed inset-x-0 top-20 z-50 max-h-[calc(100vh-5rem)] overflow-y-auto border-b-4 border-brand-charcoal bg-brand-cream lg:hidden">
          <nav className="mx-auto max-w-6xl px-4 py-5" aria-label="Mobile navigation">
            <div className="mb-4 flex items-center gap-2 font-display text-xs font-black uppercase tracking-wide text-brand-green">
              <Users className="h-4 w-4" />
              Team pathways
            </div>
            <div className="grid gap-3">
              {pathwayLinks.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeDrawer}
                  className="rounded-2xl border-3 border-brand-charcoal bg-white p-4 shadow-[4px_4px_0_#121212] transition hover:-translate-y-0.5"
                >
                  <span className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brand-charcoal bg-brand-neon font-display text-sm font-black">
                      {index + 1}
                    </span>
                    <span>
                      <span className="block font-display text-lg font-black uppercase text-brand-charcoal">
                        {item.label}
                      </span>
                      <span className="mt-1 block text-sm font-semibold leading-5 text-zinc-600">
                        {item.description}
                      </span>
                    </span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border-3 border-brand-charcoal bg-[#f1ffe1] p-4">
              <div className="mb-3 flex items-center gap-2 font-display text-xs font-black uppercase tracking-wide text-brand-green">
                <ShieldCheck className="h-4 w-4" />
                Club essentials
              </div>
              <div className="grid gap-2">
                {utilityLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeDrawer}
                    className="rounded-xl border-2 border-brand-charcoal bg-white px-4 py-3 font-display text-sm font-black uppercase text-brand-charcoal"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/astro-booking"
                  onClick={closeDrawer}
                  className="btn-brutalist-green mt-2 px-4 py-3 text-center text-sm"
                >
                  Book Astro
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
