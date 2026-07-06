'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RotateCw, X, ZoomIn, ZoomOut } from 'lucide-react';

export interface AspectOption {
  label: string;
  /** width / height — null means the image's own (rotated) aspect */
  value: number | null;
}

export const DEFAULT_ASPECTS: AspectOption[] = [
  { label: 'Wide 16:9',    value: 16 / 9 },
  { label: 'Portrait 4:5', value: 4 / 5 },
  { label: 'Square',       value: 1 },
  { label: 'Original',     value: null },
];

const MAX_ZOOM = 4;
const MAX_OUTPUT = 2400;

export default function ImageCropper({
  file,
  aspects = DEFAULT_ASPECTS,
  initialAspect = 16 / 9,
  title = 'Crop photo',
  onCancel,
  onConfirm,
}: {
  file: File | Blob;
  aspects?: AspectOption[];
  initialAspect?: number | null;
  title?: string;
  onCancel: () => void;
  onConfirm: (blob: Blob) => void;
}) {
  const [imgSize, setImgSize] = useState<{ w: number; h: number } | null>(null);
  const [aspect, setAspect] = useState<number | null>(initialAspect);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [exporting, setExporting] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchStart = useRef<{ dist: number; zoom: number } | null>(null);

  const src = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(src), [src]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setFrame({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [imgSize, aspect]);

  // Rotated image dimensions
  const rotated = useMemo(() => {
    if (!imgSize) return null;
    const swap = rotation % 180 !== 0;
    return { w: swap ? imgSize.h : imgSize.w, h: swap ? imgSize.w : imgSize.h };
  }, [imgSize, rotation]);

  const frameAspect = aspect ?? (rotated ? rotated.w / rotated.h : 16 / 9);

  const coverScale = useMemo(() => {
    if (!rotated || !frame.w || !frame.h) return 1;
    return Math.max(frame.w / rotated.w, frame.h / rotated.h);
  }, [rotated, frame]);

  const displayScale = coverScale * zoom;

  const clampOffset = useCallback(
    (x: number, y: number, scale: number) => {
      if (!rotated || !frame.w) return { x: 0, y: 0 };
      const maxX = Math.max(0, (rotated.w * scale - frame.w) / 2);
      const maxY = Math.max(0, (rotated.h * scale - frame.h) / 2);
      return {
        x: Math.min(maxX, Math.max(-maxX, x)),
        y: Math.min(maxY, Math.max(-maxY, y)),
      };
    },
    [rotated, frame],
  );

  const setZoomClamped = useCallback(
    (next: number) => {
      const z = Math.min(MAX_ZOOM, Math.max(1, next));
      setZoom(z);
      setOffset((o) => clampOffset(o.x, o.y, coverScale * z));
    },
    [clampOffset, coverScale],
  );

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchStart.current = { dist: Math.hypot(a.x - b.x, a.y - b.y), zoom };
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    const current = { x: e.clientX, y: e.clientY };
    pointers.current.set(e.pointerId, current);

    if (pointers.current.size === 2 && pinchStart.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinchStart.current.dist > 0) {
        setZoomClamped(pinchStart.current.zoom * (dist / pinchStart.current.dist));
      }
    } else if (pointers.current.size === 1) {
      const dx = current.x - prev.x;
      const dy = current.y - prev.y;
      setOffset((o) => clampOffset(o.x + dx, o.y + dy, displayScale));
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinchStart.current = null;
  }

  function rotate() {
    setRotation((r) => (r + 90) % 360);
    setOffset({ x: 0, y: 0 });
  }

  function changeAspect(value: number | null) {
    setAspect(value);
    setOffset({ x: 0, y: 0 });
  }

  async function handleConfirm() {
    const img = imgRef.current;
    if (!img || !imgSize || !rotated || !frame.w || !frame.h) return;
    setExporting(true);
    try {
      // Draw the full rotated image once
      const base = document.createElement('canvas');
      base.width = rotated.w;
      base.height = rotated.h;
      const baseCtx = base.getContext('2d');
      if (!baseCtx) throw new Error('Canvas unavailable');
      baseCtx.translate(rotated.w / 2, rotated.h / 2);
      baseCtx.rotate((rotation * Math.PI) / 180);
      baseCtx.drawImage(img, -imgSize.w / 2, -imgSize.h / 2);

      // Crop rect in rotated-image coordinates
      const cropW = frame.w / displayScale;
      const cropH = frame.h / displayScale;
      const cropX = rotated.w / 2 - offset.x / displayScale - cropW / 2;
      const cropY = rotated.h / 2 - offset.y / displayScale - cropH / 2;

      const outScale = Math.min(1, MAX_OUTPUT / Math.max(cropW, cropH));
      const out = document.createElement('canvas');
      out.width = Math.round(cropW * outScale);
      out.height = Math.round(cropH * outScale);
      const outCtx = out.getContext('2d');
      if (!outCtx) throw new Error('Canvas unavailable');
      outCtx.drawImage(base, cropX, cropY, cropW, cropH, 0, 0, out.width, out.height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        out.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Crop failed'))),
          'image/jpeg',
          0.92,
        );
      });
      onConfirm(blob);
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[70] bg-brand-charcoal/90 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 shrink-0">
        <h2 className="font-display font-black italic uppercase text-white">{title}</h2>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-11 w-11 items-center justify-center text-white/70 hover:text-white"
          aria-label="Cancel crop"
        >
          <X className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Crop stage */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-4">
        <div
          ref={frameRef}
          className="relative overflow-hidden border-2 border-white/60 touch-none select-none cursor-move bg-black"
          style={{
            aspectRatio: String(frameAspect),
            width: `min(100%, calc((100dvh - 240px) * ${frameAspect}))`,
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="application"
          aria-label="Drag to position the photo, pinch or use the slider to zoom"
        >
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={src}
              alt=""
              draggable={false}
              onLoad={(e) => {
                const el = e.currentTarget;
                setImgSize({ w: el.naturalWidth, h: el.naturalHeight });
              }}
              className="absolute left-1/2 top-1/2 max-w-none"
              style={{
                width: imgSize ? `${imgSize.w * displayScale}px` : undefined,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) rotate(${rotation}deg)`,
              }}
            />
          )}
          {/* Rule-of-thirds grid */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/25" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/25" />
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/25" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/25" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="shrink-0 px-4 py-3 space-y-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Aspect presets + rotate */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {aspects.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => changeAspect(a.value)}
              className={`shrink-0 px-3 min-h-[36px] text-xs font-bold border-2 transition-colors ${
                aspect === a.value
                  ? 'border-brand-neon bg-brand-neon text-brand-charcoal'
                  : 'border-white/30 text-white/70 hover:border-white/60'
              }`}
            >
              {a.label}
            </button>
          ))}
          <button
            type="button"
            onClick={rotate}
            className="ml-auto shrink-0 flex h-10 w-10 items-center justify-center border-2 border-white/30 text-white/70 hover:border-white/60"
            aria-label="Rotate 90 degrees"
          >
            <RotateCw className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Zoom */}
        <div className="flex items-center gap-3">
          <ZoomOut className="h-4 w-4 text-white/50 shrink-0" aria-hidden="true" />
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoomClamped(Number(e.target.value))}
            className="flex-1 accent-brand-neon min-h-[32px]"
            aria-label="Zoom"
          />
          <ZoomIn className="h-4 w-4 text-white/50 shrink-0" aria-hidden="true" />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 min-h-[48px] border-2 border-white/30 text-sm font-bold text-white/80 hover:border-white/60 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!imgSize || exporting}
            className="flex-1 min-h-[48px] bg-brand-neon text-brand-charcoal text-sm font-bold border-2 border-brand-neon disabled:opacity-50 hover:bg-brand-neon/85 transition-colors"
          >
            {exporting ? 'Cropping…' : 'Use Photo'}
          </button>
        </div>
      </div>
    </div>
  );
}
