import { atom, Getter } from 'jotai';

// Types
export interface Artist {
  id: number;
  name: string;
  birth_year?: number;
  death_year?: number;
  nationality?: string;
  bio?: string;
  art_movement?: string;
}

export interface ArtistFilter {
  name?: string;
  nationality?: string;
  style?: string;
  min_year?: number;
  max_year?: number;
}

// Atoms
export const artistsAtom = atom<Artist[]>([]);
export const selectedArtistAtom = atom<Artist | null>(null);
export const artistFilterAtom = atom<ArtistFilter>({});
export const isLoadingAtom = atom<boolean>(false);
export const errorAtom = atom<string | null>(null);

// Derived atoms
export const filteredArtistsAtom = atom((get: Getter) => {
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