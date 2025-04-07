
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { useProject } from './ProjectContext';
import { ProjetChantier } from '@/types';

// Interface pour l'état des projets
interface ProjetChantierState {
  projets: ProjetChantier[];
  projetActif: ProjetChantier | null;
}

// Actions pour le reducer
type ProjetChantierAction =
  | { type: 'SET_PROJETS'; payload: ProjetChantier[] }
  | { type: 'ADD_PROJET'; payload: ProjetChantier }
  | { type: 'UPDATE_PROJET'; payload: ProjetChantier }
  | { type: 'DELETE_PROJET'; payload: string }
  | { type: 'SET_PROJET_ACTIF'; payload: ProjetChantier | null }
  | { type: 'RESET_PROJETS' };

// État initial
const initialState: ProjetChantierState = {
  projets: [],
  projetActif: null
};

// Reducer pour gérer les actions
const projetChantierReducer = (state: ProjetChantierState, action: ProjetChantierAction): ProjetChantierState => {
  switch (action.type) {
    case 'SET_PROJETS':
      return { ...state, projets: action.payload };
    case 'ADD_PROJET': {
      // Vérifier si le projet existe déjà
      const existingIndex = state.projets.findIndex(p => p.id === action.payload.id);
      
      if (existingIndex >= 0) {
        // Mettre à jour le projet existant
        return {
          ...state,
          projets: state.projets.map(p => 
            p.id === action.payload.id ? action.payload : p
          ),
          projetActif: action.payload
        };
      } else {
        // Ajouter un nouveau projet
        return {
          ...state,
          projets: [...state.projets, action.payload],
          projetActif: action.payload
        };
      }
    }
    case 'UPDATE_PROJET':
      return {
        ...state,
        projets: state.projets.map(projet => 
          projet.id === action.payload.id ? action.payload : projet
        ),
        projetActif: state.projetActif?.id === action.payload.id 
          ? action.payload 
          : state.projetActif
      };
    case 'DELETE_PROJET':
      return {
        ...state,
        projets: state.projets.filter(projet => projet.id !== action.payload),
        projetActif: state.projetActif?.id === action.payload 
          ? null 
          : state.projetActif
      };
    case 'SET_PROJET_ACTIF':
      return { ...state, projetActif: action.payload };
    case 'RESET_PROJETS':
      return initialState;
    default:
      return state;
  }
};

// Interface pour le contexte
interface ProjetChantierContextType {
  state: ProjetChantierState;
  dispatch: React.Dispatch<ProjetChantierAction>;
  sauvegarderProjet: (projetData: Partial<ProjetChantier>) => void;
  chargerProjet: (projetId: string) => void;
  nouveauProjet: () => void;
  genererNomFichier: (projet: Partial<ProjetChantier>, nomClient: string) => string;
}

// Création du contexte
const ProjetChantierContext = createContext<ProjetChantierContextType>({
  state: initialState,
  dispatch: () => null,
  sauvegarderProjet: () => {},
  chargerProjet: () => {},
  nouveauProjet: () => {},
  genererNomFichier: () => ''
});

// Hook personnalisé pour utiliser le contexte
export const useProjetChantier = () => {
  const context = useContext(ProjetChantierContext);
  if (!context) {
    throw new Error("useProjetChantier doit être utilisé à l'intérieur d'un ProjetChantierProvider");
  }
  return context;
};

// Provider du contexte
export const ProjetChantierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Accéder au contexte du projet pour les données de pièces et travaux
  const { state: projectState, dispatch: projectDispatch } = useProject();
  
  // Utiliser le hook useLocalStorageSync pour la persistance
  const [storedProjets, setStoredProjets, saveProjets, loadProjets] = useLocalStorageSync<ProjetChantier[]>(
    'projetsChantier', 
    [],
    { syncOnMount: true, autoSave: false }
  );
  
  // Initialiser le reducer avec les données sauvegardées
  const [state, dispatch] = useReducer(projetChantierReducer, { 
    projets: storedProjets,
    projetActif: null
  });
  
  // Sauvegarder les projets quand ils changent
  useEffect(() => {
    setStoredProjets(state.projets);
    saveProjets();
  }, [state.projets, setStoredProjets, saveProjets]);
  
  // Sauvegarder un projet avec les données du projet actuel
  const sauvegarderProjet = (projetData: Partial<ProjetChantier>) => {
    const now = new Date();
    const currentDate = format(now, 'yyyy-MM-dd HH:mm:ss');
    
    // Récupérer l'ID du projet s'il existe déjà, sinon en créer un nouveau
    const projetId = state.projetActif?.id || uuidv4();
    
    // Créer ou mettre à jour le projet
    const projet: ProjetChantier = {
      id: projetId,
      clientId: projetData.clientId || state.projetActif?.clientId || '',
      nomProjet: projetData.nomProjet || state.projetActif?.nomProjet || '',
      descriptionProjet: projetData.descriptionProjet || state.projetActif?.descriptionProjet || '',
      adresseChantier: projetData.adresseChantier || state.projetActif?.adresseChantier || '',
      occupant: projetData.occupant || state.projetActif?.occupant || '',
      infoComplementaire: projetData.infoComplementaire || state.projetActif?.infoComplementaire || '',
      dateCreation: state.projetActif?.dateCreation || currentDate,
      dateModification: currentDate,
      projectData: {
        rooms: projectState.rooms,
        property: projectState.property,
        travaux: projectState.travaux
      }
    };
    
    // Envoyer l'action pour ajouter ou mettre à jour le projet
    dispatch({ type: 'ADD_PROJET', payload: projet });
  };
  
  // Charger un projet et ses données
  const chargerProjet = (projetId: string) => {
    // Trouver le projet par son ID
    const projet = state.projets.find(p => p.id === projetId);
    
    if (projet && projet.projectData) {
      // Définir le projet comme actif
      dispatch({ type: 'SET_PROJET_ACTIF', payload: projet });
      
      // Charger les données du projet dans le contexte Project
      projectDispatch({ type: 'SET_ROOMS', payload: projet.projectData.rooms });
      projectDispatch({ type: 'SET_PROPERTY', payload: projet.projectData.property });
      projectDispatch({ type: 'SET_TRAVAUX', payload: projet.projectData.travaux });
    }
  };
  
  // Créer un nouveau projet vide
  const nouveauProjet = () => {
    // Réinitialiser le projet actif
    dispatch({ type: 'SET_PROJET_ACTIF', payload: null });
    
    // Réinitialiser les données du projet
    projectDispatch({ type: 'RESET_PROJECT' });
  };
  
  // Générer un nom de fichier pour le projet
  const genererNomFichier = (projet: Partial<ProjetChantier>, nomClient: string): string => {
    const date = format(new Date(), 'yyyyMMdd', { locale: fr });
    const nomProjet = (projet.nomProjet || '').replace(/[^a-zA-Z0-9]/g, '_');
    const adresseSimplifiee = (projet.adresseChantier || '')
      .split(',')[0]
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 20);
    
    return `devis_${date}_${nomClient}_${nomProjet}_${adresseSimplifiee}`.replace(/_{2,}/g, '_');
  };

  return (
    <ProjetChantierContext.Provider 
      value={{ 
        state, 
        dispatch, 
        sauvegarderProjet, 
        chargerProjet, 
        nouveauProjet, 
        genererNomFichier 
      }}
    >
      {children}
    </ProjetChantierContext.Provider>
  );
};
