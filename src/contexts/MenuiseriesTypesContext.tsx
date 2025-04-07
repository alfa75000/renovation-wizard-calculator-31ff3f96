
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { TypeMenuiserie } from '@/types';

// Surfaces de référence pour les menuiseries
export const surfacesReference = [
  { id: 'sol', label: 'Impact au sol' },
  { id: 'mur', label: 'Impact au mur' },
  { id: 'plafond', label: 'Impact au plafond' },
  { id: 'aucun', label: 'Pas d\'impact' },
];

// Interface pour l'état des types de menuiseries
interface MenuiseriesTypesState {
  typesMenuiseries: TypeMenuiserie[];
}

// Actions pour le reducer
type MenuiseriesTypesAction =
  | { type: 'SET_TYPES'; payload: TypeMenuiserie[] }
  | { type: 'ADD_TYPE'; payload: TypeMenuiserie }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeMenuiserie } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'RESET_TYPES' };

// Données par défaut pour les types de menuiseries
const defaultTypes: TypeMenuiserie[] = [
  {
    id: uuidv4(),
    type: 'porte',
    nom: 'Porte standard',
    hauteur: 205,
    largeur: 83,
    description: 'Porte intérieure standard',
    surfaceReference: 'mur',
    impactePlinthe: true
  },
  {
    id: uuidv4(),
    type: 'fenetre',
    nom: 'Fenêtre standard',
    hauteur: 115,
    largeur: 100,
    description: 'Fenêtre classique',
    surfaceReference: 'mur',
    impactePlinthe: false
  },
  {
    id: uuidv4(),
    type: 'velux',
    nom: 'Velux standard',
    hauteur: 78,
    largeur: 98,
    description: 'Fenêtre de toit',
    surfaceReference: 'plafond',
    impactePlinthe: false
  }
];

// État initial
const initialState: MenuiseriesTypesState = {
  typesMenuiseries: []
};

// Reducer pour gérer les actions
const menuiseriesTypesReducer = (state: MenuiseriesTypesState, action: MenuiseriesTypesAction): MenuiseriesTypesState => {
  switch (action.type) {
    case 'SET_TYPES':
      return { ...state, typesMenuiseries: action.payload };
    case 'ADD_TYPE':
      return { ...state, typesMenuiseries: [...state.typesMenuiseries, action.payload] };
    case 'UPDATE_TYPE':
      return {
        ...state,
        typesMenuiseries: state.typesMenuiseries.map(type => 
          type.id === action.payload.id 
            ? { ...action.payload.type, id: type.id } 
            : type
        )
      };
    case 'DELETE_TYPE':
      return { ...state, typesMenuiseries: state.typesMenuiseries.filter(type => type.id !== action.payload) };
    case 'RESET_TYPES':
      return { typesMenuiseries: defaultTypes };
    default:
      return state;
  }
};

// Création du contexte
interface MenuiseriesTypesContextType {
  state: MenuiseriesTypesState;
  dispatch: React.Dispatch<MenuiseriesTypesAction>;
}

const MenuiseriesTypesContext = createContext<MenuiseriesTypesContextType>({
  state: initialState,
  dispatch: () => null,
});

// Hook personnalisé pour utiliser le contexte
export const useMenuiseriesTypes = () => {
  const context = useContext(MenuiseriesTypesContext);
  if (!context) {
    throw new Error("useMenuiseriesTypes doit être utilisé à l'intérieur d'un MenuiseriesTypesProvider");
  }
  return context;
};

// Provider du contexte
export const MenuiseriesTypesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utiliser le hook useLocalStorageSync pour la persistance
  const [storedTypes, setStoredTypes, saveTypes, loadTypes] = useLocalStorageSync<TypeMenuiserie[]>(
    'menuiseriesTypes', 
    defaultTypes,
    { syncOnMount: true, autoSave: false }
  );
  
  // Initialiser le reducer avec les données sauvegardées
  const [state, dispatch] = useReducer(menuiseriesTypesReducer, { typesMenuiseries: storedTypes });
  
  // Sauvegarder les types quand ils changent
  useEffect(() => {
    setStoredTypes(state.typesMenuiseries);
    saveTypes();
  }, [state.typesMenuiseries, setStoredTypes, saveTypes]);
  
  // Vérifier si les types sont vides et les initialiser si nécessaire
  useEffect(() => {
    if (state.typesMenuiseries.length === 0) {
      console.log("Initialisation des types de menuiseries avec les valeurs par défaut");
      dispatch({ type: 'SET_TYPES', payload: defaultTypes });
    }
  }, [state.typesMenuiseries.length]);

  return (
    <MenuiseriesTypesContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuiseriesTypesContext.Provider>
  );
};
