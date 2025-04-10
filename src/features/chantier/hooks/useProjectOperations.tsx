
import { useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';

export const useProjectOperations = () => {
  const { 
    loadProject,
    deleteCurrentProject,
    saveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    state // Changed from projectState to state, which is the correct property name
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
      // The rest of the state cleanup will be handled by the composite hook
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Une erreur est survenue lors de la suppression du projet');
      return false;
    }
  }, [deleteCurrentProject]);
  
  // Handler for saving the current project
  const handleSaveProject = useCallback(async (clientId: string, nomProjet: string, generateNameFn: () => Promise<void>) => {
    if (!clientId) {
      toast.error('Veuillez sélectionner un client');
      return false;
    }
    
    try {
      // Generate project name if it's empty
      if (!nomProjet) {
        await generateNameFn();
      }
      
      await saveProject();
      toast.success('Projet enregistré avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
      return false;
    }
  }, [saveProject]);

  return {
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState: state // Return state as projectState for backward compatibility
  };
};
