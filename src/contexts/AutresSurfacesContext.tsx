
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AutresSurfacesState, TypeAutreSurface, RoomCustomItem } from '@/types';

// Actions possibles
type AutresSurfacesAction =
  | { type: 'ADD_TYPE'; payload: TypeAutreSurface }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeAutreSurface } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'LOAD_TYPES'; payload: TypeAutreSurface[] }
  | { type: 'ADD_ITEM'; payload: RoomCustomItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; item: RoomCustomItem } }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'LOAD_ITEMS'; payload: RoomCustomItem[] };

// État initial
const initialState: AutresSurfacesState = {
  typesAutresSurfaces: [],
  roomCustomItems: []
};

// Créer le contexte
const AutresSurfacesContext = createContext<{
  state: AutresSurfacesState;
  dispatch: React.Dispatch<AutresSurfacesAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer pour gérer les actions
function autresSurfacesReducer(state: AutresSurfacesState, action: AutresSurfacesAction): AutresSurfacesState {
  switch (action.type) {
    case 'ADD_TYPE':
      return {
        ...state,
        typesAutresSurfaces: [...state.typesAutresSurfaces, action.payload],
      };
    
    case 'UPDATE_TYPE': {
      const { id, type } = action.payload;
      return {
        ...state,
        typesAutresSurfaces: state.typesAutresSurfaces.map((t) => (t.id === id ? type : t)),
      };
    }
    
    case 'DELETE_TYPE':
      return {
        ...state,
        typesAutresSurfaces: state.typesAutresSurfaces.filter((type) => type.id !== action.payload),
      };
    
    case 'LOAD_TYPES':
      return {
        ...state,
        typesAutresSurfaces: action.payload,
      };
    
    case 'ADD_ITEM':
      return {
        ...state,
        roomCustomItems: [...state.roomCustomItems, action.payload],
      };
    
    case 'UPDATE_ITEM': {
      const { id, item } = action.payload;
      return {
        ...state,
        roomCustomItems: state.roomCustomItems.map((i) => (i.id === id ? item : i)),
      };
    }
    
    case 'DELETE_ITEM':
      return {
        ...state,
        roomCustomItems: state.roomCustomItems.filter((item) => item.id !== action.payload),
      };
    
    case 'LOAD_ITEMS':
      return {
        ...state,
        roomCustomItems: action.payload,
      };
    
    default:
      return state;
  }
}

// Provider component
export const AutresSurfacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupérer les données depuis localStorage au démarrage
  const [state, dispatch] = useReducer(autresSurfacesReducer, initialState, () => {
    try {
      const savedTypesState = localStorage.getItem('typesAutresSurfaces');
      const savedItemsState = localStorage.getItem('roomCustomItems');
      
      const types = savedTypesState ? JSON.parse(savedTypesState) : [];
      const items = savedItemsState ? JSON.parse(savedItemsState) : [];
      
      // Si aucune donnée n'est trouvée, initialiser avec des exemples
      if (types.length === 0) {
        const defaultTypes: TypeAutreSurface[] = [
          {
            id: '1',
            nom: 'Niche murale',
            description: 'Niche décorative dans un mur',
            surfaceImpacteeParDefaut: 'mur',
            estDeduction: true,
          },
          {
            id: '2',
            nom: 'Cheminée',
            description: 'Cheminée avec habillage',
            surfaceImpacteeParDefaut: 'mur',
            estDeduction: false,
          },
          {
            id: '3',
            nom: 'Trappe d\'accès',
            description: 'Trappe d\'accès aux combles ou vide sanitaire',
            surfaceImpacteeParDefaut: 'plafond',
            estDeduction: true,
          },
          {
            id: '4',
            nom: 'Surface non traitée',
            description: 'Surface à exclure du calcul',
            surfaceImpacteeParDefaut: 'sol',
            estDeduction: true,
          },
        ];
        return { typesAutresSurfaces: defaultTypes, roomCustomItems: [] };
      }

      return { typesAutresSurfaces: types, roomCustomItems: items };
    } catch (error) {
      console.error('Erreur lors du chargement des types de surfaces:', error);
      return initialState;
    }
  });

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('typesAutresSurfaces', JSON.stringify(state.typesAutresSurfaces));
      localStorage.setItem('roomCustomItems', JSON.stringify(state.roomCustomItems));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des données des surfaces:', error);
    }
  }, [state]);

  return (
    <AutresSurfacesContext.Provider value={{ state, dispatch }}>
      {children}
    </AutresSurfacesContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAutresSurfaces = () => {
  const context = useContext(AutresSurfacesContext);
  if (!context) {
    throw new Error('useAutresSurfaces doit être utilisé à l\'intérieur d\'un AutresSurfacesProvider');
  }
  return context;
};
