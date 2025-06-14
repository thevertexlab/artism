import axios from 'axios';
import { Artist, ArtistFilter } from '../store/atoms';

// 使用前端代理路径
const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const artistService = {
  // Get all artists
  getArtists: async (): Promise<Artist[]> => {
    try {
      const response = await api.get('/artists');
      return response.data;
    } catch (error) {
      console.error('Error fetching artists:', error);
      throw error;
    }
  },

  // Get artist by ID
  getArtistById: async (id: number): Promise<Artist> => {
    try {
      const response = await api.get(`/artists/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching artist with ID ${id}:`, error);
      throw error;
    }
  },

  // Test GET API with filters
  testGetApi: async (filters: ArtistFilter): Promise<any> => {
    try {
      const response = await api.get('/api/test', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error testing GET API:', error);
      throw error;
    }
  },

  // Test POST API with filters
  testPostApi: async (filters: ArtistFilter): Promise<any> => {
    try {
      const response = await api.post('/api/test', filters);
      return response.data;
    } catch (error) {
      console.error('Error testing POST API:', error);
      throw error;
    }
  },

  // Get all test data
  getAllTestData: async (): Promise<any> => {
    try {
      const response = await api.get('/api/test');
      return response.data;
    } catch (error) {
      console.error('Error fetching all test data:', error);
      throw error;
    }
  },

  // AI artist interaction
  interactWithAI: async (message: string): Promise<any> => {
    try {
      const response = await api.post('/ai-interaction', { message });
      return response.data;
    } catch (error) {
      console.error('Error interacting with AI artist:', error);
      throw error;
    }
  },
};

export default api; 