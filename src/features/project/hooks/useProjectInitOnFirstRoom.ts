
import { useEffect, useState } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { findDefaultClientId, generateDevisNumber } from '@/services/devisService';
import { toast } from 'sonner';

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
  const { state: projectState } = useProject();
  const [isFirstRoom, setIsFirstRoom] = useState<boolean>(true);

  useEffect(() => {
    const initProjectOnFirstRoom = async () => {
      // Si nous avons une première pièce ajoutée et que c'est la première fois qu'on le détecte
      if (projectState?.rooms?.length === 1 && isFirstRoom) {
        setIsFirstRoom(false); // Ne plus exécuter cette logique pour les futures mises à jour
        let initialized = false;
        
        // Si pas de client sélectionné, sélectionner "Client à définir"
        if (!clientId) {
          const defaultClientId = await findDefaultClientId();
          if (defaultClientId) {
            setClientId(defaultClientId);
            console.log("Client par défaut sélectionné:", defaultClientId);
            initialized = true;
          }
        }
        
        // Si pas de numéro de devis, en générer un automatiquement
        if (!devisNumber) {
          try {
            const newDevisNumber = await generateDevisNumber();
            setDevisNumber(newDevisNumber);
            console.log("Numéro de devis généré:", newDevisNumber);
            initialized = true;
          } catch (error) {
            console.error("Erreur lors de la génération du numéro de devis:", error);
          }
        }
        
        // Si pas de description, utiliser "Projet en cours"
        if (!descriptionProjet) {
          setDescriptionProjet("Projet en cours");
          console.log("Description par défaut ajoutée");
          initialized = true;
        }
        
        if (initialized) {
          toast.info("Informations du projet initialisées automatiquement");
        }
      }
      
      // Réinitialiser le flag si aucune pièce n'est présente
      if (projectState?.rooms?.length === 0 && !isFirstRoom) {
        setIsFirstRoom(true);
      }
    };
    
    initProjectOnFirstRoom();
  }, [projectState?.rooms, clientId, devisNumber, descriptionProjet, isFirstRoom, setClientId, setDevisNumber, setDescriptionProjet]);
  
  // Renvoyer le flag pour pouvoir le réinitialiser depuis l'extérieur si nécessaire
  return {
    isFirstRoom,
    setIsFirstRoom
  };
};
