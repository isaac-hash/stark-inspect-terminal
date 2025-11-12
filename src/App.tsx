import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { websocketService } from "@/services/websocket";
import Dashboard from "./pages/Dashboard";
import Nodes from "./pages/Nodes";
import Topics from "./pages/Topics";
import Services from "./pages/Services";
import Parameters from "./pages/Parameters";
import Graph from "./pages/Graph";
import Control from "./pages/Control";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    websocketService.connect();
    return () => websocketService.disconnect();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen bg-background flex w-full">
            <Sidebar />
            <div className="flex-1 flex flex-col">
              <Topbar />
              <main className="flex-1 p-6 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/nodes" element={<Nodes />} />
                  <Route path="/topics" element={<Topics />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/parameters" element={<Parameters />} />
                  <Route path="/graph" element={<Graph />} />
                  <Route path="/control" element={<Control />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
