
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { ClientsProvider } from '@/contexts/ClientsContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { TravauxTypesProvider } from '@/contexts/TravauxTypesContext';
import { MenuiseriesTypesProvider } from '@/contexts/MenuiseriesTypesContext';
import { AutresSurfacesProvider } from '@/contexts/AutresSurfacesContext';

import Index from '@/pages/Index';
import Travaux from '@/pages/Travaux';
import Recapitulatif from '@/pages/Recapitulatif';
import EditionDevis from '@/pages/EditionDevis';
import AdminTravaux from '@/pages/AdminTravaux';
import Parametres from '@/pages/Parametres';
import InfosChantier from '@/pages/InfosChantier';
import NotFound from '@/pages/NotFound';
import ClientsList from '@/features/admin/pages/ClientsList';

import './App.css';
import SupabaseStatus from './components/SupabaseStatus';

import { useProjectOperations } from '@/hooks/useProjectOperations';

// Create a React Query client
const queryClient = new QueryClient();

export default function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('clients').select('count', { count: 'exact', head: true });
        if (error) throw error;
        setIsConnected(true);
      } catch (error) {
        console.error('Erreur de connexion à Supabase:', error);
        setIsConnected(false);
      }
    };

    checkConnection();
    
    const intervalId = setInterval(checkConnection, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const { 
    handleChargerProjet, 
    handleDeleteProject,
    handleSaveProject,
    handleNewProject,
    hasUnsavedChanges,
    currentProjectId
  } = useProjectOperations();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <TravauxTypesProvider>
          <MenuiseriesTypesProvider>
            <AutresSurfacesProvider>
              <ClientsProvider>
                <ProjectProvider>
                  <main className="min-h-screen flex flex-col">
                    <div className="flex-1">
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/travaux" element={<Travaux />} />
                        <Route path="/recapitulatif" element={<Recapitulatif />} />
                        <Route path="/edition-devis" element={<EditionDevis />} />
                        <Route path="/admin/travaux" element={<AdminTravaux />} />
                        <Route path="/parametres" element={<Parametres />} />
                        <Route path="/infos-chantier" element={<InfosChantier />} />
                        <Route path="/admin/clients" element={<ClientsList />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </div>
                    <SupabaseStatus />
                  </main>
                  <Toaster richColors position="top-right" />
                </ProjectProvider>
              </ClientsProvider>
            </AutresSurfacesProvider>
          </MenuiseriesTypesProvider>
        </TravauxTypesProvider>
      </Router>
    </QueryClientProvider>
  );
}
