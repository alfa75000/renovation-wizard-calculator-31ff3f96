
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types pour les catégories et sous-catégories de travaux
interface SousTypeTravauxItem {
  id: string;
  label: string;
  prixUnitaire: number;
  unite: string;
  description?: string;
}

interface TypeTravauxItem {
  id: string;
  label: string;
  icon: string;
  sousTypes: SousTypeTravauxItem[];
}

// État global pour les types de travaux
interface TravauxTypesState {
  types: TypeTravauxItem[];
}

// Actions possibles pour le reducer
type TravauxTypesAction =
  | { type: 'SET_TYPES'; payload: TypeTravauxItem[] }
  | { type: 'ADD_TYPE'; payload: TypeTravauxItem }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: Partial<TypeTravauxItem> } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'ADD_SOUS_TYPE'; payload: { typeId: string; sousType: SousTypeTravauxItem } }
  | { type: 'UPDATE_SOUS_TYPE'; payload: { typeId: string; id: string; sousType: Partial<SousTypeTravauxItem> } }
  | { type: 'DELETE_SOUS_TYPE'; payload: { typeId: string; id: string } }
  | { type: 'RESET_TYPES' };

// Données initiales par défaut
const defaultTypes: TypeTravauxItem[] = [
  {
    id: "murs",
    label: "Revêtement murs",
    icon: "Paintbrush",
    sousTypes: [
      { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.2, unite: "M²" },
      { id: "lessivage-soigne", label: "Lessivage soigné en conservation", prixUnitaire: 3.5, unite: "M²" },
      { id: "grattage", label: "Grattage, ouverture des fissures", prixUnitaire: 5, unite: "M²" },
      { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 20, unite: "M²" },
      { id: "enduit-repassage", label: "Enduit repassé, ponçage", prixUnitaire: 25, unite: "M²" },
      { id: "toile-renfort", label: "Toile de renfort anti-fissures", prixUnitaire: 15, unite: "M²" },
      { id: "bande-calicot", label: "Bande Calicot anti-fissure", prixUnitaire: 10, unite: "Ml" },
      { id: "toile-verre", label: "Toile de verre à peindre", prixUnitaire: 18, unite: "M²" },
      { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 30, unite: "M²" },
      { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 35, unite: "M²" },
      { id: "vernis", label: "Vernis", prixUnitaire: 40, unite: "M²" },
      { id: "enduit-decoratif", label: "Enduit décoratif", prixUnitaire: 45, unite: "M²" },
      { id: "papier-peint", label: "Papier peint", prixUnitaire: 22, unite: "M²" },
      { id: "faience", label: "Faïence / Carrelage", prixUnitaire: 80, unite: "M²" },
      { id: "lambris", label: "Lambris", prixUnitaire: 60, unite: "M²" },
      { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
    ]
  },
  {
    id: "plafond",
    label: "Revêtement plafond",
    icon: "Paintbrush",
    sousTypes: [
      { id: "lessivage-travaux", label: "Lessivage pour travaux", prixUnitaire: 2.5, unite: "M²" },
      { id: "rebouchage", label: "Rebouchage, ponçage", prixUnitaire: 22, unite: "M²" },
      { id: "peinture-acrylique", label: "Peinture type acrylique", prixUnitaire: 32, unite: "M²" },
      { id: "peinture-glycero", label: "Peinture type glycéro", prixUnitaire: 38, unite: "M²" },
      { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
    ]
  },
  {
    id: "sol",
    label: "Revêtement sol",
    icon: "Wrench",
    sousTypes: [
      { id: "depose-ancien", label: "Dépose ancien revêtement", prixUnitaire: 15, unite: "M²" },
      { id: "preparation", label: "Préparation support", prixUnitaire: 25, unite: "M²" },
      { id: "carrelage", label: "Carrelage", prixUnitaire: 90, unite: "M²" },
      { id: "parquet", label: "Parquet", prixUnitaire: 85, unite: "M²" },
      { id: "stratifie", label: "Stratifié", prixUnitaire: 65, unite: "M²" },
      { id: "moquette", label: "Moquette", prixUnitaire: 45, unite: "M²" },
      { id: "linoleum", label: "Linoléum", prixUnitaire: 40, unite: "M²" },
      { id: "beton-cire", label: "Béton ciré", prixUnitaire: 120, unite: "M²" },
      { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
    ]
  },
  {
    id: "menuiseries",
    label: "Menuiseries",
    icon: "Hammer",
    sousTypes: [
      { id: "depose-porte", label: "Dépose porte", prixUnitaire: 50, unite: "Ens." },
      { id: "depose-fenetre", label: "Dépose fenêtre", prixUnitaire: 70, unite: "Ens." },
      { id: "pose-porte", label: "Pose porte", prixUnitaire: 180, unite: "Ens." },
      { id: "pose-porte-fenetre", label: "Pose porte-fenêtre", prixUnitaire: 280, unite: "Ens." },
      { id: "pose-fenetre", label: "Pose fenêtre", prixUnitaire: 250, unite: "Ens." },
      { id: "peinture-menuiserie", label: "Peinture menuiserie", prixUnitaire: 45, unite: "M²" },
      { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
    ]
  },
  {
    id: "electricite",
    label: "Electricité",
    icon: "SquarePen",
    sousTypes: [
      { id: "interrupteur", label: "Pose interrupteur", prixUnitaire: 40, unite: "Unité" },
      { id: "prise", label: "Pose prise", prixUnitaire: 45, unite: "Unité" },
      { id: "luminaire", label: "Pose luminaire", prixUnitaire: 70, unite: "Unité" },
      { id: "tableau", label: "Tableau électrique", prixUnitaire: 350, unite: "Unité" },
      { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
    ]
  },
  {
    id: "plomberie",
    label: "Plomberie",
    icon: "SquarePen",
    sousTypes: [
      { id: "evacuation", label: "Évacuation", prixUnitaire: 120, unite: "Ml" },
      { id: "alimentation", label: "Alimentation", prixUnitaire: 140, unite: "Ml" },
      { id: "sanitaire", label: "Sanitaire", prixUnitaire: 180, unite: "Unité" },
      { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Unité" }
    ]
  },
  {
    id: "platrerie",
    label: "Plâtrerie",
    icon: "SquarePen",
    sousTypes: [
      { id: "cloison", label: "Cloison placo", prixUnitaire: 85, unite: "M²" },
      { id: "doublage", label: "Doublage", prixUnitaire: 75, unite: "M²" },
      { id: "faux-plafond", label: "Faux plafond", prixUnitaire: 90, unite: "M²" },
      { id: "autre", label: "Autre", prixUnitaire: 0, unite: "M²" }
    ]
  },
  {
    id: "maconnerie",
    label: "Maçonnerie",
    icon: "SquarePen",
    sousTypes: [
      { id: "ouverture", label: "Création ouverture", prixUnitaire: 450, unite: "Forfait" },
      { id: "demolition", label: "Démolition", prixUnitaire: 250, unite: "M3" },
      { id: "autre", label: "Autre", prixUnitaire: 0, unite: "Forfait" }
    ]
  },
  {
    id: "autre",
    label: "Autre",
    icon: "Wrench",
    sousTypes: [
      { id: "autre", label: "Personnalisé", prixUnitaire: 0, unite: "Unité" }
    ]
  }
];

// État initial
const initialState: TravauxTypesState = {
  types: []
};

// Fonction reducer pour gérer les modifications d'état
const travauxTypesReducer = (
  state: TravauxTypesState,
  action: TravauxTypesAction
): TravauxTypesState => {
  switch (action.type) {
    case 'SET_TYPES':
      return {
        ...state,
        types: action.payload
      };
    case 'ADD_TYPE':
      return {
        ...state,
        types: [...state.types, action.payload]
      };
    case 'UPDATE_TYPE':
      return {
        ...state,
        types: state.types.map(type =>
          type.id === action.payload.id
            ? { ...type, ...action.payload.type }
            : type
        )
      };
    case 'DELETE_TYPE':
      return {
        ...state,
        types: state.types.filter(type => type.id !== action.payload)
      };
    case 'ADD_SOUS_TYPE':
      return {
        ...state,
        types: state.types.map(type =>
          type.id === action.payload.typeId
            ? {
                ...type,
                sousTypes: [...type.sousTypes, action.payload.sousType]
              }
            : type
        )
      };
    case 'UPDATE_SOUS_TYPE':
      return {
        ...state,
        types: state.types.map(type =>
          type.id === action.payload.typeId
            ? {
                ...type,
                sousTypes: type.sousTypes.map(sousType =>
                  sousType.id === action.payload.id
                    ? { ...sousType, ...action.payload.sousType }
                    : sousType
                )
              }
            : type
        )
      };
    case 'DELETE_SOUS_TYPE':
      return {
        ...state,
        types: state.types.map(type =>
          type.id === action.payload.typeId
            ? {
                ...type,
                sousTypes: type.sousTypes.filter(
                  sousType => sousType.id !== action.payload.id
                )
              }
            : type
        )
      };
    case 'RESET_TYPES':
      localStorage.removeItem('travauxTypes');
      return {
        ...initialState,
        types: defaultTypes
      };
    default:
      return state;
  }
};

// Création du contexte
const TravauxTypesContext = createContext<{
  state: TravauxTypesState;
  dispatch: React.Dispatch<TravauxTypesAction>;
}>({
  state: initialState,
  dispatch: () => null
});

// Hook personnalisé pour utiliser le contexte
export const useTravauxTypes = () => {
  const context = useContext(TravauxTypesContext);
  if (!context) {
    throw new Error(
      "useTravauxTypes doit être utilisé à l'intérieur d'un TravauxTypesProvider"
    );
  }
  return context;
};

// Provider du contexte
export const TravauxTypesProvider: React.FC<{ children: ReactNode }> = ({
  children
}) => {
  const [state, dispatch] = useReducer(travauxTypesReducer, initialState);

  // Chargement initial des données depuis localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTypes = localStorage.getItem('travauxTypes');
        
        if (savedTypes) {
          dispatch({ type: 'SET_TYPES', payload: JSON.parse(savedTypes) });
        } else {
          // Si aucune donnée n'est trouvée, utilisez les données par défaut
          dispatch({ type: 'SET_TYPES', payload: defaultTypes });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des types de travaux:', error);
        dispatch({ type: 'SET_TYPES', payload: defaultTypes });
      }
    };

    loadData();
  }, []);

  // Sauvegarde des données dans localStorage quand elles changent
  useEffect(() => {
    if (state.types.length > 0) {
      localStorage.setItem('travauxTypes', JSON.stringify(state.types));
    }
  }, [state.types]);

  return (
    <TravauxTypesContext.Provider value={{ state, dispatch }}>
      {children}
    </TravauxTypesContext.Provider>
  );
};

// Exporter les types pour réutilisation
export type { TypeTravauxItem, SousTypeTravauxItem };
