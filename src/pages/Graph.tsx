import { useEffect, useRef } from 'react';
import { useGraphStore } from '@/stores/useGraphStore';
import { Card } from '@/components/ui/card';
import ForceGraph2D from 'react-force-graph-2d';

export default function Graph() {
  const nodes = useGraphStore((state) => state.nodes);
  const topics = useGraphStore((state) => state.topics);
  const graphRef = useRef<any>();

  const graphData = {
    nodes: [
      ...nodes.map((node) => ({
        id: node.name,
        name: node.name,
        type: 'node',
        group: node.metadata_group || 'default',
        status: node.status,
      })),
      ...topics.map((topic) => ({
        id: topic.name,
        name: topic.name,
        type: 'topic',
        group: 'topic',
      })),
    ],
    links: [
      ...nodes.flatMap((node) =>
        node.publishes.map((topic) => ({
          source: node.name,
          target: topic,
          type: 'publishes',
        }))
      ),
      ...nodes.flatMap((node) =>
        node.subscribes.map((topic) => ({
          source: topic,
          target: node.name,
          type: 'subscribes',
        }))
      ),
    ],
  };

  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force('charge').strength(-300);
      graphRef.current.d3Force('link').distance(100);
    }
  }, []);

  const getNodeColor = (node: any) => {
    if (node.type === 'topic') return '#8b5cf6';
    if (node.status === 'HEALTHY') return '#22c55e';
    if (node.status === 'ERROR') return '#ef4444';
    return '#6b7280';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Graph</h2>
        <p className="text-muted-foreground">
          Visual representation of nodes and topic connections
        </p>
      </div>

      <Card className="p-0 overflow-hidden">
        {graphData.nodes.length === 0 ? (
          <div className="h-[600px] flex items-center justify-center text-muted-foreground">
            No graph data available. Start some ROS 2 nodes.
          </div>
        ) : (
          <div className="h-[600px] bg-background">
            <ForceGraph2D
              ref={graphRef}
              graphData={graphData}
              nodeLabel="name"
              nodeColor={getNodeColor}
              nodeRelSize={8}
              linkColor={() => '#64748b'}
              linkDirectionalArrowLength={6}
              linkDirectionalArrowRelPos={1}
              linkWidth={2}
              backgroundColor="#000000"
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.name;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px monospace`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = getNodeColor(node);
                
                // Draw circle
                ctx.beginPath();
                ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
                ctx.fill();
                
                // Draw label
                ctx.fillStyle = '#ffffff';
                ctx.fillText(label, node.x, node.y + 15);
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
