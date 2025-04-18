
// Types pour les clients

// Client
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  codePostal: string;
  ville: string;
  tel1?: string;
  tel2?: string;
  typeClient?: string;
  autreInfo?: string;
  infosComplementaires?: string;
}

// Types de clients
export const typesClients = [
  { id: 'particulier', label: 'Particulier' },
  { id: 'entreprise', label: 'Entreprise' },
  { id: 'collectivite', label: 'Collectivité' },
  { id: 'autre', label: 'Autre' }
];

// État du contexte pour les clients
export interface ClientsState {
  clients: Client[];
}

// Actions pour les clients
export type ClientsAction =
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; client: Client } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'LOAD_CLIENTS'; payload: Client[] }
  | { type: 'RESET_CLIENTS' };
