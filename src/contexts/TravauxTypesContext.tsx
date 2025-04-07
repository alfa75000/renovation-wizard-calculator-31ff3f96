
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { TypeTravauxItem, SousTypeTravauxItem } from '@/types';

// Surface de référence pour les types de travaux
export const surfacesReference = [
  { id: 'sol', label: 'Surface du sol' },
  { id: 'mur', label: 'Surface des murs' },
  { id: 'plafond', label: 'Surface du plafond' },
  { id: 'plinthe', label: 'Linéaire de plinthe' },
  { id: 'menuiseries', label: 'Surface des menuiseries' },
  { id: 'autre', label: 'Autre surface' },
  { id: 'aucune', label: 'Aucune référence (saisie manuelle)' },
];

// Interface pour l'état des types de travaux
interface TravauxTypesState {
  types: TypeTravauxItem[];
}

// Actions pour le reducer
type TravauxTypesAction =
  | { type: 'SET_TYPES'; payload: TypeTravauxItem[] }
  | { type: 'ADD_TYPE'; payload: TypeTravauxItem }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeTravauxItem } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'ADD_SOUS_TYPE'; payload: { typeId: string; sousType: SousTypeTravauxItem } }
  | { type: 'UPDATE_SOUS_TYPE'; payload: { typeId: string; id: string; sousType: SousTypeTravauxItem } }
  | { type: 'DELETE_SOUS_TYPE'; payload: { typeId: string; id: string } }
  | { type: 'RESET_TYPES' };

// Données par défaut pour les types de travaux
const defaultTypes: TypeTravauxItem[] = [
  {
    id: uuidv4(),
    label: 'Peinture',
    icon: 'Paintbrush',
    sousTypes: [
      {
        id: uuidv4(),
        label: 'Peinture murs',
        unite: 'm²',
        prixUnitaire: '15.00',
        prixFournitures: '5.00',
        prixMainOeuvre: '10.00',
        tauxTVA: '10',
        surfaceReference: 'mur',
      },
      {
        id: uuidv4(),
        label: 'Peinture plafond',
        unite: 'm²',
        prixUnitaire: '16.00',
        prixFournitures: '6.00',
        prixMainOeuvre: '10.00',
        tauxTVA: '10',
        surfaceReference: 'plafond',
      }
    ]
  },
  {
    id: uuidv4(),
    label: 'Revêtement sol',
    icon: 'SquarePen',
    sousTypes: [
      {
        id: uuidv4(),
        label: 'Pose parquet',
        unite: 'm²',
        prixUnitaire: '45.00',
        prixFournitures: '35.00',
        prixMainOeuvre: '10.00',
        tauxTVA: '10',
        surfaceReference: 'sol',
      },
      {
        id: uuidv4(),
        label: 'Pose carrelage',
        unite: 'm²',
        prixUnitaire: '55.00',
        prixFournitures: '40.00',
        prixMainOeuvre: '15.00',
        tauxTVA: '10',
        surfaceReference: 'sol',
      }
    ]
  },
  {
    id: uuidv4(),
    label: 'Plomberie',
    icon: 'Wrench',
    sousTypes: [
      {
        id: uuidv4(),
        label: 'Installation lavabo',
        unite: 'u',
        prixUnitaire: '250.00',
        prixFournitures: '180.00',
        prixMainOeuvre: '70.00',
        tauxTVA: '10',
        surfaceReference: 'aucune',
      }
    ]
  }
];

// État initial
const initialState: TravauxTypesState = {
  types: []
};

// Reducer pour gérer les actions
const travauxTypesReducer = (state: TravauxTypesState, action: TravauxTypesAction): TravauxTypesState => {
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
    case 'ADD_SOUS_TYPE': {
      const { typeId, sousType } = action.payload;
      return {
        ...state,
        types: state.types.map(type => 
          type.id === typeId 
            ? { ...type, sousTypes: [...type.sousTypes, sousType] } 
            : type
        )
      };
    }
    case 'UPDATE_SOUS_TYPE': {
      const { typeId, id, sousType } = action.payload;
      return {
        ...state,
        types: state.types.map(type => 
          type.id === typeId 
            ? { 
                ...type, 
                sousTypes: type.sousTypes.map(st => 
                  st.id === id ? { ...sousType, id } : st
                ) 
              } 
            : type
        )
      };
    }
    case 'DELETE_SOUS_TYPE': {
      const { typeId, id } = action.payload;
      return {
        ...state,
        types: state.types.map(type => 
          type.id === typeId 
            ? { ...type, sousTypes: type.sousTypes.filter(st => st.id !== id) } 
            : type
        )
      };
    }
    case 'RESET_TYPES':
      return { types: defaultTypes };
    default:
      return state;
  }
};

// Création du contexte
interface TravauxTypesContextType {
  state: TravauxTypesState;
  dispatch: React.Dispatch<TravauxTypesAction>;
}

const TravauxTypesContext = createContext<TravauxTypesContextType>({
  state: initialState,
  dispatch: () => null,
});

// Hook personnalisé pour utiliser le contexte
export const useTravauxTypes = () => {
  const context = useContext(TravauxTypesContext);
  if (!context) {
    throw new Error("useTravauxTypes doit être utilisé à l'intérieur d'un TravauxTypesProvider");
  }
  return context;
};

// Provider du contexte
export const TravauxTypesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utiliser le hook useLocalStorageSync pour la persistance
  const [storedTypes, setStoredTypes, saveTypes, loadTypes] = useLocalStorageSync<TypeTravauxItem[]>(
    'travauxTypes', 
    defaultTypes,
    { syncOnMount: true, autoSave: false }
  );
  
  // Initialiser le reducer avec les données sauvegardées
  const [state, dispatch] = useReducer(travauxTypesReducer, { types: storedTypes });
  
  // Sauvegarder les types quand ils changent
  useEffect(() => {
    setStoredTypes(state.types);
    saveTypes();
  }, [state.types, setStoredTypes, saveTypes]);
  
  // Vérifier si les types sont vides et les initialiser si nécessaire
  useEffect(() => {
    if (state.types.length === 0) {
      console.log("Initialisation des types de travaux avec les valeurs par défaut");
      dispatch({ type: 'SET_TYPES', payload: defaultTypes });
    }
  }, [state.types.length]);

  return (
    <TravauxTypesContext.Provider value={{ state, dispatch }}>
      {children}
    </TravauxTypesContext.Provider>
  );
};
