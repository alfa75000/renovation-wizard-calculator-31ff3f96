
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';

// Interface pour un client
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  adresse: string;
  tel1: string;
  tel2: string;
  email: string;
  typeClient: string;
  autreInfo: string;
  infosComplementaires: string;
}

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

// Provider
interface ClientsProviderProps {
  children: ReactNode;
}

export const ClientsProvider: React.FC<ClientsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(clientsReducer, initialState);
  const { loadFromLocalStorage, saveToLocalStorage } = useLocalStorageSync<ClientsState>('clientsData', state);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      // Si aucun client n'est enregistré, utiliser les clients par défaut
      if (savedData.clients.length === 0) {
        dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
      } else {
        dispatch({ type: 'SET_CLIENTS', payload: savedData.clients });
      }
    } else {
      // Pas de données sauvegardées, utiliser les valeurs par défaut
      dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
    }
  }, []);

  return (
    <ClientsContext.Provider value={{ state, dispatch }}>
      {children}
    </ClientsContext.Provider>
  );
};
