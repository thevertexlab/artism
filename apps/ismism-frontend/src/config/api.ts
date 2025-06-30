// API Configuration for Ismism Frontend

export const API_CONFIG = {
  // Backend URLs
  ISMISM_BACKEND: import.meta.env.VITE_ISMISM_BACKEND_URL || 'http://localhost:5001',
  ARTISM_BACKEND: import.meta.env.VITE_ARTISM_BACKEND_URL || 'http://localhost:8000',
  
  // API Endpoints
  ENDPOINTS: {
    // Ismism Backend (Express.js)
    MOVEMENTS: '/api/movements',
    ART_MOVEMENTS: '/api/art-movements',

    // Artism Backend (FastAPI)
    ARTISTS: '/api/v1/artists',
    ARTWORKS: '/api/v1/artworks',
    AI_CHAT: '/api/v1/ai-interaction',
  },
  
  // Request Configuration
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// Helper function to build full API URLs
export const buildApiUrl = (backend: 'ismism' | 'artism', endpoint: string) => {
  const baseUrl = backend === 'ismism' ? API_CONFIG.ISMISM_BACKEND : API_CONFIG.ARTISM_BACKEND;
  return `${baseUrl}${endpoint}`;
};

// Common headers
export const getApiHeaders = () => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
});

export default API_CONFIG;
