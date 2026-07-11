'use client';

import { useRef, useState } from 'react';
import { Smartphone, X } from 'lucide-react';
import { upload } from '@vercel/blob/client';
import { processImage, WATERMARK_SRC, type WatermarkPosition } from '@/components/admin/ImageUploadField';
import ImageCropper from '@/components/admin/ImageCropper';

/** Mirrors the corner math in processImage() so the live preview matches the real export. */
function watermarkBadgeStyle(position: WatermarkPosition): React.CSSProperties {
  return {
    position: 'absolute',
    width: '12%',
    aspectRatio: 1,
    opacity: 0.55,
    pointerEvents: 'none',
    top: position.startsWith('top') ? '4%' : undefined,
    bottom: position.startsWith('bottom') ? '4%' : undefined,
    left: position.endsWith('left') ? '4%' : undefined,
    right: position.endsWith('right') ? '4%' : undefined,
  };
}

export default function FocalPointEditor({
  heroUrl,
  mobileUrl,
  focalX,
  focalY,
  onChange,
  onMobileCreated,
  mobileUploadPath = 'campaigns/mobile-portrait.jpg',
  desktopAspect = 21 / 9,
  desktopAspectLabel = '21:9',
  watermark = false,
  watermarkPosition = 'bottom-right',
}: {
  heroUrl: string;
  mobileUrl: string;
  focalX: number;
  focalY: number;
  onChange: (x: number, y: number) => void;
  /** When set, enables "Create phone version" — crops the hero to 4:5 */
  onMobileCreated?: (url: string) => void;
  /** Blob path for the saved phone crop — keep distinct per form to avoid collisions */
  mobileUploadPath?: string;
  /** Aspect ratio of the "desktop card crop" preview, to match the real placement */
  desktopAspect?: number;
  desktopAspectLabel?: string;
  /** Mirrors the Photo field's watermark toggle — shows a live preview badge, doesn't affect the saved image */
  watermark?: boolean;
  watermarkPosition?: WatermarkPosition;
}) {
  const objectPosition = `${focalX}% ${focalY}%`;
  const [dragging, setDragging] = useState(false);
  const [mobileSource, setMobileSource] = useState<Blob | null>(null);
  const [mobileBusy, setMobileBusy] = useState<'idle' | 'opening' | 'saving'>('idle');
  const [mobileError, setMobileError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  async function startMobileCrop() {
    setMobileError('');
    setMobileBusy('opening');
    try {
      const res = await fetch(heroUrl);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      if (!blob.type.startsWith('image/')) throw new Error();
      setMobileSource(blob);
    } catch {
      setMobileError("Couldn't open the hero image — if it's hosted off-site, upload a portrait version in the Mobile Image field instead.");
    } finally {
      setMobileBusy('idle');
    }
  }

  async function saveMobileCrop(blob: Blob) {
    setMobileSource(null);
    setMobileBusy('saving');
    setMobileError('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      // No watermark — the hero was already stamped on its way in
      const processed = await processImage(blob, false);
      const result = await upload(mobileUploadPath, processed, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob-upload',
        contentType: 'image/jpeg',
        abortSignal: controller.signal,
      });
      onMobileCreated?.(result.url);
    } catch (err) {
      if (controller.signal.aborted) {
        setMobileBusy('idle');
        return;
      }
      setMobileError(err instanceof Error ? err.message : 'Could not save the phone version');
    } finally {
      setMobileBusy('idle');
      abortRef.current = null;
    }
  }

  function cancelMobileSave() {
    abortRef.current?.abort();
  }

  function setFromPointer(e: React.PointerEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onChange(Math.min(100, Math.max(0, x)), Math.min(100, Math.max(0, y)));
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setFromPointer(e);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (dragging) setFromPointer(e);
  }

  return (
    <div className="border-2 border-brand-navy/15 bg-white p-4 space-y-4">
      <div>
        <p className="text-sm font-bold text-brand-charcoal">Crop preview &amp; focal point</p>
        <p className="text-xs text-brand-charcoal/60 mt-0.5">
          Each placement crops the image to a different shape. Tap or drag on the photo below
          to set the focal point — the previews show exactly what visitors will see.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-1.5">
            Full image — tap to set focal point
          </p>
          <div
            className="relative cursor-crosshair select-none border-2 border-brand-charcoal/20 touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={() => setDragging(false)}
            onPointerCancel={() => setDragging(false)}
            role="application"
            aria-label="Tap or drag to set the image focal point"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={heroUrl} alt="" className="block w-full" draggable={false} />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-brand-neon shadow-[0_0_0_2px_rgba(0,0,0,0.6)] bg-brand-neon/15"
              style={{ left: `${focalX}%`, top: `${focalY}%` }}
            />
            {watermark && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={WATERMARK_SRC} alt="" style={watermarkBadgeStyle(watermarkPosition)} />
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-1.5">
              Desktop crop ({desktopAspectLabel})
            </p>
            <div className="relative overflow-hidden border-2 border-brand-charcoal/20" style={{ aspectRatio: desktopAspect }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroUrl} alt="" className="h-full w-full object-cover" style={{ objectPosition }} />
              {watermark && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={WATERMARK_SRC} alt="" style={watermarkBadgeStyle(watermarkPosition)} />
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-28 shrink-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-brand-green mb-1.5">
                Phone crop
              </p>
              <div className="aspect-[4/5] overflow-hidden border-2 border-brand-charcoal/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mobileUrl || heroUrl}
                  alt=""
                  className="h-full w-full object-cover"
                  style={mobileUrl ? undefined : { objectPosition }}
                />
              </div>
            </div>
            <div className="flex-1 self-end space-y-2 pb-1">
              {onMobileCreated ? (
                <>
                  <p className="text-xs text-brand-charcoal/50">
                    {mobileUrl
                      ? 'Phones show your portrait version, framed exactly as you cropped it.'
                      : 'Phones will crop the hero image as shown — or frame it yourself:'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={startMobileCrop}
                      disabled={mobileBusy !== 'idle'}
                      className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 border-2 border-brand-navy bg-white px-2 text-xs font-bold text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-colors disabled:opacity-50"
                    >
                      <Smartphone className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {mobileBusy === 'opening'
                        ? 'Opening…'
                        : mobileBusy === 'saving'
                          ? 'Saving…'
                          : mobileUrl
                            ? 'Re-crop phone version'
                            : 'Create phone version'}
                    </button>
                    {mobileBusy === 'saving' && (
                      <button
                        type="button"
                        onClick={cancelMobileSave}
                        aria-label="Cancel saving phone version"
                        className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center border-2 border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white transition-colors"
                      >
                        <X className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                  {mobileError && (
                    <p className="text-xs font-bold text-brand-maroon" role="alert">{mobileError}</p>
                  )}
                </>
              ) : (
                <p className="text-xs text-brand-charcoal/50">
                  Phones show this crop of your image — drag the focal point to keep the
                  important part in frame.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {mobileSource && (
        <ImageCropper
          file={mobileSource}
          aspects={[{ label: 'Portrait 4:5', value: 4 / 5 }]}
          initialAspect={4 / 5}
          title="Frame the phone version"
          onCancel={() => setMobileSource(null)}
          onConfirm={saveMobileCrop}
        />
      )}
    </div>
  );
}
