'use client';

import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import ImageUploadField, { type WatermarkPosition } from '@/components/admin/ImageUploadField';
import FocalPointEditor from '@/components/admin/FocalPointEditor';
import PosterMaker from '@/components/admin/PosterMaker';

const LABEL = 'block text-sm font-bold text-brand-charcoal mb-1';
const INPUT = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';

export interface ClubMomentData {
  label: string;
  title: string;
  imageUrl: string | null;
  mobileImageUrl: string | null;
  focalX: number;
  focalY: number;
  ctaLabel: string;
  ctaUrl: string;
}

export default function ClubMomentForm({
  data,
  action,
}: {
  data: ClubMomentData;
  action: (formData: FormData) => void;
}) {
  const [heroUrl, setHeroUrl] = useState(data.imageUrl ?? '');
  const [mobileUrl, setMobileUrl] = useState(data.mobileImageUrl ?? '');
  const [focalX, setFocalX] = useState(data.focalX);
  const [focalY, setFocalY] = useState(data.focalY);
  const [posterOpen, setPosterOpen] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-5">
        <div>
          <label htmlFor="label" className={LABEL}>Eyebrow tag <span className="font-normal text-brand-charcoal/50">(small text above the headline)</span></label>
          <input id="label" name="label" type="text" required defaultValue={data.label} placeholder="U11s · Cup Winners" className={INPUT} />
        </div>

        <div>
          <label htmlFor="title" className={LABEL}>Headline *</label>
          <input id="title" name="title" type="text" required defaultValue={data.title} placeholder="Your Saturday could look like this" className={INPUT} />
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
              id="imageUrl"
              name="imageUrl"
              label="Photo"
              hint="the club moment photo — landscape works best"
              url={heroUrl}
              onUrlChange={setHeroUrl}
              pathPrefix="club-moment"
              onWatermarkChange={(on, position) => { setWatermark(on); setWatermarkPosition(position); }}
            />
            <ImageUploadField
              id="mobileImageUrl"
              name="mobileImageUrl"
              label="Mobile Photo"
              hint="optional — portrait crop"
              url={mobileUrl}
              onUrlChange={setMobileUrl}
              pathPrefix="club-moment"
              initialAspect={4 / 5}
            />
          </div>
        </div>

        {heroUrl && (
          <FocalPointEditor
            heroUrl={heroUrl}
            mobileUrl={mobileUrl}
            focalX={focalX}
            focalY={focalY}
            onChange={(x, y) => { setFocalX(x); setFocalY(y); }}
            onMobileCreated={setMobileUrl}
            mobileUploadPath="club-moment/mobile-portrait.jpg"
            desktopAspect={2 / 1}
            desktopAspectLabel="2:1"
            watermark={watermark}
            watermarkPosition={watermarkPosition}
          />
        )}
        <input type="hidden" name="focalX" value={focalX} />
        <input type="hidden" name="focalY" value={focalY} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ctaLabel" className={LABEL}>Button Text *</label>
            <input id="ctaLabel" name="ctaLabel" type="text" required defaultValue={data.ctaLabel} placeholder="Join Us" className={INPUT} />
          </div>
          <div>
            <label htmlFor="ctaUrl" className={LABEL}>Button Goes To *</label>
            <input id="ctaUrl" name="ctaUrl" type="text" required defaultValue={data.ctaUrl} placeholder="/register" className={INPUT} />
          </div>
        </div>

        <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-brand-cream/95 backdrop-blur-sm border-t-2 border-brand-charcoal/10 sm:static sm:mx-0 sm:p-0 sm:bg-transparent sm:border-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-0">
          <button
            type="submit"
            className="w-full sm:w-auto bg-brand-neon text-brand-charcoal font-bold px-6 py-3 min-h-[48px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>

      {posterOpen && (
        <PosterMaker
          onClose={() => setPosterOpen(false)}
          onCreated={({ heroUrl: posterHero, mobileUrl: posterMobile }) => {
            setHeroUrl(posterHero);
            setMobileUrl(posterMobile);
            setPosterOpen(false);
          }}
        />
      )}
    </div>
  );
}
