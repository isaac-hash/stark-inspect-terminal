import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

interface LogEntry {
  node: string;
  message: string;
  timestamp: string;
}

interface LogPanelProps {
  logs: LogEntry[];
}

export function LogPanel({ logs }: LogPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Filter only system logs (not associated with specific nodes)
  const systemLogs = logs.filter((log) => log.node === "system");

  if (systemLogs.length === 0) {
    return null;
  }

  return (
    <Card className="border-terminal-border bg-terminal-bg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-terminal-border bg-card">
        <Terminal className="h-4 w-4 text-primary" />
        <span className="font-mono text-sm font-semibold text-foreground">
          System Log
        </span>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {systemLogs.length} messages
        </span>
      </div>
      <ScrollArea className="h-[150px]">
        <div ref={scrollRef} className="p-4 font-mono text-sm text-terminal-text">
          {systemLogs.map((log, index) => (
            <div key={index} className="mb-1 hover:bg-white/5 px-1 py-0.5 rounded">
              <span className="text-primary">[{log.timestamp}]</span>{" "}
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
