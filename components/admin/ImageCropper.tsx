'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCcw, RotateCw, X } from 'lucide-react';

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

const MAX_OUTPUT = 2400;
/** Minimum crop-box width, in on-screen pixels. */
const MIN_BOX_SCREEN = 60;

type Corner = 'tl' | 'tr' | 'bl' | 'br';
type Box = { x: number; y: number; w: number; h: number };
type Drag =
  | { mode: 'move'; startX: number; startY: number; startBox: Box }
  | { mode: 'resize'; corner: Corner; startX: number; startY: number; startBox: Box };

const CORNERS: Corner[] = ['tl', 'tr', 'bl', 'br'];
const CORNER_SIGN: Record<Corner, { x: 1 | -1; y: 1 | -1 }> = {
  tl: { x: -1, y: -1 },
  tr: { x: 1, y: -1 },
  bl: { x: -1, y: 1 },
  br: { x: 1, y: 1 },
};

/** Largest centred box matching `aspect` (or the full image) within `bounds`. */
function defaultBox(bounds: { w: number; h: number }, aspect: number | null): Box {
  if (aspect === null) return { x: 0, y: 0, w: bounds.w, h: bounds.h };
  const boundsAspect = bounds.w / bounds.h;
  const w = boundsAspect > aspect ? bounds.h * aspect : bounds.w;
  const h = boundsAspect > aspect ? bounds.h : bounds.w / aspect;
  return { x: (bounds.w - w) / 2, y: (bounds.h - h) / 2, w, h };
}

/** Resize `start` by dragging `corner`, keeping the opposite edges anchored. */
function resizeCorner(
  start: Box,
  corner: Corner,
  dx: number,
  dy: number,
  bounds: { w: number; h: number },
  aspect: number | null,
  minSize: number,
): Box {
  const sign = CORNER_SIGN[corner];
  const anchorX = sign.x === 1 ? start.x : start.x + start.w;
  const anchorY = sign.y === 1 ? start.y : start.y + start.h;
  const maxW = sign.x === 1 ? bounds.w - anchorX : anchorX;
  const maxH = sign.y === 1 ? bounds.h - anchorY : anchorY;

  let newW: number;
  let newH: number;
  if (aspect) {
    const grow = (dx * sign.x + dy * sign.y * aspect) / 2;
    const widthLimit = Math.min(maxW, maxH * aspect);
    newW = Math.min(widthLimit, Math.max(minSize, start.w + grow));
    newH = newW / aspect;
  } else {
    newW = Math.min(maxW, Math.max(minSize, start.w + dx * sign.x));
    newH = Math.min(maxH, Math.max(minSize, start.h + dy * sign.y));
  }

  return {
    x: sign.x === 1 ? anchorX : anchorX - newW,
    y: sign.y === 1 ? anchorY : anchorY - newH,
    w: newW,
    h: newH,
  };
}

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
  const [frame, setFrame] = useState({ w: 0, h: 0 });
  const [box, setBox] = useState<Box>({ x: 0, y: 0, w: 0, h: 0 });
  const [exporting, setExporting] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<Drag | null>(null);

  const src = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(src), [src]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setFrame({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Rotated (on-screen) image dimensions
  const rotated = useMemo(() => {
    if (!imgSize) return null;
    const swap = rotation % 180 !== 0;
    return { w: swap ? imgSize.h : imgSize.w, h: swap ? imgSize.w : imgSize.h };
  }, [imgSize, rotation]);

  // Reset the crop box whenever the aspect or the (rotated) image changes.
  // Done during render (not an effect) since `rotated` is a derived value
  // whose reference is only stable across genuinely unrelated re-renders.
  const [boxFor, setBoxFor] = useState<{ rotated: { w: number; h: number } | null; aspect: number | null }>({
    rotated: null,
    aspect: null,
  });
  if (rotated && (rotated !== boxFor.rotated || aspect !== boxFor.aspect)) {
    setBoxFor({ rotated, aspect });
    setBox(defaultBox(rotated, aspect));
  }

  const fit = useMemo(() => {
    if (!rotated || !frame.w || !frame.h) return null;
    const scale = Math.min(frame.w / rotated.w, frame.h / rotated.h);
    const dispW = rotated.w * scale;
    const dispH = rotated.h * scale;
    return { scale, dispW, dispH, left: (frame.w - dispW) / 2, top: (frame.h - dispH) / 2 };
  }, [rotated, frame]);

  const displayScale = fit?.scale ?? 1;
  const minBoxSize = MIN_BOX_SCREEN / displayScale;

  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag || !rotated) return;
      const dx = (e.clientX - drag.startX) / displayScale;
      const dy = (e.clientY - drag.startY) / displayScale;

      if (drag.mode === 'move') {
        const maxX = rotated.w - drag.startBox.w;
        const maxY = rotated.h - drag.startBox.h;
        setBox({
          ...drag.startBox,
          x: Math.min(maxX, Math.max(0, drag.startBox.x + dx)),
          y: Math.min(maxY, Math.max(0, drag.startBox.y + dy)),
        });
      } else {
        setBox(resizeCorner(drag.startBox, drag.corner, dx, dy, rotated, aspect, minBoxSize));
      }
    },
    [rotated, aspect, displayScale, minBoxSize],
  );

  function beginMove(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { mode: 'move', startX: e.clientX, startY: e.clientY, startBox: box };
  }

  function beginResize(corner: Corner) {
    return (e: React.PointerEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRef.current = { mode: 'resize', corner, startX: e.clientX, startY: e.clientY, startBox: box };
    };
  }

  function endDrag() {
    dragRef.current = null;
  }

  function rotate() {
    setRotation((r) => (r + 90) % 360);
  }

  function resetAll() {
    if (!imgSize) return;
    setRotation(0);
    setAspect(initialAspect);
    setBox(defaultBox(imgSize, initialAspect));
  }

  async function handleConfirm() {
    const img = imgRef.current;
    if (!img || !imgSize || !rotated) return;
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

      // Crop straight from the box — it's already in rotated-image coordinates
      const outScale = Math.min(1, MAX_OUTPUT / Math.max(box.w, box.h));
      const out = document.createElement('canvas');
      out.width = Math.round(box.w * outScale);
      out.height = Math.round(box.h * outScale);
      const outCtx = out.getContext('2d');
      if (!outCtx) throw new Error('Canvas unavailable');
      outCtx.drawImage(base, box.x, box.y, box.w, box.h, 0, 0, out.width, out.height);

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

      {/* Crop stage — shows the whole photo; the box below marks what's kept.
          overflow-hidden guarantees the mask always reaches the stage edges,
          even if a layout race briefly sizes the image taller than `fit`. */}
      <div ref={stageRef} className="relative flex-1 min-h-0 mx-4 my-2 overflow-hidden">
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
            className="absolute max-w-none"
            style={
              fit && imgSize
                ? {
                    left: fit.left + fit.dispW / 2,
                    top: fit.top + fit.dispH / 2,
                    width: imgSize.w * displayScale,
                    height: imgSize.h * displayScale,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                  }
                : { left: 0, top: 0, opacity: 0, pointerEvents: 'none' }
            }
          />
        )}

        {fit && rotated && (
          <div
            className="absolute border-2 border-white touch-none cursor-move"
            style={{
              left: fit.left + box.x * displayScale,
              top: fit.top + box.y * displayScale,
              width: box.w * displayScale,
              height: box.h * displayScale,
              boxShadow: '0 0 0 9999px rgba(18,18,18,0.7)',
            }}
            onPointerDown={beginMove}
            onPointerMove={handleDragMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            role="application"
            aria-label="Crop area — drag to move, drag a corner to resize"
          >
            {/* Rule-of-thirds grid */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/25" />
              <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/25" />
              <div className="absolute top-1/3 left-0 right-0 h-px bg-white/25" />
              <div className="absolute top-2/3 left-0 right-0 h-px bg-white/25" />
            </div>

            {/* Corner resize handles */}
            {CORNERS.map((corner) => (
              <div
                key={corner}
                onPointerDown={beginResize(corner)}
                className="absolute flex h-9 w-9 items-center justify-center touch-none"
                style={{
                  left: corner === 'tl' || corner === 'bl' ? 0 : '100%',
                  top: corner === 'tl' || corner === 'tr' ? 0 : '100%',
                  transform: 'translate(-50%, -50%)',
                  cursor: corner === 'tl' || corner === 'br' ? 'nwse-resize' : 'nesw-resize',
                }}
              >
                <div className="h-3 w-3 rounded-sm border-2 border-brand-charcoal bg-white shadow" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="shrink-0 px-4 py-3 space-y-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        {/* Aspect presets + rotate */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {aspects.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => setAspect(a.value)}
              className={`shrink-0 px-3 min-h-[36px] text-xs font-bold border-2 transition-colors ${
                aspect === a.value
                  ? 'border-brand-neon bg-brand-neon text-brand-charcoal'
                  : 'border-white/30 text-white/70 hover:border-white/60'
              }`}
            >
              {a.label}
            </button>
          ))}
          <div className="ml-auto flex shrink-0 gap-1.5">
            <button
              type="button"
              onClick={resetAll}
              disabled={!imgSize}
              className="flex h-10 w-10 items-center justify-center border-2 border-white/30 text-white/70 hover:border-white/60 disabled:opacity-40"
              aria-label="Reset crop, rotation, and aspect"
            >
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={rotate}
              className="flex h-10 w-10 items-center justify-center border-2 border-white/30 text-white/70 hover:border-white/60"
              aria-label="Rotate 90 degrees"
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
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
