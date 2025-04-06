
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProjectProvider } from './contexts/ProjectContext';
import { TravauxTypesProvider } from './contexts/TravauxTypesContext';
import { MenuiseriesTypesProvider } from './contexts/MenuiseriesTypesContext';
import { AutresSurfacesProvider } from './contexts/AutresSurfacesContext';
import { ClientChantierProvider } from './contexts/ClientChantierContext';
import Index from "./pages/Index";
import Travaux from "./pages/Travaux";
import Recapitulatif from "./pages/Recapitulatif";
import AdminTravaux from "./pages/AdminTravaux";
import Parametres from "./pages/Parametres";
import ClientChantier from "./pages/ClientChantier";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectProvider>
        <TravauxTypesProvider>
          <MenuiseriesTypesProvider>
            <AutresSurfacesProvider>
              <ClientChantierProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/travaux" element={<Travaux />} />
                      <Route path="/recapitulatif" element={<Recapitulatif />} />
                      <Route path="/admin/travaux" element={<AdminTravaux />} />
                      <Route path="/parametres" element={<Parametres />} />
                      <Route path="/client-chantier" element={<ClientChantier />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </ClientChantierProvider>
            </AutresSurfacesProvider>
          </MenuiseriesTypesProvider>
        </TravauxTypesProvider>
      </ProjectProvider>
    </QueryClientProvider>
  );
}

export default App;
