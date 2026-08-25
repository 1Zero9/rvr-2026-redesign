'use client';

import { useState } from 'react';

// Every campaign always shows on /campaigns — these are the *extra* spots.
// Names must exactly match the Campaign model's boolean fields, since the
// checkbox `name` is read directly by createCampaign/updateCampaign.
const OPTIONS: Array<{
  name: 'showOnHomepage' | 'showBanner' | 'showInHero' | 'highlight';
  label: string;
  hint: string;
  icon: string;
}> = [
  {
    name: 'showOnHomepage',
    label: 'Noticeboard spotlight',
    hint: 'Rotating card below the homepage hero — campaigns + news together.',
    icon: '📌',
  },
  {
    name: 'showBanner',
    label: 'Sitewide banner',
    hint: 'Thin strip at the top of every page. Newest wins if several are live.',
    icon: '📣',
  },
  {
    name: 'showInHero',
    label: 'Hero background',
    hint: 'Rotates into the big photo/video slot at the top of the homepage.',
    icon: '🖼️',
  },
  {
    name: 'highlight',
    label: 'Highlight badge',
    hint: 'Pulsing floating badge, bottom-right, on every homepage visit. Use sparingly.',
    icon: '✨',
  },
];

export default function PlacementPicker({
  defaults,
}: {
  defaults: {
    showOnHomepage: boolean;
    showBanner: boolean;
    showInHero: boolean;
    highlight: boolean;
  };
}) {
  const [checked, setChecked] = useState(defaults);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {OPTIONS.map((opt) => {
        const isOn = checked[opt.name];
        return (
          <label
            key={opt.name}
            className={`flex items-start gap-3 border-2 p-3 cursor-pointer transition-all min-h-[44px] ${
              isOn
                ? 'border-brand-charcoal bg-brand-neon/10'
                : 'border-brand-charcoal/15 bg-white hover:border-brand-charcoal/40'
            }`}
          >
            <input
              type="checkbox"
              name={opt.name}
              defaultChecked={defaults[opt.name]}
              onChange={(e) =>
                setChecked((prev) => ({ ...prev, [opt.name]: e.target.checked }))
              }
              className="mt-0.5 w-5 h-5 shrink-0 accent-brand-neon"
            />
            <span>
              <span className="block text-sm font-bold text-brand-charcoal">
                <span aria-hidden="true">{opt.icon}</span> {opt.label}
              </span>
              <span className="block text-xs text-brand-charcoal/60 mt-0.5">{opt.hint}</span>
            </span>
          </label>
        );
      })}
    </div>
  );
}
