import axios, { AxiosInstance } from 'axios';

// 创建axios实例
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// 艺术家API
export const artistsApi = {
  // 获取所有艺术家
  getAll: async (params = {}) => {
    const response = await api.get('/artists', { params });
    return response.data;
  },
  
  // 搜索艺术家
  search: async (params: { name?: string; movement?: string; nationality?: string; limit?: number; skip?: number }) => {
    const response = await api.get('/artists/search', { params });
    return response.data;
  },
  
  // 获取单个艺术家
  getById: async (id: string) => {
    const response = await api.get(`/artists/${id}`);
    return response.data;
  },
  
  // 创建艺术家
  create: async (data: any) => {
    const response = await api.post('/artists', data);
    return response.data;
  },
  
  // 更新艺术家
  update: async (id: string, data: any) => {
    const response = await api.put(`/artists/${id}`, data);
    return response.data;
  },
  
  // 删除艺术家
  delete: async (id: string) => {
    const response = await api.delete(`/artists/${id}`);
    return response.data;
  }
};

// 艺术作品API
export const artworksApi = {
  // 获取所有艺术作品
  getAll: async (params = {}) => {
    const response = await api.get('/artworks', { params });
    return response.data;
  },
  
  // 获取单个艺术作品
  getById: async (id: string) => {
    const response = await api.get(`/artworks/${id}`);
    return response.data;
  },
  
  // 获取艺术家的所有作品
  getByArtistId: async (artistId: string, params = {}) => {
    const response = await api.get(`/artworks/by-artist/${artistId}`, { params });
    return response.data;
  },
  
  // 创建艺术作品
  create: async (data: any) => {
    const response = await api.post('/artworks', data);
    return response.data;
  },
  
  // 更新艺术作品
  update: async (id: string, data: any) => {
    const response = await api.put(`/artworks/${id}`, data);
    return response.data;
  },
  
  // 删除艺术作品
  delete: async (id: string) => {
    const response = await api.delete(`/artworks/${id}`);
    return response.data;
  }
};

// 艺术流派API
export const artMovementsApi = {
  // 获取所有艺术流派
  getAll: async (params = {}) => {
    const response = await api.get('/art-movements', { params });
    return response.data;
  },
  
  // 获取单个艺术流派
  getById: async (id: string) => {
    const response = await api.get(`/art-movements/${id}`);
    return response.data;
  },
  
  // 创建艺术流派
  create: async (data: any) => {
    const response = await api.post('/art-movements', data);
    return response.data;
  },
  
  // 更新艺术流派
  update: async (id: string, data: any) => {
    const response = await api.put(`/art-movements/${id}`, data);
    return response.data;
  },
  
  // 删除艺术流派
  delete: async (id: string) => {
    const response = await api.delete(`/art-movements/${id}`);
    return response.data;
  }
};

export default {
  artists: artistsApi,
  artworks: artworksApi,
  artMovements: artMovementsApi
}; 