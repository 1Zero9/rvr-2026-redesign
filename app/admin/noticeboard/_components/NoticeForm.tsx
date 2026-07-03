'use client';

import { useState } from 'react';
import { Megaphone, Newspaper } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';

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

// Known public routes — suggested in the CTA URL field to prevent typos
// like /regsiter. Free entry still allowed for external URLs.
const SITE_PATHS = [
  '/register', '/contact', '/membership-calculator', '/teams', '/fixtures',
  '/academy', '/campaigns', '/news', '/community', '/walking-football',
  '/ladies-football', '/football-for-all', '/seniors', '/astro-booking',
  '/boot-room', '/shop', '/sponsorship', '/get-involved', '/club',
  '/club/history', '/club/safeguarding', '/club/anniversary', '/pathway',
  '/pitch-locations',
];

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
        <table className="w-full text-left">
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

// ─── Focal point editor (campaigns) ───────────────────────────────────────────

function FocalPointEditor({
  heroUrl,
  mobileUrl,
  focalX,
  focalY,
  onChange,
}: {
  heroUrl: string;
  mobileUrl: string;
  focalX: number;
  focalY: number;
  onChange: (x: number, y: number) => void;
}) {
  const objectPosition = `${focalX}% ${focalY}%`;

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onChange(Math.min(100, Math.max(0, x)), Math.min(100, Math.max(0, y)));
  }

  return (
    <div className="border-2 border-brand-navy/15 bg-white p-4 space-y-4">
      <div>
        <p className="text-sm font-bold text-brand-charcoal">Crop preview &amp; focal point</p>
        <p className="text-xs text-brand-charcoal/60 mt-0.5">
          Each placement crops the image to a different shape. Click the photo below to set
          the focal point — the previews show exactly what visitors will see.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-1.5">
            Full image — click to set focal point
          </p>
          <div
            className="relative cursor-crosshair select-none border-2 border-brand-charcoal/20"
            onClick={handleClick}
            role="application"
            aria-label="Click to set the image focal point"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroUrl} alt="" className="block w-full" draggable={false} />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-brand-neon shadow-[0_0_0_2px_rgba(0,0,0,0.6)]"
              style={{ left: `${focalX}%`, top: `${focalY}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-1.5">
              Desktop card crop
            </p>
            <div className="aspect-[21/9] overflow-hidden border-2 border-brand-charcoal/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroUrl} alt="" className="h-full w-full object-cover" style={{ objectPosition }} />
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-28">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-1.5">
                Mobile crop
              </p>
              <div className="aspect-[4/5] overflow-hidden border-2 border-brand-charcoal/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mobileUrl || heroUrl} alt="" className="h-full w-full object-cover" style={{ objectPosition }} />
              </div>
            </div>
            <p className="flex-1 self-end text-xs text-brand-charcoal/50 pb-1">
              {mobileUrl
                ? 'Mobile uses the separate portrait upload.'
                : 'No mobile image uploaded — phones will crop the hero image as shown.'}
            </p>
          </div>
        </div>
      </div>
    </div>
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

  const action = type === 'news' ? newsAction : campaignAction;
  const isNews = type === 'news';

  return (
    <div className="space-y-6">
      <datalist id="site-paths">
        {SITE_PATHS.map((p) => <option key={p} value={p} />)}
      </datalist>

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
                <label htmlFor="ctaLabel" className={LABEL}>CTA Label <span className="font-normal text-brand-charcoal/50">(optional — 2–3 words, start with a verb)</span></label>
                <input id="ctaLabel" name="ctaLabel" type="text" defaultValue={n?.ctaLabel ?? ''} placeholder="Read More" className={INPUT} />
              </div>
              <div>
                <label htmlFor="ctaUrl" className={LABEL}>CTA URL <span className="font-normal text-brand-charcoal/50">(optional — /register, /contact…)</span></label>
                <input id="ctaUrl" name="ctaUrl" type="text" list="site-paths" defaultValue={n?.ctaUrl ?? ''} placeholder="/register" className={INPUT} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUploadField
                  id="heroImageUrl"
                  name="heroImageUrl"
                  label="Hero Image"
                  hint="optional"
                  url={heroUrl}
                  onUrlChange={setHeroUrl}
                  pathPrefix="campaigns"
                />
                <ImageUploadField
                  id="mobileImageUrl"
                  name="mobileImageUrl"
                  label="Mobile Image"
                  hint="optional — portrait crop"
                  url={mobileUrl}
                  onUrlChange={setMobileUrl}
                  pathPrefix="campaigns"
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
              />
            )}
            <input type="hidden" name="focalX" value={focalX} />
            <input type="hidden" name="focalY" value={focalY} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ctaLabel" className={LABEL}>CTA Label * <span className="font-normal text-brand-charcoal/50">(2–3 words, start with a verb)</span></label>
                <input id="ctaLabel" name="ctaLabel" type="text" required defaultValue={c?.ctaLabel ?? ''} placeholder="Book a Trial" className={INPUT} />
              </div>
              <div>
                <label htmlFor="ctaUrl" className={LABEL}>CTA URL * <span className="font-normal text-brand-charcoal/50">(where the button goes — /register, /contact, /astro-booking…)</span></label>
                <input id="ctaUrl" name="ctaUrl" type="text" list="site-paths" required defaultValue={c?.ctaUrl ?? ''} placeholder="/register" className={INPUT} />
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
                    <span className="text-sm font-bold text-brand-charcoal">Homepage spotlight <span className="font-normal text-brand-charcoal/50">(rotating hero slot)</span></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer min-h-[36px]">
                    <input name="showBanner" type="checkbox" defaultChecked={c?.showBanner ?? false} className="w-5 h-5 accent-brand-neon" />
                    <span className="text-sm font-bold text-brand-charcoal">Sitewide banner <span className="font-normal text-brand-charcoal/50">(strongest — newest shows first if several are live)</span></span>
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

        <button
          type="submit"
          className="bg-brand-neon text-brand-charcoal font-bold px-6 py-3 min-h-[44px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
        >
          {isEdit ? 'Save Changes' : isNews ? 'Create News Item' : 'Create Campaign'}
        </button>
      </form>

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
