
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Room, PropertyType, Travail } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Interface pour définir l'état global du projet
interface ProjectState {
  rooms: Room[];
  property: PropertyType;
  travaux: Travail[];
}

// Actions possibles pour le reducer
type ProjectAction =
  | { type: 'SET_ROOMS'; payload: Room[] }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: { id: string; room: Room } }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'SET_PROPERTY'; payload: PropertyType }
  | { type: 'UPDATE_PROPERTY'; payload: Partial<PropertyType> }
  | { type: 'ADD_TRAVAIL'; payload: Travail }
  | { type: 'UPDATE_TRAVAIL'; payload: Travail }
  | { type: 'DELETE_TRAVAIL'; payload: string }
  | { type: 'SET_TRAVAUX'; payload: Travail[] }
  | { type: 'RESET_PROJECT' };

// État initial du projet avec les valeurs par défaut
const initialState: ProjectState = {
  rooms: [],
  property: {
    type: "Appartement",
    floors: "1",
    totalArea: "52",
    rooms: "3",
    ceilingHeight: "2.50",
  },
  travaux: []
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
    case 'SET_TRAVAUX':
      return { ...state, travaux: action.payload };
    case 'ADD_TRAVAIL':
      return { ...state, travaux: [...state.travaux, action.payload] };
    case 'UPDATE_TRAVAIL':
      return {
        ...state,
        travaux: state.travaux.map(travail =>
          travail.id === action.payload.id ? action.payload : travail
        )
      };
    case 'DELETE_TRAVAIL':
      return { ...state, travaux: state.travaux.filter(travail => travail.id !== action.payload) };
    case 'RESET_PROJECT':
      // Réinitialiser complètement l'état et effacer localStorage
      localStorage.removeItem('rooms');
      localStorage.removeItem('property');
      localStorage.removeItem('travaux');
      return initialState;
    default:
      return state;
  }
};

// Type pour le contexte
interface ProjectContextType {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}

// Création du contexte
const ProjectContext = createContext<ProjectContextType>({
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
  // Utiliser le hook useLocalStorage pour les différentes parties de l'état
  const [storedRooms, setStoredRooms] = useLocalStorage<Room[]>('rooms', []);
  const [storedProperty, setStoredProperty] = useLocalStorage<PropertyType>('property', initialState.property);
  const [storedTravaux, setStoredTravaux] = useLocalStorage<Travail[]>('travaux', []);
  
  // Initialiser le reducer avec les données du localStorage
  const initialStateFromStorage: ProjectState = {
    rooms: storedRooms,
    property: storedProperty,
    travaux: storedTravaux
  };
  
  const [state, dispatch] = useReducer(projectReducer, initialStateFromStorage);

  // Mettre à jour localStorage quand les pièces changent
  useEffect(() => {
    setStoredRooms(state.rooms);
  }, [state.rooms, setStoredRooms]);

  // Mettre à jour localStorage quand les propriétés du bien changent
  useEffect(() => {
    setStoredProperty(state.property);
  }, [state.property, setStoredProperty]);
  
  // Mettre à jour localStorage quand les travaux changent
  useEffect(() => {
    setStoredTravaux(state.travaux);
  }, [state.travaux, setStoredTravaux]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};
