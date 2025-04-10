
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
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);
  const [isFirstRoom, setIsFirstRoom] = useState<boolean>(true);

  useEffect(() => {
    const initProjectOnFirstRoom = async () => {
      // Si nous avons une première pièce ajoutée et que l'initialisation n'a pas encore été faite
      if (projectState?.rooms?.length === 1 && isFirstRoom && !hasInitialized) {
        setIsFirstRoom(false); // Ne plus exécuter cette logique pour les futures mises à jour
        setHasInitialized(true); // Marquer comme initialisé pour éviter les répétitions
        let initialized = false;
        
        // Si pas de client sélectionné, sélectionner "Client à définir"
        let defaultClientId = clientId;
        if (!clientId) {
          defaultClientId = await findDefaultClientId();
          if (defaultClientId) {
            setClientId(defaultClientId);
            console.log("Client par défaut sélectionné:", defaultClientId);
            initialized = true;
          }
        }
        
        // Si pas de numéro de devis, en générer un automatiquement
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
        
        // Si pas de description, utiliser "Projet en cours"
        let newDescription = descriptionProjet;
        if (!descriptionProjet) {
          newDescription = "Projet en cours";
          setDescriptionProjet(newDescription);
          console.log("Description par défaut ajoutée");
          initialized = true;
        }
        
        // Si nous avons initialisé quelque chose, afficher un message
        if (initialized) {
          // Générer le nom du projet pour l'affichage dans la barre supérieure
          const selectedClient = clientsState.clients.find(c => c.id === defaultClientId);
          const clientName = selectedClient ? `${selectedClient.nom} ${selectedClient.prenom || ''}`.trim() : 'Client';
          const projectName = `Devis n° ${newDevisNumber} - ${clientName} - ${newDescription.substring(0, 40)}`;
          
          // Mettre à jour le nom du projet dans le contexte global pour la barre supérieure
          dispatch({ 
            type: 'UPDATE_PROJECT_NAME', 
            payload: projectName 
          });
          
          toast.info("Informations du projet initialisées automatiquement", {
            id: 'project-init' // Utiliser un ID pour éviter les doublons
          });
        }
      }
      
      // Réinitialiser le flag si aucune pièce n'est présente
      if (projectState?.rooms?.length === 0 && !isFirstRoom) {
        setIsFirstRoom(true);
        setHasInitialized(false);
      }
    };
    
    initProjectOnFirstRoom();
  }, [projectState?.rooms, clientId, devisNumber, descriptionProjet, isFirstRoom, hasInitialized, setClientId, setDevisNumber, setDescriptionProjet, clientsState.clients, dispatch]);
  
  // Renvoyer le flag pour pouvoir le réinitialiser depuis l'extérieur si nécessaire
  return {
    isFirstRoom,
    setIsFirstRoom,
    hasInitialized,
    setHasInitialized
  };
};
