import { useGraphStore } from '@/stores/useGraphStore';
import { useConnectionStore } from '@/stores/useConnectionStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Box, Radio, Server, Activity } from 'lucide-react';

export default function Dashboard() {
  const nodes = useGraphStore((state) => state.nodes);
  const topics = useGraphStore((state) => state.topics);
  const services = useGraphStore((state) => state.services);
  const isConnected = useConnectionStore((state) => state.isConnected);

  const healthyNodes = nodes.filter((n) => n.status === 'HEALTHY').length;
  const errorNodes = nodes.filter((n) => n.status === 'ERROR').length;

  const groupedNodes = nodes.reduce((acc, node) => {
    const group = node.metadata_group || 'ungrouped';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Dashboard</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Real-time overview of your ROS 2 system
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Nodes</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{nodes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthyNodes} healthy, {errorNodes} error
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Topics</CardTitle>
            <Radio className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topics.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active communication channels
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Available ROS 2 services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connection</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isConnected ? 'Live' : 'Offline'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              WebSocket status
            </p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(groupedNodes).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Node Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(groupedNodes).map(([group, count]) => (
                <Badge key={group} variant="outline" className="font-mono">
                  {group}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isConnected && (
        <Card className="border-warning bg-warning/5">
          <CardContent className="pt-6">
            <p className="text-sm text-warning font-mono">
              ⚠️ Not connected to backend. Make sure the Stark Inspector backend is running.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
