
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
  // Utiliser le hook useReducer pour initialiser l'état et le dispatcher
  const [state, dispatch] = useReducer(projectReducer, initialProjectState);
  
  // Utiliser les hooks spécialisés pour la gestion du projet
  const projectStorage = useProjectStorage();
  
  // Hook pour la gestion des avertissements de sauvegarde
  const { hasUnsavedChanges, updateSavedState, resetSavedState } = useSaveLoadWarning(state);

  // Hook pour la gestion des pièces - passer state et dispatch en arguments
  const roomsManager = useRooms(state, dispatch);
  
  // Fonction améliorée de sauvegarde avec suivi d'état
  const enhancedSaveProject = async (name?: string) => {
    try {
      if (typeof projectStorage.saveProject === 'function') {
        await projectStorage.saveProject(name);
        updateSavedState();
        return true;
      } else {
        console.error('La fonction saveProject n\'est pas disponible');
        toast.error('Erreur: fonction de sauvegarde non disponible');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde du projet');
      return false;
    }
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
    if (typeof projectStorage.createNewProject === 'function') {
      projectStorage.createNewProject();
      resetSavedState(initialProjectState);
    } else {
      console.error('La fonction createNewProject n\'est pas disponible');
      toast.error('Erreur: fonction de création de projet non disponible');
    }
  };

  // Fonction de chargement de projet améliorée
  const enhancedLoadProject = async (projectId: string) => {
    try {
      if (typeof projectStorage.loadProject === 'function') {
        await projectStorage.loadProject(projectId);
        return true;
      } else {
        console.error('La fonction loadProject n\'est pas disponible');
        toast.error('Erreur: fonction de chargement non disponible');
        return false;
      }
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
      return false;
    }
  };

  // Afficher l'état pour le débogage
  console.log("State in ProjectContext:", state);
  console.log("RoomsManager dans ProjectContext:", roomsManager);

  return (
    <ProjectContext.Provider value={{ 
      state, 
      dispatch,
      isLoading: projectStorage.isLoading,
      isSaving: projectStorage.isSaving,
      projects: projectStorage.projects,
      currentProjectId: projectStorage.currentProjectId,
      hasUnsavedChanges,
      saveProject: enhancedSaveProject,
      saveProjectAsDraft,
      loadProject: enhancedLoadProject,
      createNewProject: enhancedCreateNewProject,
      deleteCurrentProject: projectStorage.deleteCurrentProject,
      refreshProjects: projectStorage.refreshProjects,
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
