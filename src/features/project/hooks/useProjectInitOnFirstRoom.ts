
import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { findDefaultClientId, generateDevisNumber } from '@/services/devisService';
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
  const { state: projectState, saveProject } = useProject();
  const { state: clientsState } = useClients();
  const [isFirstRoom, setIsFirstRoom] = useState<boolean>(true);

  useEffect(() => {
    const initProjectOnFirstRoom = async () => {
      // Si nous avons une première pièce ajoutée et que c'est la première fois qu'on le détecte
      if (projectState?.rooms?.length === 1 && isFirstRoom) {
        setIsFirstRoom(false); // Ne plus exécuter cette logique pour les futures mises à jour
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
        
        // Générer un nom de projet avec les données disponibles
        if (initialized) {
          // Générer et sauvegarder le projet avec les nouvelles informations
          // Cela mettra à jour automatiquement la barre supérieure
          try {
            const selectedClient = clientsState.clients.find(c => c.id === defaultClientId);
            const clientName = selectedClient ? `${selectedClient.nom} ${selectedClient.prenom || ''}`.trim() : 'Client';
            const projectName = `Devis n° ${newDevisNumber} - ${clientName} - ${newDescription.substring(0, 40)}`;
            
            // Pour simuler la mise à jour sans sauvegarder réellement
            // C'est l'affichage qui va se mettre à jour, pas la sauvegarde
            await saveProject(projectName);
            
            toast.info("Informations du projet initialisées automatiquement");
          } catch (error) {
            console.error("Erreur lors de la mise à jour du nom du projet:", error);
          }
        }
      }
      
      // Réinitialiser le flag si aucune pièce n'est présente
      if (projectState?.rooms?.length === 0 && !isFirstRoom) {
        setIsFirstRoom(true);
      }
    };
    
    initProjectOnFirstRoom();
  }, [projectState?.rooms, clientId, devisNumber, descriptionProjet, isFirstRoom, setClientId, setDevisNumber, setDescriptionProjet, clientsState.clients, saveProject]);
  
  // Renvoyer le flag pour pouvoir le réinitialiser depuis l'extérieur si nécessaire
  return {
    isFirstRoom,
    setIsFirstRoom
  };
};
