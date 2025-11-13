import { NavLink } from '@/components/NavLink';
import { Activity, Box, Radio, Server, Settings, Network, PlayCircle, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navItems = [
  { to: '/', label: 'Dashboard', icon: Activity, end: true },
  { to: '/nodes', label: 'Nodes', icon: Box },
  { to: '/topics', label: 'Topics', icon: Radio },
  { to: '/services', label: 'Services', icon: Server },
  { to: '/parameters', label: 'Parameters', icon: Settings },
  { to: '/graph', label: 'Graph', icon: Network },
  { to: '/control', label: 'Control', icon: PlayCircle },
];

export function Sidebar() {
  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground font-mono">
            Stark Inspector
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
              activeClassName="bg-primary/10 text-primary font-medium"
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono text-center">
          ROS 2 Humble/Jazzy
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-card border-r border-border flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild className="md:hidden fixed top-4 left-4 z-50">
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
