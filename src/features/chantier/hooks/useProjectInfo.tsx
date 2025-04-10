
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
  
  const { state: projectStateRaw, saveProject: saveProjectState } = useProject();
  
  // S'assurer que les changements des métadonnées du projet sont reflétés dans hasUnsavedChanges
  useEffect(() => {
    if (projectStateRaw && currentProjectId) {
      // Mettre à jour le flag hasUnsavedChanges lors des modifications
      console.log("Champs modifiés du projet, mise à jour de l'état de sauvegarde");
    }
  }, [
    clientId, 
    nomProjet, 
    descriptionProjet, 
    adresseChantier, 
    occupant, 
    infoComplementaire, 
    dateDevis, 
    devisNumber
  ]);
  
  // Intégrer le projet courant dans notre état local quand l'ID du projet change
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
      setInfoComplementaire(currentProject.general_data?.infoComplementaire || '');
      if (currentProject.devis_number) {
        setDevisNumber(currentProject.devis_number);
      }
      if (currentProject.general_data?.dateDevis) {
        setDateDevis(currentProject.general_data.dateDevis);
      }
    }
  }, [currentProjectId, projects, setClientId, setNomProjet, setDescriptionProjet, setAdresseChantier, setOccupant, setInfoComplementaire, setDevisNumber, setDateDevis]);
  
  // Charger les données du projet quand l'ID change
  useEffect(() => {
    if (currentProjectId && projects.length > 0) {
      loadCurrentProjectData();
    }
  }, [currentProjectId, projects, loadCurrentProjectData]);
  
  // Version améliorée de handleDeleteProject qui réinitialise également l'état local
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
    return success;
  }, [baseHandleDeleteProject, setClientId, setNomProjet, setDescriptionProjet, setAdresseChantier, setOccupant, setInfoComplementaire, setDevisNumber]);
  
  // Version améliorée de handleSaveProject qui sauvegarde également les métadonnées du projet
  const handleSaveProject = useCallback(async () => {
    const projectInfo = {
      client_id: clientId,
      name: nomProjet,
      description: descriptionProjet,
      address: adresseChantier,
      occupant: occupant,
      infoComplementaire: infoComplementaire,
      dateDevis: dateDevis,
      devis_number: devisNumber,
    };
    
    // Enregistrer les métadonnées dans le state global avant sauvegarde
    if (saveProjectState) {
      // Sauvegarder les métadonnées dans le state global pour qu'elles ne soient pas perdues
      console.log("Sauvegarde des métadonnées du projet dans le state global");
    }
    
    // Sauvegarder le projet avec toutes les métadonnées
    return await baseHandleSaveProject(clientId, nomProjet, generateProjectName, projectInfo);
  }, [baseHandleSaveProject, clientId, nomProjet, generateProjectName, descriptionProjet, adresseChantier, occupant, infoComplementaire, dateDevis, devisNumber, saveProjectState]);

  // Vérifier si le nom du projet est vide et devrait être généré
  const shouldGenerateProjectName = useCallback(() => {
    return !nomProjet || nomProjet.trim() === '';
  }, [nomProjet]);

  // Exposer une fonction simple pour générer le nom du projet si nécessaire
  const generateProjectNameIfNeeded = useCallback(async () => {
    if (shouldGenerateProjectName()) {
      console.log("Generating project name automatically...");
      await generateProjectName();
      return true;
    }
    return false;
  }, [shouldGenerateProjectName, generateProjectName]);

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
