
import { useCallback, useState, useEffect } from 'react';
import { ProjectState } from '@/types';
import { toast } from 'sonner';
import { useProject } from '@/contexts/ProjectContext';
import { 
  createProject, 
  updateProject, 
  fetchProjectById, 
  fetchProjects, 
  deleteProject,
  generateDefaultProjectName,
  Project
} from '@/services/projectService';
import { initialProjectState } from '@/features/project/reducers/projectReducer';

/**
 * Hook pour gérer la sauvegarde et le chargement des projets
 */
export const useProjectStorage = () => {
  const { state, dispatch } = useProject();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  /**
   * Rafraîchit la liste des projets depuis Supabase
   */
  const refreshProjects = useCallback(async (): Promise<void> => {
    try {
      const projectsList = await fetchProjects();
      setProjects(projectsList);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast.error('Erreur lors du chargement des projets');
    }
  }, []);

  // Charger la liste des projets au démarrage
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  /**
   * Créer un nouveau projet vide
   */
  const createNewProject = useCallback(() => {
    dispatch({ type: 'RESET_PROJECT' });
    setCurrentProjectId(null);
    toast.success('Nouveau projet créé');
  }, [dispatch]);

  /**
   * Sauvegarde le projet actuel
   */
  const saveProject = useCallback(async (name?: string) => {
    try {
      setIsSaving(true);
      toast.loading('Sauvegarde en cours...', { id: 'saving-project' });
      
      // Préparer les informations du projet
      const projectInfo = {
        name: name || (currentProjectId ? projects.find(p => p.id === currentProjectId)?.name : generateDefaultProjectName()),
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
      
      await refreshProjects();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      toast.error('Erreur lors de la sauvegarde du projet', { id: 'saving-project' });
    } finally {
      setIsSaving(false);
    }
  }, [state, currentProjectId, projects, refreshProjects]);

  /**
   * Charge un projet depuis Supabase
   */
  const loadProject = useCallback(async (projectId: string) => {
    try {
      setIsLoading(true);
      
      const { projectData, projectState } = await fetchProjectById(projectId);
      dispatch({ type: 'LOAD_PROJECT', payload: projectState });
      setCurrentProjectId(projectId);
      
      toast.success(`Projet "${projectData.name}" chargé avec succès`);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  /**
   * Supprime le projet actuel
   */
  const deleteCurrentProject = useCallback(async () => {
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
  }, [currentProjectId, dispatch, refreshProjects]);

  return {
    isLoading,
    isSaving,
    projects,
    currentProjectId,
    saveProject,
    loadProject,
    createNewProject,
    deleteCurrentProject,
    refreshProjects,
  };
};
