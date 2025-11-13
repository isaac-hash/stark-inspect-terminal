import axios from 'axios';
import { useConnectionStore } from '@/stores/useConnectionStore';
import { useGraphStore } from '@/stores/useGraphStore';
import { useControlStore } from '@/stores/useControlStore';
import { GraphData, LaunchTarget, Parameter } from '@/types';
import { USE_DUMMY_DATA } from './websocket';

const getApiClient = () => {
  const baseURL = useConnectionStore.getState().apiBaseUrl;
  return axios.create({ baseURL, timeout: 5000 });
};

const dummyParameters: Parameter[] = [
  { name: '/camera_node.frame_rate', value: 30, type: 'integer' },
  { name: '/camera_node.resolution', value: '1920x1080', type: 'string' },
  { name: '/controller.max_speed', value: 1.5, type: 'double' },
  { name: '/controller.enable_safety', value: true, type: 'boolean' },
  { name: '/lidar_node.scan_range', value: 10.0, type: 'double' },
];

export const api = {
  async getGraph(): Promise<GraphData> {
    if (USE_DUMMY_DATA) {
      const graphStore = useGraphStore.getState();
      return {
        nodes: graphStore.nodes,
        topics: graphStore.topics,
        services: graphStore.services,
        timestamp: Date.now(),
      };
    }
    
    const client = getApiClient();
    const { data } = await client.get<GraphData>('/api/graph');
    return data;
  },

  async getTargets(): Promise<LaunchTarget[]> {
    if (USE_DUMMY_DATA) {
      const controlStore = useControlStore.getState();
      return controlStore.targets;
    }
    
    const client = getApiClient();
    const { data } = await client.get<LaunchTarget[]>('/api/targets');
    return data;
  },

  async runTarget(targetId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      // Simulate starting a target
      useControlStore.getState().updateTargetStatus(targetId, {
        status: 'RUNNING',
        pid: Math.floor(Math.random() * 90000) + 10000,
        uptime: 0,
      });
      return;
    }
    
    const client = getApiClient();
    await client.post('/api/control/run', { target_id: targetId });
  },

  async stopTarget(targetId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      // Simulate stopping a target
      useControlStore.getState().updateTargetStatus(targetId, {
        status: 'STOPPED',
        pid: null,
        uptime: 0,
      });
      return;
    }
    
    const client = getApiClient();
    await client.post('/api/control/stop', { target_id: targetId });
  },

  async getParameters(nodeName?: string): Promise<Parameter[]> {
    if (USE_DUMMY_DATA) {
      // Return dummy parameters, optionally filtered by node
      if (nodeName) {
        return dummyParameters.filter(p => p.name.startsWith(nodeName));
      }
      return dummyParameters;
    }
    
    const client = getApiClient();
    const { data } = await client.get<Parameter[]>('/api/params', {
      params: { node: nodeName },
    });
    return data;
  },
};
