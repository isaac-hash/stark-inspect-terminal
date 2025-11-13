import { useGraphStore } from '@/stores/useGraphStore';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Topics() {
  const topics = useGraphStore((state) => state.topics);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Topics</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          All ROS 2 topics with bandwidth and rate information
        </p>
      </div>

      <Card className="overflow-auto">
        {topics.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No topics detected.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Rate (Hz)</TableHead>
                <TableHead>Bandwidth (Mbps)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <TableRow key={topic.name}>
                  <TableCell className="font-mono">{topic.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {topic.type}
                  </TableCell>
                  <TableCell className="font-mono">
                    {topic.rate_hz.toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono">
                    {topic.bandwidth_mbps.toFixed(3)}
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
