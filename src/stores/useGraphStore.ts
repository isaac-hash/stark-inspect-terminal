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

const dummyNodes: Node[] = [
  { name: '/talker', namespace: '/', status: 'HEALTHY', metadata_group: 'perception', publishes: ['/chatter', '/rosout'], subscribes: [], uptime: 125 },
  { name: '/listener', namespace: '/', status: 'HEALTHY', metadata_group: 'perception', publishes: ['/rosout'], subscribes: ['/chatter'], uptime: 120 },
  { name: '/camera_node', namespace: '/sensors', status: 'HEALTHY', metadata_group: 'sensors', publishes: ['/camera/image_raw', '/camera/camera_info'], subscribes: [], uptime: 200 },
  { name: '/lidar_node', namespace: '/sensors', status: 'ERROR', metadata_group: 'sensors', publishes: ['/scan'], subscribes: [], uptime: 85 },
  { name: '/controller', namespace: '/navigation', status: 'HEALTHY', metadata_group: 'control', publishes: ['/cmd_vel'], subscribes: ['/scan', '/odom'], uptime: 150 },
];

const dummyTopics: Topic[] = [
  { name: '/chatter', type: 'std_msgs/msg/String', rate_hz: 10.5, bandwidth_mbps: 0.002, publishers: ['/talker'], subscribers: ['/listener'] },
  { name: '/camera/image_raw', type: 'sensor_msgs/msg/Image', rate_hz: 30.0, bandwidth_mbps: 24.5, publishers: ['/camera_node'], subscribers: [] },
  { name: '/scan', type: 'sensor_msgs/msg/LaserScan', rate_hz: 15.0, bandwidth_mbps: 1.2, publishers: ['/lidar_node'], subscribers: ['/controller'] },
  { name: '/cmd_vel', type: 'geometry_msgs/msg/Twist', rate_hz: 50.0, bandwidth_mbps: 0.01, publishers: ['/controller'], subscribers: [] },
  { name: '/odom', type: 'nav_msgs/msg/Odometry', rate_hz: 20.0, bandwidth_mbps: 0.5, publishers: [], subscribers: ['/controller'] },
];

const dummyServices: Service[] = [
  { name: '/camera_node/set_parameters', type: 'rcl_interfaces/srv/SetParameters', node: '/camera_node' },
  { name: '/controller/get_state', type: 'nav2_msgs/srv/GetState', node: '/controller' },
  { name: '/reset_simulation', type: 'std_srvs/srv/Empty' },
];

export const useGraphStore = create<GraphState>((set) => ({
  nodes: dummyNodes,
  topics: dummyTopics,
  services: dummyServices,
  lastUpdate: Date.now(),
  
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
