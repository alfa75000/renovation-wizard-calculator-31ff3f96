
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AutresSurfacesState, TypeAutreSurface } from '@/types';
import { getAutresSurfacesTypes } from '@/services/autresSurfacesService';

// Actions possibles
type AutresSurfacesAction =
  | { type: 'ADD_TYPE'; payload: TypeAutreSurface }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeAutreSurface } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'LOAD_TYPES'; payload: TypeAutreSurface[] };

// État initial
const initialState: AutresSurfacesState = {
  typesAutresSurfaces: [],
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
    
    default:
      return state;
  }
}

// Provider component
export const AutresSurfacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(autresSurfacesReducer, initialState);

  // Charger les types d'autres surfaces depuis Supabase au démarrage
  useEffect(() => {
    const loadTypesFromSupabase = async () => {
      try {
        const types = await getAutresSurfacesTypes();
        dispatch({ type: 'LOAD_TYPES', payload: types });
      } catch (error) {
        console.error('Erreur lors du chargement des types depuis Supabase:', error);
      }
    };

    loadTypesFromSupabase();
  }, []);

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
