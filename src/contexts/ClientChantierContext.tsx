
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Interface pour définir les informations du client
interface Client {
  id?: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  codePostal: string;
  ville: string;
}

// Interface pour définir les informations du chantier
interface Chantier {
  id?: string;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  dateDebut: string;
  dateFin: string;
  description: string;
}

// Interface pour définir l'état global
interface ClientChantierState {
  client: Client;
  chantier: Chantier;
}

// Actions possibles pour le reducer
type ClientChantierAction =
  | { type: 'SET_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: Partial<Client> }
  | { type: 'SET_CHANTIER'; payload: Chantier }
  | { type: 'UPDATE_CHANTIER'; payload: Partial<Chantier> }
  | { type: 'RESET_CLIENT_CHANTIER' };

// État initial avec des valeurs par défaut vides
const initialState: ClientChantierState = {
  client: {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    codePostal: '',
    ville: '',
  },
  chantier: {
    nom: '',
    adresse: '',
    codePostal: '',
    ville: '',
    dateDebut: '',
    dateFin: '',
    description: '',
  }
};

// Fonction reducer pour gérer les modifications d'état
const clientChantierReducer = (state: ClientChantierState, action: ClientChantierAction): ClientChantierState => {
  switch (action.type) {
    case 'SET_CLIENT':
      return { ...state, client: action.payload };
    case 'UPDATE_CLIENT':
      return { ...state, client: { ...state.client, ...action.payload } };
    case 'SET_CHANTIER':
      return { ...state, chantier: action.payload };
    case 'UPDATE_CHANTIER':
      return { ...state, chantier: { ...state.chantier, ...action.payload } };
    case 'RESET_CLIENT_CHANTIER':
      localStorage.removeItem('clientInfo');
      localStorage.removeItem('chantierInfo');
      return initialState;
    default:
      return state;
  }
};

// Création du contexte
const ClientChantierContext = createContext<{
  state: ClientChantierState;
  dispatch: React.Dispatch<ClientChantierAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Hook personnalisé pour utiliser le contexte
export const useClientChantier = () => {
  const context = useContext(ClientChantierContext);
  if (!context) {
    throw new Error("useClientChantier doit être utilisé à l'intérieur d'un ClientChantierProvider");
  }
  return context;
};

// Provider du contexte
export const ClientChantierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(clientChantierReducer, initialState);

  // Charger les données depuis localStorage au démarrage
  useEffect(() => {
    const loadSavedData = () => {
      try {
        const savedClient = localStorage.getItem('clientInfo');
        if (savedClient) {
          dispatch({ type: 'SET_CLIENT', payload: JSON.parse(savedClient) });
        }

        const savedChantier = localStorage.getItem('chantierInfo');
        if (savedChantier) {
          dispatch({ type: 'SET_CHANTIER', payload: JSON.parse(savedChantier) });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données client/chantier:", error);
      }
    };

    loadSavedData();
  }, []);

  // Sauvegarder les données dans localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem('clientInfo', JSON.stringify(state.client));
  }, [state.client]);

  useEffect(() => {
    localStorage.setItem('chantierInfo', JSON.stringify(state.chantier));
  }, [state.chantier]);

  return (
    <ClientChantierContext.Provider value={{ state, dispatch }}>
      {children}
    </ClientChantierContext.Provider>
  );
};
