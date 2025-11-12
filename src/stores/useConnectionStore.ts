import { create } from 'zustand';

interface ConnectionState {
  isConnected: boolean;
  wsUrl: string;
  apiBaseUrl: string;
  setConnected: (connected: boolean) => void;
  setUrls: (wsUrl: string, apiBaseUrl: string) => void;
}

export const useConnectionStore = create<ConnectionState>((set) => ({
  isConnected: false,
  wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/graph',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  setConnected: (connected) => set({ isConnected: connected }),
  
  setUrls: (wsUrl, apiBaseUrl) => set({ wsUrl, apiBaseUrl }),
}));
