
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@/types';
import { useLocalStorageSync } from '@/hooks/useLocalStorageSync';
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

// État initial
const initialState: ClientsState = {
  clients: [],
  clientSelectionne: null
};

// Types d'actions
type ClientsAction =
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Client }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SELECT_CLIENT'; payload: Client | null };

// Réducteur
const clientsReducer = (state: ClientsState, action: ClientsAction): ClientsState => {
  switch (action.type) {
    case 'SET_CLIENTS':
      return { ...state, clients: action.payload };
    case 'ADD_CLIENT':
      return {
        ...state,
        clients: [...state.clients, action.payload],
        clientSelectionne: action.payload
      };
    case 'UPDATE_CLIENT':
      return {
        ...state,
        clients: state.clients.map(client =>
          client.id === action.payload.id ? action.payload : client
        ),
        clientSelectionne: action.payload
      };
    case 'DELETE_CLIENT':
      return {
        ...state,
        clients: state.clients.filter(client => client.id !== action.payload),
        clientSelectionne: state.clientSelectionne?.id === action.payload ? null : state.clientSelectionne
      };
    case 'SELECT_CLIENT':
      return { ...state, clientSelectionne: action.payload };
    default:
      return state;
  }
};

// Types pour le contexte
interface ClientsContextType {
  state: ClientsState;
  dispatch: React.Dispatch<ClientsAction>;
  ajouterClient: (clientData: Omit<Client, 'id'>) => Promise<void>;
  modifierClient: (id: string, clientData: Omit<Client, 'id'>) => Promise<void>;
  supprimerClient: (id: string) => Promise<void>;
  selectionnerClient: (client: Client | null) => void;
  resetClients: () => Promise<void>;
}

// Création du contexte avec une valeur par défaut
const ClientsContext = createContext<ClientsContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useClients = () => {
  const context = useContext(ClientsContext);
  if (context === undefined) {
    throw new Error('useClients doit être utilisé à l\'intérieur d\'un ClientsProvider');
  }
  return context;
};

// Valeurs par défaut pour les clients
const defaultClients: Client[] = [
  {
    id: 'c1',
    nom: 'Durant',
    prenom: 'Jean',
    adresse: '15 rue de la Paix, 75001 Paris',
    tel1: '01 23 45 67 89',
    email: 'jean.durant@mail.com',
    typeClient: 'Particulier',
    autreInfo: 'Client fidèle'
  },
  {
    id: 'c2',
    nom: 'Entreprise XYZ',
    prenom: '',
    adresse: '25 avenue des Champs-Élysées, 75008 Paris',
    tel1: '01 98 76 54 32',
    tel2: '06 12 34 56 78',
    email: 'contact@entreprisexyz.com',
    typeClient: 'Professionnel',
    autreInfo: 'Grande entreprise'
  }
];

// Provider
interface ClientsProviderProps {
  children: ReactNode;
}

export const ClientsProvider: React.FC<ClientsProviderProps> = ({ children }) => {
  const logger = useLogger('ClientsProvider');
  const [state, dispatch] = useReducer(clientsReducer, initialState);
  const { loadFromLocalStorage, saveToLocalStorage } = useLocalStorageSync<ClientsState>('clients', state);
  
  // Variable pour éviter les doubles notifications
  const [isSilentOperation, setIsSilentOperation] = React.useState(false);
  
  // Charger les clients au démarrage
  useEffect(() => {
    const loadClients = async () => {
      try {
        // Essayer de charger depuis IndexedDB
        let isDbAvailable = false;
        try {
          isDbAvailable = await db.isAvailable();
        } catch (err) {
          logger.warn("IndexedDB n'est pas disponible", 'system');
        }
        
        if (isDbAvailable) {
          logger.info("Chargement des clients depuis IndexedDB", 'storage');
          const clients = await db.getAllClients();
          
          if (clients.length > 0) {
            dispatch({ type: 'SET_CLIENTS', payload: clients });
          } else {
            // Si aucun client dans IndexedDB, essayer localStorage
            const savedData = loadFromLocalStorage();
            if (savedData && savedData.clients.length > 0) {
              logger.info("Chargement des clients depuis localStorage", 'storage');
              dispatch({ type: 'SET_CLIENTS', payload: savedData.clients });
              
              // Synchroniser les clients avec IndexedDB
              await db.syncFromLocalStorage(savedData.clients);
            } else {
              // Si aucun client nulle part, initialiser avec les valeurs par défaut
              logger.info("Initialisation des clients avec les valeurs par défaut", 'storage');
              dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
              
              // Enregistrer dans IndexedDB
              await db.resetClients(defaultClients);
            }
          }
        } else {
          // Charger depuis localStorage
          const savedData = loadFromLocalStorage();
          if (savedData && savedData.clients.length > 0) {
            logger.info("Chargement des clients depuis localStorage", 'storage');
            dispatch({ type: 'SET_CLIENTS', payload: savedData.clients });
          } else {
            // Si aucun client, initialiser avec les valeurs par défaut
            logger.info("Initialisation des clients avec les valeurs par défaut", 'storage');
            dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
          }
        }
      } catch (error) {
        logger.error("Erreur lors du chargement des clients", error as Error, 'storage');
        
        // En cas d'erreur, essayer de charger depuis localStorage
        const savedData = loadFromLocalStorage();
        if (savedData && savedData.clients.length > 0) {
          logger.info("Chargement des clients depuis localStorage (fallback)", 'storage');
          dispatch({ type: 'SET_CLIENTS', payload: savedData.clients });
        } else {
          // Si aucun client, initialiser avec les valeurs par défaut
          logger.info("Initialisation des clients avec les valeurs par défaut (fallback)", 'storage');
          dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
        }
      }
    };
    
    loadClients();
  }, [loadFromLocalStorage, logger]);
  
  // Sauvegarder les clients lorsqu'ils changent
  useEffect(() => {
    const saveClients = async () => {
      // Sauvegarder dans localStorage pour la compatibilité
      saveToLocalStorage(state);
      
      // Essayer de sauvegarder dans IndexedDB
      try {
        const isDbAvailable = await db.isAvailable();
        
        if (isDbAvailable && state.clients.length > 0) {
          // Pour chaque client, sauvegarder ou mettre à jour
          for (const client of state.clients) {
            await db.updateClient(client);
          }
          logger.debug("Clients sauvegardés dans IndexedDB", 'storage');
        }
      } catch (error) {
        logger.error("Erreur lors de la sauvegarde des clients dans IndexedDB", error as Error, 'storage');
      }
    };
    
    // Ne sauvegarder que si des clients sont présents
    if (state.clients.length > 0) {
      saveClients();
    }
  }, [state, saveToLocalStorage, logger]);
  
  // Fonction pour ajouter un client
  const ajouterClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const client: Client = {
        id: uuidv4(),
        ...clientData
      };
      
      // Mettre à jour le state
      dispatch({ type: 'ADD_CLIENT', payload: client });
      
      // Essayer de sauvegarder dans IndexedDB
      try {
        const isDbAvailable = await db.isAvailable();
        if (isDbAvailable) {
          await db.addClient(client);
        }
      } catch (dbError) {
        logger.error("Erreur lors de l'ajout du client dans IndexedDB", dbError as Error, 'storage');
      }
      
      if (!isSilentOperation) {
        toast.success(`Client "${client.nom} ${client.prenom}" ajouté avec succès`);
      }
      logger.info(`Client ajouté: ${client.id}`, 'data');
    } catch (error) {
      logger.error("Erreur lors de l'ajout d'un client", error as Error, 'data');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de l'ajout du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      throw error;
    }
  };
  
  // Fonction pour modifier un client
  const modifierClient = async (id: string, clientData: Omit<Client, 'id'>) => {
    try {
      const client: Client = {
        id,
        ...clientData
      };
      
      // Mettre à jour le state
      dispatch({ type: 'UPDATE_CLIENT', payload: client });
      
      // Essayer de sauvegarder dans IndexedDB
      try {
        const isDbAvailable = await db.isAvailable();
        if (isDbAvailable) {
          await db.updateClient(client);
        }
      } catch (dbError) {
        logger.error("Erreur lors de la mise à jour du client dans IndexedDB", dbError as Error, 'storage');
      }
      
      if (!isSilentOperation) {
        toast.success(`Client "${client.nom} ${client.prenom}" mis à jour avec succès`);
      }
      logger.info(`Client mis à jour: ${id}`, 'data');
    } catch (error) {
      logger.error(`Erreur lors de la mise à jour du client ${id}`, error as Error, 'data');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la mise à jour du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      throw error;
    }
  };
  
  // Fonction pour supprimer un client
  const supprimerClient = async (id: string) => {
    try {
      // Trouver le client à supprimer pour le message
      const clientToDelete = state.clients.find(c => c.id === id);
      
      // Mettre à jour le state
      dispatch({ type: 'DELETE_CLIENT', payload: id });
      
      // Essayer de supprimer dans IndexedDB
      try {
        const isDbAvailable = await db.isAvailable();
        if (isDbAvailable) {
          await db.deleteClient(id);
        }
      } catch (dbError) {
        logger.error("Erreur lors de la suppression du client dans IndexedDB", dbError as Error, 'storage');
      }
      
      if (!isSilentOperation && clientToDelete) {
        toast.success(`Client "${clientToDelete.nom} ${clientToDelete.prenom}" supprimé avec succès`);
      }
      logger.info(`Client supprimé: ${id}`, 'data');
    } catch (error) {
      logger.error(`Erreur lors de la suppression du client ${id}`, error as Error, 'data');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la suppression du client: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      }
      throw error;
    }
  };
  
  // Fonction pour sélectionner un client
  const selectionnerClient = (client: Client | null) => {
    dispatch({ type: 'SELECT_CLIENT', payload: client });
    logger.debug(`Client sélectionné: ${client?.id || 'aucun'}`, 'ui');
  };
  
  // Fonction pour réinitialiser les clients
  const resetClients = async () => {
    try {
      setIsSilentOperation(true);
      
      // Réinitialiser avec les valeurs par défaut
      dispatch({ type: 'SET_CLIENTS', payload: defaultClients });
      
      // Réinitialiser dans IndexedDB
      try {
        const isDbAvailable = await db.isAvailable();
        if (isDbAvailable) {
          await db.resetClients(defaultClients);
        }
      } catch (dbError) {
        logger.error("Erreur lors de la réinitialisation des clients dans IndexedDB", dbError as Error, 'storage');
      }
      
      toast.success("Liste des clients réinitialisée avec les valeurs par défaut");
      logger.info("Clients réinitialisés", 'data');
    } catch (error) {
      logger.error("Erreur lors de la réinitialisation des clients", error as Error, 'data');
      toast.error(`Erreur lors de la réinitialisation des clients: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      throw error;
    } finally {
      setIsSilentOperation(false);
    }
  };
  
  return (
    <ClientsContext.Provider
      value={{
        state,
        dispatch,
        ajouterClient,
        modifierClient,
        supprimerClient,
        selectionnerClient,
        resetClients
      }}
    >
      {children}
    </ClientsContext.Provider>
  );
};
