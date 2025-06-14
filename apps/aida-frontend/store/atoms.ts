import { atom } from 'jotai';
import type { Artist, ArtistFilter } from '@/types/models';

// Artists atoms
export const artistsAtom = atom<Artist[]>([]);
export const selectedArtistAtom = atom<Artist | null>(null);
export const artistFilterAtom = atom<ArtistFilter>({});

// UI state atoms
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

// Derived atoms
export const filteredArtistsAtom = atom((get) => {
  const artists = get(artistsAtom);
  const filter = get(artistFilterAtom);
  
  return artists.filter((artist: Artist) => {
    // Filter by name
    if (filter.name && !artist.name.toLowerCase().includes(filter.name.toLowerCase())) {
      return false;
    }
    
    // Filter by nationality
    if (filter.nationality && artist.nationality !== filter.nationality) {
      return false;
    }
    
    // Filter by art style/movement
    if (filter.style && artist.art_movement !== filter.style) {
      return false;
    }
    
    // Filter by birth year (minimum)
    if (filter.min_year && artist.birth_year && artist.birth_year < filter.min_year) {
      return false;
    }
    
    // Filter by birth year (maximum)
    if (filter.max_year && artist.birth_year && artist.birth_year > filter.max_year) {
      return false;
    }
    
    return true;
  });
}); 