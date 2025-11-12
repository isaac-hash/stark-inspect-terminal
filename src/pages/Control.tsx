import { useEffect, useState } from 'react';
import { useControlStore } from '@/stores/useControlStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Play, Square, RotateCcw } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export default function Control() {
  const targets = useControlStore((state) => state.targets);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTargets();
  }, []);

  const loadTargets = async () => {
    try {
      setLoading(true);
      const data = await api.getTargets();
      useControlStore.getState().setTargets(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load launch targets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRun = async (targetId: string) => {
    try {
      await api.runTarget(targetId);
      toast({ title: 'Starting', description: 'Launch target is starting...' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start target',
        variant: 'destructive',
      });
    }
  };

  const handleStop = async (targetId: string) => {
    try {
      await api.stopTarget(targetId);
      toast({ title: 'Stopping', description: 'Launch target is stopping...' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to stop target',
        variant: 'destructive',
      });
    }
  };

  const groupedTargets = targets.reduce((acc, target) => {
    const group = target.group || 'ungrouped';
    if (!acc[group]) acc[group] = [];
    acc[group].push(target);
    return acc;
  }, {} as Record<string, typeof targets>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-success text-success-foreground';
      case 'ERROR':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Control</h2>
        <p className="text-muted-foreground">
          Manage launch targets and robot processes
        </p>
      </div>

      {loading ? (
        <Card>
          <div className="p-8 text-center text-muted-foreground">
            Loading launch targets...
          </div>
        </Card>
      ) : Object.keys(groupedTargets).length === 0 ? (
        <Card>
          <div className="p-8 text-center text-muted-foreground">
            No launch targets configured. Add targets in your backend manifest.
          </div>
        </Card>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {Object.entries(groupedTargets).map(([group, groupTargets]) => (
            <AccordionItem key={group} value={group} className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{group}</span>
                  <Badge variant="outline">{groupTargets.length} targets</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4">
                <div className="space-y-3">
                  {groupTargets.map((target) => (
                    <Card key={target.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-mono">
                            {target.display_name}
                          </CardTitle>
                          <Badge className={`${getStatusColor(target.status)} font-mono text-xs`}>
                            {target.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-mono text-muted-foreground">
                            {target.pid && `PID: ${target.pid}`}
                          </div>
                          <div className="flex gap-2">
                            {target.status === 'RUNNING' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStop(target.id)}
                                  className="border-error/50 hover:bg-error/10"
                                >
                                  <Square className="h-4 w-4 mr-1" />
                                  Stop
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    handleStop(target.id);
                                    setTimeout(() => handleRun(target.id), 1000);
                                  }}
                                  className="border-warning/50 hover:bg-warning/10"
                                >
                                  <RotateCcw className="h-4 w-4 mr-1" />
                                  Restart
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRun(target.id)}
                                className="border-success/50 hover:bg-success/10"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Run
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
