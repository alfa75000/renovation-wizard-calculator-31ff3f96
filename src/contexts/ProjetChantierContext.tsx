
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProjetChantierState, ProjetChantier } from '@/types';

// Actions possibles
type ProjetChantierAction =
  | { type: 'ADD_PROJET'; payload: ProjetChantier }
  | { type: 'UPDATE_PROJET'; payload: { id: string; projet: ProjetChantier } }
  | { type: 'DELETE_PROJET'; payload: string }
  | { type: 'LOAD_PROJETS'; payload: ProjetChantier[] };

// État initial
const initialState: ProjetChantierState = {
  projets: [],
};

// Créer le contexte
const ProjetChantierContext = createContext<{
  state: ProjetChantierState;
  dispatch: React.Dispatch<ProjetChantierAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer pour gérer les actions
function projetChantierReducer(state: ProjetChantierState, action: ProjetChantierAction): ProjetChantierState {
  switch (action.type) {
    case 'ADD_PROJET':
      return {
        ...state,
        projets: [...state.projets, action.payload],
      };
    
    case 'UPDATE_PROJET': {
      const { id, projet } = action.payload;
      return {
        ...state,
        projets: state.projets.map((p) => (p.id === id ? projet : p)),
      };
    }
    
    case 'DELETE_PROJET':
      return {
        ...state,
        projets: state.projets.filter((projet) => projet.id !== action.payload),
      };
    
    case 'LOAD_PROJETS':
      return {
        ...state,
        projets: action.payload,
      };
    
    default:
      return state;
  }
}

// Provider component
export const ProjetChantierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupérer les données depuis localStorage au démarrage
  const [state, dispatch] = useReducer(projetChantierReducer, initialState, () => {
    try {
      const savedState = localStorage.getItem('projetChantier');
      if (savedState) {
        return { projets: JSON.parse(savedState) };
      }
      return initialState;
    } catch (error) {
      console.error('Erreur lors du chargement des projets de chantier:', error);
      return initialState;
    }
  });

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('projetChantier', JSON.stringify(state.projets));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des projets de chantier:', error);
    }
  }, [state]);

  return (
    <ProjetChantierContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjetChantierContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useProjetChantier = () => {
  const context = useContext(ProjetChantierContext);
  if (!context) {
    throw new Error('useProjetChantier doit être utilisé à l\'intérieur d\'un ProjetChantierProvider');
  }
  return context;
};
