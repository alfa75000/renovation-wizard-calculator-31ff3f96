
import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { ClientsState, Client, ClientsAction, typesClients } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { fetchClients, createClient, updateClient, deleteClient, fetchClientTypes, ClientType } from '@/services/clientsService';

// État initial
const initialState: ClientsState = {
  clients: [],
};

// Créer le contexte
const ClientsContext = createContext<{
  state: ClientsState;
  dispatch: React.Dispatch<ClientsAction>;
  isLoading: boolean;
  error: string | null;
  clientTypes: ClientType[];
  getClientTypeName: (typeId: string) => string;
}>({
  state: initialState,
  dispatch: () => null,
  isLoading: false,
  error: null,
  clientTypes: [],
  getClientTypeName: () => '',
});

// Reducer pour gérer les actions
function clientsReducer(state: ClientsState, action: ClientsAction): ClientsState {
  switch (action.type) {
    case 'ADD_CLIENT': {
      // Dans le cas d'un nouvel ajout, nous utilisons l'ID que Supabase nous retournera
      // donc nous n'avons pas besoin de générer un UUID ici
      return {
        ...state,
        clients: [...state.clients, action.payload],
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
  const [state, dispatch] = useReducer(clientsReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientTypes, setClientTypes] = useState<ClientType[]>([]);
  
  // Charger les types de clients depuis Supabase
  useEffect(() => {
    const loadClientTypes = async () => {
      try {
        const types = await fetchClientTypes();
        setClientTypes(types);
        console.log(`[ClientsContext] ${types.length} types de clients chargés depuis Supabase`);
      } catch (error) {
        console.error('[ClientsContext] Erreur lors du chargement des types de clients:', error);
        setError('Erreur lors du chargement des types de clients');
      }
    };
    
    loadClientTypes();
  }, []);
  
  // Charger les clients depuis Supabase au démarrage
  useEffect(() => {
    const loadClientsFromSupabase = async () => {
      setIsLoading(true);
      try {
        const supabaseClients = await fetchClients();
        dispatch({ type: 'LOAD_CLIENTS', payload: supabaseClients });
        console.log(`[ClientsContext] ${supabaseClients.length} clients chargés depuis Supabase`);
      } catch (error) {
        console.error('[ClientsContext] Erreur lors du chargement des clients:', error);
        setError('Erreur lors du chargement des clients');
        toast.error('Erreur lors du chargement des clients');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadClientsFromSupabase();
  }, []);
  
  // Fonction pour obtenir le nom du type de client à partir de son ID
  const getClientTypeName = (typeId: string): string => {
    const clientType = clientTypes.find(type => type.id === typeId);
    return clientType?.name || typeId;
  };
  
  // Intercepter les actions du dispatch pour synchroniser avec Supabase
  const handleDispatch = async (action: ClientsAction) => {
    try {
      setIsLoading(true);
      
      switch(action.type) {
        case 'ADD_CLIENT': {
          console.log('[ClientsContext] Ajout d\'un nouveau client', action.payload);
          const newClient = action.payload;
          const result = await createClient(newClient);
          
          if (!result) {
            toast.error('Erreur lors de la création du client');
          } else {
            dispatch({ type: 'ADD_CLIENT', payload: result });
            toast.success('Client ajouté avec succès');
          }
          break;
        }
        
        case 'UPDATE_CLIENT': {
          console.log('[ClientsContext] Mise à jour du client', action.payload);
          const { id, client } = action.payload;
          const result = await updateClient(id, client);
          
          if (!result) {
            toast.error('Erreur lors de la mise à jour du client');
            // Recharger les clients pour annuler la modification locale
            const clients = await fetchClients();
            dispatch({ type: 'LOAD_CLIENTS', payload: clients });
          } else {
            // Mettre à jour le state local une seule fois
            dispatch({ type: 'UPDATE_CLIENT', payload: { id, client: result } });
            toast.success('Client mis à jour avec succès');
          }
          break;
        }
        
        case 'DELETE_CLIENT': {
          console.log('[ClientsContext] Suppression du client', action.payload);
          const id = action.payload;
          const result = await deleteClient(id);
          
          if (!result) {
            toast.error('Erreur lors de la suppression du client');
            // Recharger les clients pour annuler la modification locale
            const clients = await fetchClients();
            dispatch({ type: 'LOAD_CLIENTS', payload: clients });
          } else {
            dispatch({ type: 'DELETE_CLIENT', payload: id });
            toast.success('Client supprimé avec succès');
          }
          break;
        }
        
        case 'LOAD_CLIENTS':
        case 'RESET_CLIENTS':
          // Ces actions sont directement appliquées au reducer
          dispatch(action);
          break;
      }
    } catch (error) {
      console.error('[ClientsContext] Erreur lors de la synchronisation avec Supabase:', error);
      toast.error('Erreur de synchronisation avec la base de données');
      
      // Recharger les clients en cas d'erreur pour avoir un état cohérent
      try {
        const clients = await fetchClients();
        dispatch({ type: 'LOAD_CLIENTS', payload: clients });
      } catch (e) {
        console.error('[ClientsContext] Erreur lors du rechargement des clients:', e);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ClientsContext.Provider value={{ 
      state, 
      dispatch: handleDispatch, 
      isLoading, 
      error, 
      clientTypes,
      getClientTypeName 
    }}>
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

// Exporter pour l'utilisation dans d'autres fichiers
export { typesClients };
export type { Client };
