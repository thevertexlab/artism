// API 配置
export const API_CONFIG = {
  // 在生产环境中，使用环境变量或静态数据
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  
  // 检查是否在生产环境
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  
  // Vercel 部署时使用静态数据
  USE_STATIC_DATA: process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
};

// API 端点
export const API_ENDPOINTS = {
  ARTISTS: '/artists',
  ARTWORKS: '/artworks',
  AI_INTERACTION: '/ai-interaction',
  IMPORT_TEST_DATA: '/artworks/import-test-data'
};

// 构建完整的 API URL
export const buildApiUrl = (endpoint: string): string => {
  if (API_CONFIG.USE_STATIC_DATA) {
    // 在生产环境中，返回相对路径用于 API 路由
    return `/api${endpoint}`;
  }
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 