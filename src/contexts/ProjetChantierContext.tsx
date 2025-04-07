import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjetChantier } from '@/types';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { useProjetsStorage } from '@/hooks/useProjetsStorage';
import { useProject } from './ProjectContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useLogger } from '@/hooks/useLogger';
import { toast } from 'sonner';

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
  const logger = useLogger('ProjetChantierProvider');
  const [state, dispatch] = useReducer(projetChantierReducer, initialState);
  const { loadFromLocalStorage, saveToLocalStorage } = useLocalStorageSync<ProjetChantierState>('projetsChantier', state);
  const { state: projectState, dispatch: projectDispatch } = useProject();
  
  // Utilisation du hook pour IndexedDB
  const { 
    isDbAvailable, 
    getAllProjets, 
    saveProjet: saveProjetsToIndexedDB,
    deleteProjet,
    isInitialized
  } = useProjetsStorage();

  // Charger les données depuis IndexedDB ou localStorage au démarrage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Si IndexedDB est disponible et initialisé, charger depuis IndexedDB
        if (isDbAvailable && isInitialized) {
          const projets = await getAllProjets();
          if (projets.length > 0) {
            logger.info(`Chargement de ${projets.length} projets depuis IndexedDB`, 'storage');
            dispatch({ type: 'SET_PROJETS', payload: projets });
          } else {
            // Si IndexedDB est vide, essayer localStorage
            const savedData = loadFromLocalStorage();
            if (savedData && savedData.projets.length > 0) {
              logger.info(`Chargement de ${savedData.projets.length} projets depuis localStorage`, 'storage');
              dispatch({ type: 'SET_PROJETS', payload: savedData.projets });
              
              // Si un projet actif était sauvegardé, le restaurer
              if (savedData.projetActif) {
                dispatch({ type: 'SET_PROJET_ACTIF', payload: savedData.projetActif });
              }
            }
          }
        } else {
          // Si IndexedDB n'est pas disponible, utiliser localStorage
          const savedData = loadFromLocalStorage();
          if (savedData) {
            logger.info(`Chargement de ${savedData.projets.length} projets depuis localStorage`, 'storage');
            dispatch({ type: 'SET_PROJETS', payload: savedData.projets });
            
            // Si un projet actif était sauvegardé, le restaurer
            if (savedData.projetActif) {
              dispatch({ type: 'SET_PROJET_ACTIF', payload: savedData.projetActif });
            }
          }
        }
      } catch (error) {
        logger.error('Erreur lors du chargement des projets', error as Error, 'storage');
      }
    };
    
    loadData();
  }, [isDbAvailable, isInitialized, getAllProjets, loadFromLocalStorage, logger]);
  
  // Sauvegarder les données quand elles changent
  useEffect(() => {
    // Sauvegarder dans localStorage pour la compatibilité
    saveToLocalStorage(state);
    
    // Si IndexedDB est disponible, sauvegarder chaque projet
    if (isDbAvailable && isInitialized && state.projets.length > 0) {
      state.projets.forEach(async projet => {
        try {
          await saveProjetsToIndexedDB(projet);
        } catch (error) {
          logger.error(`Erreur lors de la sauvegarde du projet ${projet.id} dans IndexedDB`, error as Error, 'storage');
        }
      });
    }
  }, [state, isDbAvailable, isInitialized, saveProjetsToIndexedDB, saveToLocalStorage, logger]);

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
      
      // Si IndexedDB est disponible, sauvegarder
      if (isDbAvailable && isInitialized) {
        saveProjetsToIndexedDB(projetMisAJour)
          .then(() => {
            logger.info(`Projet ${projetMisAJour.id} mis à jour dans IndexedDB`, 'storage');
            toast.success('Projet sauvegardé dans IndexedDB');
          })
          .catch(error => {
            logger.error(`Erreur lors de la mise à jour du projet ${projetMisAJour.id} dans IndexedDB`, error as Error, 'storage');
            toast.error('Erreur lors de la sauvegarde dans IndexedDB');
          });
      } else {
        toast.success('Projet sauvegardé dans localStorage');
      }
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
      
      // Si IndexedDB est disponible, sauvegarder
      if (isDbAvailable && isInitialized) {
        saveProjetsToIndexedDB(nouveauProjet)
          .then(() => {
            logger.info(`Projet ${nouveauProjet.id} ajouté dans IndexedDB`, 'storage');
            toast.success('Nouveau projet sauvegardé dans IndexedDB');
          })
          .catch(error => {
            logger.error(`Erreur lors de l'ajout du projet ${nouveauProjet.id} dans IndexedDB`, error as Error, 'storage');
            toast.error('Erreur lors de la sauvegarde dans IndexedDB');
          });
      } else {
        toast.success('Nouveau projet sauvegardé dans localStorage');
      }
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
          logger.info(`${projetACharger.projectData.rooms.length} pièces chargées depuis le projet`, 'data');
        }
        
        // Mettre à jour les propriétés
        if (projetACharger.projectData.property) {
          projectDispatch({ type: 'SET_PROPERTY', payload: projetACharger.projectData.property });
        }
        
        // Mettre à jour les travaux
        if (projetACharger.projectData.travaux) {
          projectDispatch({ type: 'SET_TRAVAUX', payload: projetACharger.projectData.travaux });
          logger.info(`${projetACharger.projectData.travaux.length} travaux chargés depuis le projet`, 'data');
        }
      }
      
      toast.info(`Projet "${projetACharger.nomProjet}" chargé`);
    }
  };
  
  // Fonction pour démarrer un nouveau projet
  const nouveauProjet = () => {
    try {
      // Effacer le projet actif
      dispatch({ type: 'SET_PROJET_ACTIF', payload: null });
      
      // Réinitialiser le projectState avec l'action RESET_PROJECT
      projectDispatch({ type: 'RESET_PROJECT' });
      
      logger.info('Nouveau projet initialisé', 'data');
      toast.success('Nouveau projet initialisé');
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation d\'un nouveau projet', error as Error, 'data');
      toast.error('Erreur lors de l\'initialisation d\'un nouveau projet');
    }
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
