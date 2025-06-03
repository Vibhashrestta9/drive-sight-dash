
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SimConfiguration from "./pages/SimConfiguration";
import DigitalTwin from "./pages/DigitalTwin";
import CyberSecurity from "./pages/CyberSecurity";
import ExportData from "./pages/ExportData";
import Neta21Manual from "./pages/Neta21Manual";
import ARDashboard from "./pages/ARDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/sim-configuration" element={<SimConfiguration />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/cyber-security" element={<CyberSecurity />} />
          <Route path="/export-data" element={<ExportData />} />
          <Route path="/neta21-manual" element={<Neta21Manual />} />
          <Route path="/connect-manual" element={<Neta21Manual />} />
          <Route path="/ar-dashboard" element={<ARDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
