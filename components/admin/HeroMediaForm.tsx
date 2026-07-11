'use client';

import { useState } from 'react';
import ImageUploadField, { type WatermarkPosition } from '@/components/admin/ImageUploadField';
import FocalPointEditor from '@/components/admin/FocalPointEditor';
import { ImageIcon, Video } from 'lucide-react';

const LABEL = 'block text-sm font-bold text-brand-charcoal mb-1';
const INPUT = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';

export interface HeroMediaData {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  mobileImageUrl: string | null;
  posterUrl: string | null;
  focalX: number;
  focalY: number;
  motionEffect: 'NONE' | 'ZOOM_IN' | 'ZOOM_OUT' | 'PIXELATE';
  isEnabled: boolean;
  sortOrder: number;
}

export default function HeroMediaForm({
  data,
  action,
  deleteAction,
}: {
  data?: HeroMediaData;
  action: (formData: FormData) => void;
  deleteAction?: (formData: FormData) => void;
}) {
  const isEdit = Boolean(data);
  const [type, setType] = useState<'IMAGE' | 'VIDEO'>(data?.type ?? 'IMAGE');
  const [imageUrl, setImageUrl] = useState(type === 'IMAGE' ? (data?.url ?? '') : '');
  const [mobileUrl, setMobileUrl] = useState(data?.mobileImageUrl ?? '');
  const [videoUrl, setVideoUrl] = useState(type === 'VIDEO' ? (data?.url ?? '') : '');
  const [posterUrl, setPosterUrl] = useState(data?.posterUrl ?? '');
  const [focalX, setFocalX] = useState(data?.focalX ?? 50);
  const [focalY, setFocalY] = useState(data?.focalY ?? 50);
  const [motionEffect, setMotionEffect] = useState(data?.motionEffect ?? 'NONE');
  const [watermark, setWatermark] = useState(true);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');

  const isImage = type === 'IMAGE';
  const focalSourceUrl = isImage ? imageUrl : posterUrl;

  return (
    <div className="space-y-6">
      <form action={action} className="space-y-5">
        {!isEdit && (
          <div>
            <p className={LABEL}>What are you adding?</p>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Hero media type">
              <button
                type="button"
                role="radio"
                aria-checked={isImage}
                onClick={() => setType('IMAGE')}
                className={`flex items-center gap-3 border-2 p-4 text-left transition-all ${
                  isImage
                    ? 'border-brand-charcoal bg-brand-navy text-brand-cream shadow-brutalist'
                    : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
                }`}
              >
                <ImageIcon className="h-6 w-6 shrink-0" aria-hidden="true" />
                <span className="font-display font-black uppercase text-sm">Photo</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={!isImage}
                onClick={() => setType('VIDEO')}
                className={`flex items-center gap-3 border-2 p-4 text-left transition-all ${
                  !isImage
                    ? 'border-brand-charcoal bg-brand-navy text-brand-cream shadow-brutalist'
                    : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
                }`}
              >
                <Video className="h-6 w-6 shrink-0" aria-hidden="true" />
                <span className="font-display font-black uppercase text-sm">Video</span>
              </button>
            </div>
          </div>
        )}
        <input type="hidden" name="type" value={type} />

        {isImage ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageUploadField
                id="url"
                name="url"
                label="Photo"
                hint="1920 × 1080px (16:9) — same shape as the hero video"
                url={imageUrl}
                onUrlChange={setImageUrl}
                pathPrefix="hero-media"
                onWatermarkChange={(on, position) => { setWatermark(on); setWatermarkPosition(position); }}
              />
              <ImageUploadField
                id="mobileImageUrl"
                name="mobileImageUrl"
                label="Mobile Photo"
                hint="optional — portrait crop"
                url={mobileUrl}
                onUrlChange={setMobileUrl}
                pathPrefix="hero-media"
                initialAspect={4 / 5}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="url" className={LABEL}>
                Video URL <span className="font-normal text-brand-charcoal/50">(a path like /videos/hero2.mp4, or a full https:// link)</span>
              </label>
              <input
                id="url"
                name="url"
                type="text"
                required
                defaultValue={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="/videos/hero2.mp4"
                className={INPUT}
              />
              <p className="mt-1 text-xs text-brand-charcoal/60">
                Same shape as the current hero video (1920 × 1080px, 16:9). Videos are added by
                URL rather than uploaded here — ask a developer to drop the file in{' '}
                <code className="text-[11px]">/public/videos</code> first, or paste a link to one
                already hosted online.
              </p>
            </div>
            <ImageUploadField
              id="posterUrl"
              name="posterUrl"
              label="Poster Image"
              hint="shown before the video starts playing, and used to set the focal point below"
              url={posterUrl}
              onUrlChange={setPosterUrl}
              pathPrefix="hero-media"
              onWatermarkChange={(on, position) => { setWatermark(on); setWatermarkPosition(position); }}
            />
          </div>
        )}

        {focalSourceUrl && (
          <FocalPointEditor
            heroUrl={focalSourceUrl}
            mobileUrl={isImage ? mobileUrl : ''}
            focalX={focalX}
            focalY={focalY}
            onChange={(x, y) => { setFocalX(x); setFocalY(y); }}
            onMobileCreated={isImage ? setMobileUrl : undefined}
            mobileUploadPath="hero-media/mobile-portrait.jpg"
            desktopAspect={16 / 9}
            desktopAspectLabel="16:9"
            watermark={watermark}
            watermarkPosition={watermarkPosition}
          />
        )}
        <input type="hidden" name="focalX" value={focalX} />
        <input type="hidden" name="focalY" value={focalY} />

        <div>
          <label htmlFor="motionEffect" className={LABEL}>Motion effect</label>
          <select
            id="motionEffect"
            name="motionEffect"
            defaultValue={motionEffect}
            onChange={(e) => setMotionEffect(e.target.value as typeof motionEffect)}
            className={INPUT}
          >
            <option value="NONE">None — static</option>
            <option value="ZOOM_IN">Zoom in — slow drift over the visit</option>
            <option value="ZOOM_OUT">Zoom out — starts close, settles wide</option>
            {isImage && <option value="PIXELATE">Pixelate in — resolves from blocky to sharp</option>}
          </select>
          <p className="mt-1 text-xs text-brand-charcoal/60">
            Visitors with reduced-motion enabled always see a static frame, whatever&rsquo;s chosen here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="sortOrder" className={LABEL}>Order <span className="font-normal text-brand-charcoal/50">(lower numbers first — doesn&rsquo;t affect the random pick)</span></label>
            <input id="sortOrder" name="sortOrder" type="number" defaultValue={data?.sortOrder ?? 0} className={INPUT} />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 cursor-pointer min-h-[44px]">
              <input name="isEnabled" type="checkbox" defaultChecked={data?.isEnabled ?? true} className="w-5 h-5 accent-brand-neon" />
              <span className="text-sm font-bold text-brand-charcoal">In rotation</span>
            </label>
          </div>
        </div>

        <div className="sticky bottom-0 z-10 -mx-4 px-4 py-3 bg-brand-cream/95 backdrop-blur-sm border-t-2 border-brand-charcoal/10 sm:static sm:mx-0 sm:p-0 sm:bg-transparent sm:border-0 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-0">
          <button
            type="submit"
            className="w-full sm:w-auto bg-brand-neon text-brand-charcoal font-bold px-6 py-3 min-h-[48px] border-3 border-brand-charcoal shadow-brutalist hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          >
            {isEdit ? 'Save Changes' : 'Add to Rotation'}
          </button>
        </div>
      </form>

      {deleteAction && (
        <div className="border-t-2 border-brand-charcoal/10 pt-8">
          <h2 className="font-display font-black italic text-lg text-brand-maroon mb-2">
            Danger Zone
          </h2>
          <p className="text-sm text-brand-charcoal/60 mb-4">
            This permanently removes it from the hero rotation and cannot be undone.
          </p>
          <form
            action={deleteAction}
            onSubmit={(e) => {
              if (!window.confirm('Remove this from the hero rotation? This cannot be undone.')) {
                e.preventDefault();
              }
            }}
          >
            <button
              type="submit"
              className="bg-white text-brand-maroon font-bold px-6 py-3 min-h-[44px] border-2 border-brand-maroon hover:bg-brand-maroon hover:text-white transition-all"
            >
              Delete
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
