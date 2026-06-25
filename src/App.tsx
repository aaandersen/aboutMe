import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Astro from "./pages/Astro";
import Kurser from "./pages/Kurser";
import Arcade from "./pages/Arcade";
import Carlsberg from "./pages/Carlsberg";
import NotFound from "./pages/NotFound";
import EasterEggProvider from "./components/eggs/EasterEggProvider";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <EasterEggProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/astro" element={<Astro />} />
            <Route path="/kurser" element={<Kurser />} />
            <Route path="/arcade" element={<Arcade />} />
            <Route path="/carlsberg" element={<Carlsberg />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </EasterEggProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
