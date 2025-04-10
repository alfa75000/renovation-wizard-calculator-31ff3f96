
import { useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ProjectMetadata } from '@/types';

export const useProjectOperations = () => {
  const { 
    loadProject,
    deleteCurrentProject,
    saveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    state
  } = useProject();

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
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Une erreur est survenue lors de la suppression du projet');
      return false;
    }
  }, [deleteCurrentProject]);
  
  // Handler for saving the current project
  const handleSaveProject = useCallback(async (projectInfo?: any) => {
    try {
      // Prepare project metadata from the state
      const metadata = state.metadata;
      
      // Combine with any additional project info passed in
      const combinedProjectInfo = {
        client_id: metadata.clientId,
        name: metadata.nomProjet,
        description: metadata.descriptionProjet,
        address: metadata.adresseChantier,
        occupant: metadata.occupant,
        general_data: {
          infoComplementaire: metadata.infoComplementaire,
          dateDevis: metadata.dateDevis
        },
        devis_number: metadata.devisNumber,
        ...projectInfo // This allows overriding defaults if needed
      };
      
      // Save project with metadata
      await saveProject(combinedProjectInfo);
      toast.success('Projet enregistré avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
      return false;
    }
  }, [saveProject, state.metadata]);

  return {
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState: state 
  };
};
