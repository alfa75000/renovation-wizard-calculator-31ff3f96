
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Room, PropertyType } from '@/types';

// Interface pour définir l'état global du projet
interface ProjectState {
  rooms: Room[];
  property: PropertyType;
}

// Actions possibles pour le reducer
type ProjectAction =
  | { type: 'SET_ROOMS'; payload: Room[] }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: { id: string; room: Room } }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'SET_PROPERTY'; payload: PropertyType }
  | { type: 'UPDATE_PROPERTY'; payload: Partial<PropertyType> }
  | { type: 'RESET_PROJECT' };

// État initial du projet avec les nouvelles valeurs par défaut
const initialState: ProjectState = {
  rooms: [],
  property: {
    type: "Appartement",
    floors: "1",
    totalArea: "52",
    rooms: "",
    ceilingHeight: "2.50",
  },
};

// Fonction reducer pour gérer les modifications d'état
const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'SET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'ADD_ROOM':
      return { ...state, rooms: [...state.rooms, action.payload] };
    case 'UPDATE_ROOM':
      return {
        ...state,
        rooms: state.rooms.map(room => 
          room.id === action.payload.id ? action.payload.room : room
        )
      };
    case 'DELETE_ROOM':
      return { ...state, rooms: state.rooms.filter(room => room.id !== action.payload) };
    case 'SET_PROPERTY':
      return { ...state, property: action.payload };
    case 'UPDATE_PROPERTY':
      return { ...state, property: { ...state.property, ...action.payload } };
    case 'RESET_PROJECT':
      // Réinitialiser complètement l'état et effacer localStorage
      localStorage.removeItem('rooms');
      localStorage.removeItem('property');
      return initialState;
    default:
      return state;
  }
};

// Création du contexte
const ProjectContext = createContext<{
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Hook personnalisé pour utiliser le contexte
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject doit être utilisé à l'intérieur d'un ProjectProvider");
  }
  return context;
};

// Provider du contexte
export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedRooms = localStorage.getItem('rooms');
        if (savedRooms) {
          const parsedRooms = JSON.parse(savedRooms);
          if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
            console.log("Chargement des pièces depuis localStorage:", parsedRooms);
            dispatch({ type: 'SET_ROOMS', payload: parsedRooms });
          } else {
            console.log("Aucune pièce trouvée dans localStorage");
          }
        }

        const savedProperty = localStorage.getItem('property');
        if (savedProperty) {
          dispatch({ type: 'SET_PROPERTY', payload: JSON.parse(savedProperty) });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    loadSavedData();
  }, []);

  // Sauvegarder les données dans localStorage quand elles changent
  useEffect(() => {
    if (state.rooms.length > 0) {
      console.log("Sauvegarde des pièces dans localStorage:", state.rooms);
      localStorage.setItem('rooms', JSON.stringify(state.rooms));
    }
  }, [state.rooms]);

  useEffect(() => {
    localStorage.setItem('property', JSON.stringify(state.property));
  }, [state.property]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};
