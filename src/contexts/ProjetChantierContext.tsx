
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjetChantier } from '@/types';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { useProject } from './ProjectContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Interface pour l'état du contexte
interface ProjetChantierState {
  projets: ProjetChantier[];
  projetActif: ProjetChantier | null;
}

// État initial
const initialState: ProjetChantierState = {
  projets: [],
  projetActif: null
};

// Types d'actions
type ProjetChantierAction =
  | { type: 'SET_PROJETS'; payload: ProjetChantier[] }
  | { type: 'ADD_PROJET'; payload: ProjetChantier }
  | { type: 'UPDATE_PROJET'; payload: ProjetChantier }
  | { type: 'DELETE_PROJET'; payload: string }
  | { type: 'SET_PROJET_ACTIF'; payload: ProjetChantier | null };

// Réducteur
const projetChantierReducer = (
  state: ProjetChantierState,
  action: ProjetChantierAction
): ProjetChantierState => {
  switch (action.type) {
    case 'SET_PROJETS':
      return { ...state, projets: action.payload };
    case 'ADD_PROJET':
      return {
        ...state,
        projets: [...state.projets, action.payload],
        projetActif: action.payload
      };
    case 'UPDATE_PROJET':
      return {
        ...state,
        projets: state.projets.map(projet =>
          projet.id === action.payload.id ? action.payload : projet
        ),
        projetActif: action.payload
      };
    case 'DELETE_PROJET':
      return {
        ...state,
        projets: state.projets.filter(projet => projet.id !== action.payload),
        projetActif: state.projetActif?.id === action.payload ? null : state.projetActif
      };
    case 'SET_PROJET_ACTIF':
      return { ...state, projetActif: action.payload };
    default:
      return state;
  }
};

// Création du contexte
interface ProjetChantierContextType {
  state: ProjetChantierState;
  dispatch: React.Dispatch<ProjetChantierAction>;
  sauvegarderProjet: (projetData: Omit<ProjetChantier, 'id' | 'dateCreation' | 'dateModification'>) => void;
  chargerProjet: (projetId: string) => void;
  genererNomFichier: (projet: Partial<ProjetChantier>, nomClient: string) => string;
  nouveauProjet: () => void;
}

const ProjetChantierContext = createContext<ProjetChantierContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useProjetChantier = () => {
  const context = useContext(ProjetChantierContext);
  if (context === undefined) {
    throw new Error('useProjetChantier doit être utilisé à l\'intérieur d\'un ProjetChantierProvider');
  }
  return context;
};

// Provider
interface ProjetChantierProviderProps {
  children: ReactNode;
}

export const ProjetChantierProvider: React.FC<ProjetChantierProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(projetChantierReducer, initialState);
  const { loadFromLocalStorage, saveToLocalStorage } = useLocalStorageSync<ProjetChantierState>('projetsChantier', state);
  const { state: projectState, dispatch: projectDispatch } = useProject();

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      dispatch({ type: 'SET_PROJETS', payload: savedData.projets });
      // Si un projet actif était sauvegardé, le restaurer
      if (savedData.projetActif) {
        dispatch({ type: 'SET_PROJET_ACTIF', payload: savedData.projetActif });
      }
    }
  }, []);

  // Fonction pour générer un nom de fichier
  const genererNomFichier = (projet: Partial<ProjetChantier>, nomClient: string): string => {
    const datePart = format(new Date(), 'MMyy', { locale: fr });
    const intitule = projet.nomProjet?.substring(0, 20) || '';
    const adresse = projet.adresseChantier?.substring(0, 20) || '';
    
    return `${nomClient}_${datePart}_${intitule}_${adresse}`.replace(/\s+/g, '_');
  };

  // Fonction pour sauvegarder un projet complet (infos projet + pièces + travaux)
  const sauvegarderProjet = (
    projetData: Omit<ProjetChantier, 'id' | 'dateCreation' | 'dateModification'>
  ) => {
    const maintenant = new Date().toISOString();
    
    // Extraction des données du projectState
    const projectData = {
      rooms: projectState.rooms,
      property: projectState.property,
      travaux: projectState.travaux
    };
    
    // Si projetActif existe et qu'on est en train de le mettre à jour
    if (state.projetActif && projetData.clientId === state.projetActif.clientId) {
      const projetMisAJour: ProjetChantier = {
        ...state.projetActif,
        ...projetData,
        projectData: projectData, // Ajout des données du projectState
        dateModification: maintenant
      };
      
      dispatch({ type: 'UPDATE_PROJET', payload: projetMisAJour });
    } else {
      // Création d'un nouveau projet
      const nouveauProjet: ProjetChantier = {
        id: uuidv4(),
        ...projetData,
        projectData: projectData, // Ajout des données du projectState
        dateCreation: maintenant,
        dateModification: maintenant
      };
      
      dispatch({ type: 'ADD_PROJET', payload: nouveauProjet });
    }
  };

  // Fonction pour charger un projet complet
  const chargerProjet = (projetId: string) => {
    const projetACharger = state.projets.find(p => p.id === projetId);
    
    if (projetACharger) {
      // Mettre à jour projetActif
      dispatch({ type: 'SET_PROJET_ACTIF', payload: projetACharger });
      
      // Charger les données du projet (rooms, property, travaux) si elles existent
      if (projetACharger.projectData) {
        // Mettre à jour les pièces
        if (projetACharger.projectData.rooms) {
          projectDispatch({ type: 'SET_ROOMS', payload: projetACharger.projectData.rooms });
        }
        
        // Mettre à jour les propriétés
        if (projetACharger.projectData.property) {
          projectDispatch({ type: 'SET_PROPERTY', payload: projetACharger.projectData.property });
        }
        
        // Mettre à jour les travaux
        if (projetACharger.projectData.travaux) {
          projectDispatch({ type: 'SET_TRAVAUX', payload: projetACharger.projectData.travaux });
        }
      }
    }
  };
  
  // Fonction pour démarrer un nouveau projet
  const nouveauProjet = () => {
    // Effacer le projet actif
    dispatch({ type: 'SET_PROJET_ACTIF', payload: null });
    
    // Réinitialiser le projectState
    projectDispatch({ type: 'RESET_PROJECT' });
  };

  return (
    <ProjetChantierContext.Provider
      value={{
        state,
        dispatch,
        sauvegarderProjet,
        chargerProjet,
        genererNomFichier,
        nouveauProjet
      }}
    >
      {children}
    </ProjetChantierContext.Provider>
  );
};
