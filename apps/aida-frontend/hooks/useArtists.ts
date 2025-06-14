'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { artistsAtom, isLoadingAtom, errorAtom } from '@/store/atoms';
import { artistService } from '@/services/endpoints/artistService';
import type { Artist, ArtistFilter } from '@/types/models';

export function useArtists() {
  const [artists, setArtists] = useAtom(artistsAtom);
  const [isLoading, setIsLoading] = useAtom(isLoadingAtom);
  const [error, setError] = useAtom(errorAtom);

  const fetchArtists = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await artistService.getArtists();
      setArtists(data);
    } catch (err) {
      setError('Failed to fetch artists');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const searchArtists = async (filters: ArtistFilter) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await artistService.searchArtists(filters);
      setArtists(data);
    } catch (err) {
      setError('Failed to search artists');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (artists.length === 0) {
      fetchArtists();
    }
  }, []);

  return {
    artists,
    isLoading,
    error,
    fetchArtists,
    searchArtists,
  };
} 