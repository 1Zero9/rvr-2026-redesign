'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabKey = 'table' | 'fixtures' | 'results';

interface TeamPageTabsProps {
  tabs: TabKey[];
  /** Tailwind colour token, e.g. 'brand-sky'. Full class names are resolved
   *  via COLOUR_MAP so Tailwind's static scanner can detect them. */
  activeColour: string;
  table?:    React.ReactNode;
  fixtures?: React.ReactNode;
  results?:  React.ReactNode;
}

// ─── Colour map — must list full class strings for Tailwind to include them ──

const COLOUR_MAP: Record<string, { border: string; text: string }> = {
  'brand-sky':    { border: 'border-brand-sky',    text: 'text-brand-sky'    },
  'brand-maroon': { border: 'border-brand-maroon', text: 'text-brand-maroon' },
  'brand-green':  { border: 'border-brand-green',  text: 'text-brand-green'  },
  'brand-neon':   { border: 'border-brand-neon',   text: 'text-brand-neon'   },
};

const TAB_LABELS: Record<TabKey, string> = {
  table:    'LEAGUE TABLE',
  fixtures: 'FIXTURES',
  results:  'RESULTS',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function TeamPageTabs({
  tabs,
  activeColour,
  table,
  fixtures,
  results,
}: TeamPageTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(tabs[0]);

  const { border, text } = COLOUR_MAP[activeColour] ?? COLOUR_MAP['brand-sky'];
  const panels: Record<TabKey, React.ReactNode> = { table, fixtures, results };

  return (
    <>
      {/* ── Tab bar — sticky below the 64px site header ─────────────────── */}
      <div className="sticky top-16 z-20 bg-brand-cream border-b-2 border-brand-sky/20">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-h-[44px] py-3 text-sm font-bold uppercase tracking-wide transition-colors duration-150 ${
                  isActive
                    ? `border-b-2 ${border} ${text}`
                    : 'text-brand-charcoal/50'
                }`}
              >
                {TAB_LABELS[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Active panel ─────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto pt-6 px-4 md:px-0 pb-8">
        {panels[activeTab]}
      </div>
    </>
  );
}
