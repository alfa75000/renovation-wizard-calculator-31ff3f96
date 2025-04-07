
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { TypeAutreSurface } from '@/types';

// Interface pour l'état des types d'autres surfaces
interface AutresSurfacesState {
  types: TypeAutreSurface[];
}

// Actions pour le reducer
type AutresSurfacesAction =
  | { type: 'SET_TYPES'; payload: TypeAutreSurface[] }
  | { type: 'ADD_TYPE'; payload: TypeAutreSurface }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeAutreSurface } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'RESET_TYPES' };

// Données par défaut pour les types d'autres surfaces
const defaultTypes: TypeAutreSurface[] = [
  {
    id: uuidv4(),
    designation: 'cheminee',
    nom: 'Cheminée',
    description: 'Cheminée standard',
    surfaceImpacteeParDefaut: 'mur',
    estDeduction: true
  },
  {
    id: uuidv4(),
    designation: 'placard',
    nom: 'Placard',
    description: 'Placard intégré',
    surfaceImpacteeParDefaut: 'mur',
    estDeduction: true
  },
  {
    id: uuidv4(),
    designation: 'niche',
    nom: 'Niche murale',
    description: 'Niche aménagée dans le mur',
    surfaceImpacteeParDefaut: 'mur',
    estDeduction: false
  },
  {
    id: uuidv4(),
    designation: 'escalier',
    nom: 'Escalier',
    description: 'Escalier intérieur',
    surfaceImpacteeParDefaut: 'sol',
    estDeduction: true
  },
  {
    id: uuidv4(),
    designation: 'autre',
    nom: 'Autre surface',
    description: 'Surface personnalisée',
    surfaceImpacteeParDefaut: 'mur',
    estDeduction: false
  }
];

// État initial
const initialState: AutresSurfacesState = {
  types: []
};

// Reducer pour gérer les actions
const autresSurfacesReducer = (state: AutresSurfacesState, action: AutresSurfacesAction): AutresSurfacesState => {
  switch (action.type) {
    case 'SET_TYPES':
      return { ...state, types: action.payload };
    case 'ADD_TYPE':
      return { ...state, types: [...state.types, action.payload] };
    case 'UPDATE_TYPE':
      return {
        ...state,
        types: state.types.map(type => 
          type.id === action.payload.id 
            ? { ...action.payload.type, id: type.id } 
            : type
        )
      };
    case 'DELETE_TYPE':
      return { ...state, types: state.types.filter(type => type.id !== action.payload) };
    case 'RESET_TYPES':
      return { types: defaultTypes };
    default:
      return state;
  }
};

// Création du contexte
interface AutresSurfacesContextType {
  state: AutresSurfacesState;
  dispatch: React.Dispatch<AutresSurfacesAction>;
}

const AutresSurfacesContext = createContext<AutresSurfacesContextType>({
  state: initialState,
  dispatch: () => null,
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
export const AutresSurfacesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utiliser le hook useLocalStorageSync pour la persistance
  const [storedTypes, setStoredTypes, saveTypes, loadTypes] = useLocalStorageSync<TypeAutreSurface[]>(
    'autresSurfacesTypes', 
    defaultTypes,
    { syncOnMount: true, autoSave: false }
  );
  
  // Initialiser le reducer avec les données sauvegardées
  const [state, dispatch] = useReducer(autresSurfacesReducer, { types: storedTypes });
  
  // Sauvegarder les types quand ils changent
  useEffect(() => {
    setStoredTypes(state.types);
    saveTypes();
  }, [state.types, setStoredTypes, saveTypes]);
  
  // Vérifier si les types sont vides et les initialiser si nécessaire
  useEffect(() => {
    if (state.types.length === 0) {
      console.log("Initialisation des types d'autres surfaces avec les valeurs par défaut");
      dispatch({ type: 'SET_TYPES', payload: defaultTypes });
    }
  }, [state.types.length]);

  return (
    <AutresSurfacesContext.Provider value={{ state, dispatch }}>
      {children}
    </AutresSurfacesContext.Provider>
  );
};
