import { useState, useEffect } from "react";

export interface Node {
  name: string;
  status: "running" | "stopped" | "error" | "unknown";
  message?: string;
  isRunning?: boolean;
}

export interface LogEntry {
  node: string;
  message: string;
  timestamp: string;
}

// Mock data for demonstration
const mockNodes: Node[] = [
  {
    name: "/talker",
    status: "stopped",
    message: "Ready to start",
    isRunning: false,
  },
  {
    name: "/listener",
    status: "stopped",
    message: "Ready to start",
    isRunning: false,
  },
  {
    name: "/robot_state_publisher",
    status: "unknown",
    message: "Waiting for diagnostics",
    isRunning: false,
  },
];

export function useNodes() {
  const [nodes, setNodes] = useState<Node[]>(mockNodes);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate connection to backend
  useEffect(() => {
    // In production, this would connect to SSE endpoint at /events
    const timer = setTimeout(() => {
      setIsConnected(true);
      addLog("system", "Connected to Stark Inspector backend");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const addLog = (node: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev.slice(-49), { node, message, timestamp }]);
  };

  const startNode = (nodeName: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.name === nodeName
          ? { ...node, status: "running", isRunning: true, message: "Node started" }
          : node
      )
    );
    addLog(nodeName, "Starting node...");
    
    // Simulate log output
    setTimeout(() => {
      addLog(nodeName, "[INFO] Node initialized successfully");
    }, 500);
    
    setTimeout(() => {
      addLog(nodeName, "[INFO] Publishing messages...");
    }, 1000);
  };

  const stopNode = (nodeName: string) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.name === nodeName
          ? { ...node, status: "stopped", isRunning: false, message: "Node stopped" }
          : node
      )
    );
    addLog(nodeName, "Stopping node...");
    
    setTimeout(() => {
      addLog(nodeName, "[INFO] Node shutdown complete");
    }, 300);
  };

  const restartNode = (nodeName: string) => {
    addLog(nodeName, "Restarting node...");
    stopNode(nodeName);
    setTimeout(() => startNode(nodeName), 500);
  };

  return {
    nodes,
    logs,
    isConnected,
    startNode,
    stopNode,
    restartNode,
  };
}
