'use client';

import { useRef, useState } from 'react';
import { Megaphone, Newspaper, Wand2, ArrowLeft, ArrowRight } from 'lucide-react';
import ImageUploadField from '@/components/admin/ImageUploadField';
import FocalPointEditor from '@/components/admin/FocalPointEditor';
import PosterMaker from '@/components/admin/PosterMaker';
import {
  LABEL,
  INPUT,
  TEXTAREA,
  SITE_TARGETS,
  EXTERNAL_TARGETS,
  CTA_LABELS,
  SelectWithCustom,
  CopyPromptHelper,
  ImageGuidelines,
} from './shared';
import PlacementPicker from './PlacementPicker';

type Kind = 'news' | 'campaign';
type ServerAction = (formData: FormData) => Promise<void>;

const STEP_LABELS = ['Photo', 'Write it up', 'Share'];

const CATEGORIES: Array<{ value: string; label: string; className: string }> = [
  { value: 'COMMUNITY_NEWS',  label: 'Community News',  className: 'border-brand-sky bg-brand-sky/15 text-brand-navy' },
  { value: 'BREAKING',        label: 'Breaking News',   className: 'border-brand-maroon bg-brand-maroon/15 text-brand-maroon' },
  { value: 'CONGRATULATIONS', label: 'Congratulations', className: 'border-brand-neon bg-brand-neon/25 text-brand-charcoal' },
  { value: 'IN_SYMPATHY',     label: 'In Sympathy',     className: 'border-brand-navy bg-brand-navy/10 text-brand-navy' },
];

const FIELD_LABELS: Record<string, string> = {
  title: 'a headline',
  body: 'a caption',
};

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
  highlight:      boolean;
  focalX:         number;
  focalY:         number;
  startsAt:       string;
  endsAt:         string | null;
  isPublished:    boolean;
}

export default function ContentWizard({
  newsAction,
  campaignAction,
  deleteAction,
  initialKind = 'news',
  lockType = false,
  newsData,
  campaignData,
}: {
  newsAction: ServerAction;
  campaignAction: ServerAction;
  deleteAction?: ServerAction;
  initialKind?: Kind;
  lockType?: boolean;
  newsData?: NewsFormData;
  campaignData?: CampaignFormData;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const n = newsData;
  const c = campaignData;
  const isEdit = Boolean(n || c);

  const [kind, setKind] = useState<Kind>(initialKind);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);
  const [category, setCategory] = useState(n?.category ?? 'COMMUNITY_NEWS');

  const [image, setImage] = useState(n?.imageUrl ?? c?.heroImageUrl ?? '');
  const [mobileImage, setMobileImage] = useState(c?.mobileImageUrl ?? '');
  const [focalX, setFocalX] = useState(n?.focalX ?? c?.focalX ?? 50);
  const [focalY, setFocalY] = useState(n?.focalY ?? c?.focalY ?? 50);
  const [posterOpen, setPosterOpen] = useState(false);

  const isNews = kind === 'news';
  const totalSteps = 3;
  const today = new Date().toISOString().slice(0, 10);

  function validateStep2(): boolean {
    const required = isNews ? ['title', 'body'] : ['title'];
    const data = new FormData(formRef.current ?? undefined);
    const missing = required.filter((name) => !String(data.get(name) ?? '').trim());
    setErrors(missing);
    return missing.length === 0;
  }

  function goNext() {
    if (step === 2 && !validateStep2()) return;
    setErrors([]);
    setStep((s) => Math.min(totalSteps, s + 1));
  }

  function goBack() {
    setErrors([]);
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <ol className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1;
          const active = stepNum === step;
          const done = stepNum < step;
          return (
            <li key={label} className="flex items-center gap-1.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  active
                    ? 'border-brand-charcoal bg-brand-neon text-brand-charcoal'
                    : done
                    ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream'
                    : 'border-brand-charcoal/30 text-brand-charcoal/40'
                }`}
              >
                {stepNum}
              </span>
              <span className={active ? 'text-brand-charcoal' : 'text-brand-charcoal/40'}>{label}</span>
              {stepNum < totalSteps && <span className="mx-1 text-brand-charcoal/20">—</span>}
            </li>
          );
        })}
      </ol>

      <form
        ref={formRef}
        action={(isNews ? newsAction : campaignAction) as (formData: FormData) => void}
        className="space-y-5"
      >
        <input type="hidden" name="category" value={category} />
        <input type="hidden" name="focalX" value={focalX} />
        <input type="hidden" name="focalY" value={focalY} />
        {!isNews && <input type="hidden" name="mobileImageUrl" value={mobileImage} />}

        {/* ── Step 1: Photo ── */}
        <div className={step === 1 ? 'space-y-4' : 'hidden'}>
          {!lockType && (
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Content type">
              <button
                type="button"
                role="radio"
                aria-checked={isNews}
                onClick={() => setKind('news')}
                className={`flex items-center justify-center gap-2 border-2 px-3 py-2.5 min-h-[44px] text-sm font-bold transition-all ${
                  isNews
                    ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                    : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
                }`}
              >
                <Newspaper className="h-4 w-4 shrink-0" aria-hidden="true" /> News
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={!isNews}
                onClick={() => setKind('campaign')}
                className={`flex items-center justify-center gap-2 border-2 px-3 py-2.5 min-h-[44px] text-sm font-bold transition-all ${
                  !isNews
                    ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                    : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
                }`}
              >
                <Megaphone className="h-4 w-4 shrink-0" aria-hidden="true" /> Campaign
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setPosterOpen(true)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border-2 border-dashed border-brand-navy/40 px-4 text-xs font-bold text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5 transition-colors"
          >
            <Wand2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            No photo? Create a graphic instead
          </button>

          <ImageUploadField
            id={isNews ? 'imageUrl' : 'heroImageUrl'}
            name={isNews ? 'imageUrl' : 'heroImageUrl'}
            label="Photo"
            hint={isNews ? 'optional — shown on the card, article, and spotlight' : 'optional — phones get an auto-cropped version'}
            url={image}
            onUrlChange={setImage}
            pathPrefix={isNews ? 'news' : 'campaigns'}
          />

          <ImageGuidelines />

          {image && (
            <FocalPointEditor
              heroUrl={image}
              mobileUrl={isNews ? '' : mobileImage}
              focalX={focalX}
              focalY={focalY}
              onChange={(x, y) => { setFocalX(x); setFocalY(y); }}
              {...(isNews ? {} : { onMobileCreated: setMobileImage })}
            />
          )}
        </div>

        {/* ── Step 2: Write it up ── */}
        <div className={step === 2 ? 'space-y-5' : 'hidden'}>
          <CopyPromptHelper />

          <div>
            <label htmlFor="title" className={LABEL}>Headline <span className="font-normal text-brand-charcoal/50">(max ~5 words, punchy)</span></label>
            <input id="title" name="title" type="text" defaultValue={(isNews ? n?.title : c?.title) ?? ''} placeholder={isNews ? 'U12 Girls Win Cup Final' : 'Players Wanted — Girls U10'} className={INPUT} />
          </div>

          {isNews && (
            <div>
              <p className={LABEL}>Label</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    aria-pressed={category === cat.value}
                    onClick={() => setCategory(cat.value)}
                    className={`min-h-[44px] px-3 border-2 text-xs font-bold transition-colors ${
                      category === cat.value ? cat.className : 'border-brand-charcoal/15 bg-white text-brand-charcoal/50 hover:border-brand-charcoal/40'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor={isNews ? 'body' : 'subtitle'} className={LABEL}>
              Caption {isNews && <span className="font-normal text-brand-charcoal/50">(markdown, 2–3 paragraphs)</span>}
            </label>
            {isNews ? (
              <textarea id="body" name="body" rows={6} defaultValue={n?.body ?? ''} className={TEXTAREA} />
            ) : (
              <textarea
                id="subtitle"
                name="subtitle"
                rows={2}
                defaultValue={c?.subtitle ?? ''}
                placeholder="Free trial sessions every Saturday in June — no experience needed, just trainers."
                className={TEXTAREA}
              />
            )}
          </div>

          <details className="border-2 border-brand-navy/15 bg-white" open={isEdit && Boolean((isNews ? n?.ctaLabel : c?.ctaLabel))}>
            <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 transition-colors">
              🔘 Add a button
            </summary>
            <div className="border-t border-brand-navy/10 p-4 space-y-4">
              <div>
                <span className={LABEL}>Button Text</span>
                <SelectWithCustom
                  name="ctaLabel"
                  initial={isNews ? (n?.ctaLabel ?? '') : (c?.ctaLabel ?? (isEdit ? '' : 'Find Out More'))}
                  options={CTA_LABELS.map((l) => ({ value: l, label: l }))}
                  chooseText="Choose button text…"
                  customText="Other — write my own…"
                  customPlaceholder="e.g. Enter the Draw"
                />
              </div>
              <div>
                <span className={LABEL}>Button Goes To</span>
                <SelectWithCustom
                  name="ctaUrl"
                  initial={isNews ? (n?.ctaUrl ?? '') : (c?.ctaUrl ?? (isEdit ? '' : '/campaigns'))}
                  groups={[
                    { label: 'Club pages', options: SITE_TARGETS.map((t) => ({ value: t.path, label: t.label })) },
                    { label: 'Off-site', options: EXTERNAL_TARGETS.map((t) => ({ value: t.path, label: t.label })) },
                  ]}
                  chooseText="Choose a destination…"
                  customText="Other website — paste any link…"
                  customPlaceholder="https://…"
                  customPattern="(https?://|/).*"
                  customPatternHint="Must be a full https:// link or a site path starting with /"
                />
              </div>
            </div>
          </details>

          {isNews ? (
            <details className="border-2 border-brand-navy/15 bg-white" open={isEdit}>
              <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 transition-colors">
                ⚙ More options
              </summary>
              <div className="border-t border-brand-navy/10 p-4 space-y-4">
                <div>
                  <label htmlFor="expiresAt" className={LABEL}>Expires At <span className="font-normal text-brand-charcoal/50">(optional — auto-hides after this date)</span></label>
                  <input id="expiresAt" name="expiresAt" type="date" defaultValue={n?.expiresAt?.slice(0, 10) ?? ''} className={INPUT} />
                </div>
                <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                  <input name="pinned" type="checkbox" defaultChecked={n?.pinned ?? false} className="w-5 h-5 accent-brand-neon" />
                  <span className="text-sm font-bold text-brand-charcoal">Pinned <span className="font-normal text-brand-charcoal/50">(front of the noticeboard)</span></span>
                </label>
              </div>
            </details>
          ) : (
            <details className="border-2 border-brand-navy/15 bg-white" open={isEdit}>
              <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-brand-navy hover:bg-brand-navy/5 transition-colors">
                📍 Also show it… <span className="font-normal text-brand-charcoal/50">(always on the Campaigns page)</span>
              </summary>
              <div className="border-t border-brand-navy/10 p-4 space-y-4">
                <PlacementPicker
                  defaults={{
                    showOnHomepage: c?.showOnHomepage ?? false,
                    showBanner:     c?.showBanner ?? false,
                    showInHero:     c?.showInHero ?? false,
                    highlight:      c?.highlight ?? false,
                  }}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="audience" className={LABEL}>Audience <span className="font-normal text-brand-charcoal/50">(shown as a tag on the card)</span></label>
                    <select id="audience" name="audience" defaultValue={c?.audience ?? 'EVERYONE'} className={INPUT}>
                      <option value="EVERYONE">Everyone</option>
                      <option value="PARENTS">Parents</option>
                      <option value="PLAYERS">Players</option>
                      <option value="COACHES">Coaches</option>
                      <option value="VOLUNTEERS">Volunteers</option>
                      <option value="SPONSORS">Sponsors</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="startsAt" className={LABEL}>Start Date</label>
                    <input id="startsAt" name="startsAt" type="date" defaultValue={c?.startsAt?.slice(0, 10) ?? today} className={INPUT} />
                  </div>
                </div>
                <div>
                  <label htmlFor="endsAt" className={LABEL}>End Date <span className="font-normal text-brand-charcoal/50">(optional — expires automatically)</span></label>
                  <input id="endsAt" name="endsAt" type="date" defaultValue={c?.endsAt?.slice(0, 10) ?? ''} className={INPUT} />
                </div>
              </div>
            </details>
          )}
        </div>

        {/* ── Step 3: Share ── */}
        <div className={step === 3 ? 'space-y-5' : 'hidden'}>
          <div className="border-2 border-brand-charcoal/15 bg-white p-4 space-y-1 text-sm text-brand-charcoal/80">
            <p><strong>Type:</strong> {isNews ? 'News' : 'Campaign / Event / Banner'}</p>
            <p className="text-xs text-brand-charcoal/50">Check the previous steps look right, then {isEdit ? 'save' : 'share'} below.</p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
            <input
              name="isPublished"
              type="checkbox"
              defaultChecked={isEdit ? ((isNews ? n?.isPublished : c?.isPublished) ?? false) : true}
              className="w-5 h-5 accent-brand-neon"
            />
            <span className="text-sm font-bold text-brand-charcoal">
              {isEdit ? 'Published' : 'Post live now'} <span className="font-normal text-brand-charcoal/50">{isEdit ? '(still respects the date window)' : '(turn off to save as a draft)'}</span>
            </span>
          </label>
        </div>

        {errors.length > 0 && (
          <p className="text-sm font-bold text-brand-maroon" role="alert">
            Please add: {errors.map((f) => FIELD_LABELS[f] ?? f).join(', ')}
          </p>
        )}

        {/* ── Navigation ── */}
        <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-brand-cream/95 backdrop-blur-sm border-t-2 border-brand-charcoal/10 sm:static sm:mx-0 sm:p-0 sm:bg-transparent sm:border-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-0 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 1}
            className="inline-flex min-h-[44px] items-center gap-2 border-2 border-brand-charcoal/30 px-4 text-sm font-bold text-brand-charcoal/70 hover:border-brand-charcoal hover:text-brand-charcoal transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back
          </button>

          {step < totalSteps ? (
            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-[48px] items-center gap-2 bg-brand-neon text-brand-charcoal font-bold px-6 py-3 border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Next <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex min-h-[48px] items-center gap-2 bg-brand-neon text-brand-charcoal font-bold px-6 py-3 border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              {isEdit ? 'Save Changes' : isNews ? 'Share News' : 'Share Campaign'}
            </button>
          )}
        </div>
      </form>

      {posterOpen && (
        <PosterMaker
          onClose={() => setPosterOpen(false)}
          onCreated={({ heroUrl: posterHero, mobileUrl: posterMobile }) => {
            setImage(posterHero);
            if (!isNews) setMobileImage(posterMobile);
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
