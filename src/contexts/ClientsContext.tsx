
import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { Client } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { useLogger } from '@/hooks/useLogger';
import { toast } from 'sonner';
import db from '@/services/dbService';

// Define the client types array for selection
export const typesClients = [
  { id: 'particulier', label: 'Particulier' },
  { id: 'professionnel', label: 'Professionnel' },
  { id: 'association', label: 'Association' },
  { id: 'collectivite', label: 'Collectivité' },
  { id: 'autre', label: 'Autre' }
];

// Interface pour l'état du contexte des clients
interface ClientsState {
  clients: Client[];
  clientSelectionne: Client | null;
}

// Type pour les actions possibles sur l'état des clients
type ClientsAction =
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SELECT_CLIENT'; payload: string | null };

// Définition de l'interface pour le contexte
export interface ClientsContextType {
  state: ClientsState;
  dispatch: React.Dispatch<ClientsAction>;
  addClient: (client: Omit<Client, 'id'>) => Promise<Client>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  resetClients: () => Promise<void>;
  selectClient: (id: string | null) => void;
}

// Création du contexte avec une valeur par défaut
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// État initial pour le réducteur
const initialState: ClientsState = {
  clients: [],
  clientSelectionne: null
};

// Fonction de réduction pour gérer les mises à jour d'état
const clientsReducer = (state: ClientsState, action: ClientsAction): ClientsState => {
  switch (action.type) {
    case 'SET_CLIENTS':
      return {
        ...state,
        clients: action.payload
      };
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload]
      };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        ),
        clientSelectionne: state.clientSelectionne?.id === action.payload.id 
          ? action.payload 
          : state.clientSelectionne
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
        clientSelectionne: state.clientSelectionne?.id === action.payload 
          ? null 
          : state.clientSelectionne
      };
    case 'SELECT_CLIENT':
      return {
        ...state,
        clientSelectionne: action.payload 
          ? state.clients.find(client => client.id === action.payload) || null 
          : null
      };
    default:
      return state;
  }
};

// Composant provider du contexte
export const ClientsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const logger = useLogger('ClientsProvider');
  const [state, dispatch] = useReducer(clientsReducer, initialState);
  const [isDbInitialized, setIsDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Charger les clients depuis IndexedDB ou localStorage au démarrage
  useEffect(() => {
    const loadClients = async () => {
      setIsLoading(true);
      try {
        // Vérifier si IndexedDB est disponible
        const isDbAvailable = await db.isAvailable();
        setIsDbInitialized(isDbAvailable);
        
        if (isDbAvailable) {
          // Charger depuis IndexedDB
          const clients = await db.getAllClients();
          if (clients.length > 0) {
            dispatch({ type: 'SET_CLIENTS', payload: clients });
            logger.info(`${clients.length} clients chargés depuis IndexedDB`, 'storage');
          } else {
            // Si aucun client dans IndexedDB, essayer localStorage
            const savedClients = localStorage.getItem('clients');
            if (savedClients) {
              const parsedClients = JSON.parse(savedClients) as Client[];
              if (Array.isArray(parsedClients) && parsedClients.length > 0) {
                // Synchroniser avec IndexedDB
                await db.syncFromLocalStorage(parsedClients);
                dispatch({ type: 'SET_CLIENTS', payload: parsedClients });
                logger.info(`${parsedClients.length} clients chargés depuis localStorage et synchronisés`, 'storage');
              }
            }
          }
        } else {
          // Si IndexedDB n'est pas disponible, utiliser localStorage
          const savedClients = localStorage.getItem('clients');
          if (savedClients) {
            const parsedClients = JSON.parse(savedClients) as Client[];
            if (Array.isArray(parsedClients)) {
              dispatch({ type: 'SET_CLIENTS', payload: parsedClients });
              logger.info(`${parsedClients.length} clients chargés depuis localStorage`, 'storage');
            }
          }
        }
      } catch (error) {
        logger.error('Erreur lors du chargement des clients', error as Error, 'storage');
        toast.error('Erreur lors du chargement des clients');
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, [logger]);

  // Sauvegarder les clients lorsqu'ils changent
  useEffect(() => {
    if (!isLoading && state.clients.length > 0) {
      const saveClients = async () => {
        try {
          // Toujours sauvegarder dans localStorage pour la compatibilité
          localStorage.setItem('clients', JSON.stringify(state.clients));
          
          // Si IndexedDB est disponible
          if (isDbInitialized) {
            // Pour chaque client, vérifier s'il existe déjà et mettre à jour ou ajouter
            for (const client of state.clients) {
              try {
                await db.updateClient(client);
              } catch (error) {
                logger.error(`Erreur lors de la sauvegarde du client ${client.id} dans IndexedDB`, error as Error, 'storage');
              }
            }
          }
          
          logger.debug('Clients sauvegardés', 'storage');
        } catch (error) {
          logger.error('Erreur lors de la sauvegarde des clients', error as Error, 'storage');
        }
      };

      saveClients();
    }
  }, [state.clients, isDbInitialized, isLoading, logger]);

  // Ajouter un nouveau client
  const addClient = async (clientData: Omit<Client, 'id'>): Promise<Client> => {
    try {
      const newClient: Client = {
        id: uuidv4(),
        ...clientData
      };
      
      // Ajouter à l'état local via le réducteur
      dispatch({ type: 'ADD_CLIENT', payload: newClient });
      
      // Enregistrer dans IndexedDB si disponible
      if (isDbInitialized) {
        await db.addClient(newClient);
      }
      
      toast.success(`Client ajouté: ${newClient.nom} ${newClient.prenom}`);
      logger.info(`Nouveau client ajouté: ${newClient.id}`, 'storage');
      
      return newClient;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error('Erreur lors de l\'ajout d\'un client', error as Error, 'storage');
      toast.error(`Erreur lors de l'ajout du client: ${errorMessage}`);
      throw error;
    }
  };

  // Mettre à jour un client existant
  const updateClient = async (client: Client): Promise<void> => {
    try {
      // Mettre à jour l'état local via le réducteur
      dispatch({ type: 'UPDATE_CLIENT', payload: client });
      
      // Enregistrer dans IndexedDB si disponible
      if (isDbInitialized) {
        await db.updateClient(client);
      }
      
      toast.success(`Client mis à jour: ${client.nom} ${client.prenom}`);
      logger.info(`Client mis à jour: ${client.id}`, 'storage');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error('Erreur lors de la mise à jour d\'un client', error as Error, 'storage');
      toast.error(`Erreur lors de la mise à jour du client: ${errorMessage}`);
      throw error;
    }
  };

  // Supprimer un client
  const deleteClient = async (id: string): Promise<void> => {
    try {
      // Supprimer de l'état local via le réducteur
      dispatch({ type: 'DELETE_CLIENT', payload: id });
      
      // Supprimer dans IndexedDB si disponible
      if (isDbInitialized) {
        await db.deleteClient(id);
      }
      
      // Supprimer également du localStorage
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const parsedClients = JSON.parse(savedClients) as Client[];
        const updatedClients = parsedClients.filter(client => client.id !== id);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
      }
      
      toast.success('Client supprimé');
      logger.info(`Client supprimé: ${id}`, 'storage');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error('Erreur lors de la suppression d\'un client', error as Error, 'storage');
      toast.error(`Erreur lors de la suppression du client: ${errorMessage}`);
      throw error;
    }
  };

  // Réinitialiser les clients (tout supprimer)
  const resetClients = async (): Promise<void> => {
    try {
      // Réinitialiser l'état local
      dispatch({ type: 'SET_CLIENTS', payload: [] });
      
      // Vider localStorage
      localStorage.removeItem('clients');
      
      // Vider IndexedDB si disponible
      if (isDbInitialized) {
        await db.resetClients([]);
      }
      
      toast.success('Tous les clients ont été supprimés');
      logger.info('Tous les clients ont été supprimés', 'storage');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      logger.error('Erreur lors de la réinitialisation des clients', error as Error, 'storage');
      toast.error(`Erreur lors de la suppression des clients: ${errorMessage}`);
      throw error;
    }
  };

  // Sélectionner un client
  const selectClient = (id: string | null): void => {
    dispatch({ type: 'SELECT_CLIENT', payload: id });
  };

  const contextValue: ClientsContextType = {
    state,
    dispatch,
    addClient,
    updateClient,
    deleteClient,
    resetClients,
    selectClient
  };

  return (
    <ClientsContext.Provider value={contextValue}>
      {children}
    </ClientsContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte des clients
export const useClients = (): ClientsContextType => {
  const context = useContext(ClientsContext);
  if (!context) {
    throw new Error('useClients doit être utilisé à l\'intérieur d\'un ClientsProvider');
  }
  return context;
};
