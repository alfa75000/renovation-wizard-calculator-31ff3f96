
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TypeAutreSurface } from '@/types';

// Interface pour définir l'état du contexte
interface AutresSurfacesState {
  typesAutresSurfaces: TypeAutreSurface[];
}

// Actions possibles pour le reducer
type AutresSurfacesAction =
  | { type: 'SET_TYPES'; payload: TypeAutreSurface[] }
  | { type: 'ADD_TYPE'; payload: TypeAutreSurface }
  | { type: 'UPDATE_TYPE'; payload: TypeAutreSurface }
  | { type: 'DELETE_TYPE'; payload: string };

// État initial avec quelques types prédéfinis
const initialState: AutresSurfacesState = {
  typesAutresSurfaces: [
    {
      id: '1',
      nom: 'Poteau',
      description: 'Poteau porteur ou décoratif',
      surfaceImpacteeParDefaut: 'mur',
      estDeduction: false
    },
    {
      id: '2',
      nom: 'Trémie',
      description: 'Ouverture dans une dalle',
      surfaceImpacteeParDefaut: 'sol',
      estDeduction: true
    },
    {
      id: '3',
      nom: 'Niche',
      description: 'Niche murale',
      surfaceImpacteeParDefaut: 'mur',
      estDeduction: true
    },
    {
      id: '4',
      nom: 'Poutre apparente',
      description: 'Poutre visible au plafond',
      surfaceImpacteeParDefaut: 'plafond',
      estDeduction: false
    },
    {
      id: '5',
      nom: 'Autre Surface',
      description: 'Surface personnalisée',
      surfaceImpacteeParDefaut: 'mur',
      estDeduction: false
    }
  ]
};

// Fonction reducer pour gérer les modifications d'état
const autresSurfacesReducer = (state: AutresSurfacesState, action: AutresSurfacesAction): AutresSurfacesState => {
  switch (action.type) {
    case 'SET_TYPES':
      return { ...state, typesAutresSurfaces: action.payload };
    case 'ADD_TYPE':
      return { ...state, typesAutresSurfaces: [...state.typesAutresSurfaces, action.payload] };
    case 'UPDATE_TYPE':
      return {
        ...state,
        typesAutresSurfaces: state.typesAutresSurfaces.map(type =>
          type.id === action.payload.id ? action.payload : type
        )
      };
    case 'DELETE_TYPE':
      return {
        ...state,
        typesAutresSurfaces: state.typesAutresSurfaces.filter(type => type.id !== action.payload)
      };
    default:
      return state;
  }
};

// Création du contexte
const AutresSurfacesContext = createContext<{
  state: AutresSurfacesState;
  dispatch: React.Dispatch<AutresSurfacesAction>;
}>({
  state: initialState,
  dispatch: () => null
});

// Hook personnalisé pour utiliser le contexte
export const useAutresSurfaces = () => {
  const context = useContext(AutresSurfacesContext);
  if (!context) {
    throw new Error("useAutresSurfaces doit être utilisé à l'intérieur d'un AutresSurfacesProvider");
  }
  return context;
};

// Provider du contexte
export const AutresSurfacesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(autresSurfacesReducer, initialState);

  // Forcer la réinitialisation au montage
  useEffect(() => {
    console.log("Réinitialisation forcée des types d'autres surfaces");
    localStorage.removeItem('typesAutresSurfaces');
  }, []);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedTypes = localStorage.getItem('typesAutresSurfaces');
        if (savedTypes) {
          const parsedTypes = JSON.parse(savedTypes);
          if (Array.isArray(parsedTypes) && parsedTypes.length > 0) {
            console.log("Chargement des types d'autres surfaces depuis localStorage:", parsedTypes);
            dispatch({ type: 'SET_TYPES', payload: parsedTypes });
          } else {
            console.log("Aucun type d'autre surface trouvé dans localStorage");
            // Utiliser les types par défaut
            localStorage.setItem('typesAutresSurfaces', JSON.stringify(initialState.typesAutresSurfaces));
            dispatch({ type: 'SET_TYPES', payload: initialState.typesAutresSurfaces });
          }
        } else {
          console.log("Aucun type d'autre surface trouvé dans localStorage, initialisation avec les valeurs par défaut");
          localStorage.setItem('typesAutresSurfaces', JSON.stringify(initialState.typesAutresSurfaces));
          dispatch({ type: 'SET_TYPES', payload: initialState.typesAutresSurfaces });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        localStorage.setItem('typesAutresSurfaces', JSON.stringify(initialState.typesAutresSurfaces));
        dispatch({ type: 'SET_TYPES', payload: initialState.typesAutresSurfaces });
      }
    };

    loadSavedData();
  }, []);

  // Sauvegarder les données dans localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem('typesAutresSurfaces', JSON.stringify(state.typesAutresSurfaces));
  }, [state.typesAutresSurfaces]);

  return (
    <AutresSurfacesContext.Provider value={{ state, dispatch }}>
      {children}
    </AutresSurfacesContext.Provider>
  );
};
