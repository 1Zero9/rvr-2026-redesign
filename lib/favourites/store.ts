export const FAVOURITES_KEY = 'rvr-favourite-teams';
export const MAX_FAVOURITES = 5;

export type FavouriteId = string;

export function getFavourites(): FavouriteId[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(FAVOURITES_KEY);
    return raw ? (JSON.parse(raw) as FavouriteId[]) : [];
  } catch {
    return [];
  }
}

export function saveFavourites(ids: FavouriteId[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FAVOURITES_KEY, JSON.stringify(ids));
}

export function addFavourite(id: FavouriteId): FavouriteId[] {
  const current = getFavourites();
  if (current.includes(id)) return current;
  if (current.length >= MAX_FAVOURITES) return current;
  const updated = [...current, id];
  saveFavourites(updated);
  return updated;
}

export function removeFavourite(id: FavouriteId): FavouriteId[] {
  const updated = getFavourites().filter((f) => f !== id);
  saveFavourites(updated);
  return updated;
}

export function clearFavourites(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(FAVOURITES_KEY);
}
