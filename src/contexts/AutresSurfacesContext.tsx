
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AutresSurfacesState, TypeAutreSurface } from '@/types';

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
  // Récupérer les données depuis localStorage au démarrage
  const [state, dispatch] = useReducer(autresSurfacesReducer, initialState, () => {
    try {
      const savedState = localStorage.getItem('typesAutresSurfaces');
      if (savedState) {
        return { typesAutresSurfaces: JSON.parse(savedState) };
      }

      // Si aucune donnée n'est trouvée, initialiser avec des exemples
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

      return { typesAutresSurfaces: defaultTypes };
    } catch (error) {
      console.error('Erreur lors du chargement des types de surfaces:', error);
      return initialState;
    }
  });

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('typesAutresSurfaces', JSON.stringify(state.typesAutresSurfaces));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des types de surfaces:', error);
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
