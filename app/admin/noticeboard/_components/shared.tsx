'use client';

import { useState } from 'react';

// ─── Shared styles ────────────────────────────────────────────────────────────

export const LABEL = 'block text-sm font-bold text-brand-charcoal mb-1';
export const INPUT = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';
export const TEXTAREA = 'w-full border-2 border-brand-charcoal px-3 py-2 bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal resize-y';

// Known public destinations — the CTA target is a dropdown (with an
// "Other…" escape hatch) so typos like /regsiter can't happen.
export const SITE_TARGETS: Array<{ path: string; label: string }> = [
  { path: '/register',             label: 'Join — Register a Player' },
  { path: '/membership-calculator', label: 'Fee Calculator' },
  { path: '/contact',              label: 'Contact the Club' },
  { path: '/teams',                label: 'All Teams' },
  { path: '/fixtures',             label: 'Fixtures & Results' },
  { path: '/academy',              label: 'Development Academy' },
  { path: '/campaigns',            label: 'Campaigns' },
  { path: '/news',                 label: 'News & Noticeboard' },
  { path: '/community',            label: 'Community Football' },
  { path: '/walking-football',     label: 'Walking Football' },
  { path: '/ladies-football',      label: 'Ladies Football' },
  { path: '/football-for-all',     label: 'Football For All' },
  { path: '/seniors',              label: 'Seniors' },
  { path: '/astro-booking',        label: 'Book the Astro Pitch' },
  { path: '/boot-room',            label: 'Boot Room Exchange' },
  { path: '/shop',                 label: 'Club Shop' },
  { path: '/sponsorship',          label: 'Sponsorship' },
  { path: '/get-involved',         label: 'Volunteer & Coach' },
  { path: '/club',                 label: 'Club Overview' },
  { path: '/club/history',         label: 'Club History' },
  { path: '/club/anniversary',     label: '45th Anniversary' },
  { path: '/club/safeguarding',    label: 'Safeguarding' },
  { path: '/club/refereeing',      label: 'Become a Referee' },
  { path: '/pathway',              label: 'Player Pathway' },
  { path: '/pitch-locations',      label: 'Pitch Locations' },
];

// Off-site destinations the club actually uses — shown in their own group so
// social CTAs don't require pasting a URL by hand.
export const EXTERNAL_TARGETS: Array<{ path: string; label: string }> = [
  { path: 'https://www.instagram.com/rvrfc1981/', label: 'Instagram — @rvrfc1981' },
];

export const CTA_LABELS = [
  'Register Now', 'Join Us', 'Book a Trial', 'Find Out More', 'Read More',
  'Get Involved', 'Contact Us', 'Book Now', 'Learn More', 'Donate', 'Follow Us',
];

const CUSTOM = '__custom';

type SelectOption = { value: string; label: string };

export function SelectWithCustom({
  name,
  required,
  initial,
  options = [],
  groups,
  chooseText,
  customText,
  customPlaceholder,
  customPattern,
  customPatternHint,
}: {
  name: string;
  required?: boolean;
  initial: string;
  options?: SelectOption[];
  groups?: Array<{ label: string; options: SelectOption[] }>;
  chooseText: string;
  customText: string;
  customPlaceholder: string;
  customPattern?: string;
  customPatternHint?: string;
}) {
  const allOptions = groups ? groups.flatMap((g) => g.options) : options;
  const isKnown = initial === '' || allOptions.some((o) => o.value === initial);
  const [custom, setCustom] = useState(!isKnown);

  if (custom) {
    return (
      <div className="flex gap-2">
        <input
          name={name}
          type="text"
          required={required}
          defaultValue={initial}
          placeholder={customPlaceholder}
          pattern={customPattern}
          title={customPatternHint}
          className={INPUT}
          autoFocus={initial === ''}
        />
        <button
          type="button"
          onClick={() => setCustom(false)}
          className="shrink-0 min-h-[44px] px-3 border-2 border-brand-charcoal/30 text-xs font-bold text-brand-charcoal/60 hover:border-brand-charcoal hover:text-brand-charcoal transition-colors"
        >
          List
        </button>
      </div>
    );
  }

  return (
    <select
      name={name}
      required={required}
      defaultValue={initial}
      className={INPUT}
      onChange={(e) => {
        if (e.target.value === CUSTOM) setCustom(true);
      }}
    >
      <option value="" disabled={required}>{required ? chooseText : '— None —'}</option>
      {groups
        ? groups.map((g) => (
            <optgroup key={g.label} label={g.label}>
              {g.options.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </optgroup>
          ))
        : options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
      <option value={CUSTOM}>{customText}</option>
    </select>
  );
}

// ─── Copy prompt helper ───────────────────────────────────────────────────────

const COPY_PROMPT = `You are writing website copy for Rivervalley Rangers AFC, a community football club in Swords, Dublin, founded in 1981.

Tone: warm, direct, confident, community-first. Plain Irish/UK English. No corporate speak, no clichés, no hype the club can't back up. Write like a friendly coach, not a marketing agency.

The item: [DESCRIBE IT — what it is, who it's for, key dates, cost, where it happens]

The audience: [parents / players / coaches / volunteers / sponsors]

Give me exactly:
1. TITLE — maximum 5 words, punchy, works in capital letters, no punctuation. Example style: "Players Wanted — Girls U10"
2. SUBTITLE or OPENING SENTENCE — one persuasive sentence, maximum 20 words, plain language, ends on the benefit to the reader.
3. CTA LABEL — 2 or 3 words starting with an action verb. Example style: "Register Now", "Book a Trial", "Get Involved"

Then give me one alternative version of each.`;

export function CopyPromptHelper() {
  const [copied, setCopied] = useState(false);

  return (
    <details className="border-2 border-brand-navy/15 bg-white">
      <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 transition-colors">
        ✍️ Need help writing the copy? Use the club-tone AI prompt
      </summary>
      <div className="border-t border-brand-navy/10 p-4 space-y-3">
        <p className="text-xs text-brand-charcoal/60">
          Copy this into ChatGPT, Claude, or any AI assistant. Fill in the two
          [BRACKETED] parts, and it will return a title, subtitle, and CTA in the
          club&rsquo;s voice — so everything sounds consistent no matter who writes it.
        </p>
        <pre className="whitespace-pre-wrap border border-brand-charcoal/15 bg-brand-cream p-3 text-xs text-brand-charcoal/80 max-h-48 overflow-y-auto">{COPY_PROMPT}</pre>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(COPY_PROMPT).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            });
          }}
          className="inline-flex min-h-[40px] items-center border-2 border-brand-navy bg-brand-navy px-4 text-xs font-bold text-brand-cream hover:bg-brand-navy/85 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy prompt'}
        </button>
      </div>
    </details>
  );
}

// ─── Image guidelines ─────────────────────────────────────────────────────────

const IMAGE_SPECS: Array<{ use: string; size: string; note: string }> = [
  { use: 'Campaign hero',  size: '1920 × 1080px (16:9)', note: 'Landscape. Minimum 1600px wide — used full-width on desktop.' },
  { use: 'Campaign mobile', size: '1080 × 1350px (4:5)', note: 'Portrait crop shown on phones instead of the hero.' },
  { use: 'News image',      size: '1600 × 900px (16:9)', note: 'One landscape image covers the card, article, and spotlight.' },
];

export function ImageGuidelines() {
  return (
    <details className="border-2 border-brand-navy/15 bg-white">
      <summary className="cursor-pointer px-4 py-2.5 text-xs font-bold text-brand-navy hover:bg-brand-navy/5 transition-colors inline-flex w-full items-center gap-2">
        <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-brand-navy text-[10px] font-black">i</span>
        Image guidelines — sizes, formats, resolution
      </summary>
      <div className="border-t border-brand-navy/10 p-4 space-y-3 text-xs text-brand-charcoal/80">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left">
          <thead>
            <tr className="text-[10px] font-black uppercase tracking-wider text-brand-green">
              <th className="pb-1 pr-3">Use</th>
              <th className="pb-1 pr-3">Optimal size</th>
              <th className="pb-1">Notes</th>
            </tr>
          </thead>
          <tbody>
            {IMAGE_SPECS.map((spec) => (
              <tr key={spec.use} className="border-t border-brand-navy/10 align-top">
                <td className="py-1.5 pr-3 font-bold whitespace-nowrap">{spec.use}</td>
                <td className="py-1.5 pr-3 whitespace-nowrap">{spec.size}</td>
                <td className="py-1.5">{spec.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <ul className="list-disc pl-4 space-y-1">
          <li><strong>Formats:</strong> JPG, PNG, or WebP. Maximum 15MB per file.</li>
          <li><strong>Resolution:</strong> 72dpi is fine for the web — pixel dimensions are what matter, not print DPI.</li>
          <li><strong>Bigger is fine:</strong> larger photos are accepted and scaled down; avoid images narrower than 1200px, which look soft on desktop.</li>
          <li><strong>Cropping:</strong> images are never distorted — each slot crops to fit. Use the focal-point tool below the upload to control what stays in frame.</li>
        </ul>
      </div>
    </details>
  );
}
