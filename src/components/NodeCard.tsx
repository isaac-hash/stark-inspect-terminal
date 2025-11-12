import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Square, RotateCcw, ChevronDown, Terminal } from "lucide-react";

interface LogEntry {
  node: string;
  message: string;
  timestamp: string;
}

interface NodeCardProps {
  node: {
    name: string;
    status: "running" | "stopped" | "error" | "unknown";
    message?: string;
    isRunning?: boolean;
  };
  logs: LogEntry[];
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

export function NodeCard({ node, logs, onStart, onStop, onRestart }: NodeCardProps) {
  const config = statusConfig[node.status];
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (scrollRef.current && isOpen) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isOpen]);

  // Filter logs for this specific node
  const nodeLogs = logs.filter((log) => log.node === node.name);

  return (
    <Card className="border-border bg-card hover:border-primary/30 transition-colors overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-mono text-lg font-semibold text-foreground truncate">
                  {node.name}
                </h3>
                <Badge className={`${config.color} font-mono text-xs`}>
                  {config.label}
                </Badge>
                {nodeLogs.length > 0 && (
                  <Badge variant="outline" className="font-mono text-xs">
                    {nodeLogs.length} logs
                  </Badge>
                )}
              </div>
              {node.message && (
                <p className="text-sm text-muted-foreground font-mono">
                  {node.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {nodeLogs.length > 0 && (
                <CollapsibleTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="hover:bg-secondary"
                  >
                    <Terminal className="h-4 w-4 mr-1" />
                    Console
                    <ChevronDown
                      className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>
              )}
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
        </div>

        <CollapsibleContent>
          <div className="border-t border-terminal-border bg-terminal-bg">
            <ScrollArea className="h-[200px]">
              <div
                ref={scrollRef}
                className="p-4 font-mono text-sm text-terminal-text"
              >
                {nodeLogs.length === 0 ? (
                  <div className="text-muted-foreground text-center py-4">
                    No output yet.
                  </div>
                ) : (
                  nodeLogs.map((log, index) => (
                    <div
                      key={index}
                      className="mb-1 hover:bg-white/5 px-1 py-0.5 rounded"
                    >
                      <span className="text-primary">[{log.timestamp}]</span>{" "}
                      <span>{log.message}</span>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
