
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { TravauxTypesState, TravauxType, TypeTravauxItem, SousTypeTravauxItem } from '@/types';

// Actions possibles
type TravauxTypesAction =
  | { type: 'ADD_TYPE'; payload: TravauxType }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TravauxType } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'ADD_SOUS_TYPE'; payload: { typeId: string; sousType: SousTypeTravauxItem } }
  | { type: 'UPDATE_SOUS_TYPE'; payload: { id: string; typeId: string; sousType: SousTypeTravauxItem } }
  | { type: 'DELETE_SOUS_TYPE'; payload: { typeId: string; sousTypeId: string } }
  | { type: 'LOAD_TYPES'; payload: TravauxType[] };

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
    case 'ADD_TYPE':
      return {
        ...state,
        types: [...state.types, action.payload],
      };
    
    case 'UPDATE_TYPE': {
      const { id, type } = action.payload;
      return {
        ...state,
        types: state.types.map((t) => (t.id === id ? type : t)),
      };
    }
    
    case 'DELETE_TYPE':
      return {
        ...state,
        types: state.types.filter((type) => type.id !== action.payload),
      };
    
    case 'ADD_SOUS_TYPE': {
      const { typeId, sousType } = action.payload;
      return {
        ...state,
        types: state.types.map((type) => {
          if (type.id === typeId) {
            return {
              ...type,
              sousTypes: [...type.sousTypes, sousType],
            };
          }
          return type;
        }),
      };
    }
    
    case 'UPDATE_SOUS_TYPE': {
      const { id, typeId, sousType } = action.payload;
      return {
        ...state,
        types: state.types.map((type) => {
          if (type.id === typeId) {
            return {
              ...type,
              sousTypes: type.sousTypes.map((st) => (st.id === id ? sousType : st)),
            };
          }
          return type;
        }),
      };
    }
    
    case 'DELETE_SOUS_TYPE': {
      const { typeId, sousTypeId } = action.payload;
      return {
        ...state,
        types: state.types.map((type) => {
          if (type.id === typeId) {
            return {
              ...type,
              sousTypes: type.sousTypes.filter((st) => st.id !== sousTypeId),
            };
          }
          return type;
        }),
      };
    }
    
    case 'LOAD_TYPES':
      return {
        ...state,
        types: action.payload,
      };
    
    default:
      return state;
  }
}

// Provider component
export const TravauxTypesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupérer les données depuis localStorage au démarrage
  const [state, dispatch] = useReducer(travauxTypesReducer, initialState, () => {
    try {
      const savedState = localStorage.getItem('travauxTypes');
      if (savedState) {
        return { types: JSON.parse(savedState) };
      }

      // Si aucune donnée n'est trouvée, initialiser avec des exemples
      const defaultTypes: TravauxType[] = [
        {
          id: '1',
          nom: 'Peinture',
          description: 'Travaux de peinture intérieure',
          sousTypes: [
            {
              id: '1-1',
              typeTravauxId: '1',
              nom: 'Peinture murs',
              description: 'Peinture acrylique standard pour murs',
              uniteParDefaut: 'm²',
              prixFournituresUnitaire: 5.5,
              prixMainOeuvreUnitaire: 15,
              tempsMoyenMinutes: 15,
              tauxTVA: 10,
            },
            {
              id: '1-2',
              typeTravauxId: '1',
              nom: 'Peinture plafond',
              description: 'Peinture acrylique standard pour plafond',
              uniteParDefaut: 'm²',
              prixFournituresUnitaire: 6.5,
              prixMainOeuvreUnitaire: 18,
              tempsMoyenMinutes: 20,
              tauxTVA: 10,
            },
          ],
        },
        {
          id: '2',
          nom: 'Revêtement de sol',
          description: 'Pose de différents types de sols',
          sousTypes: [
            {
              id: '2-1',
              typeTravauxId: '2',
              nom: 'Parquet stratifié',
              description: 'Pose de parquet stratifié avec sous-couche',
              uniteParDefaut: 'm²',
              prixFournituresUnitaire: 22,
              prixMainOeuvreUnitaire: 25,
              tempsMoyenMinutes: 30,
              tauxTVA: 10,
            },
            {
              id: '2-2',
              typeTravauxId: '2',
              nom: 'Carrelage',
              description: 'Pose de carrelage au sol avec colle et joints',
              uniteParDefaut: 'm²',
              prixFournituresUnitaire: 28,
              prixMainOeuvreUnitaire: 35,
              tempsMoyenMinutes: 45,
              tauxTVA: 10,
            },
          ],
        },
      ];

      return { types: defaultTypes };
    } catch (error) {
      console.error('Erreur lors du chargement des types de travaux:', error);
      return initialState;
    }
  });

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('travauxTypes', JSON.stringify(state.types));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des types de travaux:', error);
    }
  }, [state]);

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
