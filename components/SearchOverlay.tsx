'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { searchTeams, SEARCH_INDEX, type SearchEntry } from '@/lib/search';
import { useFavourites } from '@/lib/favourites/context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TYPE_LABELS: Record<SearchEntry['type'], string> = {
  'ddsl-boys':  'DDSL BOYS',
  'ddsl-girls': 'DDSL GIRLS',
  'senior':     'SENIOR',
  'over35s':    'OVER 35s',
};

const TYPE_TEXT: Record<SearchEntry['type'], string> = {
  'ddsl-boys':  'text-brand-charcoal',
  'ddsl-girls': 'text-white',
  'senior':     'text-white',
  'over35s':    'text-brand-charcoal',
};

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

  const results   = searchTeams(query);
  const showEmpty = query.trim().length >= 2 && results.length === 0;

  const favouriteEntries = favourites
    .map((id) => SEARCH_INDEX.find((e) => e.id === id))
    .filter((e): e is SearchEntry => e !== undefined);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 bg-black/30 flex items-start justify-center px-4 pt-20"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        aria-modal="true"
        role="dialog"
        aria-label="Search teams"
        className="w-full max-w-2xl bg-brand-navy border border-brand-sky/20 rounded-2xl shadow-2xl flex flex-col max-h-[70vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input row */}
        <div className="flex items-center gap-2 p-3 border-b border-brand-sky/20">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search teams, age groups..."
            className="flex-1 bg-transparent text-brand-cream text-base p-2 placeholder:text-brand-sky/50 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="text-brand-sky text-sm min-h-[44px] min-w-[44px] flex items-center justify-center px-3 hover:text-brand-neon transition-colors shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Results */}
        <div className="overflow-y-auto p-3 space-y-1.5">
          {results.length > 0 && results.map((entry) => (
            <Link
              key={entry.id}
              href={entry.href}
              onClick={onClose}
              className="flex items-center gap-3 min-h-[44px] p-3 bg-white/5 hover:bg-white/10 border border-brand-sky/20 rounded-lg transition-colors"
            >
              <span className={`${entry.colour} ${TYPE_TEXT[entry.type]} text-[10px] font-bold uppercase px-2 py-1 shrink-0 rounded`}>
                {TYPE_LABELS[entry.type]}
              </span>
              <span className="flex-1 min-w-0">
                <span className="text-brand-cream font-bold block truncate">{entry.label}</span>
                <span className="text-brand-sky text-sm">{entry.subLabel}</span>
              </span>
              {isFavourite(entry.id) && (
                <span className="text-brand-neon shrink-0">★</span>
              )}
            </Link>
          ))}

          {showEmpty && (
            <p className="text-brand-sky text-sm p-2">
              No teams found for &ldquo;{query}&rdquo;
            </p>
          )}

          {query.trim().length < 2 && (
            favouriteEntries.length > 0 ? (
              <>
                <p className="text-brand-neon text-xs font-bold uppercase tracking-wide px-1 pb-1">
                  YOUR TEAMS
                </p>
                {favouriteEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={entry.href}
                    onClick={onClose}
                    className="flex items-center gap-3 min-h-[44px] p-3 bg-white/5 hover:bg-white/10 border border-brand-sky/20 rounded-lg transition-colors"
                  >
                    <span className={`${entry.colour} ${TYPE_TEXT[entry.type]} text-[10px] font-bold uppercase px-2 py-1 shrink-0 rounded`}>
                      {TYPE_LABELS[entry.type]}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="text-brand-cream font-bold block truncate">{entry.label}</span>
                      <span className="text-brand-sky text-sm">{entry.subLabel}</span>
                    </span>
                    <span className="text-brand-neon shrink-0">★</span>
                  </Link>
                ))}
              </>
            ) : (
              <p className="text-brand-sky/60 text-sm p-2">
                Search for a team to get started
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
