import { useGraphStore } from '@/stores/useGraphStore';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function Services() {
  const services = useGraphStore((state) => state.services);

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Services</h2>
        <p className="text-sm md:text-base text-muted-foreground">
          All ROS 2 services available in your system
        </p>
      </div>

      <Card className="overflow-auto">
        {services.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No services detected.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.name}>
                  <TableCell className="font-mono">{service.name}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    {service.type}
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
