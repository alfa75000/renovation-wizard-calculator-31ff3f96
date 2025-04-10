
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProjetChantierState, ProjetChantier, ProjetChantierAction } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useProject } from './ProjectContext';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { toast } from 'sonner';

// État initial
const initialState: ProjetChantierState = {
  projets: [],
  projetActif: null,
};

// Créer le contexte
const ProjetChantierContext = createContext<{
  state: ProjetChantierState;
  dispatch: React.Dispatch<ProjetChantierAction>;
  sauvegarderProjet: (projetData: Partial<ProjetChantier>) => void;
  chargerProjet: (projetId: string) => void;
  genererNomFichier: (projet: Partial<ProjetChantier>, nomClient?: string) => string;
  nouveauProjet: () => void;
  hasUnsavedChanges: boolean;
}>({
  state: initialState,
  dispatch: () => null,
  sauvegarderProjet: () => null,
  chargerProjet: () => null,
  genererNomFichier: () => '',
  nouveauProjet: () => null,
  hasUnsavedChanges: false,
});

// Reducer pour gérer les actions
function projetChantierReducer(state: ProjetChantierState, action: ProjetChantierAction): ProjetChantierState {
  try {
    switch (action.type) {
      case 'ADD_PROJET': {
        const newProjet = {
          ...action.payload,
          id: action.payload.id || uuidv4(),
        };
        return {
          ...state,
          projets: Array.isArray(state.projets) ? [...state.projets, newProjet] : [newProjet],
        };
      }
      
      case 'UPDATE_PROJET': {
        const { id, projet } = action.payload;
        // Vérifier que projets est un tableau
        if (!Array.isArray(state.projets)) {
          console.error('state.projets n\'est pas un tableau:', state.projets);
          return {
            ...state,
            projets: []
          };
        }
        return {
          ...state,
          projets: state.projets.map((p) => (p.id === id ? { ...p, ...projet } : p)),
          projetActif: state.projetActif?.id === id ? { ...state.projetActif, ...projet } : state.projetActif,
        };
      }
      
      case 'DELETE_PROJET': {
        // Vérifier que projets est un tableau
        if (!Array.isArray(state.projets)) {
          console.error('state.projets n\'est pas un tableau:', state.projets);
          return {
            ...state,
            projets: []
          };
        }
        return {
          ...state,
          projets: state.projets.filter((projet) => projet.id !== action.payload),
          projetActif: state.projetActif?.id === action.payload ? null : state.projetActif,
        };
      }
        
      case 'SET_PROJET_ACTIF': {
        const projetId = action.payload;
        // Vérifier que projets est un tableau
        if (!Array.isArray(state.projets)) {
          console.error('state.projets n\'est pas un tableau:', state.projets);
          return {
            ...state,
            projets: [],
            projetActif: null
          };
        }
        const projetActif = projetId ? state.projets.find(p => p.id === projetId) || null : null;
        return {
          ...state,
          projetActif,
        };
      }
      
      case 'LOAD_PROJETS':
        // Vérifier que la charge utile est un tableau
        if (!Array.isArray(action.payload)) {
          console.error('LOAD_PROJETS: action.payload n\'est pas un tableau:', action.payload);
          return {
            ...state,
            projets: []
          };
        }
        return {
          ...state,
          projets: action.payload,
        };
        
      case 'RESET_PROJETS':
        return initialState;
      
      default:
        return state;
    }
  } catch (error) {
    console.error('Erreur dans projetChantierReducer:', error);
    return {
      ...state,
      projets: Array.isArray(state.projets) ? state.projets : []
    };
  }
}

// Provider component
export const ProjetChantierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedProjets, setSavedProjets] = useLocalStorage<ProjetChantier[]>('projetsChantier', []);
  const { state: projectState, hasUnsavedChanges: projectUnsavedChanges } = useProject();
  const [hasInternalChanges, setHasInternalChanges] = React.useState(false);
  
  // Initialiser le state avec les données sauvegardées
  const [state, dispatch] = useReducer(projetChantierReducer, {
    projets: Array.isArray(savedProjets) ? savedProjets : [],
    projetActif: null,
  });

  // Sauvegarder les changements dans localStorage
  useEffect(() => {
    if (Array.isArray(state.projets)) {
      console.log("Sauvegarde des projets:", state.projets.length);
      setSavedProjets(state.projets);
      
      // Réinitialiser le flag de modifications
      setHasInternalChanges(false);
    } else {
      console.error("state.projets n'est pas un tableau lors de la sauvegarde:", state.projets);
      setSavedProjets([]);
    }
  }, [state.projets, setSavedProjets]);

  // Fonction pour sauvegarder ou mettre à jour un projet
  const sauvegarderProjet = (projetData: Partial<ProjetChantier>) => {
    try {
      const dateModification = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      
      if (state.projetActif) {
        // Mise à jour du projet existant
        dispatch({
          type: 'UPDATE_PROJET',
          payload: {
            id: state.projetActif.id,
            projet: {
              ...state.projetActif,
              ...projetData,
              dateModification,
              projectData: JSON.parse(JSON.stringify(projectState)),
            },
          },
        });
        setHasInternalChanges(false);
        toast.success("Projet mis à jour", {
          description: "Le projet a été mis à jour avec succès",
          duration: 3000,
        });
      } else {
        // Création d'un nouveau projet
        const newProjet: ProjetChantier = {
          id: uuidv4(),
          nom: projetData.nomProjet || 'Nouveau projet',
          adresse: projetData.adresse || '',
          codePostal: projetData.codePostal || '',
          ville: projetData.ville || '',
          clientId: projetData.clientId || '',
          dateDebut: format(new Date(), 'yyyy-MM-dd'),
          dateFin: '',
          description: projetData.description || '',
          statut: 'en_attente' as const, // Forcer le type
          montantTotal: 0,
          dateModification,
          projectData: JSON.parse(JSON.stringify(projectState)),
          ...projetData,
        };
        
        dispatch({
          type: 'ADD_PROJET',
          payload: newProjet,
        });
        setHasInternalChanges(false);
        toast.success("Projet créé", {
          description: "Le nouveau projet a été créé avec succès",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du projet:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de la sauvegarde du projet",
      });
    }
  };

  // Fonction pour charger un projet existant
  const chargerProjet = (projetId: string) => {
    try {
      dispatch({
        type: 'SET_PROJET_ACTIF',
        payload: projetId,
      });
      setHasInternalChanges(true);
    } catch (error) {
      console.error("Erreur lors du chargement du projet:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors du chargement du projet",
      });
    }
  };

  // Fonction pour générer un nom de fichier
  const genererNomFichier = (projet: Partial<ProjetChantier>, nomClient?: string) => {
    const date = format(new Date(), 'yyyyMMdd');
    const nomProjet = projet.nomProjet || 'nouveau-projet';
    const client = nomClient || 'client';
    
    return `Devis_${date}_${client}_${nomProjet}`.replace(/\s+/g, '_');
  };

  // Fonction pour initialiser un nouveau projet
  const nouveauProjet = () => {
    try {
      dispatch({
        type: 'SET_PROJET_ACTIF',
        payload: null,
      });
      setHasInternalChanges(false);
    } catch (error) {
      console.error("Erreur lors de l'initialisation d'un nouveau projet:", error);
      toast.error("Erreur", {
        description: "Une erreur est survenue lors de l'initialisation d'un nouveau projet",
      });
    }
  };

  // Détecter les modifications non enregistrées
  const hasUnsavedChanges = projectUnsavedChanges || hasInternalChanges;

  return (
    <ProjetChantierContext.Provider value={{ 
      state, 
      dispatch, 
      sauvegarderProjet, 
      chargerProjet, 
      genererNomFichier,
      nouveauProjet,
      hasUnsavedChanges,
    }}>
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
