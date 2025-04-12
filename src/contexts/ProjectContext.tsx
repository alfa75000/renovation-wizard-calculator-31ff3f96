
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProjectState, ProjectAction, Project } from '@/types';
import { toast } from 'sonner';
import { projectReducer, initialProjectState } from '@/features/project/reducers/projectReducer';
import { fetchProjectById, fetchProjects, createProject, updateProject, deleteProject } from '@/services/projectService';
import { useRooms } from '@/features/project/hooks/useRooms';
import { useTravaux } from '@/features/travaux/hooks/useTravaux';
import { useSaveLoadWarning } from '@/features/project/hooks/useSaveLoadWarning';
import { supabase } from '@/lib/supabase';

type ProjectContextType = {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  isLoading: boolean;
  isSaving: boolean;
  projects: Project[];
  currentProjectId: string | null;
  setCurrentProjectId: (id: string | null) => void;
  hasUnsavedChanges: boolean;
  saveProject: (name?: string) => Promise<void>;
  saveProjectAsDraft: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  createNewProject: () => void;
  deleteCurrentProject: () => Promise<void>;
  refreshProjects: () => Promise<void>;
  updateSavedState: () => void;
  resetSavedState: (state: ProjectState) => void;
  rooms: {
    rooms: ProjectState['rooms'];
    addRoom: ReturnType<typeof useRooms>['addRoom'];
    updateRoom: ReturnType<typeof useRooms>['updateRoom'];
    deleteRoom: ReturnType<typeof useRooms>['deleteRoom'];
  };
};

const ProjectContext = createContext<ProjectContextType>({} as ProjectContextType);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialProjectState);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = React.useState<string | null>(null);
  const { hasUnsavedChanges, updateSavedState, resetSavedState, forceNoUnsavedChanges } = useSaveLoadWarning(state);
  const roomsManager = useRooms(state, dispatch);

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

  React.useEffect(() => {
    refreshProjects();
  }, []);

  React.useEffect(() => {
    const loadCurrentProjectFromAppState = async () => {
      try {
        const { data: appStateData, error } = await supabase
          .from('app_state')
          .select('current_project_id')
          .eq('user_id', (await supabase.from('app_users').select('id').eq('username', 'Admin').single()).data?.id || '')
          .single();
          
        if (error || !appStateData || !appStateData.current_project_id) {
          console.log('Aucun projet en cours dans l\'état de l\'application');
          return;
        }
        
        console.log('Projet en cours trouvé dans l\'état de l\'application:', appStateData.current_project_id);
        
        await loadProject(appStateData.current_project_id);
      } catch (error) {
        console.error('Erreur lors du chargement du projet en cours depuis l\'état de l\'application:', error);
      }
    };
    
    loadCurrentProjectFromAppState();
  }, []);

  React.useEffect(() => {
    const updateAppStateProjectId = async () => {
      if (currentProjectId === null) {
        console.log('Pas de projet en cours à sauvegarder');
        return;
      }
      
      try {
        console.log('Tentative de mise à jour du project_id dans app_state:', currentProjectId);
        const { data: adminUser, error: userError } = await supabase
          .from('app_users')
          .select('id')
          .eq('username', 'Admin')
          .single();
          
        if (userError || !adminUser) {
          console.error('Erreur lors de la récupération de l\'utilisateur Admin:', userError);
          return;
        }
        
        console.log('Admin user trouvé:', adminUser);
        
        const { data, error } = await supabase
          .from('app_state')
          .update({ current_project_id: currentProjectId })
          .eq('user_id', adminUser.id)
          .select();
          
        if (error) {
          console.error('Erreur lors de la mise à jour de l\'ID du projet en cours dans l\'état de l\'application:', error);
        } else {
          console.log('Mise à jour réussie de current_project_id dans app_state:', data);
        }
      } catch (error) {
        console.error('Exception lors de la mise à jour de l\'ID du projet en cours dans l\'état de l\'application:', error);
      }
    };
    
    updateAppStateProjectId();
  }, [currentProjectId]);

  const createNewProject = (): void => {
    dispatch({ type: 'RESET_PROJECT' });
    setCurrentProjectId(null);
    resetSavedState(initialProjectState);
    toast.success('Initialisation pour un nouveau projet réussie');
  };

  const saveProject = async (name?: string): Promise<void> => {
    try {
      setIsSaving(true);
      toast.loading('Sauvegarde en cours...', { id: 'saving-project' });
      
      const projectInfo = {
        name: name || (currentProjectId ? projects.find(p => p.id === currentProjectId)?.name : undefined)
      };
      
      if (currentProjectId) {
        await updateProject(currentProjectId, state, projectInfo);
        toast.success('Projet mis à jour avec succès', { id: 'saving-project' });
      } else {
        const result = await createProject(state, projectInfo);
        if (result?.id) {
          setCurrentProjectId(result.id);
          setTimeout(async () => {
            try {
              const { data: adminUser } = await supabase
                .from('app_users')
                .select('id')
                .eq('username', 'Admin')
                .single();
              
              if (adminUser) {
                await supabase
                  .from('app_state')
                  .update({ current_project_id: result.id })
                  .eq('user_id', adminUser.id);
                
                console.log('Projet ID mis à jour explicitement après création:', result.id);
              }
            } catch (e) {
              console.error('Erreur lors de la mise à jour forcée du current_project_id:', e);
            }
          }, 500);
        }
        toast.success('Projet enregistré avec succès', { id: 'saving-project' });
      }
      
      // Très important: mettre à jour l'état sauvegardé pour désactiver hasUnsavedChanges
      updateSavedState();
      await refreshProjects();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      toast.error('Erreur lors de la sauvegarde du projet', { id: 'saving-project' });
    } finally {
      setIsSaving(false);
    }
  };

  const saveProjectAsDraft = async (): Promise<void> => {
    try {
      await saveProject();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  };

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
      
      try {
        const { data: adminUser } = await supabase
          .from('app_users')
          .select('id')
          .eq('username', 'Admin')
          .single();
        
        if (adminUser) {
          const { data, error } = await supabase
            .from('app_state')
            .update({ current_project_id: projectId })
            .eq('user_id', adminUser.id)
            .select();
          
          if (error) {
            console.error('Erreur lors de la mise à jour du current_project_id après chargement:', error);
          } else {
            console.log('Mise à jour réussie du current_project_id après chargement:', data);
          }
        }
      } catch (e) {
        console.error('Exception lors de la mise à jour du current_project_id après chargement:', e);
      }
      
      // Utiliser un délai plus long pour s'assurer que l'état a eu le temps d'être mis à jour
      setTimeout(() => {
        console.log("Mise à jour de l'état sauvegardé après le chargement complet");
        
        // IMPORTANT: D'abord mettre à jour lastSavedState puis forcer hasUnsavedChanges à false
        updateSavedState();
        
        // Puis forcer hasUnsavedChanges à false de façon plus robuste
        forceNoUnsavedChanges();
        
        console.log("hasUnsavedChanges forcé à false après chargement");
      }, 100); // Augmenter le délai à 100ms
      
      toast.success(`Projet "${projectData.name}" chargé avec succès`);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCurrentProject = async (): Promise<void> => {
    if (!currentProjectId) {
      toast.error('Aucun projet à supprimer');
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteProject(currentProjectId);
      
      dispatch({ type: 'RESET_PROJECT' });
      setCurrentProjectId(null);
      
      try {
        const { data: adminUser } = await supabase
          .from('app_users')
          .select('id')
          .eq('username', 'Admin')
          .single();
        
        if (adminUser) {
          await supabase
            .from('app_state')
            .update({ current_project_id: null })
            .eq('user_id', adminUser.id);
          
          console.log('current_project_id mis à null après suppression');
        }
      } catch (e) {
        console.error('Exception lors de la mise à jour du current_project_id après suppression:', e);
      }
      
      await refreshProjects();
      toast.success('Projet supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Erreur lors de la suppression du projet');
    } finally {
      setIsLoading(false);
    }
  };

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
      setCurrentProjectId,
      hasUnsavedChanges,
      saveProject,
      saveProjectAsDraft,
      loadProject,
      createNewProject,
      deleteCurrentProject,
      refreshProjects,
      updateSavedState,
      resetSavedState,
      rooms: roomsManager
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject doit être utilisé à l\'intérieur d\'un ProjectProvider');
  }
  return context;
};

export { useTravaux };
