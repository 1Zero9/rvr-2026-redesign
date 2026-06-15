"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Heart,
  HelpCircle,
  Megaphone,
  Menu,
  Shield,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { ASSET_PATHS } from "@/config/assets";

const sections = [
  {
    label: "Girls & Women",
    description: "Girls teams and women pathway",
    icon: Users,
    links: [
      { href: "/teams", label: "Squad Directory" },
      { href: "/football-for-all", label: "Girls Football For All" },
      { href: "/teams/matches", label: "Fixtures & Results" },
    ],
  },
  {
    label: "Junior Academy",
    description: "U7 to U12 foundation football",
    icon: HelpCircle,
    links: [
      { href: "/teams", label: "Squad Directory" },
      { href: "/teams/matches", label: "Fixtures & Results" },
      { href: "/football-for-all", label: "Fun Football Sessions" },
      { href: "/register", label: "Register Now" },
      { href: "/register", label: "Family Registration" },
    ],
  },
  {
    label: "Youth Competitive",
    description: "U13 to U18 league teams",
    icon: Activity,
    links: [
      { href: "/teams/matches", label: "Fixtures & Results" },
      { href: "/ddsl-jmo", label: "DDSL Schedule" },
      { href: "/teams", label: "Squad Directory" },
      { href: "/register", label: "Register Now" },
      { href: "/register", label: "Family Registration" },
    ],
  },
  {
    label: "Seniors",
    description: "Adult squads and senior football",
    icon: Trophy,
    links: [
      { href: "/teams", label: "Squad Directory" },
      { href: "/teams/matches", label: "Fixtures & Results" },
    ],
  },
  {
    label: "Inclusive",
    description: "Accessible football for all players",
    icon: Heart,
    links: [
      { href: "/football-for-all", label: "Football For All" },
      { href: "/football-for-all#sensory", label: "Sensory Sessions" },
      { href: "/football-for-all#walking", label: "Walking Football" },
    ],
  },
  {
    label: "Safeguarding",
    description: "FAI compliance and welfare",
    icon: Shield,
    links: [
      { href: "/club/safeguarding", label: "Safeguarding Statement" },
      { href: "/club/safeguarding", label: "Garda Vetting" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    label: "Campaigns",
    description: "Club events and initiatives",
    icon: Megaphone,
    links: [
      { href: "/campaigns/colour-fun-run", label: "Colour Fun Run" },
      { href: "/club/anniversary", label: "40th Anniversary Kit" },
      { href: "/shop", label: "Shop" },
      { href: "/membership-calculator", label: "Fees Calculator" },
    ],
  },
] as const;

const utilityLinks = [
  { href: "/membership-calculator", label: "Fees" },
  { href: "/shop", label: "Shop" },
] as const;

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setActiveSection(null);
  };

  const toggleSection = (label: string) =>
    setActiveSection((prev) => (prev === label ? null : label));

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <header className="relative sticky top-0 z-50 glass-dark border-b border-brand-sky/20">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-3 px-4 md:px-6">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={closeDrawer}>
          {/* Mobile: text badge */}
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-brand-sky/40 bg-brand-green font-display text-sm font-black italic text-brand-neon shadow-[2px_2px_0_rgba(184,205,238,0.25)] sm:hidden">
            RVR
          </span>
          {/* Desktop: crest image */}
          <Image
            src={ASSET_PATHS.crestMaster}
            alt="Rivervalley Rangers AFC crest"
            width={44}
            height={44}
            className="hidden sm:block rounded-lg"
            priority
          />
          <span className="grid leading-none">
            <span className="font-display text-lg font-black uppercase italic tracking-tight text-white md:text-xl">
              Rivervalley
            </span>
            <span className="font-display text-xs font-bold uppercase tracking-wider text-brand-neon">
              Rangers AFC
            </span>
          </span>
        </Link>

        {/* Version tag — mobile only */}
        <span className="absolute right-16 top-1 rounded bg-brand-navy px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-brand-sky/70 border border-brand-sky/20 lg:hidden">
          v2026.06.15-ALPHA
        </span>

        {/* Desktop dropdown navigation */}
        <nav
          className="hidden min-w-0 flex-1 items-center justify-between lg:flex"
          aria-label="Main navigation"
        >
          {sections.map((section, index) => {
            // Last two sections (Safeguarding, Campaigns) anchor right to avoid viewport overflow
            const alignRight = index >= sections.length - 2;

            return (
              <div key={section.label} className="relative group/menu">
                <button
                  className="flex items-center gap-0.5 whitespace-nowrap rounded-lg px-1 xl:px-1.5 py-2 font-display text-[9px] xl:text-[10px] font-black uppercase tracking-tight xl:tracking-normal text-white/85 transition-colors hover:text-brand-neon focus:outline-none focus:ring-2 focus:ring-brand-neon/50"
                  aria-haspopup="true"
                  aria-label={`Open ${section.label} menu`}
                >
                  {section.label}
                  <ChevronDown className="h-3 w-3 shrink-0 transition-transform duration-150 group-hover/menu:rotate-180" />
                </button>

                {/*
                  Hover gap fix: outer wrapper starts at top-full with NO margin.
                  The pt-3 transparent top-padding acts as an invisible bridge so
                  the cursor remains inside the group-hover zone as it travels
                  downward. hidden/block means this has zero layout footprint when
                  closed and cannot push horizontal nav items around.
                */}
                <div
                  className={`absolute top-full z-50 hidden pt-3 group-hover/menu:block w-56 xl:w-60 ${
                    alignRight ? "right-0" : "left-0"
                  }`}
                >
                  <div
                    className="rounded-xl border-2 bg-white py-2 shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                    style={{ borderColor: "#B8CDEE" }}
                  >
                    {section.links.map((link) => (
                      <Link
                        key={`${section.label}-${link.label}`}
                        href={link.href}
                        className="flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-brand-charcoal transition-colors hover:bg-[#F5F0F5]"
                        onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#8B1E4D"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = ""; }}
                      >
                        {link.label}
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-30" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Desktop CTA — neon green for conversion focus */}
        <div className="hidden shrink-0 items-center lg:flex">
          <Link href="/register" className="btn-brutalist-neon px-4 xl:px-5 py-2.5 text-xs whitespace-nowrap">
            Join the Team
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={drawerOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((o) => !o)}
          className="rounded-xl border-2 border-brand-sky/30 bg-brand-neon p-2 shadow-[3px_3px_0_rgba(184,205,238,0.3)] transition active:translate-y-0.5 active:shadow-none lg:hidden"
        >
          {drawerOpen ? (
            <X className="h-6 w-6 text-brand-charcoal" />
          ) : (
            <Menu className="h-6 w-6 text-brand-charcoal" />
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-x-0 top-20 z-50 flex max-h-[calc(100vh-5rem)] flex-col overflow-y-auto border-b border-brand-sky/20 bg-brand-navy lg:hidden">
          <nav className="mx-auto w-full max-w-6xl px-4 py-5" aria-label="Mobile navigation">

            <div className="mb-4 flex items-center gap-2 font-display text-xs font-black uppercase tracking-wide text-brand-neon">
              <Users className="h-4 w-4" />
              Team Pathways
            </div>

            <div className="grid gap-3">
              {sections.map((section, index) => {
                const Icon = section.icon;
                const expanded = activeSection === section.label;
                return (
                  <div
                    key={section.label}
                    className="rounded-2xl border border-brand-sky/20 bg-white/5"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.label)}
                      aria-expanded={expanded}
                      className="flex w-full items-center gap-4 p-4 text-left"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-brand-sky/40 bg-brand-neon font-display text-sm font-black text-brand-charcoal">
                        {index + 1}
                      </span>
                      <span className="flex-1">
                        <span className="block font-display text-base font-black uppercase text-white">
                          {section.label}
                        </span>
                        <span className="mt-0.5 block text-xs font-semibold text-zinc-400">
                          {section.description}
                        </span>
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-white/50 transition-transform duration-200 ${
                          expanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expanded && (
                      <div className="border-t border-brand-sky/20 px-4 pb-3 pt-2 space-y-1">
                        {section.links.map((link) => (
                          <Link
                            key={`mobile-${section.label}-${link.label}`}
                            href={link.href}
                            onClick={closeDrawer}
                            className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-zinc-300 transition-colors hover:text-brand-neon"
                          >
                            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-brand-neon/60" />
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Club essentials */}
            <div className="mt-6 rounded-2xl border border-brand-sky/20 bg-white/5 p-4">
              <div className="mb-3 flex items-center gap-2 font-display text-xs font-black uppercase tracking-wide text-brand-neon">
                <ShieldCheck className="h-4 w-4" />
                Club Essentials
              </div>
              <div className="grid gap-2">
                {utilityLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeDrawer}
                    className="rounded-xl border border-brand-sky/20 bg-white/5 px-4 py-3 font-display text-sm font-black uppercase text-white transition-colors hover:bg-white/10"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile CTAs */}
            <div className="mt-4 grid gap-3">
              <Link
                href="/register"
                onClick={closeDrawer}
                className="btn-brutalist-neon block py-3.5 text-center text-sm"
              >
                Join the Team
              </Link>
              <Link
                href="/astro-booking"
                onClick={closeDrawer}
                className="btn-brutalist-green block py-3.5 text-center text-sm"
              >
                Book Astro Pitch
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
