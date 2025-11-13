import { useGraphStore } from '@/stores/useGraphStore';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const getMockTopicOutput = (topicName: string, topicType: string) => {
  const lines = [];
  for (let i = 0; i < 15; i++) {
    lines.push(`[${new Date().toISOString()}] ${topicName} - ${topicType} message #${i + 1}`);
    lines.push(`  data: { x: ${(Math.random() * 100).toFixed(2)}, y: ${(Math.random() * 100).toFixed(2)}, z: ${(Math.random() * 100).toFixed(2)} }`);
  }
  return lines.join('\n');
};

export default function Topics() {
  const topics = useGraphStore((state) => state.topics);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const toggleTopic = (topicName: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicName)) {
        next.delete(topicName);
      } else {
        next.add(topicName);
      }
      return next;
    });
  };

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
                <TableHead className="w-[100px]">Echo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => {
                const isExpanded = expandedTopics.has(topic.name);
                return (
                  <Collapsible key={topic.name} open={isExpanded} onOpenChange={() => toggleTopic(topic.name)}>
                    <TableRow>
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
                      <TableCell>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Terminal className="h-4 w-4" />
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <CollapsibleContent>
                          <div className="p-4 bg-muted/50">
                            <ScrollArea className="h-[200px] w-full rounded-md border bg-black p-4">
                              <pre className="text-xs text-green-500 font-mono whitespace-pre-wrap">
                                {getMockTopicOutput(topic.name, topic.type)}
                              </pre>
                            </ScrollArea>
                          </div>
                        </CollapsibleContent>
                      </TableCell>
                    </TableRow>
                  </Collapsible>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
