import { Header } from "@/components/Header";
import { NodeCard } from "@/components/NodeCard";
import { LogPanel } from "@/components/LogPanel";
import { useNodes } from "@/hooks/useNodes";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

const Index = () => {
  const { nodes, logs, isConnected, startNode, stopNode, restartNode } = useNodes();

  const runningCount = nodes.filter((n) => n.isRunning).length;

  return (
    <div className="min-h-screen bg-background">
      <Header
        nodeCount={nodes.length}
        runningCount={runningCount}
        isConnected={isConnected}
      />

      <main className="container mx-auto p-6 space-y-6">
        <Alert className="border-primary/20 bg-primary/5">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription className="font-mono text-sm">
            <strong>Frontend Demo:</strong> This UI is ready to connect to your Python/FastAPI backend.
            In production, it will poll <code>/nodes</code> and subscribe to <code>/events</code> (SSE) for real-time updates.
            Currently showing mock data for demonstration.
          </AlertDescription>
        </Alert>

        <div>
          <h2 className="text-xl font-semibold text-foreground font-mono mb-4">
            ROS 2 Nodes
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {nodes.map((node) => (
              <NodeCard
                key={node.name}
                node={node}
                logs={logs}
                onStart={() => startNode(node.name)}
                onStop={() => stopNode(node.name)}
                onRestart={() => restartNode(node.name)}
              />
            ))}
          </div>
        </div>

        <LogPanel logs={logs} />
      </main>

      <footer className="border-t border-border bg-card px-6 py-4 mt-8">
        <p className="text-center text-sm text-muted-foreground font-mono">
          Stark Inspector MVP • Built for ROS 2 Humble/Jazzy • Localhost Only
        </p>
      </footer>
    </div>
  );
};

export default Index;
