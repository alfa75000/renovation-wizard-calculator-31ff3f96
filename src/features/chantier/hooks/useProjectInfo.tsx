
import { useState, useEffect, useCallback } from 'react';
import { useClients } from '@/contexts/ClientsContext';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { generateDevisNumber } from '@/services/devisService';

export const useProjectInfo = () => {
  const { 
    state: projectState, 
    isLoading,
    projects, 
    currentProjectId,
    hasUnsavedChanges,
    loadProject,
    deleteCurrentProject,
    saveProject
  } = useProject();
  
  const [clientId, setClientId] = useState<string>('');
  const [nomProjet, setNomProjet] = useState<string>('');
  const [descriptionProjet, setDescriptionProjet] = useState<string>('');
  const [adresseChantier, setAdresseChantier] = useState<string>('');
  const [occupant, setOccupant] = useState<string>('');
  const [infoComplementaire, setInfoComplementaire] = useState<string>('');
  const [dateDevis, setDateDevis] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [devisNumber, setDevisNumber] = useState<string>('');
  
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
  
  // Load current project data when project ID changes
  useEffect(() => {
    if (currentProjectId) {
      const currentProject = projects.find(p => p.id === currentProjectId);
      if (currentProject) {
        console.log("Chargement du projet courant:", currentProject);
        setClientId(currentProject.client_id || '');
        setNomProjet(currentProject.name || '');
        setDescriptionProjet(currentProject.description || '');
        setAdresseChantier(currentProject.address || '');
        setOccupant(currentProject.occupant || '');
        if (currentProject.devis_number) {
          setDevisNumber(currentProject.devis_number);
        }
      }
    }
  }, [currentProjectId, projects]);
  
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
  }, [clientId, devisNumber, descriptionProjet, clientsState.clients, getDefaultClientId]);

  // Handler for loading a project
  const handleChargerProjet = useCallback(async (projetId: string) => {
    try {
      await loadProject(projetId);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  }, [loadProject]);
  
  // Handler for deleting the current project
  const handleDeleteProject = useCallback(async () => {
    try {
      await deleteCurrentProject();
      setClientId('');
      setNomProjet('');
      setDescriptionProjet('');
      setAdresseChantier('');
      setOccupant('');
      setInfoComplementaire('');
      setDevisNumber('');
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Une erreur est survenue lors de la suppression du projet');
    }
  }, [deleteCurrentProject]);
  
  // Handler for saving the current project
  const handleSaveProject = useCallback(async () => {
    if (!clientId) {
      toast.error('Veuillez sélectionner un client');
      return;
    }
    
    try {
      // Generate project name if it's empty
      if (!nomProjet) {
        await generateProjectName();
      }
      
      await saveProject();
      toast.success('Projet enregistré avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
    }
  }, [clientId, nomProjet, generateProjectName, saveProject]);

  return {
    projectState,
    isLoading,
    projects,
    currentProjectId,
    hasUnsavedChanges,
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
    generateProjectName,
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject
  };
};
