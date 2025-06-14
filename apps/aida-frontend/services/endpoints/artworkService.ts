import api from '@/services/api';
import type { Artwork, ArtworkFilter } from '@/types/models';

export const artworkService = {
  // Get all artworks
  getArtworks: async (): Promise<Artwork[]> => {
    try {
      const response = await api.get('/artworks');
      return response.data;
    } catch (error) {
      console.error('Error fetching artworks:', error);
      throw error;
    }
  },

  // Get artwork by ID
  getArtworkById: async (id: number): Promise<Artwork> => {
    try {
      const response = await api.get(`/artworks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching artwork with ID ${id}:`, error);
      throw error;
    }
  },

  // Get artworks by artist ID
  getArtworksByArtistId: async (artistId: number): Promise<Artwork[]> => {
    try {
      const response = await api.get(`/artworks/artist/${artistId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching artworks for artist with ID ${artistId}:`, error);
      throw error;
    }
  },

  // Search artworks with filters
  searchArtworks: async (filters: ArtworkFilter): Promise<Artwork[]> => {
    try {
      const response = await api.get('/artworks/search', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error searching artworks:', error);
      throw error;
    }
  },

  // Import test data
  importTestData: async (): Promise<any> => {
    try {
      const response = await api.get('/artworks/import-test-data');
      return response.data;
    } catch (error) {
      console.error('Error importing test artwork data:', error);
      throw error;
    }
  },
}; 