'use client';

import { useRef, useState } from 'react';
import { Megaphone, Newspaper, Wand2, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import ImageUploadField, { type WatermarkPosition } from '@/components/admin/ImageUploadField';
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

const STEP_LABELS = ['What is it?', 'Where it shows', 'Image', 'Details', 'Review'];

export default function ContentWizard({
  newsAction,
  campaignAction,
  initialKind = 'news',
}: {
  newsAction: ServerAction;
  campaignAction: ServerAction;
  initialKind?: Kind;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [kind, setKind] = useState<Kind>(initialKind);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<string[]>([]);

  const [image, setImage] = useState('');
  const [mobileImage, setMobileImage] = useState('');
  const [focalX, setFocalX] = useState(50);
  const [focalY, setFocalY] = useState(50);
  const [posterOpen, setPosterOpen] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');

  const isNews = kind === 'news';
  const totalSteps = 5;

  function fieldsOnStep(s: number): string[] {
    if (s === 4) {
      return isNews ? ['title', 'category', 'body'] : ['title', 'ctaLabel', 'ctaUrl', 'audience', 'startsAt'];
    }
    return [];
  }

  function validateStep(s: number): boolean {
    const required = fieldsOnStep(s);
    if (required.length === 0) { setErrors([]); return true; }
    const data = new FormData(formRef.current ?? undefined);
    const missing = required.filter((name) => !String(data.get(name) ?? '').trim());
    setErrors(missing);
    return missing.length === 0;
  }

  function goNext() {
    if (!validateStep(step)) return;
    // News has no placement choices — skip step 2.
    if (step === 1 && isNews) { setStep(3); return; }
    setStep((s) => Math.min(totalSteps, s + 1));
  }

  function goBack() {
    setErrors([]);
    if (step === 3 && isNews) { setStep(1); return; }
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <ol className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1;
          const isSkipped = n === 2 && isNews;
          const active = n === step;
          const done = n < step && !isSkipped;
          return (
            <li key={label} className={`flex items-center gap-1.5 ${isSkipped ? 'opacity-30' : ''}`}>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                  active
                    ? 'border-brand-charcoal bg-brand-neon text-brand-charcoal'
                    : done
                    ? 'border-brand-charcoal bg-brand-charcoal text-brand-cream'
                    : 'border-brand-charcoal/30 text-brand-charcoal/40'
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : n}
              </span>
              <span className={active ? 'text-brand-charcoal' : 'text-brand-charcoal/40'}>{label}</span>
              {n < totalSteps && <span className="mx-1 text-brand-charcoal/20">—</span>}
            </li>
          );
        })}
      </ol>

      <form
        ref={formRef}
        action={(isNews ? newsAction : campaignAction) as (formData: FormData) => void}
        className="space-y-5"
      >
        {/* ── Step 1: What is this? ── */}
        <div className={step === 1 ? 'space-y-4' : 'hidden'}>
          <p className={LABEL}>What are you posting?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Content type">
            <button
              type="button"
              role="radio"
              aria-checked={isNews}
              onClick={() => setKind('news')}
              className={`flex items-start gap-3 border-2 p-4 text-left transition-all ${
                isNews
                  ? 'border-brand-charcoal bg-brand-navy text-brand-cream shadow-brutalist'
                  : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
              }`}
            >
              <Newspaper className="h-6 w-6 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <span className="block font-display font-black uppercase text-sm">News</span>
                <span className="block text-xs mt-1 opacity-80">
                  Something that already happened — a result, an update, a notice.
                  Appears on the News page and the homepage spotlight.
                </span>
              </span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={!isNews}
              onClick={() => setKind('campaign')}
              className={`flex items-start gap-3 border-2 p-4 text-left transition-all ${
                !isNews
                  ? 'border-brand-charcoal bg-brand-navy text-brand-cream shadow-brutalist'
                  : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
              }`}
            >
              <Megaphone className="h-6 w-6 shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <span className="block font-display font-black uppercase text-sm">Campaign / Event / Banner</span>
                <span className="block text-xs mt-1 opacity-80">
                  Something to do — join, register, book, volunteer. Choose exactly
                  where it shows on the next step: banner, hero, spotlight, highlight badge.
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* ── Step 2: Where should it show? (campaign only) ── */}
        <div className={step === 2 && !isNews ? 'space-y-4' : 'hidden'}>
          <p className={LABEL}>
            Where should this show? <span className="font-normal text-brand-charcoal/50">(always on the Campaigns page — tick any extra spots)</span>
          </p>
          <PlacementPicker defaults={{ showOnHomepage: false, showBanner: false, showInHero: false, highlight: false }} />
        </div>

        {/* ── Step 3: Image ── */}
        <div className={step === 3 ? 'space-y-4' : 'hidden'}>
          <p className={LABEL}>Add an image <span className="font-normal text-brand-charcoal/50">(optional — upload a photo, pick from the library, or skip)</span></p>

          <button
            type="button"
            onClick={() => setPosterOpen(true)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 border-2 border-dashed border-brand-navy/40 px-4 text-xs font-bold text-brand-navy hover:border-brand-navy hover:bg-brand-navy/5 transition-colors"
          >
            <Wand2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            No photo? Create a graphic instead
          </button>

          {isNews ? (
            <ImageUploadField
              id="imageUrl"
              name="imageUrl"
              label="Image"
              hint="optional — shown on the news card, article page, and homepage spotlight"
              url={image}
              onUrlChange={setImage}
              pathPrefix="news"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadField
                id="heroImageUrl"
                name="heroImageUrl"
                label="Hero Image"
                hint="optional"
                url={image}
                onUrlChange={setImage}
                pathPrefix="campaigns"
                onWatermarkChange={(w, p) => { setWatermark(w); setWatermarkPosition(p); }}
              />
              <ImageUploadField
                id="mobileImageUrl"
                name="mobileImageUrl"
                label="Mobile Image"
                hint="portrait crop, so phones don't just get the middle of the wide photo"
                url={mobileImage}
                onUrlChange={setMobileImage}
                pathPrefix="campaigns"
                initialAspect={4 / 5}
                watermarkFrom={{ watermark, position: watermarkPosition }}
                required={Boolean(image)}
              />
            </div>
          )}

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
          <input type="hidden" name="focalX" value={focalX} />
          <input type="hidden" name="focalY" value={focalY} />
        </div>

        {/* ── Step 4: Details ── */}
        <div className={step === 4 ? 'space-y-5' : 'hidden'}>
          <CopyPromptHelper />

          <div>
            <label htmlFor="title" className={LABEL}>Title * <span className="font-normal text-brand-charcoal/50">(max ~5 words, punchy — shown in big capitals)</span></label>
            <input id="title" name="title" type="text" placeholder={isNews ? 'U12 Girls Win Cup Final' : 'Players Wanted — Girls U10'} className={INPUT} />
          </div>

          {isNews ? (
            <>
              <div>
                <label htmlFor="category" className={LABEL}>Label *</label>
                <select id="category" name="category" defaultValue="COMMUNITY_NEWS" className={INPUT}>
                  <option value="BREAKING">Breaking News — urgent, time-sensitive</option>
                  <option value="CONGRATULATIONS">Congratulations — wins, awards, milestones</option>
                  <option value="COMMUNITY_NEWS">Community News — general club updates</option>
                  <option value="IN_SYMPATHY">In Sympathy — condolence notices</option>
                </select>
              </div>
              <div>
                <label htmlFor="body" className={LABEL}>Body * <span className="font-normal text-brand-charcoal/50">(markdown, 2–3 paragraphs)</span></label>
                <textarea id="body" name="body" rows={6} className={TEXTAREA} />
              </div>
              <div>
                <label htmlFor="expiresAt" className={LABEL}>Expires At <span className="font-normal text-brand-charcoal/50">(optional — auto-hides after this date)</span></label>
                <input id="expiresAt" name="expiresAt" type="date" className={INPUT} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="subtitle" className={LABEL}>Subtitle <span className="font-normal text-brand-charcoal/50">(optional — one sentence, end on the benefit to the reader)</span></label>
                <input id="subtitle" name="subtitle" type="text" placeholder="Free trial sessions every Saturday in June — no experience needed, just trainers." className={INPUT} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="audience" className={LABEL}>Audience * <span className="font-normal text-brand-charcoal/50">(shown as a &ldquo;For parents&rdquo; tag on the card)</span></label>
                  <select id="audience" name="audience" defaultValue="EVERYONE" className={INPUT}>
                    <option value="EVERYONE">Everyone</option>
                    <option value="PARENTS">Parents</option>
                    <option value="PLAYERS">Players</option>
                    <option value="COACHES">Coaches</option>
                    <option value="VOLUNTEERS">Volunteers</option>
                    <option value="SPONSORS">Sponsors</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="startsAt" className={LABEL}>Start Date * <span className="font-normal text-brand-charcoal/50">(goes live automatically)</span></label>
                  <input id="startsAt" name="startsAt" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className={INPUT} />
                </div>
              </div>
              <div>
                <label htmlFor="endsAt" className={LABEL}>End Date <span className="font-normal text-brand-charcoal/50">(optional — expires automatically)</span></label>
                <input id="endsAt" name="endsAt" type="date" className={INPUT} />
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className={LABEL}>Button Text {!isNews && '*'} <span className="font-normal text-brand-charcoal/50">{isNews && '(optional)'}</span></span>
              <SelectWithCustom
                name="ctaLabel"
                initial=""
                options={CTA_LABELS.map((l) => ({ value: l, label: l }))}
                chooseText="Choose button text…"
                customText="Other — write my own…"
                customPlaceholder="e.g. Enter the Draw"
              />
            </div>
            <div>
              <span className={LABEL}>Button Goes To {!isNews && '*'} <span className="font-normal text-brand-charcoal/50">{isNews && '(optional)'}</span></span>
              <SelectWithCustom
                name="ctaUrl"
                initial=""
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
        </div>

        {/* ── Step 5: Review & Publish ── */}
        <div className={step === 5 ? 'space-y-5' : 'hidden'}>
          <div className="border-2 border-brand-charcoal/15 bg-white p-4 space-y-1 text-sm text-brand-charcoal/80">
            <p><strong>Type:</strong> {isNews ? 'News' : 'Campaign / Event / Banner'}</p>
            <p className="text-xs text-brand-charcoal/50">Check the details on the previous steps look right, then publish below.</p>
          </div>

          <div className="flex gap-8">
            <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <input name="isPublished" type="checkbox" className="w-5 h-5 accent-brand-neon" />
              <span className="text-sm font-bold text-brand-charcoal">Published</span>
            </label>
            {isNews && (
              <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
                <input name="pinned" type="checkbox" className="w-5 h-5 accent-brand-neon" />
                <span className="text-sm font-bold text-brand-charcoal">Pinned <span className="font-normal text-brand-charcoal/50">(front of the noticeboard)</span></span>
              </label>
            )}
          </div>
        </div>

        {errors.length > 0 && (
          <p className="text-sm font-bold text-brand-maroon" role="alert">
            Please fill in: {errors.join(', ')}
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
              {isNews ? 'Create News Item' : 'Create Campaign'}
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
    </div>
  );
}
