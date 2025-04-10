
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { ProjectState, ProjectAction, Travail } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { projectReducer, initialProjectState } from '@/features/project/reducers/projectReducer';
import { useRooms } from '@/features/project/hooks/useRooms';
import { useProjectStorage } from '@/features/project/hooks/useProjectStorage';
import { Project } from '@/services/projectService';
import { filtrerTravauxParPiece } from '@/features/travaux/utils/travauxUtils';

// Création du contexte
const ProjectContext = createContext<{
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
  // Hooks pour les pièces et travaux
  rooms: ReturnType<typeof useRooms>;
}>({
  state: initialProjectState,
  dispatch: () => null,
  isLoading: false,
  isSaving: false,
  projects: [],
  currentProjectId: null,
  hasUnsavedChanges: false,
  saveProject: async () => {},
  saveProjectAsDraft: async () => {},
  loadProject: async () => {},
  createNewProject: () => {},
  deleteCurrentProject: async () => {},
  refreshProjects: async () => {},
  rooms: {} as ReturnType<typeof useRooms>,
});

// Provider component
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialProjectState);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [lastSavedState, setLastSavedState] = useState<string>('');
  
  // Utilisation des hooks spécialisés
  const rooms = useRooms();
  
  // Initialiser le hook de stockage de projet avec le state, dispatch et autres dépendances
  const { 
    isLoading, 
    isSaving, 
    projects,
    saveProject: saveProjectToStorage,
    loadProject: loadProjectFromStorage,
    createNewProject: createEmptyProject,
    deleteCurrentProject: deleteProjectFromStorage,
    refreshProjects 
  } = useProjectStorage();
  
  // Mise à jour des fonctions avec le hook spécialisé
  const saveProject = useCallback(async (name?: string) => {
    try {
      await saveProjectToStorage(name);
      const stateSnapshot = JSON.stringify(state);
      setLastSavedState(stateSnapshot);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      toast.error('Erreur lors de la sauvegarde du projet');
    }
  }, [state, saveProjectToStorage]);
  
  const saveProjectAsDraft = useCallback(async () => {
    try {
      await saveProject();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  }, [saveProject]);
  
  const loadProject = useCallback(async (projectId: string) => {
    try {
      await loadProjectFromStorage(projectId);
      setCurrentProjectId(projectId);
      
      // Mise à jour de l'état sauvegardé pour le suivi des modifications
      const stateSnapshot = JSON.stringify(state);
      setLastSavedState(stateSnapshot);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
    }
  }, [loadProjectFromStorage, state]);
  
  const createNewProject = useCallback(() => {
    createEmptyProject();
    setCurrentProjectId(null);
    setHasUnsavedChanges(false);
    // Mise à jour de l'état sauvegardé pour le nouveau projet vide
    const stateSnapshot = JSON.stringify(initialProjectState);
    setLastSavedState(stateSnapshot);
  }, [createEmptyProject]);
  
  const deleteCurrentProject = useCallback(async () => {
    if (!currentProjectId) {
      toast.error('Aucun projet à supprimer');
      return;
    }
    
    try {
      await deleteProjectFromStorage();
      setCurrentProjectId(null);
      setHasUnsavedChanges(false);
      
      // Réinitialiser l'état sauvegardé
      const stateSnapshot = JSON.stringify(initialProjectState);
      setLastSavedState(stateSnapshot);
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Erreur lors de la suppression du projet');
    }
  }, [currentProjectId, deleteProjectFromStorage]);
  
  // Détecter les changements non sauvegardés
  useEffect(() => {
    if (lastSavedState) {
      const currentStateSnapshot = JSON.stringify(state);
      setHasUnsavedChanges(currentStateSnapshot !== lastSavedState);
    }
  }, [state, lastSavedState]);
  
  // Avertissement avant de quitter la page avec des modifications non sauvegardées
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Message d'avertissement standard pour tous les navigateurs
        const message = 'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter cette page?';
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);
  
  // Rafraîchir la liste des projets au démarrage
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);
  
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
      rooms
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

// Hook pour la gestion des travaux (implémentation directe pour éviter l'importation circulaire)
export const useTravaux = () => {
  const { state, dispatch } = useProject();
  
  // Fonction pour récupérer les travaux d'une pièce spécifique
  const getTravauxForPiece = useCallback((pieceId: string) => {
    return filtrerTravauxParPiece(state.travaux, pieceId);
  }, [state.travaux]);
  
  // Fonction pour ajouter un nouveau travail
  const addTravail = useCallback((travail: Omit<Travail, 'id'>) => {
    const newTravail = { ...travail, id: uuidv4() };
    
    dispatch({
      type: 'ADD_TRAVAIL',
      payload: newTravail
    });
    
    toast.success(`Travail "${travail.description}" ajouté avec succès`);
    
    return newTravail;
  }, [dispatch]);
  
  // Fonction pour mettre à jour un travail existant
  const updateTravail = useCallback((id: string, travail: Partial<Travail>) => {
    dispatch({
      type: 'UPDATE_TRAVAIL',
      payload: { id, travail: { ...travail, id } as Travail }
    });
    
    toast.success(`Travail mis à jour avec succès`);
  }, [dispatch]);
  
  // Fonction pour supprimer un travail
  const deleteTravail = useCallback((id: string) => {
    dispatch({
      type: 'DELETE_TRAVAIL',
      payload: id
    });
    
    toast.success(`Travail supprimé avec succès`);
  }, [dispatch]);
  
  return {
    travaux: state.travaux,
    getTravauxForPiece,
    addTravail,
    updateTravail,
    deleteTravail
  };
};
