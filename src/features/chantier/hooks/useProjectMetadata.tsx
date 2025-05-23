
import { useCallback } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateDevisNumber } from '@/services/devisService';
import { useClients } from '@/contexts/ClientsContext';
import { useProject } from '@/contexts/ProjectContext';

export const useProjectMetadata = () => {
  const { state, dispatch } = useProject();
  const { state: clientsState } = useClients();
  
  // S'assurer que metadata existe toujours
  const metadata = state?.metadata || {
    clientId: '',
    nomProjet: '',
    descriptionProjet: '',
    adresseChantier: '',
    occupant: '',
    infoComplementaire: '',
    dateDevis: new Date().toISOString().split('T')[0],
    devisNumber: '',
    clientsData: ''
  };
  
  // Find the default client ID
  const getDefaultClientId = useCallback((): string => {
    console.log("Recherche du client par défaut...");
    const defaultClient = clientsState.clients.find(c => c.nom === "Client à définir");
    console.log("Client par défaut trouvé:", defaultClient);
    return defaultClient ? defaultClient.id : '';
  }, [clientsState.clients]);

  // Update metadata helper
  const updateMetadata = useCallback((field: string, value: string) => {
    console.log(`Mise à jour du champ ${field} avec la valeur:`, value);
    dispatch({
      type: 'UPDATE_METADATA',
      payload: { [field]: value }
    });
  }, [dispatch]);

  // Create setters for each metadata field
  const setClientId = useCallback((value: string) => {
    updateMetadata('clientId', value);
  }, [updateMetadata]);

  const setNomProjet = useCallback((value: string) => {
    updateMetadata('nomProjet', value);
    // Update document title when project name changes
    if (value) {
      document.title = `${value} - Infos Chantier`;
    } else {
      document.title = 'Infos Chantier / Client';
    }
  }, [updateMetadata]);

  const setDescriptionProjet = useCallback((value: string) => {
    updateMetadata('descriptionProjet', value);
  }, [updateMetadata]);

  const setAdresseChantier = useCallback((value: string) => {
    updateMetadata('adresseChantier', value);
  }, [updateMetadata]);

  const setOccupant = useCallback((value: string) => {
    updateMetadata('occupant', value);
  }, [updateMetadata]);

  const setInfoComplementaire = useCallback((value: string) => {
    updateMetadata('infoComplementaire', value);
  }, [updateMetadata]);

  const setDateDevis = useCallback((value: string) => {
    updateMetadata('dateDevis', value);
  }, [updateMetadata]);

  const setDevisNumber = useCallback((value: string) => {
    updateMetadata('devisNumber', value);
  }, [updateMetadata]);
  
  // Add setter for clientsData with explicit logging
  const setClientsData = useCallback((value: string) => {
    console.log("setClientsData appelé avec:", value);
    updateMetadata('clientsData', value);
  }, [updateMetadata]);

  // Generate project name based on client, devis number and description
  const generateProjectName = useCallback(async () => {
    console.log("Génération du nom de projet en cours...");
    
    // Set default client if none selected
    let updatedClientId = metadata.clientId;
    if (!metadata.clientId) {
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
    let updatedDevisNumber = metadata.devisNumber;
    if (!metadata.devisNumber) {
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
    let updatedDescription = metadata.descriptionProjet;
    if (!metadata.descriptionProjet) {
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
  }, [metadata, setClientId, setDevisNumber, setDescriptionProjet, setNomProjet, clientsState.clients, getDefaultClientId]);

  // Vérifier si le nom du projet est vide et devrait être généré
  const shouldGenerateProjectName = useCallback(() => {
    return !metadata.nomProjet || metadata.nomProjet.trim() === '';
  }, [metadata.nomProjet]);

  // Générer le nom du projet si nécessaire
  const generateProjectNameIfNeeded = useCallback(async () => {
    if (shouldGenerateProjectName()) {
      console.log("Generating project name automatically...");
      await generateProjectName();
      return true;
    }
    return false;
  }, [shouldGenerateProjectName, generateProjectName]);

  return {
    clientId: metadata.clientId || '',
    setClientId,
    nomProjet: metadata.nomProjet || '',
    setNomProjet,
    descriptionProjet: metadata.descriptionProjet || '',
    setDescriptionProjet,
    adresseChantier: metadata.adresseChantier || '',
    setAdresseChantier,
    occupant: metadata.occupant || '',
    setOccupant,
    infoComplementaire: metadata.infoComplementaire || '',
    setInfoComplementaire,
    dateDevis: metadata.dateDevis || '',
    setDateDevis,
    devisNumber: metadata.devisNumber || '',
    setDevisNumber,
    clientsData: metadata.clientsData || '',
    setClientsData,
    generateProjectName,
    generateProjectNameIfNeeded,
    shouldGenerateProjectName
  };
};
