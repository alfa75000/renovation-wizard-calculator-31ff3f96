
import { useCallback, useEffect } from 'react';
import { useProjectMetadata } from './useProjectMetadata';
import { useProjectOperations } from './useProjectOperations';
import { useProject } from '@/contexts/ProjectContext';

export const useProjectInfo = () => {
  const {
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
  } = useProjectMetadata();
  
  const {
    handleChargerProjet,
    handleDeleteProject: baseHandleDeleteProject,
    handleSaveProject: baseHandleSaveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState
  } = useProjectOperations();
  
  const { state: projectStateRaw, saveProject: saveProjectContext } = useProject();
  
  // Synchronize project data to context when loaded
  useEffect(() => {
    if (currentProjectId) {
      loadCurrentProjectData();
    }
  }, [currentProjectId, projects]);
  
  // Integrate the project data into our local state when project ID changes
  const loadCurrentProjectData = useCallback(() => {
    if (!currentProjectId) return;
    
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
  }, [currentProjectId, projects, setClientId, setNomProjet, setDescriptionProjet, setAdresseChantier, setOccupant, setDevisNumber]);
  
  // Enhanced version of handleDeleteProject that also resets local state
  const handleDeleteProject = useCallback(async () => {
    const success = await baseHandleDeleteProject();
    if (success) {
      setClientId('');
      setNomProjet('');
      setDescriptionProjet('');
      setAdresseChantier('');
      setOccupant('');
      setInfoComplementaire('');
      setDevisNumber('');
    }
  }, [baseHandleDeleteProject, setClientId, setNomProjet, setDescriptionProjet, setAdresseChantier, setOccupant, setInfoComplementaire, setDevisNumber]);
  
  // Enhanced version of handleSaveProject that passes required arguments
  const handleSaveProject = useCallback(async () => {
    try {
      // Assurez-vous que le nom du projet est généré si nécessaire
      if (!nomProjet) {
        await generateProjectNameIfNeeded();
      }
      
      // Préparer les informations additionnelles du projet pour la sauvegarde
      const projectInfo = {
        name: nomProjet,
        client_id: clientId,
        description: descriptionProjet,
        address: adresseChantier,
        occupant: occupant,
        devis_number: devisNumber
      };
      
      // Sauvegarder le projet avec le context et les informations actuelles
      await saveProjectContext(projectInfo.name);
      
      // Ensuite utiliser l'implémentation de base pour la sauvegarde complète
      return await baseHandleSaveProject(clientId, nomProjet, async () => {
        return nomProjet;
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du projet:", error);
      return false;
    }
  }, [
    baseHandleSaveProject,
    clientId, 
    nomProjet,
    descriptionProjet,
    adresseChantier,
    occupant,
    devisNumber,
    saveProjectContext,
    generateProjectNameIfNeeded
  ]);

  // New helper function to check if project name is empty and should be generated
  const shouldGenerateProjectName = useCallback(() => {
    return !nomProjet || nomProjet.trim() === '';
  }, [nomProjet]);

  // Expose a simple function to generate project name if needed
  const generateProjectNameIfNeeded = useCallback(async () => {
    if (shouldGenerateProjectName()) {
      console.log("Generating project name automatically...");
      const newName = await generateProjectName();
      // Force UI update if needed
      if (newName && newName !== nomProjet) {
        setNomProjet(newName);
        
        // Sauvegarder temporairement les modifications pour éviter la perte lors du changement de page
        const projectInfo = {
          name: newName,
          client_id: clientId,
          description: descriptionProjet,
          address: adresseChantier,
          occupant: occupant,
          devis_number: devisNumber
        };
        
        // Mettre à jour le context avec le nouveau nom
        await saveProjectContext(newName);
      }
      return true;
    }
    return false;
  }, [shouldGenerateProjectName, generateProjectName, nomProjet, setNomProjet, clientId, descriptionProjet, adresseChantier, occupant, devisNumber, saveProjectContext]);

  return {
    projectState: projectStateRaw,
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
    generateProjectNameIfNeeded,
    shouldGenerateProjectName,
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject
  };
};
