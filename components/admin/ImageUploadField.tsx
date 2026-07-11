'use client';

import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Camera, Crop, FolderOpen, ImagePlus, X } from 'lucide-react';
import ImageCropper, { type AspectOption, DEFAULT_ASPECTS } from '@/components/admin/ImageCropper';
import ImageLibraryModal from '@/components/admin/ImageLibraryModal';

const LABEL = 'block text-sm font-bold text-brand-charcoal mb-1';
const INPUT = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';
const ACTION_BTN = 'flex-1 min-w-0 inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 border-2 border-brand-navy bg-brand-navy px-2 text-xs font-bold text-brand-cream hover:bg-brand-navy/85 transition-colors disabled:opacity-50';

export const WATERMARK_SRC = '/river-valley-rangers-logo-pack-v2/RVR-New-White2.png';
const MAX_WIDTH = 1920;

export type WatermarkPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export const WATERMARK_POSITIONS: { value: WatermarkPosition; label: string }[] = [
  { value: 'top-left', label: 'Top left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'bottom-right', label: 'Bottom right' },
];

/**
 * Re-encode the photo through a canvas: caps width at 1920px, strips ALL
 * metadata (EXIF/GPS — important for photos of children), and optionally
 * stamps the club watermark in the given corner.
 */
export async function processImage(
  file: Blob,
  watermark: boolean,
  position: WatermarkPosition = 'bottom-right',
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_WIDTH / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  if (watermark) {
    const logo = new Image();
    logo.src = WATERMARK_SRC;
    await logo.decode();
    const logoWidth = Math.round(width * 0.12);
    const logoHeight = Math.round(logoWidth * (logo.naturalHeight / logo.naturalWidth));
    const margin = Math.round(width * 0.02);
    const x = position.endsWith('left') ? margin : width - logoWidth - margin;
    const y = position.startsWith('top') ? margin : height - logoHeight - margin;
    ctx.globalAlpha = 0.45;
    ctx.drawImage(logo, x, y, logoWidth, logoHeight);
    ctx.globalAlpha = 1;
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Image processing failed'))),
      'image/jpeg',
      0.85,
    );
  });
}

export default function ImageUploadField({
  id,
  name,
  label,
  hint,
  url,
  onUrlChange,
  pathPrefix = 'uploads',
  showPreview = false,
  cropAspects = DEFAULT_ASPECTS,
  initialAspect = 16 / 9,
}: {
  id: string;
  name: string;
  label: string;
  hint: string;
  url: string;
  onUrlChange: (url: string) => void;
  pathPrefix?: string;
  showPreview?: boolean;
  cropAspects?: AspectOption[];
  initialAspect?: number | null;
}) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [watermark, setWatermark] = useState(true);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('bottom-right');
  const [pendingFile, setPendingFile] = useState<Blob | null>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const pendingName = useRef('photo.jpg');
  const abortRef = useRef<AbortController | null>(null);

  async function uploadCropped(blob: Blob) {
    const originalName = pendingName.current;
    setPendingFile(null);
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const processed = await processImage(blob, watermark, watermarkPosition);
      const jpgName = originalName.replace(/\.[^.]+$/, '') + '.jpg';
      const result = await upload(`${pathPrefix}/${jpgName}`, processed, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob-upload',
        contentType: 'image/jpeg',
        abortSignal: controller.signal,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      onUrlChange(result.url);
      setStatus('idle');
    } catch (err) {
      if (controller.signal.aborted) {
        setStatus('idle');
        return;
      }
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      abortRef.current = null;
    }
  }

  function cancelUpload() {
    abortRef.current?.abort();
  }

  function handleFile(file: File | undefined) {
    if (fileRef.current) fileRef.current.value = '';
    if (cameraRef.current) cameraRef.current.value = '';
    if (!file) return;
    setErrorMsg('');
    setStatus('idle');
    pendingName.current = file.name;
    setPendingFile(file);
  }

  async function editCurrent() {
    setErrorMsg('');
    setStatus('idle');
    setFetching(true);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      if (!blob.type.startsWith('image/')) throw new Error();
      pendingName.current = url.split('/').pop()?.split('?')[0] || 'photo.jpg';
      // Club uploads were already watermarked on the way in — avoid double-stamping
      if (url.includes('blob.vercel-storage.com')) setWatermark(false);
      setPendingFile(blob);
    } catch {
      setStatus('error');
      setErrorMsg("Couldn't open this image for editing — if it's hosted off-site, save it to your phone and upload it instead.");
    } finally {
      setFetching(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label} <span className="font-normal text-brand-charcoal/50">({hint})</span></label>
      <input
        id={id}
        name={name}
        type="text"
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        placeholder="Add a photo below or paste a URL"
        className={INPUT}
      />

      <div className="mt-2 flex gap-2">
        <label className={ACTION_BTN}>
          <ImagePlus className="h-4 w-4 shrink-0" aria-hidden="true" />
          {status === 'uploading' ? `${progress}%` : 'Photo'}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={status === 'uploading'}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        <label className={`${ACTION_BTN} sm:hidden`}>
          <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
          Camera
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            disabled={status === 'uploading'}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          disabled={status === 'uploading'}
          className={ACTION_BTN}
        >
          <FolderOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
          Library
        </button>
      </div>

      {url && (
        <button
          type="button"
          onClick={editCurrent}
          disabled={status === 'uploading' || fetching}
          className="mt-2 inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 border-2 border-brand-navy bg-white px-2 text-xs font-bold text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-colors disabled:opacity-50"
        >
          <Crop className="h-4 w-4 shrink-0" aria-hidden="true" />
          {fetching ? 'Opening…' : 'Edit current photo — crop, rotate, re-frame'}
        </button>
      )}

      <label className="mt-1.5 flex items-center gap-2 cursor-pointer text-xs text-brand-charcoal/70">
        <input
          type="checkbox"
          checked={watermark}
          onChange={(e) => setWatermark(e.target.checked)}
          className="w-4 h-4 accent-brand-neon"
        />
        Add club watermark <span className="text-brand-charcoal/45">(untick for posters/graphics — photos of players should keep it)</span>
      </label>

      {watermark && (
        <div className="mt-2">
          <p className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/50 mb-1">
            Watermark position
          </p>
          <div className="grid grid-cols-2 gap-1 w-fit">
            {WATERMARK_POSITIONS.map((pos) => (
              <button
                key={pos.value}
                type="button"
                onClick={() => setWatermarkPosition(pos.value)}
                aria-pressed={watermarkPosition === pos.value}
                className={`min-h-[44px] min-w-[44px] px-3 border-2 text-[10px] font-bold uppercase transition-colors ${
                  watermarkPosition === pos.value
                    ? 'border-brand-neon bg-brand-neon text-brand-charcoal'
                    : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60'
                }`}
              >
                {pos.label}
              </button>
            ))}
          </div>
          <div
            className="relative mt-2 h-16 w-16 shrink-0 overflow-hidden border-2 border-brand-charcoal/20 bg-brand-navy"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={WATERMARK_SRC}
              alt=""
              className={`absolute h-5 w-5 object-contain opacity-80 ${
                watermarkPosition.startsWith('top') ? 'top-1.5' : 'bottom-1.5'
              } ${watermarkPosition.endsWith('left') ? 'left-1.5' : 'right-1.5'}`}
            />
          </div>
        </div>
      )}

      {status === 'uploading' && (
        <div className="mt-2 flex items-center gap-2">
          <div
            className="h-2 flex-1 border border-brand-charcoal/20 bg-brand-charcoal/5"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Uploading ${label}`}
          >
            <div
              className="h-full bg-brand-neon transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <button
            type="button"
            onClick={cancelUpload}
            aria-label="Cancel upload"
            className="inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center border-2 border-brand-maroon text-brand-maroon hover:bg-brand-maroon hover:text-white transition-colors"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      {status === 'error' && (
        <p className="mt-1 text-xs font-bold text-brand-maroon" role="alert">{errorMsg}</p>
      )}
      {showPreview && url && status !== 'uploading' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-2 h-24 w-full max-w-xs border-2 border-brand-charcoal/15 object-cover" />
      )}

      {pendingFile && (
        <ImageCropper
          file={pendingFile}
          aspects={cropAspects}
          initialAspect={initialAspect}
          title={`Crop — ${label}`}
          onCancel={() => setPendingFile(null)}
          onConfirm={uploadCropped}
        />
      )}
      {libraryOpen && (
        <ImageLibraryModal
          onClose={() => setLibraryOpen(false)}
          onSelect={(selected) => {
            onUrlChange(selected);
            setLibraryOpen(false);
          }}
        />
      )}
    </div>
  );
}
