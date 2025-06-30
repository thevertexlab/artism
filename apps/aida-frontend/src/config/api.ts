// API 配置
export const API_CONFIG = {
  // Backend URLs
  ARTISM_BACKEND: process.env.NEXT_PUBLIC_ARTISM_BACKEND_URL || 'http://localhost:8000',
  ISMISM_BACKEND: process.env.NEXT_PUBLIC_ISMISM_BACKEND_URL || 'http://localhost:5001',

  // Legacy support
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',

  // 检查是否在生产环境
  IS_PRODUCTION: process.env.NODE_ENV === 'production',

  // Vercel 部署时使用静态数据
  USE_STATIC_DATA: process.env.VERCEL === '1' || process.env.NODE_ENV === 'production',

  // Request Configuration
  TIMEOUT: 15000,
  RETRY_ATTEMPTS: 3,
};

// API 端点
export const API_ENDPOINTS = {
  // Artism Backend (FastAPI)
  ARTISTS: '/api/v1/artists',
  ARTWORKS: '/api/v1/artworks',
  ART_MOVEMENTS: '/api/v1/art-movements',
  AI_INTERACTION: '/api/v1/ai-interaction',
  AI_GENERATE: '/api/v1/ai-generate',
  IMPORT_TEST_DATA: '/api/v1/artworks/import-test-data',

  // Ismism Backend (Express.js)
  MOVEMENTS: '/api/movements',
};

// 构建完整的 API URL
export const buildApiUrl = (backend: 'artism' | 'ismism' | 'legacy', endpoint: string): string => {
  if (API_CONFIG.USE_STATIC_DATA) {
    // 在生产环境中，返回相对路径用于 API 路由
    return `/api${endpoint}`;
  }

  // 选择正确的后端
  let baseUrl: string;
  switch (backend) {
    case 'artism':
      baseUrl = API_CONFIG.ARTISM_BACKEND;
      break;
    case 'ismism':
      baseUrl = API_CONFIG.ISMISM_BACKEND;
      break;
    case 'legacy':
    default:
      baseUrl = API_CONFIG.BASE_URL;
      break;
  }

  return `${baseUrl}${endpoint}`;
};

// Common headers
export const getApiHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

// API client with error handling
export const apiClient = {
  async get(url: string, options?: RequestInit) {
    const response = await fetch(url, {
      method: 'GET',
      headers: getApiHeaders(),
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async post(url: string, data?: any, options?: RequestInit) {
    const response = await fetch(url, {
      method: 'POST',
      headers: getApiHeaders(),
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
};