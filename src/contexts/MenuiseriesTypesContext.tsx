
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { MenuiseriesTypesState, TypeMenuiserie } from '@/types';

// Actions possibles
type MenuiseriesTypesAction =
  | { type: 'ADD_TYPE'; payload: TypeMenuiserie }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeMenuiserie } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'LOAD_TYPES'; payload: TypeMenuiserie[] };

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
    case 'ADD_TYPE':
      return {
        ...state,
        typesMenuiseries: [...state.typesMenuiseries, action.payload],
      };
    
    case 'UPDATE_TYPE': {
      const { id, type } = action.payload;
      return {
        ...state,
        typesMenuiseries: state.typesMenuiseries.map((t) => (t.id === id ? type : t)),
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
    
    default:
      return state;
  }
}

// Provider component
export const MenuiseriesTypesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupérer les données depuis localStorage au démarrage
  const [state, dispatch] = useReducer(menuiseriesTypesReducer, initialState, () => {
    try {
      const savedState = localStorage.getItem('typesMenuiseries');
      if (savedState) {
        return { typesMenuiseries: JSON.parse(savedState) };
      }

      // Si aucune donnée n'est trouvée, initialiser avec des exemples
      const defaultTypes: TypeMenuiserie[] = [
        {
          id: '1',
          nom: 'Fenêtre standard',
          description: 'Fenêtre standard double vitrage',
          hauteur: 120,
          largeur: 100,
          surfaceReference: 1.2,
          impactePlinthe: false,
        },
        {
          id: '2',
          nom: 'Porte intérieure',
          description: 'Porte intérieure standard',
          hauteur: 210,
          largeur: 90,
          surfaceReference: 1.9,
          impactePlinthe: true,
        },
        {
          id: '3',
          nom: 'Porte-fenêtre',
          description: 'Porte-fenêtre double vitrage',
          hauteur: 220,
          largeur: 140,
          surfaceReference: 3.1,
          impactePlinthe: true,
        },
        {
          id: '4',
          nom: 'Velux',
          description: 'Fenêtre de toit',
          hauteur: 78,
          largeur: 98,
          surfaceReference: 0.76,
          impactePlinthe: false,
        },
      ];

      return { typesMenuiseries: defaultTypes };
    } catch (error) {
      console.error('Erreur lors du chargement des types de menuiseries:', error);
      return initialState;
    }
  });

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('typesMenuiseries', JSON.stringify(state.typesMenuiseries));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des types de menuiseries:', error);
    }
  }, [state]);

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
