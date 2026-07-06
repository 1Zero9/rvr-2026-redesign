'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface BlobItem {
  url: string;
  pathname: string;
  size: number;
  uploadedAt: string;
}

interface BlobPage {
  blobs: BlobItem[];
  cursor: string | null;
  hasMore: boolean;
}

const TABS: Array<{ prefix: string; label: string }> = [
  { prefix: '',          label: 'All' },
  { prefix: 'news',      label: 'News' },
  { prefix: 'campaigns', label: 'Campaigns' },
  { prefix: 'posters',   label: 'Posters' },
];

async function loadBlobs(prefix: string, cursor: string | null): Promise<BlobPage> {
  const params = new URLSearchParams();
  if (prefix) params.set('prefix', prefix);
  if (cursor) params.set('cursor', cursor);
  const res = await fetch(`/api/admin/blob-list?${params}`);
  if (!res.ok) throw new Error('Could not load images');
  return (await res.json()) as BlobPage;
}

export default function ImageLibraryModal({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (url: string) => void;
}) {
  const [prefix, setPrefix] = useState('');
  const [blobs, setBlobs] = useState<BlobItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // First page for the active tab — re-runs when the tab changes
  useEffect(() => {
    let cancelled = false;
    loadBlobs(prefix, null)
      .then((data) => {
        if (cancelled) return;
        setBlobs(data.blobs);
        setCursor(data.hasMore ? data.cursor : null);
        setError('');
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Could not load images');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [prefix]);

  function selectTab(next: string) {
    if (next === prefix) return;
    setPrefix(next);
    setBlobs([]);
    setCursor(null);
    setError('');
    setLoading(true);
  }

  async function loadMore() {
    if (!cursor) return;
    setLoading(true);
    try {
      const data = await loadBlobs(prefix, cursor);
      setBlobs((prev) => [...prev, ...data.blobs]);
      setCursor(data.hasMore ? data.cursor : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load images');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] bg-brand-charcoal/70 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Image library"
        className="bg-brand-cream w-full sm:max-w-2xl h-[85dvh] sm:h-[70vh] flex flex-col border-t-4 sm:border-2 border-brand-charcoal sm:shadow-brutalist"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b-2 border-brand-charcoal/10 shrink-0">
          <h2 className="font-display font-black italic uppercase text-brand-navy">Image Library</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center text-brand-charcoal/60 hover:text-brand-charcoal"
            aria-label="Close image library"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 px-4 py-2.5 border-b border-brand-charcoal/10 overflow-x-auto shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.prefix}
              type="button"
              onClick={() => selectTab(tab.prefix)}
              className={`shrink-0 px-3 min-h-[36px] text-xs font-bold border-2 transition-colors ${
                prefix === tab.prefix
                  ? 'border-brand-charcoal bg-brand-navy text-brand-cream'
                  : 'border-brand-charcoal/20 bg-white text-brand-charcoal/60 hover:border-brand-charcoal/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <p className="text-sm font-bold text-brand-maroon" role="alert">{error}</p>
          )}
          {!error && blobs.length === 0 && !loading && (
            <p className="text-sm text-brand-charcoal/60">No images here yet.</p>
          )}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {blobs.map((b) => (
              <button
                key={b.url}
                type="button"
                onClick={() => onSelect(b.url)}
                className="group relative aspect-square overflow-hidden border-2 border-brand-charcoal/15 bg-white hover:border-brand-neon focus:border-brand-neon focus:outline-none"
                title={b.pathname}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.url}
                  alt={b.pathname.split('/').pop() ?? ''}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              </button>
            ))}
          </div>
          {loading && (
            <p className="py-4 text-center text-sm font-bold text-brand-charcoal/50">Loading…</p>
          )}
          {cursor && !loading && (
            <button
              type="button"
              onClick={loadMore}
              className="mt-4 w-full min-h-[44px] border-2 border-brand-navy text-sm font-bold text-brand-navy hover:bg-brand-navy hover:text-brand-cream transition-colors"
            >
              Load more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
