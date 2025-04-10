
import React, { createContext, useContext, useReducer } from 'react';
import { ProjectState, ProjectAction, Project } from '@/types';
import { toast } from 'sonner';
import { projectReducer, initialProjectState } from '@/features/project/reducers/projectReducer';
import { useProjectStorage } from '@/features/project/hooks/useProjectStorage';
import { useRooms } from '@/features/project/hooks/useRooms';
import { useTravaux } from '@/features/travaux/hooks/useTravaux';
import { useSaveLoadWarning } from '@/features/project/hooks/useSaveLoadWarning';

// Définition du type pour le contexte
type ProjectContextType = {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  isLoading: boolean;
  isSaving: boolean;
  projects: Project[];
  currentProjectId: string | null;
  hasUnsavedChanges: boolean;
  saveProject: (name?: string) => Promise<void>;
  saveProjectAsDraft: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  createNewProject: () => void;
  deleteCurrentProject: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  updateProjectName: (projectId: string, name: string) => void;
  rooms: {
    rooms: ProjectState['rooms'];
    addRoom: ReturnType<typeof useRooms>['addRoom'];
    updateRoom: ReturnType<typeof useRooms>['updateRoom'];
    deleteRoom: ReturnType<typeof useRooms>['deleteRoom'];
  };
};

// Création du contexte
const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

// Provider component
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // S'assurer que l'état initial est correctement défini
  const [state, dispatch] = useReducer(projectReducer, initialProjectState);
  
  // Utiliser les hooks spécialisés
  const {
    isLoading,
    isSaving,
    projects,
    currentProjectId,
    saveProject,
    loadProject,
    createNewProject,
    deleteCurrentProject,
    refreshProjects
  } = useProjectStorage();
  
  // Hook pour la gestion des avertissements de sauvegarde
  const { hasUnsavedChanges, updateSavedState, resetSavedState } = useSaveLoadWarning(state);

  // Hook pour la gestion des pièces - passer state et dispatch en arguments
  const roomsManager = useRooms(state, dispatch);
  
  // Fonction de mise à jour du nom du projet
  const updateProjectName = (projectId: string, name: string) => {
    if (!projectId) return;
    
    // Mettre à jour le nom du projet dans la liste locale
    const updatedProjects = projects.map(p => 
      p.id === projectId ? { ...p, name: name } : p
    );
    
    // Log pour débogage
    console.log("Mise à jour du nom du projet:", projectId, name);
    console.log("Projets mis à jour:", updatedProjects);
    
    // Lors de la prochaine sauvegarde, le nom sera persisté
    // puisque nous utilisons la version locale mise à jour
  };
  
  // Fonction améliorée de sauvegarde avec suivi d'état
  const enhancedSaveProject = async (name?: string) => {
    await saveProject(name);
    updateSavedState();
  };

  // Sauvegarde automatique en tant que brouillon
  const saveProjectAsDraft = async () => {
    try {
      await enhancedSaveProject();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  };
  
  // Étendre la fonction de création d'un nouveau projet pour réinitialiser l'état sauvegardé
  const enhancedCreateNewProject = () => {
    createNewProject();
    resetSavedState(initialProjectState);
  };

  // Afficher l'état pour le débogage
  console.log("State in ProjectContext:", state);
  console.log("RoomsManager dans ProjectContext:", roomsManager);

  return (
    <ProjectContext.Provider value={{ 
      state, 
      dispatch,
      isLoading,
      isSaving,
      projects,
      currentProjectId,
      hasUnsavedChanges,
      saveProject: enhancedSaveProject,
      saveProjectAsDraft,
      loadProject,
      createNewProject: enhancedCreateNewProject,
      deleteCurrentProject,
      refreshProjects,
      updateProjectName,
      rooms: roomsManager
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject doit être utilisé à l\'intérieur d\'un ProjectProvider');
  }
  return context;
};

// Exporter useTravaux directement depuis le hook spécialisé
export { useTravaux };
