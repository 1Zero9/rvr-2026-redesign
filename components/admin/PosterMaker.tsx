'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { upload } from '@vercel/blob/client';
import { Camera, FolderOpen, ImagePlus, X } from 'lucide-react';
import ImageLibraryModal from '@/components/admin/ImageLibraryModal';

const LOGO_SRC = '/river-valley-rangers-logo-pack-v2/RVR-New-White2.png';

const CLUB_COLOURS: Array<{ label: string; value: string }> = [
  { label: 'Navy',     value: '#0B1F3B' },
  { label: 'Green',    value: '#005C39' },
  { label: 'Charcoal', value: '#121212' },
  { label: 'Maroon',   value: '#8B1E4D' },
];

const NEON = '#85E320';
const CREAM = '#FAF8F5';

const ACCENT_COLOURS: Array<{ label: string; value: string }> = [
  { label: 'Neon',   value: NEON },
  { label: 'Cream',  value: CREAM },
  { label: 'White',  value: '#FFFFFF' },
  { label: 'Sky',    value: '#B8CDEE' },
  { label: 'Maroon', value: '#8B1E4D' },
];

type Layout = 'band' | 'center' | 'corner';
type BgStyle = 'solid' | 'gradient' | 'dots' | 'stripes';

const LAYOUTS: Array<{ id: Layout; label: string; blurb: string }> = [
  { id: 'band',   label: 'Bottom Band', blurb: 'Solid title band along the bottom' },
  { id: 'center', label: 'Centred',     blurb: 'Big title in the middle' },
  { id: 'corner', label: 'Top Corner',  blurb: 'Title top-left with accent bar' },
];

const BG_STYLES: Array<{ id: BgStyle; label: string }> = [
  { id: 'solid',    label: 'Solid' },
  { id: 'gradient', label: 'Gradient' },
  { id: 'dots',     label: 'Dot Grid' },
  { id: 'stripes',  label: 'Stripes' },
];

interface PosterSpec {
  title: string;
  subtitle: string;
  layout: Layout;
  bgColour: string;
  bgStyle: BgStyle;
  accentColour: string;
  showCrest: boolean;
  photo: HTMLImageElement | null;
  photoOffset: { x: number; y: number };
  displayFont: string;
  sansFont: string;
  logo: HTMLImageElement | null;
}

// ─── Canvas drawing ───────────────────────────────────────────────────────────

function computeCover(img: HTMLImageElement, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  return { dw: img.naturalWidth * scale, dh: img.naturalHeight * scale };
}

function coverDraw(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  w: number,
  h: number,
  offset: { x: number; y: number } = { x: 0, y: 0 },
) {
  const { dw, dh } = computeCover(img, w, h);
  const slackX = dw - w;
  const slackY = dh - h;
  const x = (w - dw) / 2 + (slackX / 2) * offset.x;
  const y = (h - dh) / 2 + (slackY / 2) * offset.y;
  ctx.drawImage(img, x, y, dw, dh);
}

/** Lighten (positive) or darken (negative) a #rrggbb colour by `amt` (0-255). */
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) + amt);
  const g = clamp(((n >> 8) & 255) + amt);
  const b = clamp((n & 255) + amt);
  return `rgb(${r}, ${g}, ${b})`;
}

function paintBackground(ctx: CanvasRenderingContext2D, w: number, h: number, spec: PosterSpec) {
  ctx.fillStyle = spec.bgColour;
  ctx.fillRect(0, 0, w, h);

  if (spec.bgStyle === 'gradient') {
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, shade(spec.bgColour, 34));
    grad.addColorStop(1, shade(spec.bgColour, -42));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (spec.bgStyle === 'dots') {
    const gap = Math.round(Math.min(w, h) * 0.045);
    const r = Math.max(2, gap * 0.09);
    ctx.fillStyle = shade(spec.bgColour, 26);
    for (let y = gap / 2; y < h; y += gap) {
      for (let x = gap / 2; x < w; x += gap) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (spec.bgStyle === 'stripes') {
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = shade(spec.bgColour, 34);
    const gap = Math.round(Math.min(w, h) * 0.05);
    ctx.lineWidth = gap * 0.4;
    for (let x = -h; x < w + h; x += gap) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + h, h);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawCrest(ctx: CanvasRenderingContext2D, spec: PosterSpec, w: number, h: number) {
  if (!spec.logo) return;
  const logoW = Math.min(w, h) * 0.85;
  const logoH = logoW * (spec.logo.naturalHeight / spec.logo.naturalWidth);
  ctx.globalAlpha = 0.12;
  ctx.drawImage(spec.logo, (w - logoW) / 2, (h - logoH) / 2, logoW, logoH);
  ctx.globalAlpha = 1;
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawLogo(ctx: CanvasRenderingContext2D, spec: PosterSpec, w: number, h: number, position: 'top-right' | 'bottom-right') {
  if (!spec.logo) return;
  const logoW = Math.round(w * 0.1);
  const logoH = Math.round(logoW * (spec.logo.naturalHeight / spec.logo.naturalWidth));
  const margin = Math.round(w * 0.025);
  const y = position === 'top-right' ? margin : h - logoH - margin;
  ctx.globalAlpha = 0.9;
  ctx.drawImage(spec.logo, w - logoW - margin, y, logoW, logoH);
  ctx.globalAlpha = 1;
}

export function drawPoster(canvas: HTMLCanvasElement, w: number, h: number, spec: PosterSpec) {
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  paintBackground(ctx, w, h, spec);
  if (!spec.photo && spec.showCrest) drawCrest(ctx, spec, w, h);
  if (spec.photo) coverDraw(ctx, spec.photo, w, h, spec.photoOffset);

  const unit = Math.min(w, h);
  const title = spec.title.trim().toUpperCase() || 'YOUR TITLE HERE';
  const subtitle = spec.subtitle.trim();
  const titleSize = Math.round(unit * 0.085);
  const subSize = Math.round(unit * 0.038);
  const maxTextWidth = w * 0.86;
  const margin = Math.round(w * 0.05);

  ctx.textBaseline = 'alphabetic';

  if (spec.layout === 'band') {
    // Measure text to size the band
    ctx.font = `italic 900 ${titleSize}px ${spec.displayFont}`;
    const titleLines = wrapLines(ctx, title, maxTextWidth);
    ctx.font = `600 ${subSize}px ${spec.sansFont}`;
    const subLines = subtitle ? wrapLines(ctx, subtitle, maxTextWidth) : [];

    const titleBlock = titleLines.length * titleSize * 1.1;
    const subBlock = subLines.length * subSize * 1.45;
    const pad = unit * 0.05;
    const bandH = titleBlock + subBlock + pad * 2 + (subLines.length ? unit * 0.02 : 0);
    const bandY = h - bandH;

    ctx.fillStyle = spec.photo ? 'rgba(11,31,59,0.92)' : 'rgba(0,0,0,0.35)';
    ctx.fillRect(0, bandY, w, bandH);
    ctx.fillStyle = spec.accentColour;
    ctx.fillRect(0, bandY, w, Math.max(6, Math.round(unit * 0.008)));

    let y = bandY + pad + titleSize * 0.9;
    ctx.fillStyle = CREAM;
    ctx.font = `italic 900 ${titleSize}px ${spec.displayFont}`;
    for (const line of titleLines) {
      ctx.fillText(line, margin, y);
      y += titleSize * 1.1;
    }
    if (subLines.length) {
      y += unit * 0.02;
      ctx.fillStyle = 'rgba(250,248,245,0.85)';
      ctx.font = `600 ${subSize}px ${spec.sansFont}`;
      for (const line of subLines) {
        ctx.fillText(line, margin, y);
        y += subSize * 1.45;
      }
    }
    drawLogo(ctx, spec, w, h, 'top-right');
  } else if (spec.layout === 'center') {
    if (spec.photo) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(18,18,18,0.25)');
      grad.addColorStop(0.5, 'rgba(18,18,18,0.55)');
      grad.addColorStop(1, 'rgba(18,18,18,0.75)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.textAlign = 'center';
    ctx.font = `italic 900 ${titleSize}px ${spec.displayFont}`;
    const titleLines = wrapLines(ctx, title, maxTextWidth);
    ctx.font = `600 ${subSize}px ${spec.sansFont}`;
    const subLines = subtitle ? wrapLines(ctx, subtitle, maxTextWidth) : [];

    const total = titleLines.length * titleSize * 1.1 + (subLines.length ? unit * 0.03 + subLines.length * subSize * 1.45 : 0);
    let y = (h - total) / 2 + titleSize * 0.9;

    ctx.fillStyle = spec.accentColour;
    ctx.font = `italic 900 ${titleSize}px ${spec.displayFont}`;
    for (const line of titleLines) {
      ctx.fillText(line, w / 2, y);
      y += titleSize * 1.1;
    }
    if (subLines.length) {
      y += unit * 0.03;
      ctx.fillStyle = CREAM;
      ctx.font = `600 ${subSize}px ${spec.sansFont}`;
      for (const line of subLines) {
        ctx.fillText(line, w / 2, y);
        y += subSize * 1.45;
      }
    }
    ctx.textAlign = 'left';
    drawLogo(ctx, spec, w, h, 'bottom-right');
  } else {
    // corner
    if (spec.photo) {
      const grad = ctx.createLinearGradient(0, 0, 0, h * 0.7);
      grad.addColorStop(0, 'rgba(18,18,18,0.7)');
      grad.addColorStop(1, 'rgba(18,18,18,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h * 0.7);
    }
    const barW = Math.max(8, Math.round(unit * 0.012));
    const x = margin + barW + Math.round(unit * 0.025);
    ctx.font = `italic 900 ${titleSize}px ${spec.displayFont}`;
    const titleLines = wrapLines(ctx, title, w - x - margin);
    ctx.font = `600 ${subSize}px ${spec.sansFont}`;
    const subLines = subtitle ? wrapLines(ctx, subtitle, w - x - margin) : [];

    let y = margin + titleSize;
    const blockTop = margin + titleSize * 0.15;
    ctx.fillStyle = CREAM;
    ctx.font = `italic 900 ${titleSize}px ${spec.displayFont}`;
    for (const line of titleLines) {
      ctx.fillText(line, x, y);
      y += titleSize * 1.1;
    }
    if (subLines.length) {
      y += unit * 0.015;
      ctx.fillStyle = 'rgba(250,248,245,0.85)';
      ctx.font = `600 ${subSize}px ${spec.sansFont}`;
      for (const line of subLines) {
        ctx.fillText(line, x, y);
        y += subSize * 1.45;
      }
    }
    ctx.fillStyle = spec.accentColour;
    ctx.fillRect(margin, blockTop, barW, y - blockTop - titleSize * 0.35);
    drawLogo(ctx, spec, w, h, 'bottom-right');
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadImage(src: string, crossOrigin = false): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (crossOrigin) img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Render failed'))), 'image/jpeg', 0.9);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

const FIELD = 'w-full border-2 border-brand-charcoal px-3 py-2 min-h-[44px] bg-white focus:outline-none focus:border-brand-neon text-brand-charcoal';
const PICK_BTN = 'flex-1 inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-1.5 border-2 border-brand-navy bg-white px-2 text-xs font-bold text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-colors';

export default function PosterMaker({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (result: { heroUrl: string; mobileUrl: string }) => void;
}) {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [layout, setLayout] = useState<Layout>('band');
  const [bgColour, setBgColour] = useState(CLUB_COLOURS[0].value);
  const [bgStyle, setBgStyle] = useState<BgStyle>('solid');
  const [accentColour, setAccentColour] = useState(NEON);
  const [showCrest, setShowCrest] = useState(false);
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null);
  const [photoOffset, setPhotoOffset] = useState({ x: 0, y: 0 });
  const [preview, setPreview] = useState<'hero' | 'mobile'>('hero');
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [logo, setLogo] = useState<HTMLImageElement | null>(null);
  const [fonts, setFonts] = useState({ display: 'sans-serif', sans: 'sans-serif' });
  const fontsReady = useRef(false);

  const heroCanvas = useRef<HTMLCanvasElement>(null);
  const mobileCanvas = useRef<HTMLCanvasElement>(null);
  const displayProbe = useRef<HTMLSpanElement>(null);
  const sansProbe = useRef<HTMLSpanElement>(null);
  const photoUrlRef = useRef<string | null>(null);
  const photoDrag = useRef<{
    startX: number;
    startY: number;
    startOffset: { x: number; y: number };
    canvasW: number;
    canvasH: number;
    rectW: number;
    rectH: number;
  } | null>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    };
  }, []);

  // Resolve the real font families (next/font uses generated names) + preload assets
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const display = displayProbe.current ? getComputedStyle(displayProbe.current).fontFamily : 'sans-serif';
      const sans = sansProbe.current ? getComputedStyle(sansProbe.current).fontFamily : 'sans-serif';
      await document.fonts.ready;
      const logoImg = await loadImage(LOGO_SRC).catch(() => null);
      if (cancelled) return;
      setFonts({ display, sans });
      setLogo(logoImg);
      fontsReady.current = true;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const spec: PosterSpec = {
    title,
    subtitle,
    layout,
    bgColour,
    bgStyle,
    accentColour,
    showCrest,
    photo,
    photoOffset,
    displayFont: fonts.display,
    sansFont: fonts.sans,
    logo,
  };

  // Redraw previews on any change
  useEffect(() => {
    if (heroCanvas.current) drawPoster(heroCanvas.current, 1920, 1080, spec);
    if (mobileCanvas.current) drawPoster(mobileCanvas.current, 1080, 1350, spec);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, subtitle, layout, bgColour, bgStyle, accentColour, showCrest, photo, photoOffset, fonts, logo, preview]);

  async function handlePhotoFile(file: File | undefined) {
    if (!file) return;
    setErrorMsg('');
    try {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
      const url = URL.createObjectURL(file);
      photoUrlRef.current = url;
      setPhotoOffset({ x: 0, y: 0 });
      setPhoto(await loadImage(url));
    } catch {
      setErrorMsg('Could not load that photo');
    }
  }

  const handleLibrarySelect = useCallback(async (url: string) => {
    setLibraryOpen(false);
    setErrorMsg('');
    try {
      setPhotoOffset({ x: 0, y: 0 });
      setPhoto(await loadImage(url, true));
    } catch {
      setErrorMsg('Could not load that image from the library');
    }
  }, []);

  function beginPhotoDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!photo) return;
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    canvas.setPointerCapture(e.pointerId);
    photoDrag.current = {
      startX: e.clientX,
      startY: e.clientY,
      startOffset: photoOffset,
      canvasW: canvas.width,
      canvasH: canvas.height,
      rectW: rect.width,
      rectH: rect.height,
    };
  }

  function movePhotoDrag(e: React.PointerEvent<HTMLCanvasElement>) {
    const drag = photoDrag.current;
    if (!drag || !photo || !drag.rectW || !drag.rectH) return;
    const scaleX = drag.canvasW / drag.rectW;
    const scaleY = drag.canvasH / drag.rectH;
    const dxCanvas = (e.clientX - drag.startX) * scaleX;
    const dyCanvas = (e.clientY - drag.startY) * scaleY;
    const { dw, dh } = computeCover(photo, drag.canvasW, drag.canvasH);
    const slackX = Math.max(0, dw - drag.canvasW);
    const slackY = Math.max(0, dh - drag.canvasH);
    const clamp = (v: number) => Math.min(1, Math.max(-1, v));
    setPhotoOffset({
      x: slackX > 0 ? clamp(drag.startOffset.x + dxCanvas / (slackX / 2)) : 0,
      y: slackY > 0 ? clamp(drag.startOffset.y + dyCanvas / (slackY / 2)) : 0,
    });
  }

  function endPhotoDrag() {
    photoDrag.current = null;
  }

  async function handleSave() {
    if (!title.trim()) {
      setErrorMsg('Give the poster a title first');
      return;
    }
    setStatus('saving');
    setErrorMsg('');
    try {
      const hero = document.createElement('canvas');
      const mobile = document.createElement('canvas');
      drawPoster(hero, 1920, 1080, spec);
      drawPoster(mobile, 1080, 1350, spec);
      const [heroBlob, mobileBlob] = await Promise.all([canvasToBlob(hero), canvasToBlob(mobile)]);

      const slug = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'poster';
      const [heroResult, mobileResult] = await Promise.all([
        upload(`posters/${slug}-hero.jpg`, heroBlob, {
          access: 'public',
          handleUploadUrl: '/api/admin/blob-upload',
          contentType: 'image/jpeg',
        }),
        upload(`posters/${slug}-mobile.jpg`, mobileBlob, {
          access: 'public',
          handleUploadUrl: '/api/admin/blob-upload',
          contentType: 'image/jpeg',
        }),
      ]);
      onCreated({ heroUrl: heroResult.url, mobileUrl: mobileResult.url });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Could not save the poster');
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-brand-charcoal/70 backdrop-blur-sm flex items-end sm:items-center justify-center">
      {/* Font probes — hidden elements so we can read the real next/font family names */}
      <span ref={displayProbe} className="font-display sr-only" aria-hidden="true">probe</span>
      <span ref={sansProbe} className="font-sans sr-only" aria-hidden="true">probe</span>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Poster maker"
        className="bg-brand-cream w-full sm:max-w-3xl h-[95dvh] sm:h-[90vh] flex flex-col border-t-4 sm:border-2 border-brand-charcoal sm:shadow-brutalist"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b-2 border-brand-charcoal/10 shrink-0">
          <h2 className="font-display font-black italic uppercase text-brand-navy">Poster Maker</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-brand-charcoal/60 hover:text-brand-charcoal"
            aria-label="Close poster maker"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-sm font-bold text-brand-charcoal">Preview</p>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setPreview('hero')}
                  className={`px-2.5 min-h-[32px] text-[11px] font-bold border-2 ${
                    preview === 'hero' ? 'border-brand-charcoal bg-brand-navy text-brand-cream' : 'border-brand-charcoal/20 text-brand-charcoal/60'
                  }`}
                >
                  Desktop 16:9
                </button>
                <button
                  type="button"
                  onClick={() => setPreview('mobile')}
                  className={`px-2.5 min-h-[32px] text-[11px] font-bold border-2 ${
                    preview === 'mobile' ? 'border-brand-charcoal bg-brand-navy text-brand-cream' : 'border-brand-charcoal/20 text-brand-charcoal/60'
                  }`}
                >
                  Phone 4:5
                </button>
              </div>
            </div>
            <canvas
              ref={heroCanvas}
              onPointerDown={beginPhotoDrag}
              onPointerMove={movePhotoDrag}
              onPointerUp={endPhotoDrag}
              onPointerCancel={endPhotoDrag}
              className={`w-full touch-none border-2 border-brand-charcoal/20 ${photo ? 'cursor-move' : ''} ${preview === 'hero' ? '' : 'hidden'}`}
              aria-label="Poster preview, desktop crop"
            />
            <canvas
              ref={mobileCanvas}
              onPointerDown={beginPhotoDrag}
              onPointerMove={movePhotoDrag}
              onPointerUp={endPhotoDrag}
              onPointerCancel={endPhotoDrag}
              className={`mx-auto max-h-[45dvh] w-auto touch-none border-2 border-brand-charcoal/20 ${photo ? 'cursor-move' : ''} ${preview === 'mobile' ? '' : 'hidden'}`}
              aria-label="Poster preview, phone crop"
            />
            <p className="mt-1 text-[11px] text-brand-charcoal/50">
              {photo
                ? 'Drag the preview to reposition the photo.'
                : 'Both sizes are generated together — desktop hero and phone portrait.'}
            </p>
          </div>

          {/* Text */}
          <div className="space-y-3">
            <div>
              <label htmlFor="poster-title" className="block text-sm font-bold text-brand-charcoal mb-1">
                Title * <span className="font-normal text-brand-charcoal/50">(max ~5 words — big capitals)</span>
              </label>
              <input
                id="poster-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Players Wanted — Girls U10"
                maxLength={60}
                className={FIELD}
              />
            </div>
            <div>
              <label htmlFor="poster-subtitle" className="block text-sm font-bold text-brand-charcoal mb-1">
                Subtitle <span className="font-normal text-brand-charcoal/50">(optional — one short sentence)</span>
              </label>
              <input
                id="poster-subtitle"
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Trials every Saturday in June — all welcome"
                maxLength={110}
                className={FIELD}
              />
            </div>
          </div>

          {/* Layout */}
          <div>
            <p className="text-sm font-bold text-brand-charcoal mb-1.5">Layout</p>
            <div className="grid grid-cols-3 gap-2">
              {LAYOUTS.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLayout(l.id)}
                  className={`border-2 p-2.5 text-left transition-colors ${
                    layout === l.id
                      ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                      : 'border-brand-charcoal/20 bg-white text-brand-charcoal/70 hover:border-brand-charcoal/50'
                  }`}
                >
                  <span className="block text-xs font-black uppercase">{l.label}</span>
                  <span className="block text-[10px] mt-0.5 opacity-75">{l.blurb}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <p className="text-sm font-bold text-brand-charcoal mb-1.5">Background</p>
            <div className="flex gap-2">
              <label className={PICK_BTN}>
                <ImagePlus className="h-4 w-4 shrink-0" aria-hidden="true" />
                Photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  className="sr-only"
                  onChange={(e) => {
                    handlePhotoFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </label>
              <label className={`${PICK_BTN} sm:hidden`}>
                <Camera className="h-4 w-4 shrink-0" aria-hidden="true" />
                Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="sr-only"
                  onChange={(e) => {
                    handlePhotoFile(e.target.files?.[0]);
                    e.target.value = '';
                  }}
                />
              </label>
              <button type="button" onClick={() => setLibraryOpen(true)} className={PICK_BTN}>
                <FolderOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
                Library
              </button>
            </div>
            {photo ? (
              <div className="mt-2 flex items-center justify-between gap-2">
                <p className="text-xs text-brand-charcoal/60">Drag the preview above to reframe the photo.</p>
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="shrink-0 text-xs font-bold text-brand-maroon underline min-h-[36px]"
                >
                  Remove photo
                </button>
              </div>
            ) : (
              <div className="mt-3 space-y-3">
                <div>
                  <p className="text-xs font-bold text-brand-charcoal/70 mb-1">Colour</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {CLUB_COLOURS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setBgColour(c.value)}
                        className={`h-9 w-9 rounded-full border-2 ${
                          bgColour === c.value ? 'border-brand-neon ring-2 ring-brand-neon/40' : 'border-brand-charcoal/20'
                        }`}
                        style={{ backgroundColor: c.value }}
                        aria-label={`${c.label} background`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-charcoal/70 mb-1">Style</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {BG_STYLES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setBgStyle(s.id)}
                        className={`px-3 min-h-[36px] text-xs font-bold border-2 transition-colors ${
                          bgStyle === s.id
                            ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                            : 'border-brand-charcoal/20 bg-white text-brand-charcoal/70 hover:border-brand-charcoal/50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-brand-charcoal/70 min-h-[36px]">
                  <input
                    type="checkbox"
                    checked={showCrest}
                    onChange={(e) => setShowCrest(e.target.checked)}
                    className="h-4 w-4 accent-brand-navy"
                  />
                  Add a large faded crest
                </label>
              </div>
            )}

            <div className="mt-3">
              <p className="text-xs font-bold text-brand-charcoal/70 mb-1">Accent colour</p>
              <div className="flex items-center gap-2 flex-wrap">
                {ACCENT_COLOURS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setAccentColour(c.value)}
                    className={`h-9 w-9 rounded-full border-2 ${
                      accentColour === c.value ? 'border-brand-navy ring-2 ring-brand-navy/30' : 'border-brand-charcoal/20'
                    }`}
                    style={{ backgroundColor: c.value }}
                    aria-label={`${c.label} accent`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {errorMsg && (
            <p className="text-sm font-bold text-brand-maroon" role="alert">{errorMsg}</p>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t-2 border-brand-charcoal/10 p-4 flex gap-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-h-[48px] border-2 border-brand-charcoal/30 text-sm font-bold text-brand-charcoal/70 hover:border-brand-charcoal transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={status === 'saving'}
            className="flex-[2] min-h-[48px] bg-brand-neon text-brand-charcoal text-sm font-bold border-2 border-brand-charcoal shadow-brutalist hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-60"
          >
            {status === 'saving' ? 'Saving…' : 'Use This Poster'}
          </button>
        </div>
      </div>

      {libraryOpen && (
        <ImageLibraryModal onClose={() => setLibraryOpen(false)} onSelect={handleLibrarySelect} />
      )}
    </div>
  );
}
