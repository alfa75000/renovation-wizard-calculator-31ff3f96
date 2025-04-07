
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
import { Client, ClientsState, ClientsAction, ClientsContextType } from '@/types';

// Types de clients disponibles
export const typesClients = [
  { id: 'particulier', label: 'Particulier' },
  { id: 'professionnel', label: 'Professionnel' },
  { id: 'entreprise', label: 'Entreprise' },
  { id: 'association', label: 'Association' },
  { id: 'autre', label: 'Autre' }
];

// Données par défaut pour les clients
const defaultClients: Client[] = [
  {
    id: uuidv4(),
    nom: 'Dupont',
    prenom: 'Jean',
    adresse: '15 rue de la Paix, 75001 Paris',
    tel1: '06 12 34 56 78',
    tel2: '',
    email: 'jean.dupont@example.com',
    typeClient: 'particulier',
    autreInfo: '',
    infosComplementaires: 'Client régulier depuis 2020'
  },
  {
    id: uuidv4(),
    nom: 'Martin Entreprise',
    prenom: '',
    adresse: '25 avenue des Champs-Élysées, 75008 Paris',
    tel1: '01 87 65 43 21',
    tel2: '06 98 76 54 32',
    email: 'contact@martin-entreprise.com',
    typeClient: 'entreprise',
    autreInfo: 'SIRET: 123 456 789 00012',
    infosComplementaires: 'Entreprise de taille moyenne, budget conséquent'
  }
];

// État initial
const initialState: ClientsState = {
  clients: [],
  selectedClient: null
};

// Reducer pour gérer les actions
const clientsReducer = (state: ClientsState, action: ClientsAction): ClientsState => {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return { ...state, clients: [...state.clients, action.payload] };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client => 
          client.id === action.payload.id 
            ? action.payload.client 
            : client
        ),
        selectedClient: state.selectedClient?.id === action.payload.id 
          ? action.payload.client 
          : state.selectedClient
      };
    case 'DELETE_CLIENT':
      return { 
        ...state, 
        clients: state.clients.filter(client => client.id !== action.payload),
        selectedClient: state.selectedClient?.id === action.payload 
          ? null 
          : state.selectedClient
      };
    case 'SELECT_CLIENT':
      return { 
        ...state, 
        selectedClient: state.clients.find(client => client.id === action.payload) || null
      };
    case 'RESET_CLIENTS':
      return { clients: defaultClients, selectedClient: null };
    default:
      return state;
  }
};

// Création du contexte
const ClientsContext = createContext<ClientsContextType>({
  state: initialState,
  dispatch: () => null
});

// Hook personnalisé pour utiliser le contexte
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error("useClients doit être utilisé à l'intérieur d'un ClientsProvider");
  }
  return context;
};

// Provider du contexte
export const ClientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Utiliser le hook useLocalStorageSync pour la persistance
  const [storedClients, setStoredClients, saveClients, loadClients] = useLocalStorageSync<Client[]>(
    'clients', 
    defaultClients,
    { syncOnMount: true, autoSave: false }
  );
  
  // Initialiser le reducer avec les données sauvegardées
  const [state, dispatch] = useReducer(clientsReducer, { 
    clients: storedClients,
    selectedClient: null
  });
  
  // Sauvegarder les clients quand ils changent
  useEffect(() => {
    setStoredClients(state.clients);
    saveClients();
  }, [state.clients, setStoredClients, saveClients]);
  
  // Vérifier si les clients sont vides et les initialiser si nécessaire
  useEffect(() => {
    if (state.clients.length === 0) {
      console.log("Initialisation des clients avec les valeurs par défaut");
      dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
    }
  }, [state.clients.length]);

  return (
    <ClientsContext.Provider value={{ state, dispatch }}>
      {children}
    </ClientsContext.Provider>
  );
};
