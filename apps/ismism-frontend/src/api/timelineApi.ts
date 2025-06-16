import api from './axios';

interface TimelineNode {
  id: string;
  title: string;
  year: number;
  description: string;
  imageUrl?: string;
  images?: string[];
  artists: string[];
  styleMovement: string;
  influences: string[];
  influencedBy: string[];
  position?: { x: number; y: number };
  tags?: string[];
}

// 获取所有时间线节点
export const fetchTimelineNodes = async (): Promise<TimelineNode[]> => {
  try {
    const response = await api.get('/movements');
    return response.data.map((node: any) => ({
      id: node.id || node._id || String(Date.now()),
      title: node.title || node.name,
      year: node.year || node.start_year,
      description: node.description || '',
      imageUrl: (node.images && node.images.length > 0) ? node.images[0] : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
      images: node.images || Array(4).fill(0).map((_, i) => `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`),
      artists: node.artists || node.representative_artists || [],
      styleMovement: node.styleMovement || (node.title || node.name).toLowerCase().replace(/\s+/g, '-'),
      influences: node.influences || [],
      influencedBy: node.influencedBy || [],
      position: node.position || { x: 100 + Math.random() * 800, y: 100 + Math.random() * 300 },
      tags: node.tags || []
    }));
  } catch (error) {
    console.error('Error fetching timeline nodes:', error);
    throw error;
  }
};

// 获取单个时间线节点
export const fetchTimelineNodeById = async (id: string): Promise<TimelineNode> => {
  try {
    const response = await api.get(`/movements/${id}`);
    const node = response.data;
    return {
      id: node.id || node._id || String(Date.now()),
      title: node.title || node.name,
      year: node.year || node.start_year,
      description: node.description || '',
      imageUrl: (node.images && node.images.length > 0) ? node.images[0] : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
      images: node.images || Array(4).fill(0).map((_, i) => `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`),
      artists: node.artists || node.representative_artists || [],
      styleMovement: node.styleMovement || (node.title || node.name).toLowerCase().replace(/\s+/g, '-'),
      influences: node.influences || [],
      influencedBy: node.influencedBy || [],
      position: node.position || { x: 100 + Math.random() * 800, y: 100 + Math.random() * 300 },
      tags: node.tags || []
    };
  } catch (error) {
    console.error(`Error fetching timeline node ${id}:`, error);
    throw error;
  }
};

// 创建新节点
export const createNode = async (nodeData: Partial<TimelineNode>): Promise<TimelineNode> => {
  try {
    const response = await api.post('/movements', {
      name: nodeData.title,
      start_year: nodeData.year,
      description: nodeData.description || '',
      images: nodeData.images || [],
      representative_artists: nodeData.artists || [],
      influences: nodeData.influences || [],
      influencedBy: nodeData.influencedBy || [],
      tags: nodeData.tags || [],
      position: nodeData.position || { x: 100 + Math.random() * 800, y: 100 + Math.random() * 300 }
    });
    
    const node = response.data;
    return {
      id: node.id || node._id || String(Date.now()),
      title: node.title || node.name,
      year: node.year || node.start_year,
      description: node.description || '',
      imageUrl: (node.images && node.images.length > 0) ? node.images[0] : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
      images: node.images || Array(4).fill(0).map((_, i) => `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`),
      artists: node.artists || node.representative_artists || [],
      styleMovement: node.styleMovement || (node.title || node.name).toLowerCase().replace(/\s+/g, '-'),
      influences: node.influences || [],
      influencedBy: node.influencedBy || [],
      position: node.position || { x: 100 + Math.random() * 800, y: 100 + Math.random() * 300 },
      tags: node.tags || []
    };
  } catch (error) {
    console.error('Error creating node:', error);
    throw error;
  }
};

// 更新节点
export const updateNode = async (id: string, nodeData: Partial<TimelineNode>): Promise<TimelineNode> => {
  try {
    const response = await api.put(`/movements/${id}`, {
      name: nodeData.title,
      start_year: nodeData.year,
      description: nodeData.description,
      images: nodeData.images,
      representative_artists: nodeData.artists,
      influences: nodeData.influences,
      influencedBy: nodeData.influencedBy,
      tags: nodeData.tags,
      position: nodeData.position
    });
    
    const node = response.data;
    return {
      id: node.id || node._id || id,
      title: node.title || node.name,
      year: node.year || node.start_year,
      description: node.description || '',
      imageUrl: (node.images && node.images.length > 0) ? node.images[0] : `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`,
      images: node.images || Array(4).fill(0).map((_, i) => `/TestData/${10001 + (Math.floor(Math.random() * 30))}.jpg`),
      artists: node.artists || node.representative_artists || [],
      styleMovement: node.styleMovement || (node.title || node.name).toLowerCase().replace(/\s+/g, '-'),
      influences: node.influences || [],
      influencedBy: node.influencedBy || [],
      position: node.position || { x: 100 + Math.random() * 800, y: 100 + Math.random() * 300 },
      tags: node.tags || []
    };
  } catch (error) {
    console.error(`Error updating node ${id}:`, error);
    throw error;
  }
};

// 删除节点
export const deleteNode = async (id: string): Promise<void> => {
  try {
    await api.delete(`/movements/${id}`);
  } catch (error) {
    console.error(`Error deleting node ${id}:`, error);
    throw error;
  }
}; 