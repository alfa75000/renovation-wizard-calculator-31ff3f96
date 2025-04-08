
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { MenuiseriesTypesState, MenuiseriesTypesAction } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { SurfaceImpactee, MenuiserieType } from '@/types/supabase';
import { 
  fetchMenuiserieTypes, 
  createMenuiserieType, 
  updateMenuiserieType, 
  deleteMenuiserieType 
} from '@/services/menuiseriesService';
import { toast } from 'sonner';

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
  isLoading: boolean;
  refreshTypes: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  isLoading: false,
  refreshTypes: async () => {},
});

// Fonction pour adapter les données du format Supabase au format interne
const mapSupabaseTypeToLocal = (menuiserieType: MenuiserieType) => {
  return {
    id: menuiserieType.id,
    nom: menuiserieType.name,
    description: menuiserieType.description || '',
    hauteur: menuiserieType.hauteur,
    largeur: menuiserieType.largeur,
    surfaceReference: menuiserieType.surface_impactee,
    impactePlinthe: menuiserieType.impacte_plinthe,
  };
};

// Fonction pour adapter les données du format interne au format Supabase
const mapLocalTypeToSupabase = (type: any) => {
  return {
    name: type.nom,
    hauteur: type.hauteur,
    largeur: type.largeur,
    surface_impactee: type.surfaceReference as SurfaceImpactee,
    impacte_plinthe: !!type.impactePlinthe,
    description: type.description || '',
  };
};

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
  const [state, dispatch] = useReducer(menuiseriesTypesReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fonction pour charger les types depuis Supabase
  const refreshTypes = async () => {
    try {
      setIsLoading(true);
      const typesFromSupabase = await fetchMenuiserieTypes();
      
      // Convertir les types du format Supabase au format local
      const localTypes = typesFromSupabase.map(mapSupabaseTypeToLocal);
      
      dispatch({ type: 'LOAD_TYPES', payload: localTypes });
    } catch (error) {
      console.error('Erreur lors du chargement des types de menuiseries:', error);
      toast.error('Impossible de charger les types de menuiseries');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Charger les types au démarrage
  useEffect(() => {
    refreshTypes();
  }, []);

  // Intercepter les actions pour effectuer des appels API
  const enhancedDispatch = async (action: MenuiseriesTypesAction) => {
    try {
      // Exécuter l'action immédiatement pour le state local
      dispatch(action);
      
      // Effectuer l'appel API correspondant
      switch (action.type) {
        case 'ADD_TYPE': {
          const supabaseData = mapLocalTypeToSupabase(action.payload);
          const result = await createMenuiserieType(supabaseData);
          if (!result) {
            throw new Error('Erreur lors de la création du type de menuiserie');
          }
          break;
        }
        
        case 'UPDATE_TYPE': {
          const { id, type } = action.payload;
          const supabaseData = mapLocalTypeToSupabase(type);
          const result = await updateMenuiserieType(id, supabaseData);
          if (!result) {
            throw new Error('Erreur lors de la mise à jour du type de menuiserie');
          }
          break;
        }
        
        case 'DELETE_TYPE': {
          const success = await deleteMenuiserieType(action.payload);
          if (!success) {
            throw new Error('Erreur lors de la suppression du type de menuiserie');
          }
          break;
        }
        
        // Pas besoin de traiter LOAD_TYPES et RESET_TYPES ici
        default:
          break;
      }
    } catch (error) {
      console.error('Erreur lors de la synchronisation avec Supabase:', error);
      // Recharger les types pour maintenir la cohérence
      refreshTypes();
    }
  };

  return (
    <MenuiseriesTypesContext.Provider value={{ 
      state, 
      dispatch: enhancedDispatch as React.Dispatch<MenuiseriesTypesAction>,
      isLoading,
      refreshTypes
    }}>
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

// Exporter les types uniquement, pas la référence à nouveau
export type { TypeMenuiserie } from '@/types';
