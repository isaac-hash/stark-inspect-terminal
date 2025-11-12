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
    
    // Simulate log output with realistic ROS 2 messages
    setTimeout(() => {
      addLog(nodeName, "[INFO] Node initialized successfully");
    }, 500);
    
    setTimeout(() => {
      addLog(nodeName, "[INFO] Creating publishers and subscribers");
    }, 800);
    
    setTimeout(() => {
      addLog(nodeName, "[INFO] Node is now active");
    }, 1000);

    // Simulate periodic messages for running nodes
    const interval = setInterval(() => {
      if (nodeName === "/talker") {
        addLog(nodeName, `[INFO] Publishing: "Hello World ${Date.now() % 1000}"`);
      } else if (nodeName === "/listener") {
        addLog(nodeName, `[INFO] Received message: "Hello World ${Date.now() % 1000}"`);
      } else {
        addLog(nodeName, `[DEBUG] Heartbeat ${Date.now() % 100}`);
      }
    }, 2000);

    // Store interval ID for cleanup (in production, store in state)
    (window as any)[`interval_${nodeName}`] = interval;
  };

  const stopNode = (nodeName: string) => {
    // Clear periodic messages
    const interval = (window as any)[`interval_${nodeName}`];
    if (interval) {
      clearInterval(interval);
      delete (window as any)[`interval_${nodeName}`];
    }

    setNodes((prev) =>
      prev.map((node) =>
        node.name === nodeName
          ? { ...node, status: "stopped", isRunning: false, message: "Node stopped" }
          : node
      )
    );
    addLog(nodeName, "[WARN] Shutdown requested");
    
    setTimeout(() => {
      addLog(nodeName, "[INFO] Cleaning up resources");
    }, 200);
    
    setTimeout(() => {
      addLog(nodeName, "[INFO] Node shutdown complete");
    }, 400);
  };

  const restartNode = (nodeName: string) => {
    addLog(nodeName, "[INFO] Restarting node...");
    stopNode(nodeName);
    setTimeout(() => startNode(nodeName), 600);
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
