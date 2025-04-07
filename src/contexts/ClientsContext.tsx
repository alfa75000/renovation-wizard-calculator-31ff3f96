
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ClientsState, Client } from '@/types';

// Actions possibles
type ClientsAction =
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; client: Client } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'LOAD_CLIENTS'; payload: Client[] };

// État initial
const initialState: ClientsState = {
  clients: [],
};

// Créer le contexte
const ClientsContext = createContext<{
  state: ClientsState;
  dispatch: React.Dispatch<ClientsAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer pour gérer les actions
function clientsReducer(state: ClientsState, action: ClientsAction): ClientsState {
  switch (action.type) {
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload],
      };
    
    case 'UPDATE_CLIENT': {
      const { id, client } = action.payload;
      return {
        ...state,
        clients: state.clients.map((c) => (c.id === id ? client : c)),
      };
    }
    
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter((client) => client.id !== action.payload),
      };
    
    case 'LOAD_CLIENTS':
      return {
        ...state,
        clients: action.payload,
      };
    
    default:
      return state;
  }
}

// Provider component
export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupérer les données depuis localStorage au démarrage
  const [state, dispatch] = useReducer(clientsReducer, initialState, () => {
    try {
      const savedState = localStorage.getItem('clients');
      if (savedState) {
        return { clients: JSON.parse(savedState) };
      }

      // Si aucune donnée n'est trouvée, initialiser avec un exemple
      const defaultClients: Client[] = [
        {
          id: '1',
          nom: 'Durand',
          prenom: 'Jean',
          telephone: '0612345678',
          email: 'jean.durand@example.com',
          adresse: '15 rue des Lilas',
          codePostal: '75001',
          ville: 'Paris',
        },
      ];

      return { clients: defaultClients };
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      return initialState;
    }
  });

  // Sauvegarder les données dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem('clients', JSON.stringify(state.clients));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des clients:', error);
    }
  }, [state]);

  return (
    <ClientsContext.Provider value={{ state, dispatch }}>
      {children}
    </ClientsContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients doit être utilisé à l\'intérieur d\'un ClientsProvider');
  }
  return context;
};
