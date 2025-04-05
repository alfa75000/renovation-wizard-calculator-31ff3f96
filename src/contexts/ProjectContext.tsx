
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Room, PropertyType, Travail } from '@/types';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';

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
  | { type: 'SET_TRAVAUX'; payload: Travail[] }
  | { type: 'ADD_TRAVAIL'; payload: Travail }
  | { type: 'UPDATE_TRAVAIL'; payload: { id: string; travail: Travail } }
  | { type: 'DELETE_TRAVAIL'; payload: string }
  | { type: 'RESET_PROJECT' };

// État initial du projet
const initialState: ProjectState = {
  rooms: [],
  property: {
    type: "Appartement",
    floors: "1",
    totalArea: "",
    rooms: "",
    ceilingHeight: "",
  },
  travaux: [],
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
      return { 
        ...state, 
        rooms: state.rooms.filter(room => room.id !== action.payload),
        // Supprimer également les travaux associés à cette pièce
        travaux: state.travaux.filter(travail => travail.pieceId !== action.payload)
      };
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
          travail.id === action.payload.id ? action.payload.travail : travail
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

  // Utiliser le hook de synchronisation avec localStorage pour chaque partie de l'état
  const { loadFromLocalStorage: loadRooms, saveToLocalStorage: saveRooms } = useLocalStorageSync('rooms', state.rooms);
  const { loadFromLocalStorage: loadProperty, saveToLocalStorage: saveProperty } = useLocalStorageSync('property', state.property);
  const { loadFromLocalStorage: loadTravaux, saveToLocalStorage: saveTravaux } = useLocalStorageSync('travaux', state.travaux);

  // Chargement initial des données depuis localStorage
  useEffect(() => {
    const loadInitialData = () => {
      try {
        // Chargement des pièces
        const savedRooms = loadRooms();
        if (savedRooms && Array.isArray(savedRooms) && savedRooms.length > 0) {
          console.log("Chargement initial des pièces:", savedRooms);
          dispatch({ type: 'SET_ROOMS', payload: savedRooms });
        }
        
        // Chargement des propriétés
        const savedProperty = loadProperty();
        if (savedProperty) {
          dispatch({ type: 'SET_PROPERTY', payload: savedProperty });
        }
        
        // Chargement des travaux
        const savedTravaux = loadTravaux();
        if (savedTravaux && Array.isArray(savedTravaux)) {
          dispatch({ type: 'SET_TRAVAUX', payload: savedTravaux });
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial des données:", error);
      }
    };

    // Ajouter un petit délai pour s'assurer que le localStorage est disponible
    setTimeout(loadInitialData, 100);
  }, []);

  // Force la sauvegarde quand les données changent
  useEffect(() => {
    saveRooms(state.rooms);
  }, [state.rooms]);

  useEffect(() => {
    saveProperty(state.property);
  }, [state.property]);

  useEffect(() => {
    saveTravaux(state.travaux);
  }, [state.travaux]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};
