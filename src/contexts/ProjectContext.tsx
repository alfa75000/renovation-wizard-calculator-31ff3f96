
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Room, PropertyType, Travail, AutreSurface } from '@/types';

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

// État initial du projet avec les nouvelles valeurs par défaut
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
            
            // Assurer la rétrocompatibilité en ajoutant le tableau autresSurfaces si absent
            const roomsWithAutresSurfaces = parsedRooms.map(room => ({
              ...room,
              autresSurfaces: room.autresSurfaces || []
            }));
            
            dispatch({ type: 'SET_ROOMS', payload: roomsWithAutresSurfaces });
          } else {
            console.log("Aucune pièce trouvée dans localStorage");
          }
        }

        const savedProperty = localStorage.getItem('property');
        if (savedProperty) {
          dispatch({ type: 'SET_PROPERTY', payload: JSON.parse(savedProperty) });
        }
        
        const savedTravaux = localStorage.getItem('travaux');
        if (savedTravaux) {
          const parsedTravaux = JSON.parse(savedTravaux);
          if (Array.isArray(parsedTravaux)) {
            console.log("Chargement des travaux depuis localStorage:", parsedTravaux.length);
            dispatch({ type: 'SET_TRAVAUX', payload: parsedTravaux });
          }
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
  
  useEffect(() => {
    if (state.travaux.length > 0) {
      console.log("Sauvegarde des travaux dans localStorage:", state.travaux.length);
      localStorage.setItem('travaux', JSON.stringify(state.travaux));
    }
  }, [state.travaux]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};
