'use client';

import { useFavourites } from '@/lib/favourites/context';

interface Props {
  teamId: string;
  label: string;
  variant: 'icon' | 'button';
}

export default function FavouriteButton({ teamId, label, variant }: Props) {
  const { isFavourite, toggle, hasReachedLimit } = useFavourites();
  const active = isFavourite(teamId);

  if (variant === 'icon') {
    return (
      <button
        type="button"
        aria-label={`${active ? 'Remove' : 'Add'} ${label} ${active ? 'from' : 'to'} favourites`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(teamId); }}
        className="absolute top-2 right-2 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
      >
        <span className={`text-xl leading-none ${active ? 'text-brand-neon' : 'text-brand-sky/60'}`}>
          {active ? '★' : '☆'}
        </span>
      </button>
    );
  }

  // button variant
  if (hasReachedLimit && !active) {
    return (
      <p className="text-brand-sky text-sm mt-4">
        Max 5 teams reached
      </p>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(teamId)}
      aria-label={`${active ? 'Remove' : 'Add'} ${label} ${active ? 'from' : 'to'} favourites`}
      className={`w-full min-h-[44px] py-3 font-bold text-sm mt-4 transition-colors ${
        active
          ? 'bg-brand-neon text-brand-charcoal'
          : 'border-2 border-brand-neon text-brand-neon'
      }`}
    >
      {active ? '★ Following this team · Tap to unfollow' : '☆ Follow this team'}
    </button>
  );
}
