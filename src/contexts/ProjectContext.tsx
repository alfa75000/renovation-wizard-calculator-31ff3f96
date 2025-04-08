
import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef } from 'react';
import { ProjectState, Property, Room, Travail, ProjectAction } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { saveProject } from '@/services/projectService';
import { ProjetChantier } from '@/types';
import { useProjetChantier } from './ProjetChantierContext';
import { toast } from '@/components/ui/use-toast';

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
  saveCurrentProject: (projectInfo?: Partial<ProjetChantier>) => Promise<boolean>;
  saveProjectDraft: () => Promise<boolean>;
  lastModified: Date | null;
}>({
  state: initialState,
  dispatch: () => null,
  saveCurrentProject: async () => false,
  saveProjectDraft: async () => false,
  lastModified: null,
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
  const [lastModified, setLastModified] = useState<Date | null>(null);
  const { state: projetChantierState } = useProjetChantier();
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);
  
  // Fonction pour sauvegarder le projet actuel dans Supabase
  const saveCurrentProject = useCallback(async (projectInfo?: Partial<ProjetChantier>): Promise<boolean> => {
    try {
      const currentProjectInfo = projetChantierState.projetActif || {};
      const mergedProjectInfo = { ...currentProjectInfo, ...projectInfo };
      
      const projectId = await saveProject(state, mergedProjectInfo);
      
      if (projectId) {
        setLastModified(new Date());
        toast({
          title: "Projet sauvegardé",
          description: "Le projet a été sauvegardé avec succès dans Supabase."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du projet:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le projet. Veuillez réessayer.",
        variant: "destructive"
      });
      return false;
    }
  }, [state, projetChantierState.projetActif]);
  
  // Fonction pour sauvegarder automatiquement le projet comme brouillon
  const saveProjectDraft = useCallback(async (): Promise<boolean> => {
    try {
      const projectId = await saveProject(state, projetChantierState.projetActif || {});
      
      if (projectId) {
        setLastModified(new Date());
        toast({
          title: "Brouillon sauvegardé",
          description: "Le brouillon du projet a été sauvegardé automatiquement."
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la sauvegarde automatique:", error);
      return false;
    }
  }, [state, projetChantierState.projetActif]);
  
  // Configurer la sauvegarde automatique toutes les 10 minutes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Nettoyer le timer existant si nécessaire
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }
    
    // Configurer un nouveau timer pour la sauvegarde automatique (10 minutes = 600000 ms)
    autoSaveTimer.current = setTimeout(() => {
      // Sauvegarder automatiquement seulement s'il y a des pièces ou des travaux
      if (state.rooms.length > 0 || state.travaux.length > 0) {
        saveProjectDraft();
      }
      
      // Réinitialiser le timer pour la prochaine sauvegarde
      autoSaveTimer.current = null;
    }, 600000); // 10 minutes
    
    // Nettoyer le timer lors du démontage du composant
    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [state, saveProjectDraft]);
  
  // Détecter les changements dans les travaux pour déclencher une sauvegarde automatique
  useEffect(() => {
    // Ne pas sauvegarder au premier montage
    if (isInitialMount.current) {
      return;
    }
    
    // Sauvegarder après une modification dans la page Récapitulatif (ajout/suppression/modification de travaux)
    const currentPath = window.location.pathname;
    if (currentPath === '/recapitulatif' && state.travaux.length > 0) {
      // Utiliser un délai pour éviter des sauvegardes trop fréquentes
      const debounceTimer = setTimeout(() => {
        saveProjectDraft();
      }, 5000); // 5 secondes après la dernière modification
      
      return () => clearTimeout(debounceTimer);
    }
  }, [state.travaux, saveProjectDraft]);
  
  // Mettre à jour lastModified après chaque action
  useEffect(() => {
    setLastModified(new Date());
  }, [state]);

  return (
    <ProjectContext.Provider value={{ 
      state, 
      dispatch, 
      saveCurrentProject, 
      saveProjectDraft,
      lastModified
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
