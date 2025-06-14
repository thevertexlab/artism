import api from '@/services/api';
import type { ArtistFilter } from '@/types/models';

export const testService = {
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
}; 