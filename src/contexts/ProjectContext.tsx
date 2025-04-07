
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProjectState, Property, Room, Travail, ProjectAction } from '@/types';
import { v4 as uuidv4 } from 'uuid';

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
}>({
  state: initialState,
  dispatch: () => null,
});

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
    
    case 'ADD_ROOM':
      return {
        ...state,
        rooms: [...state.rooms, action.payload],
      };
    
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
  // Récupérer les données depuis localStorage au démarrage
  const [state, dispatch] = useReducer(projectReducer, initialState, () => {
    try {
      const savedState = localStorage.getItem('projectState');
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error('Erreur lors du chargement de l\'état du projet:', error);
      return initialState;
    }
  });

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('projectState', JSON.stringify(state));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'état du projet:', error);
    }
  }, [state]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
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
