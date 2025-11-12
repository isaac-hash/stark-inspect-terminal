import axios from 'axios';
import { useConnectionStore } from '@/stores/useConnectionStore';
import { GraphData, LaunchTarget, Parameter } from '@/types';

const getApiClient = () => {
  const baseURL = useConnectionStore.getState().apiBaseUrl;
  return axios.create({ baseURL, timeout: 5000 });
};

export const api = {
  async getGraph(): Promise<GraphData> {
    const client = getApiClient();
    const { data } = await client.get<GraphData>('/api/graph');
    return data;
  },

  async getTargets(): Promise<LaunchTarget[]> {
    const client = getApiClient();
    const { data } = await client.get<LaunchTarget[]>('/api/targets');
    return data;
  },

  async runTarget(targetId: string): Promise<void> {
    const client = getApiClient();
    await client.post('/api/control/run', { target_id: targetId });
  },

  async stopTarget(targetId: string): Promise<void> {
    const client = getApiClient();
    await client.post('/api/control/stop', { target_id: targetId });
  },

  async getParameters(nodeName?: string): Promise<Parameter[]> {
    const client = getApiClient();
    const { data } = await client.get<Parameter[]>('/api/params', {
      params: { node: nodeName },
    });
    return data;
  },
};
