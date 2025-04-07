
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { useLogger } from '@/hooks/useLogger';
import { Client } from '@/types';

// Types de clients disponibles
export const typesClients = [
  { id: 'particulier', label: 'Particulier' },
  { id: 'societe', label: 'Société' },
  { id: 'gestionnaire', label: 'Gestionnaire de biens immobiliers' },
  { id: 'syndic', label: 'Syndic' },
  { id: 'architecte', label: 'Architecte' },
  { id: 'bureau_etude', label: 'Bureau d\'étude' },
  { id: 'autre', label: 'Autre' }
];

// Clients par défaut (pour faciliter les tests)
const defaultClients: Client[] = [
  {
    id: uuidv4(),
    nom: 'Dupont',
    prenom: 'Jean',
    adresse: '15 rue de la Paix, 75001 Paris',
    tel1: '01 23 45 67 89',
    tel2: '',
    email: 'jean.dupont@example.com',
    typeClient: 'particulier',
    autreInfo: '',
    infosComplementaires: 'Client fidèle depuis 2020'
  },
  {
    id: uuidv4(),
    nom: 'Immobilier Plus',
    prenom: '',
    adresse: '25 avenue des Champs-Élysées, 75008 Paris',
    tel1: '01 23 45 67 90',
    tel2: '06 12 34 56 78',
    email: 'contact@immobilierplus.example.com',
    typeClient: 'gestionnaire',
    autreInfo: 'SIRET: 123 456 789 00012',
    infosComplementaires: 'Gestionnaire de plusieurs immeubles dans le 8ème arrondissement'
  }
];

// État initial
interface ClientsState {
  clients: Client[];
}

const initialState: ClientsState = {
  clients: []
};

// Actions
type ClientsAction =
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; client: Client } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'RESET_CLIENTS' };

// Réducteur
const clientsReducer = (state: ClientsState, action: ClientsAction): ClientsState => {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, { ...action.payload, id: action.payload.id || uuidv4() }] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? { ...action.payload.client } : client
        )
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload)
      };
    case 'RESET_CLIENTS':
      return { ...state, clients: defaultClients };
    default:
      return state;
  }
};

// Création du contexte
interface ClientsContextType {
  state: ClientsState;
  dispatch: React.Dispatch<ClientsAction>;
}

const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// Hook pour utiliser le contexte
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients doit être utilisé à l\'intérieur d\'un ClientsProvider');
  }
  return context;
};

// Buffer pour tentatives de sauvegarde échouées
const BUFFER_KEY = 'clients_buffer';

// Provider
interface ClientsProviderProps {
  children: ReactNode;
}

export const ClientsProvider: React.FC<ClientsProviderProps> = ({ children }) => {
  const logger = useLogger('ClientsProvider');
  const [state, dispatch] = useReducer(clientsReducer, initialState);
  const { loadFromLocalStorage, saveToLocalStorage } = useLocalStorageSync<ClientsState>('clientsData', state);

  // Fonction pour tenter de récupérer des données du buffer en cas d'échec
  const tryRecoverFromBuffer = () => {
    try {
      const bufferedDataJSON = localStorage.getItem(BUFFER_KEY);
      if (bufferedDataJSON) {
        const bufferedData = JSON.parse(bufferedDataJSON) as ClientsState;
        logger.info('Tentative de récupération des données depuis le buffer', 'storage', {
          clientsCount: bufferedData.clients.length
        });
        return bufferedData;
      }
    } catch (error) {
      logger.error('Erreur lors de la récupération des données depuis le buffer', error as Error, 'storage');
    }
    return null;
  };

  // Fonction pour enregistrer les données dans le buffer
  const saveToBuffer = (data: ClientsState) => {
    try {
      localStorage.setItem(BUFFER_KEY, JSON.stringify(data));
      logger.debug('Données sauvegardées dans le buffer', 'storage', {
        clientsCount: data.clients.length
      });
    } catch (error) {
      logger.error('Erreur lors de la sauvegarde des données dans le buffer', error as Error, 'storage');
    }
  };

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    logger.info('Initialisation du Provider Clients', 'system');
    
    try {
      const savedData = loadFromLocalStorage();
      
      if (savedData) {
        logger.info('Chargement des données clients depuis localStorage', 'storage', {
          clientsCount: savedData.clients.length
        });
        
        // Si aucun client n'est enregistré, utiliser les clients par défaut
        if (savedData.clients.length === 0) {
          logger.info('Aucun client trouvé, utilisation des clients par défaut', 'data');
          dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
        } else {
          dispatch({ type: 'SET_CLIENTS', payload: savedData.clients });
        }
      } else {
        // Tenter de récupérer depuis le buffer
        const bufferedData = tryRecoverFromBuffer();
        
        if (bufferedData) {
          logger.info('Données récupérées depuis le buffer', 'storage', {
            clientsCount: bufferedData.clients.length
          });
          dispatch({ type: 'SET_CLIENTS', payload: bufferedData.clients });
        } else {
          // Pas de données sauvegardées, utiliser les valeurs par défaut
          logger.info('Aucune donnée sauvegardée, utilisation des clients par défaut', 'data');
          dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
        }
      }
    } catch (error) {
      logger.error('Erreur lors du chargement initial des clients', error as Error, 'storage');
      
      // En cas d'erreur, tenter de récupérer depuis le buffer
      const bufferedData = tryRecoverFromBuffer();
      
      if (bufferedData) {
        logger.info('Récupération d\'urgence depuis le buffer après erreur', 'storage');
        dispatch({ type: 'SET_CLIENTS', payload: bufferedData.clients });
      } else {
        // Utiliser les clients par défaut en dernier recours
        logger.info('Utilisation des clients par défaut après échec de récupération', 'data');
        dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
      }
    }
  }, []);

  // Sauvegarder les données dans localStorage quand l'état change
  useEffect(() => {
    // Ne pas sauvegarder lors de l'initialisation (state vide)
    if (state.clients.length > 0) {
      try {
        // Sauvegarder d'abord dans le buffer (sécurité)
        saveToBuffer(state);
        
        // Puis tenter de sauvegarder dans localStorage
        logger.debug('Sauvegarde des clients dans localStorage', 'storage', {
          clientsCount: state.clients.length
        });
        saveToLocalStorage(state);
      } catch (error) {
        logger.error('Erreur lors de la sauvegarde des clients', error as Error, 'storage', {
          clientsCount: state.clients.length
        });
      }
    }
  }, [state, saveToLocalStorage]);

  // Middleware pour logguer les actions
  const loggedDispatch: React.Dispatch<ClientsAction> = (action) => {
    // Log avant l'action
    const actionType = action.type;
    
    switch (actionType) {
      case 'ADD_CLIENT':
        logger.info('Ajout d\'un client', 'data', { 
          clientId: action.payload.id,
          clientName: `${action.payload.nom} ${action.payload.prenom}`.trim() 
        });
        break;
      case 'UPDATE_CLIENT':
        logger.info('Mise à jour d\'un client', 'data', { 
          clientId: action.payload.id,
          clientName: `${action.payload.client.nom} ${action.payload.client.prenom}`.trim() 
        });
        break;
      case 'DELETE_CLIENT':
        logger.info('Suppression d\'un client', 'data', { clientId: action.payload });
        const clientToDelete = state.clients.find(c => c.id === action.payload);
        if (clientToDelete) {
          logger.debug('Détails du client supprimé', 'data', { 
            clientName: `${clientToDelete.nom} ${clientToDelete.prenom}`.trim(),
            clientType: clientToDelete.typeClient
          });
        }
        break;
      case 'RESET_CLIENTS':
        logger.warn('Réinitialisation complète des clients', 'data');
        break;
      default:
        logger.debug(`Action ${actionType}`, 'data');
    }
    
    // Exécution de l'action
    dispatch(action);
  };

  return (
    <ClientsContext.Provider value={{ state, dispatch: loggedDispatch }}>
      {children}
    </ClientsContext.Provider>
  );
};
