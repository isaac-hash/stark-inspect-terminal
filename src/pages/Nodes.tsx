import { useGraphStore } from '@/stores/useGraphStore';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Nodes() {
  const nodes = useGraphStore((state) => state.nodes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'bg-success text-success-foreground';
      case 'ERROR':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-unknown text-unknown-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Nodes</h2>
        <p className="text-muted-foreground">
          All ROS 2 nodes detected in your system
        </p>
      </div>

      <Card>
        {nodes.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No nodes detected. Make sure ROS 2 nodes are running.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Namespace</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publishers</TableHead>
                <TableHead>Subscribers</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes.map((node) => (
                <TableRow key={node.name}>
                  <TableCell className="font-mono">{node.name}</TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    {node.namespace || '/'}
                  </TableCell>
                  <TableCell>
                    {node.metadata_group ? (
                      <Badge variant="outline" className="font-mono">
                        {node.metadata_group}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(node.status)} font-mono text-xs`}>
                      {node.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {node.publishes.length}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {node.subscribes.length}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
