import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Square, RotateCcw } from "lucide-react";

interface NodeCardProps {
  node: {
    name: string;
    status: "running" | "stopped" | "error" | "unknown";
    message?: string;
    isRunning?: boolean;
  };
  onStart: () => void;
  onStop: () => void;
  onRestart: () => void;
}

const statusConfig = {
  running: {
    color: "bg-success text-success-foreground",
    label: "Running",
  },
  stopped: {
    color: "bg-muted text-muted-foreground",
    label: "Stopped",
  },
  error: {
    color: "bg-error text-error-foreground",
    label: "Error",
  },
  unknown: {
    color: "bg-unknown text-unknown-foreground",
    label: "Unknown",
  },
};

export function NodeCard({ node, onStart, onStop, onRestart }: NodeCardProps) {
  const config = statusConfig[node.status];

  return (
    <Card className="p-4 border-border bg-card hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-mono text-lg font-semibold text-foreground truncate">
              {node.name}
            </h3>
            <Badge className={`${config.color} font-mono text-xs`}>
              {config.label}
            </Badge>
          </div>
          {node.message && (
            <p className="text-sm text-muted-foreground font-mono">
              {node.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {node.isRunning ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onRestart}
                className="border-warning/50 hover:bg-warning/10 hover:text-warning"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Restart
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onStop}
                className="border-error/50 hover:bg-error/10 hover:text-error"
              >
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={onStart}
              className="border-success/50 hover:bg-success/10 hover:text-success"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
