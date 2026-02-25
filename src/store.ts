import { create } from 'zustand';

export interface WorkspaceItem {
  id: string;
  type: 'variable' | 'model3d' | 'image' | 'barcode' | 'url';
  name: string;
  value: any;
  position?: [number, number, number];
  color?: string;
  isCut?: boolean;
}

interface AppState {
  code: string;
  setCode: (code: string) => void;
  items: WorkspaceItem[];
  addItem: (item: WorkspaceItem) => void;
  updateItem: (id: string, updates: Partial<WorkspaceItem>) => void;
  removeItem: (id: string) => void;
  isVisualizerOpen: boolean;
  setVisualizerOpen: (isOpen: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  code: '',
  setCode: (code) => set((state) => ({ 
    code,
    isVisualizerOpen: code.trim().length > 0 || state.isVisualizerOpen 
  })),
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  updateItem: (id, updates) => set((state) => ({
    items: state.items.map((item) => (item.id === id ? { ...item, ...updates } : item))
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  isVisualizerOpen: false,
  setVisualizerOpen: (isOpen) => set({ isVisualizerOpen: isOpen }),
}));
