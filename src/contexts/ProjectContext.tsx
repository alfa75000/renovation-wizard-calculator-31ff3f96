
import React, { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { ProjectState, Property, Room, Travail, ProjectAction } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { 
  createProject, 
  updateProject, 
  fetchProjectById, 
  fetchProjects, 
  deleteProject,
  generateDefaultProjectName,
  Project
} from '@/services/projectService';

// État initial
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

// Créer le contexte
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

// Fonction utilitaire pour générer un nom de pièce séquentiel
const generateRoomName = (rooms: Room[], type: string): string => {
  console.log("generateRoomName - Démarrage pour type:", type);
  console.log("generateRoomName - Toutes les pièces:", rooms);
  
  // Filtrer les pièces du même type
  const sameTypeRooms = rooms.filter(room => room.type === type);
  console.log("generateRoomName - Pièces du même type:", sameTypeRooms);
  
  // Trouver le numéro le plus élevé déjà utilisé
  let maxNumber = 0;
  
  sameTypeRooms.forEach(room => {
    // Extraire le numéro à la fin du nom (ex: "Chambre 1" -> 1)
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
  
  // Retourner le nom avec le numéro suivant
  const newName = `${type} ${maxNumber + 1}`;
  console.log("generateRoomName - Nouveau nom généré:", newName);
  return newName;
};

// Reducer pour gérer les actions
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
      console.log("ADD_ROOM - Action reçue avec payload:", action.payload);
      
      // Si le nom n'est pas spécifié, générer un nom séquentiel
      const roomData = {...action.payload};
      if (!roomData.name || roomData.name === '') {
        console.log("ADD_ROOM - Nom non spécifié, génération automatique");
        roomData.name = generateRoomName(state.rooms, roomData.type);
        console.log("ADD_ROOM - Nom généré:", roomData.name);
      }
      
      const newRoom = {...roomData, id: roomData.id || uuidv4()};
      console.log("ADD_ROOM - Nouvelle pièce finale:", newRoom);
      
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
        // Supprimer également les travaux associés à cette pièce
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

// Provider component
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  // Fonction pour récupérer la liste des projets depuis Supabase
  const refreshProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      const projectsData = await fetchProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error);
      toast.error('Impossible de charger la liste des projets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger la liste des projets au démarrage
  useEffect(() => {
    refreshProjects();
  }, [refreshProjects]);

  // Détecter les changements dans l'état du projet
  useEffect(() => {
    if (currentProjectId && lastSaveTime) {
      const now = new Date();
      const timeSinceLastSave = now.getTime() - lastSaveTime.getTime();
      
      // Marquer comme non sauvegardé seulement si le dernier enregistrement date de plus de 1 seconde
      // Cela évite de marquer comme "non sauvegardé" juste après avoir sauvegardé
      if (timeSinceLastSave > 1000) {
        setHasUnsavedChanges(true);
      }
    } else if (currentProjectId) {
      setHasUnsavedChanges(true);
    }
  }, [state, currentProjectId, lastSaveTime]);

  // Configuration de la sauvegarde automatique
  useEffect(() => {
    if (hasUnsavedChanges && currentProjectId) {
      // Nettoyer l'ancien timer si existant
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Définir un nouveau timer pour sauvegarder après 10 minutes
      const timer = setTimeout(() => {
        saveProjectAsDraft();
        toast.info('Sauvegarde automatique effectuée', {
          duration: 3000,
          position: 'bottom-right'
        });
      }, 10 * 60 * 1000); // 10 minutes en millisecondes
      
      setAutoSaveTimer(timer);
      
      // Nettoyer le timer lors du démontage du composant
      return () => {
        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer);
        }
      };
    }
  }, [hasUnsavedChanges, currentProjectId]);

  // Fonction pour créer un nouveau projet
  const createNewProject = useCallback(() => {
    dispatch({ type: 'RESET_PROJECT' });
    setCurrentProjectId(null);
    setHasUnsavedChanges(false);
    setLastSaveTime(null);
    toast.success('Nouveau projet créé');
  }, []);

  // Fonction pour sauvegarder le projet actuel
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

  // Fonction pour sauvegarder en tant que brouillon
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

  // Fonction pour charger un projet depuis Supabase
  const loadProject = useCallback(async (projectId: string) => {
    try {
      setIsLoading(true);
      
      // Sauvegarder les changements non enregistrés du projet actuel si nécessaire
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

  // Fonction pour supprimer le projet actuel
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

  // Avant de quitter la page, vérifier s'il y a des changements non enregistrés
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

// Hook personnalisé pour utiliser le contexte
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject doit être utilisé à l\'intérieur d\'un ProjectProvider');
  }
  return context;
};

// Hook pour la gestion des travaux
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
