import { create } from 'zustand';
import { LaunchTarget } from '@/types';

interface ControlState {
  targets: LaunchTarget[];
  setTargets: (targets: LaunchTarget[]) => void;
  updateTargetStatus: (targetId: string, updates: Partial<LaunchTarget>) => void;
}

export const useControlStore = create<ControlState>((set) => ({
  targets: [],
  
  setTargets: (targets) => set({ targets }),
  
  updateTargetStatus: (targetId, updates) => set((state) => ({
    targets: state.targets.map((target) =>
      target.id === targetId ? { ...target, ...updates } : target
    ),
  })),
}));
