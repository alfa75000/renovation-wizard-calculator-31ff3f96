
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { ProjectState, ProjectAction, Travail } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { projectReducer, initialProjectState } from '@/features/project/reducers/projectReducer';
import { filtrerTravauxParPiece } from '@/features/travaux/utils/travauxUtils';
import { Project } from '@/services/projectService';

// Définition initiale du contexte (sera remplacée dans le Provider)
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
  // Les props pour la gestion des pièces/travaux seront ajoutées au moment de l'utilisation des hooks
  rooms: any;
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
  rooms: {},
});

// Provider component
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialProjectState);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSavedState, setLastSavedState] = useState<string>('');
  
  // États de base pour le stockage des projets
  // Ces propriétés seront remplacées par celles du hook useProjectStorage
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);

  // Implémentation basique du hook rooms
  const rooms = {
    rooms: state.rooms,
    addRoom: useCallback((room: any) => {
      const newRoom = { ...room, id: uuidv4() };
      dispatch({ type: 'ADD_ROOM', payload: newRoom });
      toast.success(`Pièce "${newRoom.name}" ajoutée avec succès`);
      return newRoom;
    }, [dispatch]),
    updateRoom: useCallback((id: string, room: any) => {
      dispatch({ type: 'UPDATE_ROOM', payload: { id, room } });
      toast.success(`Pièce "${room.name}" mise à jour avec succès`);
    }, [dispatch]),
    deleteRoom: useCallback((id: string) => {
      const roomToDelete = state.rooms.find(room => room.id === id);
      if (!roomToDelete) return;
      
      dispatch({ type: 'DELETE_ROOM', payload: id });
      toast.success(`Pièce "${roomToDelete.name}" supprimée avec succès`);
    }, [dispatch, state.rooms])
  };

  // Fonctions de gestion de projet
  const refreshProjects = useCallback(async () => {
    try {
      // Note: Dans une implémentation réelle, cette fonction appellerait
      // fetchProjects() du service, mais pour éviter de changer l'architecture
      // actuelle, on garde cette implémentation minimale
      return projects;
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast.error('Erreur lors du chargement des projets');
      return [];
    }
  }, [projects]);

  const saveProject = useCallback(async (name?: string) => {
    try {
      setIsSaving(true);
      
      // Simuler la sauvegarde
      setTimeout(() => {
        // Mise à jour de l'état sauvegardé pour le suivi des modifications
        const stateSnapshot = JSON.stringify(state);
        setLastSavedState(stateSnapshot);
        setHasUnsavedChanges(false);
        
        toast.success('Projet enregistré avec succès');
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      toast.error('Erreur lors de la sauvegarde du projet');
      setIsSaving(false);
    }
  }, [state]);
  
  const saveProjectAsDraft = useCallback(async () => {
    try {
      await saveProject();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde automatique:', error);
    }
  }, [saveProject]);
  
  const loadProject = useCallback(async (projectId: string) => {
    try {
      setIsLoading(true);
      setCurrentProjectId(projectId);
      
      // Simuler le chargement
      setTimeout(() => {
        // Mise à jour de l'état sauvegardé pour le suivi des modifications
        const stateSnapshot = JSON.stringify(state);
        setLastSavedState(stateSnapshot);
        setHasUnsavedChanges(false);
        setIsLoading(false);
        
        toast.success('Projet chargé avec succès');
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
      setIsLoading(false);
    }
  }, [state]);
  
  const createNewProject = useCallback(() => {
    dispatch({ type: 'RESET_PROJECT' });
    setCurrentProjectId(null);
    setHasUnsavedChanges(false);
    
    // Mise à jour de l'état sauvegardé pour le nouveau projet vide
    const stateSnapshot = JSON.stringify(initialProjectState);
    setLastSavedState(stateSnapshot);
    
    toast.success('Nouveau projet créé');
  }, [dispatch]);
  
  const deleteCurrentProject = useCallback(async () => {
    if (!currentProjectId) {
      toast.error('Aucun projet à supprimer');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simuler la suppression
      setTimeout(() => {
        dispatch({ type: 'RESET_PROJECT' });
        setCurrentProjectId(null);
        setHasUnsavedChanges(false);
        
        // Réinitialiser l'état sauvegardé
        const stateSnapshot = JSON.stringify(initialProjectState);
        setLastSavedState(stateSnapshot);
        setIsLoading(false);
        
        toast.success('Projet supprimé avec succès');
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Erreur lors de la suppression du projet');
      setIsLoading(false);
    }
  }, [currentProjectId, dispatch]);
  
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
