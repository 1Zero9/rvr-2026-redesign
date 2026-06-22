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
    <div
      aria-modal="true"
      role="dialog"
      aria-label="Search teams"
      className="fixed inset-0 z-50 bg-brand-navy/95 backdrop-blur-sm"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-brand-sky text-sm min-h-[44px] min-w-[44px] flex items-center justify-center px-3 hover:text-brand-neon transition-colors"
      >
        ✕ Close
      </button>

      <div className="max-w-2xl mx-auto pt-20 px-4">
        {/* Search input */}
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search teams, age groups..."
          className="w-full bg-white/10 border-2 border-brand-sky/30 text-brand-cream text-lg p-4 placeholder:text-brand-sky/50 focus:outline-none focus:border-brand-neon transition-colors"
        />

        <div className="mt-4 space-y-2">
          {/* Search results */}
          {results.length > 0 && results.map((entry) => (
            <Link
              key={entry.id}
              href={entry.href}
              onClick={onClose}
              className="flex items-center gap-3 min-h-[44px] p-3 bg-white/5 hover:bg-white/10 border border-brand-sky/20 transition-colors"
            >
              <span className={`${entry.colour} ${TYPE_TEXT[entry.type]} text-[10px] font-bold uppercase px-2 py-1 shrink-0`}>
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

          {/* Empty state */}
          {showEmpty && (
            <p className="text-brand-sky text-sm mt-4">
              No teams found for &ldquo;{query}&rdquo;
            </p>
          )}

          {/* Favourites section — shown when query is empty */}
          {query.trim().length < 2 && (
            favouriteEntries.length > 0 ? (
              <>
                <p className="text-brand-neon text-xs font-bold uppercase tracking-wide mb-2">
                  YOUR TEAMS
                </p>
                {favouriteEntries.map((entry) => (
                  <Link
                    key={entry.id}
                    href={entry.href}
                    onClick={onClose}
                    className="flex items-center gap-3 min-h-[44px] p-3 bg-white/5 hover:bg-white/10 border border-brand-sky/20 transition-colors"
                  >
                    <span className={`${entry.colour} ${TYPE_TEXT[entry.type]} text-[10px] font-bold uppercase px-2 py-1 shrink-0`}>
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
              <p className="text-brand-sky/60 text-sm">
                Search for a team to get started
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
