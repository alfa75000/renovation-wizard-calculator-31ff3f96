
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

// État initial avec quelques types de travaux prédéfinis
const initialState: TravauxTypesState = {
  types: [
    {
      id: "peinture",
      nom: "Peinture",
      label: "Peinture",
      description: "Travaux de peinture",
      icon: "paintbrush",
      sousTypes: [
        {
          id: "peinture-murs",
          typeTravauxId: "peinture",
          nom: "Peinture des murs",
          label: "Peinture des murs",
          description: "Application de peinture sur les murs",
          uniteParDefaut: "m²",
          unite: "m²",
          prixFournitures: 5,
          prixFournituresUnitaire: 5,
          prixMainOeuvre: 15,
          prixMainOeuvreUnitaire: 15,
          prixUnitaire: 20,
          tempsMoyenMinutes: 30,
          tauxTVA: 10,
          surfaceReference: "murs"
        },
        {
          id: "peinture-plafond",
          typeTravauxId: "peinture",
          nom: "Peinture du plafond",
          label: "Peinture du plafond",
          description: "Application de peinture sur le plafond",
          uniteParDefaut: "m²",
          unite: "m²",
          prixFournitures: 5,
          prixFournituresUnitaire: 5,
          prixMainOeuvre: 20,
          prixMainOeuvreUnitaire: 20,
          prixUnitaire: 25,
          tempsMoyenMinutes: 40,
          tauxTVA: 10,
          surfaceReference: "plafond"
        }
      ]
    },
    {
      id: "sol",
      nom: "Revêtement de sol",
      label: "Revêtement de sol",
      description: "Installation de revêtements de sol",
      icon: "layout",
      sousTypes: [
        {
          id: "parquet",
          typeTravauxId: "sol",
          nom: "Pose de parquet",
          label: "Pose de parquet",
          description: "Installation de parquet",
          uniteParDefaut: "m²",
          unite: "m²",
          prixFournitures: 25,
          prixFournituresUnitaire: 25,
          prixMainOeuvre: 20,
          prixMainOeuvreUnitaire: 20,
          prixUnitaire: 45,
          tempsMoyenMinutes: 60,
          tauxTVA: 10,
          surfaceReference: "sol"
        }
      ]
    }
  ],
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
      console.log('ADD_TYPE:', action.payload);
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
      console.log('UPDATE_TYPE:', action.payload);
      const { id, type } = action.payload;
      return {
        ...state,
        types: state.types.map((t) => (t.id === id ? { ...t, ...type } : t)),
      };
    }
    
    case 'DELETE_TYPE': {
      console.log('DELETE_TYPE:', action.payload);
      return {
        ...state,
        types: state.types.filter((type) => type.id !== action.payload),
      };
    }
    
    case 'ADD_SOUS_TYPE': {
      console.log('ADD_SOUS_TYPE:', action.payload);
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
      console.log('UPDATE_SOUS_TYPE:', action.payload);
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
      console.log('DELETE_SOUS_TYPE:', action.payload);
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
    
    case 'LOAD_TYPES': {
      console.log('LOAD_TYPES:', action.payload);
      return {
        ...state,
        types: action.payload,
      };
    }
      
    case 'RESET_TYPES': {
      console.log('RESET_TYPES');
      return initialState;
    }
    
    default:
      return state;
  }
}

// Provider component
export const TravauxTypesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedTypes, setSavedTypes] = useLocalStorage<TravauxType[]>('travauxTypes', initialState.types);
  
  // Initialiser le state avec les données sauvegardées
  const [state, dispatch] = useReducer(travauxTypesReducer, {
    types: savedTypes.length > 0 ? savedTypes : initialState.types,
  });

  // Sauvegarder les changements dans localStorage
  useEffect(() => {
    console.log('Sauvegarde des types de travaux:', state.types);
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
