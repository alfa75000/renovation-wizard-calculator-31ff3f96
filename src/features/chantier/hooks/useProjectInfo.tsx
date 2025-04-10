
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
  
  const { state: projectStateRaw } = useProject();
  
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
  
  // Utilisation d'un useEffect pour charger les données du projet lors du montage du composant
  // et lorsque currentProjectId ou projects changent
  useEffect(() => {
    if (currentProjectId && projects.length > 0) {
      loadCurrentProjectData();
    }
  }, [currentProjectId, projects, loadCurrentProjectData]);
  
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
    return await baseHandleSaveProject(clientId, nomProjet, generateProjectName);
  }, [baseHandleSaveProject, clientId, nomProjet, generateProjectName]);

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
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject
  };
};
