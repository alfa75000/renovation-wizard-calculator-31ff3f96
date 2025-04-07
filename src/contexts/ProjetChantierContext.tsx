
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ProjetChantierState, ProjetChantier, ProjetChantierAction } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useProject } from './ProjectContext';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';

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
}>({
  state: initialState,
  dispatch: () => null,
  sauvegarderProjet: () => null,
  chargerProjet: () => null,
  genererNomFichier: () => '',
  nouveauProjet: () => null,
});

// Reducer pour gérer les actions
function projetChantierReducer(state: ProjetChantierState, action: ProjetChantierAction): ProjetChantierState {
  switch (action.type) {
    case 'ADD_PROJET': {
      const newProjet = {
        ...action.payload,
        id: action.payload.id || uuidv4(),
      };
      return {
        ...state,
        projets: [...state.projets, newProjet],
      };
    }
    
    case 'UPDATE_PROJET': {
      const { id, projet } = action.payload;
      return {
        ...state,
        projets: state.projets.map((p) => (p.id === id ? { ...p, ...projet } : p)),
        projetActif: state.projetActif?.id === id ? { ...state.projetActif, ...projet } : state.projetActif,
      };
    }
    
    case 'DELETE_PROJET':
      return {
        ...state,
        projets: state.projets.filter((projet) => projet.id !== action.payload),
        projetActif: state.projetActif?.id === action.payload ? null : state.projetActif,
      };
      
    case 'SET_PROJET_ACTIF': {
      const projetId = action.payload;
      const projetActif = projetId ? state.projets.find(p => p.id === projetId) || null : null;
      return {
        ...state,
        projetActif,
      };
    }
    
    case 'LOAD_PROJETS':
      return {
        ...state,
        projets: action.payload,
      };
      
    case 'RESET_PROJETS':
      return initialState;
    
    default:
      return state;
  }
}

// Provider component
export const ProjetChantierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedProjets, setSavedProjets] = useLocalStorage<ProjetChantier[]>('projetsChantier', []);
  const { state: projectState } = useProject();
  
  // Initialiser le state avec les données sauvegardées
  const [state, dispatch] = useReducer(projetChantierReducer, {
    projets: savedProjets,
    projetActif: null,
  });

  // Sauvegarder les changements dans localStorage
  useEffect(() => {
    setSavedProjets(state.projets);
  }, [state.projets, setSavedProjets]);

  // Fonction pour sauvegarder ou mettre à jour un projet
  const sauvegarderProjet = (projetData: Partial<ProjetChantier>) => {
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
            projectData: projectState,
          },
        },
      });
    } else {
      // Création d'un nouveau projet
      dispatch({
        type: 'ADD_PROJET',
        payload: {
          id: uuidv4(),
          nom: projetData.nomProjet || 'Nouveau projet',
          adresse: projetData.adresse || '',
          codePostal: '',
          ville: '',
          clientId: projetData.clientId || '',
          dateDebut: format(new Date(), 'yyyy-MM-dd'),
          dateFin: '',
          description: projetData.description || '',
          statut: 'en_attente',
          montantTotal: 0,
          ...projetData,
          dateModification,
          projectData: projectState,
        },
      });
    }
  };

  // Fonction pour charger un projet existant
  const chargerProjet = (projetId: string) => {
    dispatch({
      type: 'SET_PROJET_ACTIF',
      payload: projetId,
    });
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
    dispatch({
      type: 'SET_PROJET_ACTIF',
      payload: null,
    });
  };

  return (
    <ProjetChantierContext.Provider value={{ 
      state, 
      dispatch, 
      sauvegarderProjet, 
      chargerProjet, 
      genererNomFichier,
      nouveauProjet,
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
