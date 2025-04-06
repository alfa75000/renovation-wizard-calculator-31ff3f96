
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { TypeMenuiserie } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const surfacesReference = [
  { id: 'SurfaceNetteSol', label: 'Surface Nette Sol' },
  { id: 'SurfaceNettePlafond', label: 'Surface Nette Plafond' },
  { id: 'SurfaceNetteMurs', label: 'Surface Nette Murs' },
  { id: 'LineaireNet', label: 'Linéaire Net (mètres)' },
];

interface MenuiseriesTypesState {
  typesMenuiseries: TypeMenuiserie[];
}

type MenuiseriesTypesAction =
  | { type: 'SET_TYPES'; payload: TypeMenuiserie[] }
  | { type: 'ADD_TYPE'; payload: TypeMenuiserie }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeMenuiserie } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'RESET_TYPES' };

// État initial avec quelques exemples de types de menuiseries
const initialTypes: TypeMenuiserie[] = [
  {
    id: uuidv4(),
    nom: 'Fenêtre standard',
    hauteur: 120,
    largeur: 80,
    surfaceReference: 'SurfaceNetteMurs',
    impactePlinthe: false,
    description: 'Fenêtre standard pour salon ou chambre'
  },
  {
    id: uuidv4(),
    nom: 'Porte intérieure',
    hauteur: 210,
    largeur: 83,
    surfaceReference: 'SurfaceNetteMurs',
    impactePlinthe: true,
    description: 'Porte intérieure standard'
  },
  {
    id: uuidv4(),
    nom: 'Fenêtre de toit',
    hauteur: 90,
    largeur: 60,
    surfaceReference: 'SurfaceNettePlafond',
    impactePlinthe: false,
    description: 'Fenêtre pour toit en pente'
  }
];

const initialState: MenuiseriesTypesState = {
  typesMenuiseries: initialTypes
};

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
          type.id === action.payload.id ? action.payload.type : type
        )
      };
    case 'DELETE_TYPE':
      return {
        ...state,
        typesMenuiseries: state.typesMenuiseries.filter(type => type.id !== action.payload)
      };
    case 'RESET_TYPES':
      localStorage.removeItem('typesMenuiseries');
      return { ...initialState };
    default:
      return state;
  }
};

const MenuiseriesTypesContext = createContext<{
  state: MenuiseriesTypesState;
  dispatch: React.Dispatch<MenuiseriesTypesAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useMenuiseriesTypes = () => {
  const context = useContext(MenuiseriesTypesContext);
  if (!context) {
    throw new Error("useMenuiseriesTypes doit être utilisé à l'intérieur d'un MenuiseriesTypesProvider");
  }
  return context;
};

export const MenuiseriesTypesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(menuiseriesTypesReducer, initialState);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedTypes = localStorage.getItem('typesMenuiseries');
    if (savedTypes) {
      try {
        const parsedTypes = JSON.parse(savedTypes);
        if (Array.isArray(parsedTypes) && parsedTypes.length > 0) {
          dispatch({ type: 'SET_TYPES', payload: parsedTypes });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des types de menuiseries:", error);
      }
    }
  }, []);

  // Sauvegarder les données dans localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem('typesMenuiseries', JSON.stringify(state.typesMenuiseries));
  }, [state.typesMenuiseries]);

  return (
    <MenuiseriesTypesContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuiseriesTypesContext.Provider>
  );
};
