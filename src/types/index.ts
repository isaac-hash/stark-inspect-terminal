export interface Node {
  name: string;
  namespace: string;
  status: "HEALTHY" | "ERROR" | "UNKNOWN";
  metadata_group: string | null;
  publishes: string[];
  subscribes: string[];
  uptime?: number;
}

export interface Topic {
  name: string;
  type: string;
  rate_hz: number;
  bandwidth_mbps: number;
  publishers?: string[];
  subscribers?: string[];
}

export interface Service {
  name: string;
  type: string;
  node?: string;
}

export interface Parameter {
  name: string;
  value: any;
  type: string;
}

export interface LaunchTarget {
  id: string;
  display_name: string;
  group: string;
  command: string;
  status: "RUNNING" | "STOPPED" | "ERROR";
  pid: number | null;
  uptime?: number;
}

export interface GraphData {
  nodes: Node[];
  topics: Topic[];
  services: Service[];
  timestamp: number;
}

export interface GraphUpdateEvent {
  type: "GRAPH_UPDATE";
  payload: GraphData;
}

export interface ControlStatusEvent {
  type: "CONTROL_STATUS";
  payload: {
    target_id: string;
    action: "RUN" | "STOP" | "RESTART";
    success: boolean;
    message: string;
    pid: number | null;
  };
}

export type WebSocketEvent = GraphUpdateEvent | ControlStatusEvent;
