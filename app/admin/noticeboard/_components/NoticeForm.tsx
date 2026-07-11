'use client';

import { useState } from 'react';
import { Megaphone, Newspaper, Wand2 } from 'lucide-react';
import ImageUploadField, { type WatermarkPosition } from '@/components/admin/ImageUploadField';
import FocalPointEditor from '@/components/admin/FocalPointEditor';
import PosterMaker from '@/components/admin/PosterMaker';

// ─── Data shapes ──────────────────────────────────────────────────────────────

export interface NewsFormData {
  id:          string;
  title:       string;
  category:    string;
  body:        string;
  imageUrl:    string | null;
  focalX:      number;
  focalY:      number;
  ctaLabel:    string | null;
  ctaUrl:      string | null;
  expiresAt:   string | null;
  isPublished: boolean;
  pinned:      boolean;
}

export interface CampaignFormData {
  id:             string;
  title:          string;
  subtitle:       string | null;
  heroImageUrl:   string | null;
  mobileImageUrl: string | null;
  ctaLabel:       string;
  ctaUrl:         string;
  audience:       string;
  showOnHomepage: boolean;
  showBanner:     boolean;
  showInHero:     boolean;
  focalX:         number;
  focalY:         number;
  startsAt:       string;
  endsAt:         string | null;
  isPublished:    boolean;
}

type ServerAction = (formData: FormData) => Promise<void>;

interface Props {
  initialType?:   'news' | 'campaign';
  lockType?:      boolean;
  newsAction?:    ServerAction;
  campaignAction?: ServerAction;
  deleteAction?:  ServerAction;
  newsData?:      NewsFormData;
  campaignData?:  CampaignFormData;
}

// ─── Shared styles ────────────────────────────────────────────────────────────

const LABEL = 'block text-sm font-bold text-brand-charcoal mb-1';
const INPUT = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';
const TEXTAREA = 'w-full border-2 border-brand-charcoal px-3 py-2 bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal resize-y';

// Known public destinations — the CTA target is a dropdown (with an
// "Other…" escape hatch) so typos like /regsiter can't happen.
const SITE_TARGETS: Array<{ path: string; label: string }> = [
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
const EXTERNAL_TARGETS: Array<{ path: string; label: string }> = [
  { path: 'https://www.instagram.com/rvrfc1981/', label: 'Instagram — @rvrfc1981' },
];

const CTA_LABELS = [
  'Register Now', 'Join Us', 'Book a Trial', 'Find Out More', 'Read More',
  'Get Involved', 'Contact Us', 'Book Now', 'Learn More', 'Donate', 'Follow Us',
];

const CUSTOM = '__custom';

type SelectOption = { value: string; label: string };

function SelectWithCustom({
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

function CopyPromptHelper() {
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

function ImageGuidelines() {
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

// ─── Unified form ─────────────────────────────────────────────────────────────

export default function NoticeForm({
  initialType = 'news',
  lockType = false,
  newsAction,
  campaignAction,
  deleteAction,
  newsData,
  campaignData,
}: Props) {
  const [type, setType] = useState<'news' | 'campaign'>(initialType);

  const n = newsData;
  const c = campaignData;
  const isEdit = Boolean(n || c);

  // Image state (shared upload component is controlled)
  const [newsImage, setNewsImage]   = useState(n?.imageUrl ?? '');
  const [heroUrl, setHeroUrl]       = useState(c?.heroImageUrl ?? '');
  const [mobileUrl, setMobileUrl]   = useState(c?.mobileImageUrl ?? '');
  const [focalX, setFocalX]         = useState(c?.focalX ?? n?.focalX ?? 50);
  const [focalY, setFocalY]         = useState(c?.focalY ?? n?.focalY ?? 50);
  const [posterOpen, setPosterOpen] = useState(false);
  const [watermark, setWatermark]           = useState(true);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');

  const action = type === 'news' ? newsAction : campaignAction;
  const isNews = type === 'news';

  return (
    <div className="space-y-6">
      {/* Type selector */}
      {!lockType && (
        <div>
          <p className={LABEL}>What are you posting?</p>
          <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Notice type">
            <button
              type="button"
              role="radio"
              aria-checked={isNews}
              onClick={() => setType('news')}
              className={`flex items-center gap-3 border-2 p-4 text-left transition-all ${
                isNews
                  ? 'border-brand-charcoal bg-brand-navy text-brand-cream shadow-brutalist'
                  : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
              }`}
            >
              <Newspaper className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span>
                <span className="block font-display font-black uppercase text-sm">News</span>
                <span className="block text-xs mt-0.5 opacity-80">Something that happened — updates, results, notices</span>
              </span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!isNews}
              onClick={() => setType('campaign')}
              className={`flex items-center gap-3 border-2 p-4 text-left transition-all ${
                !isNews
                  ? 'border-brand-charcoal bg-brand-navy text-brand-cream shadow-brutalist'
                  : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
              }`}
            >
              <Megaphone className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span>
                <span className="block font-display font-black uppercase text-sm">Campaign</span>
                <span className="block text-xs mt-0.5 opacity-80">Something to do — join, register, book, volunteer</span>
              </span>
            </button>
          </div>
        </div>
      )}

      <CopyPromptHelper />

      <form key={type} action={action as (formData: FormData) => void} className="space-y-5">

        {/* ── Shared: title ── */}
        <div>
          <label htmlFor="title" className={LABEL}>Title * <span className="font-normal text-brand-charcoal/50">(max ~5 words, punchy — shown in big capitals)</span></label>
          <input id="title" name="title" type="text" required defaultValue={(isNews ? n?.title : c?.title) ?? ''} placeholder={isNews ? 'U12 Girls Win Cup Final' : 'Players Wanted — Girls U10'} className={INPUT} />
        </div>

        {isNews ? (
          <>
            {/* ── News fields ── */}
            <div>
              <label htmlFor="category" className={LABEL}>Label *</label>
              <select id="category" name="category" required defaultValue={n?.category ?? 'COMMUNITY_NEWS'} className={INPUT}>
                <option value="BREAKING">Breaking News — urgent, time-sensitive</option>
                <option value="CONGRATULATIONS">Congratulations — wins, awards, milestones</option>
                <option value="COMMUNITY_NEWS">Community News — general club updates</option>
                <option value="IN_SYMPATHY">In Sympathy — condolence notices</option>
              </select>
              <p className="mt-1 text-xs text-brand-charcoal/60">
                In Sympathy notices: keep wording gentle and factual — &ldquo;The club extends
                its deepest sympathies to…&rdquo;. Always confirm with the family before publishing.
              </p>
            </div>

            <div>
              <label htmlFor="body" className={LABEL}>Body * <span className="font-normal text-brand-charcoal/50">(markdown, 2–3 paragraphs)</span></label>
              <textarea id="body" name="body" rows={6} required defaultValue={n?.body ?? ''} className={TEXTAREA} />
            </div>

            <div className="space-y-2">
              <ImageUploadField
                id="imageUrl"
                name="imageUrl"
                label="Image"
                hint="optional — shown on the news card, article page, and homepage spotlight"
                url={newsImage}
                onUrlChange={setNewsImage}
                pathPrefix="news"
              />
              <button
                type="button"
                onClick={() => setPosterOpen(true)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border-2 border-dashed border-brand-navy/40 px-4 text-xs font-bold text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5 transition-colors"
              >
                <Wand2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                No photo? Create a graphic — title on club colours or a photo
              </button>
              <ImageGuidelines />
            </div>

            {newsImage && (
              <FocalPointEditor
                heroUrl={newsImage}
                mobileUrl=""
                focalX={focalX}
                focalY={focalY}
                onChange={(x, y) => { setFocalX(x); setFocalY(y); }}
              />
            )}
            <input type="hidden" name="focalX" value={focalX} />
            <input type="hidden" name="focalY" value={focalY} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className={LABEL}>Button Text <span className="font-normal text-brand-charcoal/50">(optional)</span></span>
                <SelectWithCustom
                  name="ctaLabel"
                  initial={n?.ctaLabel ?? ''}
                  options={CTA_LABELS.map((l) => ({ value: l, label: l }))}
                  chooseText="Choose button text…"
                  customText="Other — write my own…"
                  customPlaceholder="e.g. See the Photos"
                />
              </div>
              <div>
                <span className={LABEL}>Button Goes To <span className="font-normal text-brand-charcoal/50">(optional)</span></span>
                <SelectWithCustom
                  name="ctaUrl"
                  initial={n?.ctaUrl ?? ''}
                  groups={[
                    { label: 'Club pages', options: SITE_TARGETS.map((t) => ({ value: t.path, label: t.label })) },
                    { label: 'Off-site',   options: EXTERNAL_TARGETS.map((t) => ({ value: t.path, label: t.label })) },
                  ]}
                  chooseText="Choose a destination…"
                  customText="Other website — paste any link…"
                  customPlaceholder="https://…"
                  customPattern="(https?://|/).*"
                  customPatternHint="Must be a full https:// link or a site path starting with /"
                />
              </div>
            </div>

            <div>
              <label htmlFor="expiresAt" className={LABEL}>Expires At <span className="font-normal text-brand-charcoal/50">(optional — auto-hides after this date)</span></label>
              <input id="expiresAt" name="expiresAt" type="date" defaultValue={n?.expiresAt?.slice(0, 10) ?? ''} className={INPUT} />
            </div>

            <div className="flex gap-8">
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input name="isPublished" type="checkbox" defaultChecked={n?.isPublished ?? false} className="w-5 h-5 accent-brand-neon" />
                <span className="text-sm font-bold text-brand-charcoal">Published</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input name="pinned" type="checkbox" defaultChecked={n?.pinned ?? false} className="w-5 h-5 accent-brand-neon" />
                <span className="text-sm font-bold text-brand-charcoal">Pinned <span className="font-normal text-brand-charcoal/50">(front of the noticeboard)</span></span>
              </label>
            </div>
          </>
        ) : (
          <>
            {/* ── Campaign fields ── */}
            <div>
              <label htmlFor="subtitle" className={LABEL}>Subtitle <span className="font-normal text-brand-charcoal/50">(optional — one sentence, end on the benefit to the reader)</span></label>
              <input id="subtitle" name="subtitle" type="text" defaultValue={c?.subtitle ?? ''} placeholder="Free trial sessions every Saturday in June — no experience needed, just trainers." className={INPUT} />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setPosterOpen(true)}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border-2 border-dashed border-brand-navy/40 px-4 text-xs font-bold text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5 transition-colors"
              >
                <Wand2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                Create a graphic — makes the hero and mobile images together
              </button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadField
                  id="heroImageUrl"
                  name="heroImageUrl"
                  label="Hero Image"
                  hint="optional"
                  url={heroUrl}
                  onUrlChange={setHeroUrl}
                  pathPrefix="campaigns"
                  onWatermarkChange={(w, p) => { setWatermark(w); setWatermarkPosition(p); }}
                />
                <ImageUploadField
                  id="mobileImageUrl"
                  name="mobileImageUrl"
                  label="Mobile Image"
                  hint="portrait crop, so phones don't just get the middle of the wide photo"
                  url={mobileUrl}
                  onUrlChange={setMobileUrl}
                  pathPrefix="campaigns"
                  initialAspect={4 / 5}
                  watermarkFrom={{ watermark, position: watermarkPosition }}
                  required={Boolean(heroUrl)}
                />
              </div>
              <ImageGuidelines />
            </div>

            {heroUrl && (
              <FocalPointEditor
                heroUrl={heroUrl}
                mobileUrl={mobileUrl}
                focalX={focalX}
                focalY={focalY}
                onChange={(x, y) => { setFocalX(x); setFocalY(y); }}
                onMobileCreated={setMobileUrl}
              />
            )}
            <input type="hidden" name="focalX" value={focalX} />
            <input type="hidden" name="focalY" value={focalY} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className={LABEL}>Button Text *</span>
                <SelectWithCustom
                  name="ctaLabel"
                  required
                  initial={c?.ctaLabel ?? ''}
                  options={CTA_LABELS.map((l) => ({ value: l, label: l }))}
                  chooseText="Choose button text…"
                  customText="Other — write my own…"
                  customPlaceholder="e.g. Enter the Draw"
                />
              </div>
              <div>
                <span className={LABEL}>Button Goes To *</span>
                <SelectWithCustom
                  name="ctaUrl"
                  required
                  initial={c?.ctaUrl ?? ''}
                  groups={[
                    { label: 'Club pages', options: SITE_TARGETS.map((t) => ({ value: t.path, label: t.label })) },
                    { label: 'Off-site',   options: EXTERNAL_TARGETS.map((t) => ({ value: t.path, label: t.label })) },
                  ]}
                  chooseText="Choose a destination…"
                  customText="Other website — paste any link…"
                  customPlaceholder="https://…"
                  customPattern="(https?://|/).*"
                  customPatternHint="Must be a full https:// link or a site path starting with /"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="audience" className={LABEL}>Audience * <span className="font-normal text-brand-charcoal/50">(shown as a &ldquo;For parents&rdquo; tag on the card)</span></label>
                <select id="audience" name="audience" required defaultValue={c?.audience ?? 'EVERYONE'} className={INPUT}>
                  <option value="EVERYONE">Everyone</option>
                  <option value="PARENTS">Parents</option>
                  <option value="PLAYERS">Players</option>
                  <option value="COACHES">Coaches</option>
                  <option value="VOLUNTEERS">Volunteers</option>
                  <option value="SPONSORS">Sponsors</option>
                </select>
              </div>
              <div>
                <span className={LABEL}>Placement <span className="font-normal text-brand-charcoal/50">(always on the Campaigns page — add extra reach below)</span></span>
                <div className="flex flex-col gap-1 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                    <input name="showOnHomepage" type="checkbox" defaultChecked={c?.showOnHomepage ?? false} className="w-5 h-5 accent-brand-neon" />
                    <span className="text-sm font-bold text-brand-charcoal">Noticeboard spotlight <span className="font-normal text-brand-charcoal/50">(rotating card below the hero)</span></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                    <input name="showBanner" type="checkbox" defaultChecked={c?.showBanner ?? false} className="w-5 h-5 accent-brand-neon" />
                    <span className="text-sm font-bold text-brand-charcoal">Sitewide banner <span className="font-normal text-brand-charcoal/50">(strongest — newest shows first if several are live)</span></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                    <input name="showInHero" type="checkbox" defaultChecked={c?.showInHero ?? false} className="w-5 h-5 accent-brand-neon" />
                    <span className="text-sm font-bold text-brand-charcoal">Hero background <span className="font-normal text-brand-charcoal/50">(featured photo takes a turn in the top-of-page rotation until it ends — set the ratio in Hero Rotation settings)</span></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startsAt" className={LABEL}>Start Date * <span className="font-normal text-brand-charcoal/50">(goes live automatically)</span></label>
                <input id="startsAt" name="startsAt" type="date" required defaultValue={c?.startsAt?.slice(0, 10) ?? new Date().toISOString().slice(0, 10)} className={INPUT} />
              </div>
              <div>
                <label htmlFor="endsAt" className={LABEL}>End Date <span className="font-normal text-brand-charcoal/50">(optional — expires automatically)</span></label>
                <input id="endsAt" name="endsAt" type="date" defaultValue={c?.endsAt?.slice(0, 10) ?? ''} className={INPUT} />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <input name="isPublished" type="checkbox" defaultChecked={c?.isPublished ?? false} className="w-5 h-5 accent-brand-neon" />
              <span className="text-sm font-bold text-brand-charcoal">Published <span className="font-normal text-brand-charcoal/50">(still respects the date window)</span></span>
            </label>
          </>
        )}

        {/* Sticky on mobile so saving never means scrolling back down */}
        <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-brand-cream/95 backdrop-blur-sm border-t-2 border-brand-charcoal/10 sm:static sm:mx-0 sm:p-0 sm:bg-transparent sm:border-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-0">
          <button
            type="submit"
            className="w-full sm:w-auto bg-brand-neon text-brand-charcoal font-bold px-6 py-3 min-h-[48px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            {isEdit ? 'Save Changes' : isNews ? 'Create News Item' : 'Create Campaign'}
          </button>
        </div>
      </form>

      {posterOpen && (
        <PosterMaker
          onClose={() => setPosterOpen(false)}
          onCreated={({ heroUrl: posterHero, mobileUrl: posterMobile }) => {
            if (isNews) {
              setNewsImage(posterHero);
            } else {
              setHeroUrl(posterHero);
              setMobileUrl(posterMobile);
            }
            setPosterOpen(false);
          }}
        />
      )}

      {deleteAction && (
        <div className="border-t-2 border-brand-charcoal/10 pt-8">
          <h2 className="font-display font-black italic text-lg text-brand-maroon mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-brand-charcoal/60 mb-4">
            This permanently deletes the item and cannot be undone.
          </p>
          <form
            action={deleteAction as (formData: FormData) => void}
            onSubmit={(e) => {
              if (!window.confirm('Delete this item? This cannot be undone.')) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="bg-white text-brand-maroon font-bold px-6 py-3 min-h-[44px] border-2 border-brand-maroon hover:bg-brand-maroon hover:text-white transition-all"
            >
              Delete {isNews ? 'News Item' : 'Campaign'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
