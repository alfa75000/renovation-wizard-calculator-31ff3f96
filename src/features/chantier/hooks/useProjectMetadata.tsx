
import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { generateDevisNumber } from '@/services/devisService';
import { useClients } from '@/contexts/ClientsContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export const useProjectMetadata = () => {
  // Utiliser useLocalStorage pour persister les données entre les navigations
  const [clientId, setClientId] = useLocalStorage<string>('project_client_id', '');
  const [nomProjet, setNomProjet] = useLocalStorage<string>('project_nom', '');
  const [descriptionProjet, setDescriptionProjet] = useLocalStorage<string>('project_description', '');
  const [adresseChantier, setAdresseChantier] = useLocalStorage<string>('project_adresse', '');
  const [occupant, setOccupant] = useLocalStorage<string>('project_occupant', '');
  const [infoComplementaire, setInfoComplementaire] = useLocalStorage<string>('project_info_complementaire', '');
  const [dateDevis, setDateDevis] = useLocalStorage<string>('project_date_devis', format(new Date(), 'yyyy-MM-dd'));
  const [devisNumber, setDevisNumber] = useLocalStorage<string>('project_devis_number', '');
  
  const { state: clientsState } = useClients();

  // Update document title when project name changes
  useEffect(() => {
    if (nomProjet) {
      document.title = `${nomProjet} - Infos Chantier`;
    } else {
      document.title = 'Infos Chantier / Client';
    }
  }, [nomProjet]);
  
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
  }, [clientId, devisNumber, descriptionProjet, clientsState.clients, getDefaultClientId, setClientId, setDevisNumber, setDescriptionProjet, setNomProjet]);

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
