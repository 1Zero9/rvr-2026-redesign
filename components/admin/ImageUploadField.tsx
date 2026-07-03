'use client';

import { useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';

const LABEL = 'block text-sm font-bold text-brand-charcoal mb-1';
const INPUT = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';

export default function ImageUploadField({
  id,
  name,
  label,
  hint,
  url,
  onUrlChange,
  pathPrefix = 'uploads',
  showPreview = false,
}: {
  id: string;
  name: string;
  label: string;
  hint: string;
  url: string;
  onUrlChange: (url: string) => void;
  pathPrefix?: string;
  showPreview?: boolean;
}) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');
    try {
      const blob = await upload(`${pathPrefix}/${file.name}`, file, {
        access: 'public',
        handleUploadUrl: '/api/admin/blob-upload',
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      });
      onUrlChange(blob.url);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div>
      <label htmlFor={id} className={LABEL}>{label} <span className="font-normal text-brand-charcoal/50">({hint})</span></label>
      <div className="flex gap-2">
        <input
          id={id}
          name={name}
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="Upload a photo or paste a URL"
          className={INPUT}
        />
        <label className="shrink-0 inline-flex min-h-[44px] w-24 cursor-pointer items-center justify-center border-2 border-brand-navy bg-brand-navy px-3 text-xs font-bold text-brand-cream hover:bg-brand-navy/85 transition-colors">
          {status === 'uploading' ? `${progress}%` : 'Upload'}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={status === 'uploading'}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
      </div>
      {status === 'uploading' && (
        <div
          className="mt-2 h-2 w-full border border-brand-charcoal/20 bg-brand-charcoal/5"
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
      )}
      {status === 'error' && (
        <p className="mt-1 text-xs font-bold text-brand-maroon" role="alert">{errorMsg}</p>
      )}
      {showPreview && url && status !== 'uploading' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-2 h-24 w-full max-w-xs border-2 border-brand-charcoal/15 object-cover" />
      )}
    </div>
  );
}
