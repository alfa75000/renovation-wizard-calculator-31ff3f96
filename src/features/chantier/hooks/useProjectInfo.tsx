
import { useCallback, useEffect } from 'react';
import { useProjectMetadata } from './useProjectMetadata';
import { useProjectOperations } from './useProjectOperations';
import { useProject } from '@/contexts/ProjectContext';

export const useProjectInfo = () => {
  // Utiliser le hook de métadonnées qui utilise directement le contexte
  const metadataHook = useProjectMetadata();
  
  // Utiliser le hook d'opérations sur le projet
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

  // Simplification du hook en réutilisant les hooks spécialisés
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
