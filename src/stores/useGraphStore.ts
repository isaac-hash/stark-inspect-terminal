import { create } from 'zustand';
import { Node, Topic, Service, GraphData } from '@/types';

interface GraphState {
  nodes: Node[];
  topics: Topic[];
  services: Service[];
  lastUpdate: number;
  setGraphData: (data: Partial<GraphData>) => void;
  clearGraph: () => void;
  updateNode: (name: string, updates: Partial<Node>) => void;
  updateTopic: (name: string, updates: Partial<Topic>) => void;
}

export const useGraphStore = create<GraphState>((set) => ({
  nodes: [],
  topics: [],
  services: [],
  lastUpdate: 0,
  
  setGraphData: (data) => set((state) => ({
    nodes: data.nodes ?? state.nodes,
    topics: data.topics ?? state.topics,
    services: data.services ?? state.services,
    lastUpdate: data.timestamp ?? Date.now(),
  })),
  
  clearGraph: () => set({
    nodes: [],
    topics: [],
    services: [],
    lastUpdate: 0,
  }),
  
  updateNode: (name, updates) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.name === name ? { ...node, ...updates } : node
    ),
  })),
  
  updateTopic: (name, updates) => set((state) => ({
    topics: state.topics.map((topic) =>
      topic.name === name ? { ...topic, ...updates } : topic
    ),
  })),
}));
