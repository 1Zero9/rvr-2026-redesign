'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
  getFavourites,
  addFavourite,
  removeFavourite,
  clearFavourites,
  MAX_FAVOURITES,
  type FavouriteId,
} from './store';

interface FavouritesContextValue {
  favourites: FavouriteId[];
  isFavourite: (id: FavouriteId) => boolean;
  toggle: (id: FavouriteId) => void;
  clear: () => void;
  hasReachedLimit: boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: React.ReactNode }) {
  const [favourites, setFavourites] = useState<FavouriteId[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setFavourites(getFavourites()), 0);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (id: FavouriteId) => {
    if (favourites.includes(id)) {
      setFavourites(removeFavourite(id));
    } else {
      setFavourites(addFavourite(id));
    }
  };

  return (
    <FavouritesContext.Provider
      value={{
        favourites,
        isFavourite: (id) => favourites.includes(id),
        toggle,
        clear: () => { clearFavourites(); setFavourites([]); },
        hasReachedLimit: favourites.length >= MAX_FAVOURITES,
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
