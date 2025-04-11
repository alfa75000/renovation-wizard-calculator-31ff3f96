
import { useCallback } from 'react';
import { useProjectMetadata } from './useProjectMetadata';
import { useProjectOperations } from './useProjectOperations';

/**
 * Hook combinant les métadonnées et les opérations sur les projets
 */
export const useProjectInfo = () => {
  // Utiliser le hook de métadonnées pour accéder aux propriétés du projet
  const metadataHook = useProjectMetadata();
  
  // Utiliser le hook d'opérations pour les actions sur les projets
  const {
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState
  } = useProjectOperations();

  // Regrouper tous les éléments dans un seul objet
  return {
    // Données de l'état du projet global
    projectState,
    isLoading,
    projects,
    currentProjectId,
    hasUnsavedChanges,
    
    // Métadonnées du projet et leurs setters
    ...metadataHook,
    
    // Opérations sur le projet
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject
  };
};
