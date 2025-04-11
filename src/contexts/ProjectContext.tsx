
import React, { createContext, useContext, useReducer } from 'react';
import { ProjectState, ProjectAction, Project } from '@/types';
import { toast } from 'sonner';
import { projectReducer, initialProjectState } from '@/features/project/reducers/projectReducer';
import { fetchProjectById, fetchProjects, createProject, updateProject, deleteProject } from '@/services/projectService';
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
  
  // État pour le suivi du chargement et de la sauvegarde
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = React.useState<string | null>(null);
  
  // Hook pour la gestion des avertissements de sauvegarde
  const { hasUnsavedChanges, updateSavedState, resetSavedState } = useSaveLoadWarning(state);

  // Hook pour la gestion des pièces - passer state et dispatch en arguments
  const roomsManager = useRooms(state, dispatch);
  
  // Rafraîchir la liste des projets
  const refreshProjects = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const projectsList = await fetchProjects();
      setProjects(projectsList);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast.error('Erreur lors du chargement des projets');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Charger la liste des projets au démarrage
  React.useEffect(() => {
    refreshProjects();
  }, []);
  
  // Fonction pour créer un nouveau projet
  const createNewProject = (): void => {
    dispatch({ type: 'RESET_PROJECT' });
    setCurrentProjectId(null);
    resetSavedState(initialProjectState);
    toast.success('Nouveau projet créé');
  };
  
  // Fonction améliorée de sauvegarde avec suivi d'état
  const saveProject = async (name?: string): Promise<void> => {
    try {
      setIsSaving(true);
      toast.loading('Sauvegarde en cours...', { id: 'saving-project' });
      
      // Préparer les informations du projet
      const projectInfo = {
        name: name || (currentProjectId ? projects.find(p => p.id === currentProjectId)?.name : undefined)
      };
      
      if (currentProjectId) {
        // Mettre à jour un projet existant
        await updateProject(currentProjectId, state, projectInfo);
        toast.success('Projet mis à jour avec succès', { id: 'saving-project' });
      } else {
        // Créer un nouveau projet
        const result = await createProject(state, projectInfo);
        if (result?.id) {
          setCurrentProjectId(result.id);
        }
        toast.success('Projet enregistré avec succès', { id: 'saving-project' });
      }
      
      updateSavedState();
      await refreshProjects();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      toast.error('Erreur lors de la sauvegarde du projet', { id: 'saving-project' });
    } finally {
      setIsSaving(false);
    }
  };

  // Sauvegarde automatique en tant que brouillon
  const saveProjectAsDraft = async (): Promise<void> => {
    try {
      await saveProject();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  };
  
  // Fonction de chargement de projet
  const loadProject = async (projectId: string): Promise<void> => {
    if (!projectId) {
      toast.error('ID de projet invalide');
      return;
    }
    
    try {
      setIsLoading(true);
      
      console.log("Chargement du projet:", projectId);
      const { projectData, projectState } = await fetchProjectById(projectId);
      
      if (!projectState) {
        throw new Error('Données de projet invalides');
      }
      
      console.log("Données du projet chargées:", projectData);
      console.log("État du projet:", projectState);
      
      dispatch({ type: 'LOAD_PROJECT', payload: projectState });
      setCurrentProjectId(projectId);
      
      toast.success(`Projet "${projectData.name}" chargé avec succès`);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Suppression du projet actuel
  const deleteCurrentProject = async (): Promise<void> => {
    if (!currentProjectId) {
      toast.error('Aucun projet à supprimer');
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteProject(currentProjectId);
      
      // Réinitialiser l'état après la suppression
      dispatch({ type: 'RESET_PROJECT' });
      setCurrentProjectId(null);
      
      await refreshProjects();
      toast.success('Projet supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Erreur lors de la suppression du projet');
    } finally {
      setIsLoading(false);
    }
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
      saveProject,
      saveProjectAsDraft,
      loadProject,
      createNewProject,
      deleteCurrentProject,
      refreshProjects,
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
