import { create } from 'zustand';
import { IArtStyle } from '../types/art';

interface TimelineState {
  nodes: IArtStyle[];
  fetchNodes: () => Promise<void>;
  fetchContemporaryNodes: () => Promise<void>;
  updateNodePosition: (id: string, position: { x: number; y: number }) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  nodes: [],
  fetchNodes: async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movements');
      const data = await response.json();
      set({ nodes: data });
    } catch (error) {
      console.error('Error fetching timeline nodes:', error);
    }
  },
  fetchContemporaryNodes: async () => {
    try {
      const response = await fetch('http://localhost:5000/api/movements/contemporary');
      const data = await response.json();
      set({ nodes: data });
    } catch (error) {
      console.error('Error fetching contemporary movements:', error);
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