import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

interface HeaderProps {
  nodeCount: number;
  runningCount: number;
  isConnected: boolean;
}

export function Header({ nodeCount, runningCount, isConnected }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground font-mono">
              Stark Inspector
            </h1>
          </div>
          <Badge variant="outline" className="font-mono">
            MVP
          </Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isConnected ? "bg-success animate-pulse" : "bg-error"
              }`}
            />
            <span className="text-sm font-mono text-muted-foreground">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="h-6 w-px bg-border" />

          <div className="text-sm font-mono">
            <span className="text-muted-foreground">Nodes:</span>{" "}
            <span className="text-foreground font-semibold">{nodeCount}</span>
            <span className="text-muted-foreground mx-2">|</span>
            <span className="text-muted-foreground">Running:</span>{" "}
            <span className="text-success font-semibold">{runningCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
