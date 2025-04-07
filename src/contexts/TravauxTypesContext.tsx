import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { TravauxTypesState, TravauxType, SousTypeTravauxItem, TypeTravauxItem, TravauxTypesAction } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

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
  types: [],
};

// Créer le contexte
const TravauxTypesContext = createContext<{
  state: TravauxTypesState;
  dispatch: React.Dispatch<TravauxTypesAction>;
  loading: boolean;
}>({
  state: initialState,
  dispatch: () => null,
  loading: false,
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
  const [loading, setLoading] = useState(true);
  
  // Initialiser le state avec un état vide
  const [state, dispatch] = useReducer(travauxTypesReducer, initialState);

  // Charger les données depuis Supabase au démarrage
  useEffect(() => {
    const loadTravauxTypes = async () => {
      setLoading(true);
      try {
        console.log("Chargement des types de travaux depuis Supabase...");
        
        // Appel à Supabase pour récupérer les types de travaux
        // À implémenter quand la structure Supabase est prête
        // Pour l'instant, utiliser des données par défaut
        
        // TEMPORAIRE: Utiliser un état initial fixe en attendant la migration complète
        dispatch({ 
          type: 'LOAD_TYPES', 
          payload: [
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
                }
              ]
            }
          ] 
        });
      } catch (error) {
        console.error("Erreur lors du chargement des types de travaux:", error);
        toast.error("Erreur lors du chargement des types de travaux");
        
        // En cas d'erreur, utiliser un état vide
        dispatch({ type: 'LOAD_TYPES', payload: [] });
      } finally {
        setLoading(false);
      }
    };
    
    loadTravauxTypes();
  }, []);

  // Sauvegarder les changements dans Supabase
  // À implémenter quand la structure Supabase est prête
  useEffect(() => {
    // Cette fonction sera modifiée pour utiliser les API Supabase
    // Pour l'instant, elle ne fait rien
    if (state.types.length > 0) {
      console.log('Types de travaux modifiés, à synchroniser avec Supabase:', state.types);
      // TODO: Implémenter la sauvegarde dans Supabase
    }
  }, [state.types]);

  return (
    <TravauxTypesContext.Provider value={{ state, dispatch, loading }}>
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
