import { useConnectionStore } from '@/stores/useConnectionStore';
import { useGraphStore } from '@/stores/useGraphStore';
import { useControlStore } from '@/stores/useControlStore';
import { WebSocketEvent } from '@/types';
import { toast } from '@/hooks/use-toast';

// Set to true to use dummy data, false to connect to real backend
const USE_DUMMY_DATA = true;

let ws: WebSocket | null = null;
let reconnectTimer: NodeJS.Timeout | null = null;
let dummyInterval: NodeJS.Timeout | null = null;

export const websocketService = {
  connect() {
    const { wsUrl, setConnected } = useConnectionStore.getState();
    
    // Use dummy data mode
    if (USE_DUMMY_DATA) {
      console.log('Using dummy data mode');
      setConnected(true);
      toast({ title: 'Connected', description: 'Using dummy data (set USE_DUMMY_DATA=false for live backend)' });
      this.startDummyDataSimulation();
      return;
    }

    if (ws?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    try {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setConnected(true);
        toast({ title: 'Connected', description: 'Connected to Stark Inspector backend' });
        
        if (reconnectTimer) {
          clearTimeout(reconnectTimer);
          reconnectTimer = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketEvent = JSON.parse(event.data);
          
          if (message.type === 'GRAPH_UPDATE') {
            useGraphStore.getState().setGraphData(message.payload);
          } else if (message.type === 'CONTROL_STATUS') {
            const { target_id, success, message: msg, pid } = message.payload;
            useControlStore.getState().updateTargetStatus(target_id, {
              status: success ? 'RUNNING' : 'ERROR',
              pid,
            });
            
            toast({
              title: success ? 'Success' : 'Error',
              description: msg,
              variant: success ? 'default' : 'destructive',
            });
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setConnected(false);
        ws = null;
        
        // Attempt reconnect after 3 seconds
        reconnectTimer = setTimeout(() => {
          console.log('Attempting to reconnect...');
          this.connect();
        }, 3000);
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      setConnected(false);
    }
  },

  startDummyDataSimulation() {
    // Simulate periodic updates to dummy data
    dummyInterval = setInterval(() => {
      const graphStore = useGraphStore.getState();
      
      // Randomly update node uptimes and slight rate variations
      const updatedNodes = graphStore.nodes.map(node => ({
        ...node,
        uptime: node.uptime ? node.uptime + 5 : 5,
      }));

      const updatedTopics = graphStore.topics.map(topic => ({
        ...topic,
        rate_hz: topic.rate_hz * (0.98 + Math.random() * 0.04),
        bandwidth_mbps: topic.bandwidth_mbps * (0.98 + Math.random() * 0.04),
      }));

      graphStore.setGraphData({
        nodes: updatedNodes,
        topics: updatedTopics,
        timestamp: Date.now(),
      });
    }, 5000);
  },

  disconnect() {
    if (ws) {
      ws.close();
      ws = null;
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    if (dummyInterval) {
      clearInterval(dummyInterval);
      dummyInterval = null;
    }
    useConnectionStore.getState().setConnected(false);
  },

  send(data: any) {
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected');
    }
  },
};
