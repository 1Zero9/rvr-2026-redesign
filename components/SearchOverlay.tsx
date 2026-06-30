'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { searchSite, SEARCH_INDEX, type SearchEntry, type SearchCategory } from '@/lib/search';
import { useFavourites } from '@/lib/favourites/context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TEAM_CATEGORIES: SearchCategory[] = ['ddsl-boys', 'ddsl-girls', 'senior', 'over35s'];

export default function SearchOverlay({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { favourites, isFavourite } = useFavourites();

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => {
        setQuery('');
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  const results      = searchSite(query);
  const hasQuery     = query.trim().length >= 2;
  const showEmpty    = hasQuery && results.length === 0;
  const pageResults  = results.filter((e) => e.category === 'page');
  const teamResults  = results.filter((e) => TEAM_CATEGORIES.includes(e.category));

  const favouriteEntries = favourites
    .map((id) => SEARCH_INDEX.find((e) => e.id === id))
    .filter((e): e is SearchEntry => e !== undefined);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center px-4 pt-20"
      onClick={onClose}
    >
      <div
        aria-modal="true"
        role="dialog"
        aria-label="Site search"
        className="w-full max-w-2xl bg-brand-navy border border-brand-sky/20 rounded-2xl shadow-2xl flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input row */}
        <div className="flex items-center gap-2 p-3 border-b border-brand-sky/20">
          <svg className="w-4 h-4 text-brand-sky/50 shrink-0 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, teams, features..."
            className="flex-1 bg-transparent text-brand-cream text-base p-2 placeholder:text-brand-sky/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-brand-sky/60 hover:text-brand-neon transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
            aria-label="Close search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-3 space-y-4">

          {/* — Query results — */}
          {hasQuery && (
            <>
              {pageResults.length > 0 && (
                <ResultGroup label="Pages" entries={pageResults} onClose={onClose} isFavourite={isFavourite} />
              )}
              {teamResults.length > 0 && (
                <ResultGroup label="Teams" entries={teamResults} onClose={onClose} isFavourite={isFavourite} />
              )}
              {showEmpty && (
                <p className="text-brand-sky/60 text-sm px-1 py-2">
                  No results for &ldquo;{query}&rdquo;
                </p>
              )}
            </>
          )}

          {/* — Empty state: favourites or prompt — */}
          {!hasQuery && (
            favouriteEntries.length > 0 ? (
              <ResultGroup label="Your Teams" entries={favouriteEntries} onClose={onClose} isFavourite={isFavourite} showStar />
            ) : (
              <p className="text-brand-sky/50 text-sm px-1 py-2">
                Search pages, teams, kit, fixtures, volunteering&hellip;
              </p>
            )
          )}

        </div>
      </div>
    </div>
  );
}

function ResultGroup({
  label,
  entries,
  onClose,
  isFavourite,
  showStar = false,
}: {
  label: string;
  entries: SearchEntry[];
  onClose: () => void;
  isFavourite: (id: string) => boolean;
  showStar?: boolean;
}) {
  return (
    <div>
      <p className="text-brand-sky/50 text-[10px] font-bold uppercase tracking-widest px-1 mb-1.5">
        {label}
      </p>
      <div className="space-y-1">
        {entries.map((entry) => (
          <Link
            key={entry.id}
            href={entry.href}
            onClick={onClose}
            className="flex items-center gap-3 min-h-[44px] px-3 py-2.5 bg-white/5 hover:bg-white/10 border border-brand-sky/10 rounded-xl transition-colors"
          >
            <span className={`${entry.badgeColour} text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded shrink-0`}>
              {entry.badge}
            </span>
            <span className="flex-1 min-w-0">
              <span className="text-brand-cream font-semibold block truncate text-sm">{entry.label}</span>
              <span className="text-brand-sky/60 text-xs">{entry.subLabel}</span>
            </span>
            {(showStar || isFavourite(entry.id)) && (
              <span className="text-brand-neon shrink-0 text-xs">★</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
