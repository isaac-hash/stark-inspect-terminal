import { useConnectionStore } from '@/stores/useConnectionStore';
import { useGraphStore } from '@/stores/useGraphStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export function Topbar() {
  const isConnected = useConnectionStore((state) => state.isConnected);
  const nodes = useGraphStore((state) => state.nodes);
  const topics = useGraphStore((state) => state.topics);

  const handleRefresh = async () => {
    try {
      const data = await api.getGraph();
      useGraphStore.getState().setGraphData(data);
      toast({ title: 'Refreshed', description: 'Graph data updated' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to refresh data',
        variant: 'destructive' 
      });
    }
  };

  return (
    <header className="h-16 bg-card border-b border-border px-4 md:px-6 flex items-center justify-between md:ml-0 ml-0">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-success animate-pulse' : 'bg-error'
            }`}
          />
          <span className="text-xs md:text-sm font-mono text-muted-foreground hidden sm:inline">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <div className="flex items-center gap-2 md:gap-3">
          <Badge variant="outline" className="font-mono text-xs">
            {nodes.length} <span className="hidden sm:inline">Nodes</span>
          </Badge>
          <Badge variant="outline" className="font-mono text-xs">
            {topics.length} <span className="hidden sm:inline">Topics</span>
          </Badge>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleRefresh}
        disabled={!isConnected}
        className="hidden sm:flex"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Refresh
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleRefresh}
        disabled={!isConnected}
        className="sm:hidden"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </header>
  );
}
