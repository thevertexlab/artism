import api from '@/services/api';
import type { Artist, ArtistFilter } from '@/types/models';

export const artistService = {
  // Get all artists
  getArtists: async (): Promise<Artist[]> => {
    try {
      const response = await api.get('/artists/');
      return response.data;
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  },

  // Get artist by ID
  getArtistById: async (id: number): Promise<Artist> => {
    try {
      const response = await api.get(`/artists/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching artist with ID ${id}:`, error);
      throw error;
    }
  },

  // Search artists with filters
  searchArtists: async (filters: ArtistFilter): Promise<Artist[]> => {
    try {
      const response = await api.get('/artists/search/', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error searching artists:', error);
      throw error;
    }
  },

  // AI artist interaction
  interactWithAI: async (message: string, artistId?: number): Promise<any> => {
    try {
      const payload = artistId ? { message, artist_id: artistId } : { message };
      const response = await api.post('/ai-interaction/', payload);
      return response.data;
    } catch (error) {
      console.error('Error interacting with AI artist:', error);
      throw error;
    }
  },
}; 