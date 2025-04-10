
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateDevisNumber } from '@/services/devisService';
import { useClients } from '@/contexts/ClientsContext';
import { useProject } from '@/contexts/ProjectContext';

export const useProjectMetadata = () => {
  const [clientId, setClientId] = useState<string>('');
  const [nomProjet, setNomProjet] = useState<string>('');
  const [descriptionProjet, setDescriptionProjet] = useState<string>('');
  const [adresseChantier, setAdresseChantier] = useState<string>('');
  const [occupant, setOccupant] = useState<string>('');
  const [infoComplementaire, setInfoComplementaire] = useState<string>('');
  const [dateDevis, setDateDevis] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [devisNumber, setDevisNumber] = useState<string>('');
  
  const { state: clientsState } = useClients();
  const { saveProject: saveProjectToContext } = useProject();

  // Update document title when project name changes
  useEffect(() => {
    if (nomProjet) {
      document.title = `${nomProjet} - Infos Chantier`;
      
      // Mettre à jour le gestionnaire de projet pour maintenir le nom du projet
      const saveTimeout = setTimeout(() => {
        if (nomProjet) {
          console.log("Mise à jour du nom du projet dans le contexte:", nomProjet);
          saveProjectToContext(nomProjet).catch(console.error);
        }
      }, 500);
      
      return () => clearTimeout(saveTimeout);
    } else {
      document.title = 'Infos Chantier / Client';
    }
  }, [nomProjet, saveProjectToContext]);
  
  // Find the default client ID
  const getDefaultClientId = useCallback((): string => {
    console.log("Recherche du client par défaut...");
    const defaultClient = clientsState.clients.find(c => c.nom === "Client à définir");
    console.log("Client par défaut trouvé:", defaultClient);
    return defaultClient ? defaultClient.id : '';
  }, [clientsState.clients]);

  // Generate project name based on client, devis number and description
  const generateProjectName = useCallback(async () => {
    console.log("Génération du nom de projet en cours...");
    
    // Set default client if none selected
    let updatedClientId = clientId;
    if (!clientId) {
      const defaultClientId = getDefaultClientId();
      if (defaultClientId) {
        setClientId(defaultClientId);
        updatedClientId = defaultClientId;
        console.log("Client par défaut sélectionné:", defaultClientId);
      } else {
        console.error("Impossible de trouver le client par défaut");
        return;
      }
    }
    
    // Generate devis number if none exists
    let updatedDevisNumber = devisNumber;
    if (!devisNumber) {
      try {
        updatedDevisNumber = await generateDevisNumber();
        setDevisNumber(updatedDevisNumber);
        console.log("Numéro de devis généré:", updatedDevisNumber);
      } catch (error) {
        console.error("Erreur lors de la génération du numéro de devis:", error);
        return;
      }
    }
    
    // Set default description if none exists
    let updatedDescription = descriptionProjet;
    if (!descriptionProjet) {
      updatedDescription = "Projet en cours";
      setDescriptionProjet(updatedDescription);
      console.log("Description par défaut utilisée:", updatedDescription);
    }
    
    // Get the selected client
    const selectedClient = clientsState.clients.find(c => c.id === updatedClientId);
    if (!selectedClient) {
      console.error("Client non trouvé");
      return;
    }
    
    // Generate project name
    const clientName = `${selectedClient.nom} ${selectedClient.prenom || ''}`.trim();
    let newName = '';
    
    if (updatedDevisNumber) {
      newName = `Devis n° ${updatedDevisNumber} - ${clientName}`;
    } else {
      newName = clientName;
    }
    
    if (updatedDescription) {
      newName += updatedDescription.length > 40 
        ? ` - ${updatedDescription.substring(0, 40)}...` 
        : ` - ${updatedDescription}`;
    }
    
    console.log("Nouveau nom de projet généré:", newName);
    setNomProjet(newName);
    
    // Sauvegarder immédiatement le nom pour éviter la perte lors des changements de page
    try {
      await saveProjectToContext(newName);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde du nom de projet:", err);
    }
    
    // Force state update (this is important to update the UI)
    return newName;
  }, [clientId, devisNumber, descriptionProjet, clientsState.clients, getDefaultClientId, saveProjectToContext]);

  return {
    clientId,
    setClientId,
    nomProjet,
    setNomProjet,
    descriptionProjet,
    setDescriptionProjet,
    adresseChantier,
    setAdresseChantier,
    occupant,
    setOccupant,
    infoComplementaire,
    setInfoComplementaire,
    dateDevis,
    setDateDevis,
    devisNumber,
    setDevisNumber,
    generateProjectName
  };
};
