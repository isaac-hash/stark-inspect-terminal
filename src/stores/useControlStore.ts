import { create } from 'zustand';
import { LaunchTarget } from '@/types';

interface ControlState {
  targets: LaunchTarget[];
  setTargets: (targets: LaunchTarget[]) => void;
  updateTargetStatus: (targetId: string, updates: Partial<LaunchTarget>) => void;
}

const dummyTargets: LaunchTarget[] = [
  { id: 'perception_stack', display_name: 'Perception Stack', group: 'Perception', command: 'ros2 launch perception perception.launch.py', status: 'RUNNING', pid: 12345, uptime: 450 },
  { id: 'navigation_stack', display_name: 'Navigation Stack', group: 'Navigation', command: 'ros2 launch nav2_bringup navigation.launch.py', status: 'RUNNING', pid: 12346, uptime: 420 },
  { id: 'camera_driver', display_name: 'Camera Driver', group: 'Sensors', command: 'ros2 launch camera camera.launch.py', status: 'STOPPED', pid: null },
  { id: 'lidar_driver', display_name: 'LIDAR Driver', group: 'Sensors', command: 'ros2 launch lidar lidar.launch.py', status: 'ERROR', pid: null },
  { id: 'robot_localization', display_name: 'Robot Localization', group: 'Navigation', command: 'ros2 launch robot_localization ekf.launch.py', status: 'RUNNING', pid: 12347, uptime: 380 },
];

export const useControlStore = create<ControlState>((set) => ({
  targets: dummyTargets,
  
  setTargets: (targets) => set({ targets }),
  
  updateTargetStatus: (targetId, updates) => set((state) => ({
    targets: state.targets.map((target) =>
      target.id === targetId ? { ...target, ...updates } : target
    ),
  })),
}));
