
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
  
  // Utiliser sessionStorage pour suivre l'état d'initialisation
  const [hasInitialized, setHasInitialized] = useState<boolean>(() => {
    const stored = sessionStorage.getItem('project_initialized');
    return stored === 'true';
  });
  
  const [isFirstRoom, setIsFirstRoom] = useState<boolean>(() => {
    return projectState?.rooms?.length === 0;
  });
  
  // Utiliser sessionStorage pour éviter les toasts répétés
  const [hasShownToast, setHasShownToast] = useState<boolean>(() => {
    const stored = sessionStorage.getItem('project_init_toast_shown');
    return stored === 'true';
  });

  useEffect(() => {
    const initProjectOnFirstRoom = async () => {
      // Si nous avons une première pièce ajoutée et que l'initialisation n'a pas encore été faite
      if (projectState?.rooms?.length === 1 && isFirstRoom && !hasInitialized) {
        setIsFirstRoom(false);
        setHasInitialized(true);
        sessionStorage.setItem('project_initialized', 'true');
        
        let initialized = false;
        
        // Si aucun client n'est sélectionné, sélectionner "Client à définir"
        let defaultClientId = clientId;
        if (!clientId) {
          defaultClientId = await findDefaultClientId();
          if (defaultClientId) {
            setClientId(defaultClientId);
            console.log("Client par défaut sélectionné:", defaultClientId);
            initialized = true;
          }
        }
        
        // Si aucun numéro de devis, en générer un automatiquement
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
        
        // Si aucune description, utiliser "Projet en cours"
        let newDescription = descriptionProjet;
        if (!descriptionProjet) {
          newDescription = "Projet en cours";
          setDescriptionProjet(newDescription);
          console.log("Description par défaut ajoutée");
          initialized = true;
        }
        
        // Si nous avons initialisé quelque chose, afficher un message
        if (initialized && !hasShownToast) {
          // Générer le nom du projet pour l'affichage dans la barre supérieure
          const selectedClient = clientsState.clients.find(c => c.id === defaultClientId);
          const clientName = selectedClient ? `${selectedClient.nom} ${selectedClient.prenom || ''}`.trim() : 'Client';
          const projectName = `Devis n° ${newDevisNumber} - ${clientName} - ${newDescription.substring(0, 40)}`;
          
          // Mettre à jour le nom du projet dans le contexte global pour la barre supérieure
          dispatch({ 
            type: 'UPDATE_PROJECT_NAME', 
            payload: projectName 
          });
          
          // Marquer que le toast a été affiché pour éviter les répétitions
          setHasShownToast(true);
          sessionStorage.setItem('project_init_toast_shown', 'true');
          
          toast.info("Informations du projet initialisées automatiquement", {
            id: 'project-init' // Utiliser un ID pour éviter les doublons
          });
        }
      }
      
      // Réinitialiser le drapeau si aucune pièce n'est présente et que nous avons réinitialisé le projet
      if (projectState?.rooms?.length === 0 && !isFirstRoom) {
        setIsFirstRoom(true);
        setHasInitialized(false);
        setHasShownToast(false);
        sessionStorage.removeItem('project_initialized');
        sessionStorage.removeItem('project_init_toast_shown');
      }
    };
    
    initProjectOnFirstRoom();
  }, [projectState?.rooms, clientId, devisNumber, descriptionProjet, isFirstRoom, hasInitialized, hasShownToast, setClientId, setDevisNumber, setDescriptionProjet, clientsState.clients, dispatch]);
  
  // Renvoyer le drapeau pour pouvoir le réinitialiser depuis l'extérieur si nécessaire
  return {
    isFirstRoom,
    setIsFirstRoom,
    hasInitialized,
    setHasInitialized
  };
};
