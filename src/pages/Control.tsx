import { useEffect, useState } from 'react';
import { useControlStore } from '@/stores/useControlStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, Square, RotateCcw, ChevronDown, Terminal } from 'lucide-react';
import { api } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { LaunchTarget } from '@/types';

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

  const groupedTargets = targets.filter(t => t.group && t.group !== 'ungrouped');
  const independentTargets = targets.filter(t => !t.group || t.group === 'ungrouped');

  const groupsByName = groupedTargets.reduce((acc, target) => {
    const group = target.group!;
    if (!acc[group]) acc[group] = [];
    acc[group].push(target);
    return acc;
  }, {} as Record<string, LaunchTarget[]>);

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

  const getMockTerminalOutput = (target: LaunchTarget) => {
    if (target.status === 'RUNNING') {
      return `[${new Date().toLocaleTimeString()}] Starting ${target.display_name}...\n[${new Date().toLocaleTimeString()}] Process initialized with PID ${target.pid}\n[${new Date().toLocaleTimeString()}] Node active and publishing data\n[${new Date().toLocaleTimeString()}] System nominal`;
    }
    return `[${new Date().toLocaleTimeString()}] ${target.display_name} is not running`;
  };

  const renderTargetCard = (target: LaunchTarget, showControls: boolean = true) => (
    <Collapsible key={target.id} className="border rounded-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-medium">{target.display_name}</span>
            <Badge className={`${getStatusColor(target.status)} font-mono text-xs`}>
              {target.status}
            </Badge>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <Terminal className="h-4 w-4 mr-1" />
              <ChevronDown className="h-4 w-4" />
            </Button>
          </CollapsibleTrigger>
        </div>

        {showControls && (
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-mono text-muted-foreground">
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
        )}

        <CollapsibleContent>
          <ScrollArea className="h-32 w-full rounded border bg-black/90 p-3">
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">
              {getMockTerminalOutput(target)}
            </pre>
          </ScrollArea>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Control</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          Manage launch targets and robot processes
        </p>
      </div>

      {loading ? (
        <Card>
          <div className="p-8 text-center text-muted-foreground">
            Loading launch targets...
          </div>
        </Card>
      ) : targets.length === 0 ? (
        <Card>
          <div className="p-8 text-center text-muted-foreground">
            No launch targets configured. Add targets in your backend manifest.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Node Groups Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Node Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.keys(groupsByName).length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No grouped nodes
                </p>
              ) : (
                Object.entries(groupsByName).map(([group, groupTargets]) => (
                  <div key={group} className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-sm">{group}</h3>
                      <Badge variant="outline" className="text-xs">
                        {groupTargets.length}
                      </Badge>
                    </div>
                    {groupTargets.map((target) => renderTargetCard(target, false))}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Independent Nodes Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="h-5 w-5" />
                Independent Nodes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {independentTargets.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No independent nodes
                </p>
              ) : (
                independentTargets.map((target) => renderTargetCard(target, true))
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
