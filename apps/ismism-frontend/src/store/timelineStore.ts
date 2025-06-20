import { create } from 'zustand';
import { IArtStyle } from '../types/art';

interface TimelineState {
  nodes: IArtStyle[];
  loading: boolean;
  error: string | null;
  fetchNodes: () => Promise<void>;
  fetchContemporaryNodes: () => Promise<void>;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  nodes: [],
  loading: false,
  error: null,
  fetchNodes: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('http://localhost:5000/api/movements');
      
      if (!response.ok) {
        throw new Error(`API返回错误: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('API返回的数据不是数组格式');
      }
      
      set({ nodes: data, loading: false });
      console.log(`成功获取${data.length}个艺术运动节点`);
    } catch (error) {
      console.error('Error fetching timeline nodes:', error);
      set({ 
        error: error instanceof Error ? error.message : '获取数据失败', 
        loading: false,
        // 保持现有节点，避免UI空白
        nodes: []
      });
    }
  },
  fetchContemporaryNodes: async () => {
    try {
      set({ loading: true, error: null });
      const response = await fetch('http://localhost:5000/api/movements/contemporary');
      
      if (!response.ok) {
        throw new Error(`API返回错误: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data)) {
        throw new Error('API返回的数据不是数组格式');
      }
      
      set({ nodes: data, loading: false });
      console.log(`成功获取${data.length}个当代艺术运动节点`);
    } catch (error) {
      console.error('Error fetching contemporary movements:', error);
      set({ 
        error: error instanceof Error ? error.message : '获取数据失败', 
        loading: false,
        // 保持现有节点，避免UI空白
        nodes: []
      });
    }
  },
  updateNodePosition: (id, position) => {
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === id ? { ...node, position } : node
      ),
    }));
  },
})); 