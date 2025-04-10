
import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { findDefaultClientId } from '@/services/devisService';
import { generateDevisNumber } from '@/services/projectService';
import { toast } from 'sonner';
import { useClients } from '@/contexts/ClientsContext';

/**
 * Hook qui initialise automatiquement les informations du projet lorsque la première pièce est ajoutée
 */
export const useProjectInitOnFirstRoom = (
  clientId: string,
  setClientId: (id: string) => void,
  devisNumber: string,
  setDevisNumber: (number: string) => void,
  descriptionProjet: string,
  setDescriptionProjet: (description: string) => void
) => {
  const { state: projectState, dispatch } = useProject();
  const { state: clientsState } = useClients();
  
  // Add a storage flag to avoid showing the toast multiple times
  const [hasInitialized, setHasInitialized] = useState<boolean>(() => {
    const stored = sessionStorage.getItem('project_initialized');
    return stored === 'true';
  });
  
  const [isFirstRoom, setIsFirstRoom] = useState<boolean>(() => {
    return projectState?.rooms?.length === 0;
  });

  useEffect(() => {
    const initProjectOnFirstRoom = async () => {
      // If we have a first room added and initialization hasn't been done yet
      if (projectState?.rooms?.length === 1 && isFirstRoom && !hasInitialized) {
        setIsFirstRoom(false);
        setHasInitialized(true);
        sessionStorage.setItem('project_initialized', 'true');
        
        let initialized = false;
        
        // If no client selected, select "Client à définir"
        let defaultClientId = clientId;
        if (!clientId) {
          defaultClientId = await findDefaultClientId();
          if (defaultClientId) {
            setClientId(defaultClientId);
            console.log("Client par défaut sélectionné:", defaultClientId);
            initialized = true;
          }
        }
        
        // If no devis number, generate one automatically
        let newDevisNumber = devisNumber;
        if (!devisNumber) {
          try {
            newDevisNumber = await generateDevisNumber();
            setDevisNumber(newDevisNumber);
            console.log("Numéro de devis généré:", newDevisNumber);
            initialized = true;
          } catch (error) {
            console.error("Erreur lors de la génération du numéro de devis:", error);
          }
        }
        
        // If no description, use "Projet en cours"
        let newDescription = descriptionProjet;
        if (!descriptionProjet) {
          newDescription = "Projet en cours";
          setDescriptionProjet(newDescription);
          console.log("Description par défaut ajoutée");
          initialized = true;
        }
        
        // If we initialized something, show a message
        if (initialized) {
          // Generate project name for display in top bar
          const selectedClient = clientsState.clients.find(c => c.id === defaultClientId);
          const clientName = selectedClient ? `${selectedClient.nom} ${selectedClient.prenom || ''}`.trim() : 'Client';
          const projectName = `Devis n° ${newDevisNumber} - ${clientName} - ${newDescription.substring(0, 40)}`;
          
          // Update project name in global context for top bar
          dispatch({ 
            type: 'UPDATE_PROJECT_NAME', 
            payload: projectName 
          });
          
          toast.info("Informations du projet initialisées automatiquement", {
            id: 'project-init' // Use an ID to avoid duplicates
          });
        }
      }
      
      // Reset flag if no room is present and we reset the project
      if (projectState?.rooms?.length === 0 && !isFirstRoom) {
        setIsFirstRoom(true);
        setHasInitialized(false);
        sessionStorage.removeItem('project_initialized');
      }
    };
    
    initProjectOnFirstRoom();
  }, [projectState?.rooms, clientId, devisNumber, descriptionProjet, isFirstRoom, hasInitialized, setClientId, setDevisNumber, setDescriptionProjet, clientsState.clients, dispatch]);
  
  // Return the flag to be able to reset it from outside if needed
  return {
    isFirstRoom,
    setIsFirstRoom,
    hasInitialized,
    setHasInitialized
  };
};
