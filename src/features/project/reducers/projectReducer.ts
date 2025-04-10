
import { ProjectState, ProjectAction, Room, Travail } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { generateRoomName } from '../utils/projectUtils';

// État initial pour le projet
export const initialProjectState: ProjectState = {
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

/**
 * Reducer pour gérer toutes les actions liées au projet
 */
export function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
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
      return initialProjectState;
    
    case 'LOAD_PROJECT':
      return action.payload;
    
    // L'action UPDATE_PROJECT_NAME est gérée par le provider, pas besoin de modifier l'état ici
    case 'UPDATE_PROJECT_NAME':
      return state;
    
    default:
      return state;
  }
}
