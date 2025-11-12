import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { api } from '@/services/api';
import { Parameter } from '@/types';
import { toast } from '@/hooks/use-toast';

export default function Parameters() {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadParameters();
  }, []);

  const loadParameters = async () => {
    try {
      setLoading(true);
      const data = await api.getParameters();
      setParameters(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load parameters',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: any, type: string) => {
    if (type === 'array' || type === 'object') {
      return JSON.stringify(value);
    }
    return String(value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Parameters</h2>
        <p className="text-muted-foreground">
          ROS 2 parameter values across all nodes
        </p>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            Loading parameters...
          </div>
        ) : parameters.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No parameters detected.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameters.map((param, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono">{param.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {param.type}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {formatValue(param.value, param.type)}
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
