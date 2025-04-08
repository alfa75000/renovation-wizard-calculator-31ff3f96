
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MenuiseriesTypesState, TypeMenuiserie, MenuiseriesTypesAction } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { SurfaceImpactee } from '@/types/supabase';

// Surface Reference constante correcte (adaptée aux types Supabase)
export const surfacesReference = [
  { id: 'Mur', label: 'Murs' },
  { id: 'Plafond', label: 'Plafond' },
  { id: 'Sol', label: 'Sol' },
  { id: 'Aucune', label: 'Aucune (quantité directe)' }
];

// État initial
const initialState: MenuiseriesTypesState = {
  typesMenuiseries: [],
};

// Créer le contexte
const MenuiseriesTypesContext = createContext<{
  state: MenuiseriesTypesState;
  dispatch: React.Dispatch<MenuiseriesTypesAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer pour gérer les actions
function menuiseriesTypesReducer(state: MenuiseriesTypesState, action: MenuiseriesTypesAction): MenuiseriesTypesState {
  switch (action.type) {
    case 'ADD_TYPE': {
      const newType = {
        ...action.payload,
        id: action.payload.id || uuidv4(),
      };
      return {
        ...state,
        typesMenuiseries: [...state.typesMenuiseries, newType],
      };
    }
    
    case 'UPDATE_TYPE': {
      const { id, type } = action.payload;
      return {
        ...state,
        typesMenuiseries: state.typesMenuiseries.map((t) => (t.id === id ? { ...t, ...type } : t)),
      };
    }
    
    case 'DELETE_TYPE':
      return {
        ...state,
        typesMenuiseries: state.typesMenuiseries.filter((type) => type.id !== action.payload),
      };
    
    case 'LOAD_TYPES':
      return {
        ...state,
        typesMenuiseries: action.payload,
      };
      
    case 'RESET_TYPES':
      return initialState;
    
    default:
      return state;
  }
}

// Provider component
export const MenuiseriesTypesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedTypes, setSavedTypes] = useLocalStorage<TypeMenuiserie[]>('menuiseriesTypes', []);
  
  // Initialiser le state avec les données sauvegardées
  const [state, dispatch] = useReducer(menuiseriesTypesReducer, {
    typesMenuiseries: savedTypes,
  });

  // Sauvegarder les changements dans localStorage
  useEffect(() => {
    setSavedTypes(state.typesMenuiseries);
  }, [state.typesMenuiseries, setSavedTypes]);

  return (
    <MenuiseriesTypesContext.Provider value={{ state, dispatch }}>
      {children}
    </MenuiseriesTypesContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useMenuiseriesTypes = () => {
  const context = useContext(MenuiseriesTypesContext);
  if (!context) {
    throw new Error('useMenuiseriesTypes doit être utilisé à l\'intérieur d\'un MenuiseriesTypesProvider');
  }
  return context;
};

// Exporter les types et références pour l'utilisation dans d'autres fichiers
export { surfacesReference };
export type { TypeMenuiserie };
