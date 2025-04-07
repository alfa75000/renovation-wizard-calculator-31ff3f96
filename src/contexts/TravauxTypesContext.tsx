import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TravauxTypesState, TravauxType, SousTypeTravauxItem, TypeTravauxItem, TravauxTypesAction } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

// Export de surfacesReference pour l'utilisation dans d'autres composants
export const surfacesReference = [
  { id: 'murs', label: 'Surface des murs' },
  { id: 'sol', label: 'Surface du sol' },
  { id: 'plafond', label: 'Surface du plafond' },
  { id: 'menuiseries', label: 'Surface des menuiseries' },
  { id: 'plinthes', label: 'Longueur des plinthes' },
  { id: 'perimetre', label: 'Périmètre de la pièce' }
];

// État initial
const initialState: TravauxTypesState = {
  types: [],
};

// Créer le contexte
const TravauxTypesContext = createContext<{
  state: TravauxTypesState;
  dispatch: React.Dispatch<TravauxTypesAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer pour gérer les actions
function travauxTypesReducer(state: TravauxTypesState, action: TravauxTypesAction): TravauxTypesState {
  switch (action.type) {
    case 'ADD_TYPE': {
      const newType = {
        ...action.payload,
        id: action.payload.id || uuidv4(),
        sousTypes: action.payload.sousTypes || [],
      };
      return {
        ...state,
        types: [...state.types, newType],
      };
    }
    
    case 'UPDATE_TYPE': {
      const { id, type } = action.payload;
      return {
        ...state,
        types: state.types.map((t) => (t.id === id ? { ...t, ...type } : t)),
      };
    }
    
    case 'DELETE_TYPE':
      return {
        ...state,
        types: state.types.filter((type) => type.id !== action.payload),
      };
    
    case 'ADD_SOUS_TYPE': {
      const { typeId, sousType } = action.payload;
      const newSousType = {
        ...sousType,
        id: sousType.id || uuidv4(),
        typeTravauxId: typeId,
      };
      
      return {
        ...state,
        types: state.types.map((type) =>
          type.id === typeId
            ? { ...type, sousTypes: [...type.sousTypes, newSousType] }
            : type
        ),
      };
    }
    
    case 'UPDATE_SOUS_TYPE': {
      const { typeId, id, sousType } = action.payload;
      return {
        ...state,
        types: state.types.map((type) =>
          type.id === typeId
            ? {
                ...type,
                sousTypes: type.sousTypes.map((st) =>
                  st.id === id ? { ...st, ...sousType } : st
                ),
              }
            : type
        ),
      };
    }
    
    case 'DELETE_SOUS_TYPE': {
      const { typeId, id } = action.payload;
      return {
        ...state,
        types: state.types.map((type) =>
          type.id === typeId
            ? {
                ...type,
                sousTypes: type.sousTypes.filter((st) => st.id !== id),
              }
            : type
        ),
      };
    }
    
    case 'LOAD_TYPES':
      return {
        ...state,
        types: action.payload,
      };
      
    case 'RESET_TYPES':
      return initialState;
    
    default:
      return state;
  }
}

// Provider component
export const TravauxTypesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedTypes, setSavedTypes] = useLocalStorage<TravauxType[]>('travauxTypes', []);
  
  // Initialiser le state avec les données sauvegardées
  const [state, dispatch] = useReducer(travauxTypesReducer, {
    types: savedTypes,
  });

  // Sauvegarder les changements dans localStorage
  useEffect(() => {
    setSavedTypes(state.types);
  }, [state.types, setSavedTypes]);

  return (
    <TravauxTypesContext.Provider value={{ state, dispatch }}>
      {children}
    </TravauxTypesContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useTravauxTypes = () => {
  const context = useContext(TravauxTypesContext);
  if (!context) {
    throw new Error('useTravauxTypes doit être utilisé à l\'intérieur d\'un TravauxTypesProvider');
  }
  return context;
};

// Exporter pour l'utilisation dans les autres fichiers
export type { TravauxType, SousTypeTravauxItem, TypeTravauxItem };
