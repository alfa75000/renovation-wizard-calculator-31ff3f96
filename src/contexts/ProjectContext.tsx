import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { ProjectState, Property, Room, Travail, ProjectAction } from '@/types';
import { Project as SupabaseProject } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  createProject, 
  updateProject, 
  fetchProjectById, 
  fetchProjects, 
  deleteProject,
  generateDefaultProjectName
} from '@/services/projectService';

const initialState: ProjectState = {
  property: {
    type: 'Appartement',
    floors: 1,
    totalArea: 0,
    rooms: 0,
    ceilingHeight: 2.5,
  },
  rooms: [],
  travaux: [],
};

const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
  isLoading: boolean;
  isSaving: boolean;
  projects: SupabaseProject[];
  currentProjectId: string | null;
  hasUnsavedChanges: boolean;
  saveProject: (name?: string) => Promise<void>;
  saveProjectAsDraft: () => Promise<void>;
  loadProject: (projectId: string) => Promise<void>;
  createNewProject: () => void;
  deleteCurrentProject: () => Promise<void>;
  refreshProjects: () => Promise<void>;
}>({
  state: initialState,
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
});

const generateRoomName = (rooms: Room[], type: string): string => {
  console.log("generateRoomName - Démarrage pour type:", type);
  console.log("generateRoomName - Toutes les pièces:", rooms);
  
  const sameTypeRooms = rooms.filter(room => room.type === type);
  console.log("generateRoomName - Pièces du même type:", sameTypeRooms);
  
  let maxNumber = 0;
  
  sameTypeRooms.forEach(room => {
    const match = room.name.match(/\s(\d+)$/);
    console.log("generateRoomName - Analyse de la pièce:", room.name, "avec match:", match);
    
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  
  console.log("generateRoomName - Numéro maximal trouvé:", maxNumber);
  
  const newName = `${type} ${maxNumber + 1}`;
  console.log("generateRoomName - Nouveau nom généré:", newName);
  return newName;
};

function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        property: {
          ...state.property,
          ...action.payload,
        },
      };
    
    case 'ADD_ROOM': {
      const roomData = {...action.payload};
      if (!roomData.name || roomData.name === '') {
        roomData.name = generateRoomName(state.rooms, roomData.type);
      }
      
      const newRoom = {...roomData, id: roomData.id || uuidv4()};
      return {
        ...state,
        rooms: [...state.rooms, newRoom],
      };
    }
    
    case 'UPDATE_ROOM': {
      const { id, room } = action.payload;
      return {
        ...state,
        rooms: state.rooms.map((r) => (r.id === id ? room : r)),
      };
    }
    
    case 'DELETE_ROOM':
      return {
        ...state,
        rooms: state.rooms.filter((room) => room.id !== action.payload),
        travaux: state.travaux.filter((travail) => travail.pieceId !== action.payload),
      };
    
    case 'ADD_TRAVAIL':
      return {
        ...state,
        travaux: [...state.travaux, action.payload],
      };
    
    case 'UPDATE_TRAVAIL': {
      const { id, travail } = action.payload;
      return {
        ...state,
        travaux: state.travaux.map((t) => (t.id === id ? travail : t)),
      };
    }
    
    case 'DELETE_TRAVAIL':
      return {
        ...state,
        travaux: state.travaux.filter((travail) => travail.id !== action.payload),
      };
    
    case 'RESET_PROJECT':
      return initialState;
    
    case 'LOAD_PROJECT':
      return action.payload;
    
    default:
      return state;
  }
}

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [projects, setProjects] = useState<SupabaseProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  const refreshProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const projectsData = await fetchProjects();
      
      const convertedProjects: SupabaseProject[] = projectsData.map(project => ({
        ...project,
        description: '',
        address: '',
        postal_code: '',
        city: '',
        occupant: '',
        rooms_count: project.rooms_count || 0
      }));
      
      setProjects(convertedProjects);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast.error('Impossible de charger la liste des projets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  useEffect(() => {
    if (currentProjectId && lastSaveTime) {
      const now = new Date();
      const timeSinceLastSave = now.getTime() - lastSaveTime.getTime();
      
      if (timeSinceLastSave > 1000) {
        setHasUnsavedChanges(true);
      }
    } else if (currentProjectId) {
      setHasUnsavedChanges(true);
    }
  }, [state, currentProjectId, lastSaveTime]);

  useEffect(() => {
    if (hasUnsavedChanges && currentProjectId) {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      const timer = setTimeout(() => {
        saveProjectAsDraft();
        toast.info('Sauvegarde automatique effectuée', {
          duration: 3000,
          position: 'bottom-right'
        });
      }, 10 * 60 * 1000);
      
      setAutoSaveTimer(timer);
      
      return () => {
        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer);
        }
      };
    }
  }, [hasUnsavedChanges, currentProjectId]);

  const createNewProject = useCallback(() => {
    dispatch({ type: 'RESET_PROJECT' });
    setCurrentProjectId(null);
    setHasUnsavedChanges(false);
    setLastSaveTime(null);
    toast.success('Nouveau projet créé');
  }, []);

  const saveProject = useCallback(async (name?: string) => {
    try {
      setIsSaving(true);
      toast.loading('Sauvegarde en cours...', { id: 'saving-project' });
      
      const projectInfo = {
        name: name || (currentProjectId ? projects.find(p => p.id === currentProjectId)?.name : generateDefaultProjectName()),
      };
      
      if (currentProjectId) {
        await updateProject(currentProjectId, state, projectInfo);
        toast.success('Projet mis à jour avec succès', { id: 'saving-project' });
      } else {
        const result = await createProject(state, projectInfo);
        setCurrentProjectId(result.id);
        toast.success('Projet enregistré avec succès', { id: 'saving-project' });
      }
      
      setHasUnsavedChanges(false);
      setLastSaveTime(new Date());
      await refreshProjects();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du projet:', error);
      toast.error('Erreur lors de la sauvegarde du projet', { id: 'saving-project' });
    } finally {
      setIsSaving(false);
    }
  }, [state, currentProjectId, projects, refreshProjects]);

  const saveProjectAsDraft = useCallback(async () => {
    if (hasUnsavedChanges) {
      try {
        setIsSaving(true);
        await saveProject();
        setLastSaveTime(new Date());
      } catch (error) {
        console.error('Erreur lors de la sauvegarde automatique:', error);
        toast.error('Erreur lors de la sauvegarde automatique');
      } finally {
        setIsSaving(false);
      }
    }
  }, [hasUnsavedChanges, saveProject]);

  const loadProject = useCallback(async (projectId: string) => {
    try {
      setIsLoading(true);
      
      if (hasUnsavedChanges && currentProjectId) {
        const shouldSave = window.confirm('Voulez-vous sauvegarder les modifications du projet actuel avant d\'en charger un nouveau ?');
        if (shouldSave) {
          await saveProject();
        }
      }
      
      const { projectData, projectState } = await fetchProjectById(projectId);
      dispatch({ type: 'LOAD_PROJECT', payload: projectState });
      setCurrentProjectId(projectId);
      setHasUnsavedChanges(false);
      setLastSaveTime(new Date());
      
      toast.success(`Projet "${projectData.name}" chargé avec succès`);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Erreur lors du chargement du projet');
    } finally {
      setIsLoading(false);
    }
  }, [hasUnsavedChanges, currentProjectId, saveProject]);

  const deleteCurrentProject = useCallback(async () => {
    if (!currentProjectId) {
      toast.error('Aucun projet à supprimer');
      return;
    }
    
    try {
      setIsLoading(true);
      await deleteProject(currentProjectId);
      
      dispatch({ type: 'RESET_PROJECT' });
      setCurrentProjectId(null);
      setHasUnsavedChanges(false);
      setLastSaveTime(null);
      
      await refreshProjects();
      toast.success('Projet supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Erreur lors de la suppression du projet');
    } finally {
      setIsLoading(false);
    }
  }, [currentProjectId, refreshProjects]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        const message = 'Vous avez des modifications non enregistrées. Êtes-vous sûr de vouloir quitter?';
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
      refreshProjects
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

export const useTravaux = () => {
  const { state, dispatch } = useProject();
  
  const getTravauxForPiece = (pieceId: string) => {
    return state.travaux.filter(travail => travail.pieceId === pieceId);
  };
  
  const addTravail = (travail: Omit<Travail, 'id'>) => {
    dispatch({
      type: 'ADD_TRAVAIL',
      payload: { ...travail, id: uuidv4() }
    });
  };
  
  const updateTravail = (id: string, travail: Travail) => {
    dispatch({
      type: 'UPDATE_TRAVAIL',
      payload: { id, travail }
    });
  };
  
  const deleteTravail = (id: string) => {
    dispatch({
      type: 'DELETE_TRAVAIL',
      payload: id
    });
  };
  
  return {
    travaux: state.travaux,
    getTravauxForPiece,
    addTravail,
    updateTravail,
    deleteTravail
  };
};
