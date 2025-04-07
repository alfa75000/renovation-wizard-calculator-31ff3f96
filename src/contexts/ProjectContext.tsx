
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Room, PropertyType, Travail, AutreSurface } from '@/types';
import { useRoomsStorage } from '@/hooks/useRoomsStorage';
import { useTravauxStorage } from '@/hooks/useTravauxStorage';
import { usePropertyStorage } from '@/hooks/usePropertyStorage';
import { useLogger } from '@/hooks/useLogger';

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
  const logger = useLogger('ProjectProvider');
  const [state, dispatch] = useReducer(projectReducer, initialState);
  
  // Hooks pour IndexedDB
  const roomsStorage = useRoomsStorage();
  const travauxStorage = useTravauxStorage();
  const propertyStorage = usePropertyStorage();

  // Charger les données au démarrage
  useEffect(() => {
    const loadSavedData = async () => {
      try {
        // D'abord essayer de charger depuis IndexedDB (si disponible)
        if (roomsStorage.isDbAvailable && !roomsStorage.isLoading) {
          const rooms = await roomsStorage.getAllRooms();
          if (rooms.length > 0) {
            logger.info(`Chargement de ${rooms.length} pièces depuis IndexedDB`, 'storage');
            dispatch({ type: 'SET_ROOMS', payload: rooms });
          } else {
            // Fallback sur localStorage
            try {
              const savedRooms = localStorage.getItem('rooms');
              if (savedRooms) {
                const parsedRooms = JSON.parse(savedRooms);
                if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
                  logger.info("Chargement des pièces depuis localStorage:", 'storage', { count: parsedRooms.length });
                  
                  // Assurer la rétrocompatibilité pour autresSurfaces
                  const roomsWithAutresSurfaces = parsedRooms.map(room => ({
                    ...room,
                    autresSurfaces: room.autresSurfaces || []
                  }));
                  
                  dispatch({ type: 'SET_ROOMS', payload: roomsWithAutresSurfaces });
                }
              }
            } catch (localError) {
              logger.error("Erreur lors du chargement des pièces depuis localStorage", localError as Error, 'storage');
            }
          }
        } else {
          // Si IndexedDB n'est pas disponible, charger depuis localStorage directement
          const savedRooms = localStorage.getItem('rooms');
          if (savedRooms) {
            const parsedRooms = JSON.parse(savedRooms);
            if (Array.isArray(parsedRooms) && parsedRooms.length > 0) {
              logger.info("Chargement des pièces depuis localStorage:", 'storage', { count: parsedRooms.length });
              
              // Assurer la rétrocompatibilité
              const roomsWithAutresSurfaces = parsedRooms.map(room => ({
                ...room,
                autresSurfaces: room.autresSurfaces || []
              }));
              
              dispatch({ type: 'SET_ROOMS', payload: roomsWithAutresSurfaces });
            }
          }
        }

        // Chargement des propriétés
        if (propertyStorage.isDbAvailable && !propertyStorage.isLoading) {
          const property = await propertyStorage.getProperty();
          if (property) {
            logger.info("Chargement des propriétés depuis IndexedDB", 'storage');
            dispatch({ type: 'SET_PROPERTY', payload: property });
          } else {
            // Fallback sur localStorage
            try {
              const savedProperty = localStorage.getItem('property');
              if (savedProperty) {
                dispatch({ type: 'SET_PROPERTY', payload: JSON.parse(savedProperty) });
              }
            } catch (localError) {
              logger.error("Erreur lors du chargement des propriétés depuis localStorage", localError as Error, 'storage');
            }
          }
        } else {
          // Si IndexedDB n'est pas disponible
          const savedProperty = localStorage.getItem('property');
          if (savedProperty) {
            dispatch({ type: 'SET_PROPERTY', payload: JSON.parse(savedProperty) });
          }
        }
        
        // Chargement des travaux
        if (travauxStorage.isDbAvailable && !travauxStorage.isLoading) {
          const travaux = await travauxStorage.getAllTravaux();
          if (travaux.length > 0) {
            logger.info(`Chargement de ${travaux.length} travaux depuis IndexedDB`, 'storage');
            dispatch({ type: 'SET_TRAVAUX', payload: travaux });
          } else {
            // Fallback sur localStorage
            try {
              const savedTravaux = localStorage.getItem('travaux');
              if (savedTravaux) {
                const parsedTravaux = JSON.parse(savedTravaux);
                if (Array.isArray(parsedTravaux)) {
                  logger.info("Chargement des travaux depuis localStorage:", 'storage', { count: parsedTravaux.length });
                  dispatch({ type: 'SET_TRAVAUX', payload: parsedTravaux });
                }
              }
            } catch (localError) {
              logger.error("Erreur lors du chargement des travaux depuis localStorage", localError as Error, 'storage');
            }
          }
        } else {
          // Si IndexedDB n'est pas disponible
          const savedTravaux = localStorage.getItem('travaux');
          if (savedTravaux) {
            const parsedTravaux = JSON.parse(savedTravaux);
            if (Array.isArray(parsedTravaux)) {
              logger.info("Chargement des travaux depuis localStorage:", 'storage', { count: parsedTravaux.length });
              dispatch({ type: 'SET_TRAVAUX', payload: parsedTravaux });
            }
          }
        }
      } catch (error) {
        logger.error("Erreur lors du chargement des données:", error as Error, 'storage');
      }
    };

    loadSavedData();
  }, [roomsStorage.isDbAvailable, roomsStorage.isLoading, travauxStorage.isDbAvailable, travauxStorage.isLoading, propertyStorage.isDbAvailable, propertyStorage.isLoading, logger]);

  // Sauvegarde des données lorsqu'elles changent
  // Sauvegarder les pièces dans localStorage et/ou IndexedDB
  useEffect(() => {
    if (state.rooms.length > 0) {
      logger.info("Sauvegarde des pièces:", 'storage', { count: state.rooms.length });
      
      // Toujours sauvegarder dans localStorage (pour la compatibilité)
      localStorage.setItem('rooms', JSON.stringify(state.rooms));
      
      // Si IndexedDB est disponible, sauvegarder également
      if (roomsStorage.isDbAvailable && !roomsStorage.isLoading) {
        // Pour chaque pièce, sauvegarder ou mettre à jour
        state.rooms.forEach(async room => {
          try {
            await roomsStorage.saveRoom(room);
          } catch (error) {
            logger.error(`Erreur lors de la sauvegarde de la pièce ${room.id} dans IndexedDB`, error as Error, 'storage');
          }
        });
      }
    }
  }, [state.rooms, roomsStorage.isDbAvailable, roomsStorage.isLoading, roomsStorage.saveRoom, logger]);

  // Sauvegarder les propriétés du bien
  useEffect(() => {
    // Toujours sauvegarder dans localStorage (compatibilité)
    localStorage.setItem('property', JSON.stringify(state.property));
    
    // Si IndexedDB est disponible
    if (propertyStorage.isDbAvailable && !propertyStorage.isLoading) {
      propertyStorage.saveProperty(state.property)
        .catch(error => {
          logger.error("Erreur lors de la sauvegarde des propriétés dans IndexedDB", error as Error, 'storage');
        });
    }
  }, [state.property, propertyStorage.isDbAvailable, propertyStorage.isLoading, propertyStorage.saveProperty, logger]);
  
  // Sauvegarder les travaux
  useEffect(() => {
    if (state.travaux.length > 0) {
      logger.info("Sauvegarde des travaux:", 'storage', { count: state.travaux.length });
      
      // Toujours sauvegarder dans localStorage (compatibilité)
      localStorage.setItem('travaux', JSON.stringify(state.travaux));
      
      // Si IndexedDB est disponible
      if (travauxStorage.isDbAvailable && !travauxStorage.isLoading) {
        // Pour chaque travail, sauvegarder ou mettre à jour
        state.travaux.forEach(async travail => {
          try {
            await travauxStorage.saveTravail(travail);
          } catch (error) {
            logger.error(`Erreur lors de la sauvegarde du travail ${travail.id} dans IndexedDB`, error as Error, 'storage');
          }
        });
      }
    }
  }, [state.travaux, travauxStorage.isDbAvailable, travauxStorage.isLoading, travauxStorage.saveTravail, logger]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};
