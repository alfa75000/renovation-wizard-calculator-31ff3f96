
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ClientsState, Client, ClientsAction, typesClients } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

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
    case 'ADD_CLIENT': {
      const newClient = {
        ...action.payload,
        id: action.payload.id || uuidv4(),
      };
      return {
        ...state,
        clients: [...state.clients, newClient],
      };
    }
    
    case 'UPDATE_CLIENT': {
      const { id, client } = action.payload;
      return {
        ...state,
        clients: state.clients.map((c) => (c.id === id ? { ...c, ...client } : c)),
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
      
    case 'RESET_CLIENTS':
      return initialState;
    
    default:
      return state;
  }
}

// Provider component
export const ClientsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedClients, setSavedClients] = useLocalStorage<Client[]>('clients', []);
  
  // Initialiser le state avec les données sauvegardées
  const [state, dispatch] = useReducer(clientsReducer, {
    clients: savedClients || [], // Ensure clients is always an array
  });

  // Sauvegarder les changements dans localStorage
  useEffect(() => {
    setSavedClients(state.clients || []); // Ensure we're saving an array even if state.clients is undefined
  }, [state.clients, setSavedClients]);

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

// Fonction pour obtenir le label d'un type client
export const getTypeClientLabel = (id: string) => {
  const type = typesClients.find(type => type.id === id);
  return type ? type.label : id;
};

// Exporter pour l'utilisation dans d'autres fichiers
export { typesClients };
export type { Client };
