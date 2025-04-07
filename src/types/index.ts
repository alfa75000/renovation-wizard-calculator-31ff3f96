
// Types pour les pièces et menuiseries
export interface Room {
  id: string;
  name: string;
  // Propriétés de base
  width: string;
  length: string;
  height: string;
  surface: string;
  typeSol: string;
  typeMur: string;
  // Collections associées
  menuiseries: Menuiserie[];
  autresSurfaces: AutreSurface[];
  
  // Propriétés calculées utilisées dans l'application
  type?: string;
  customName?: string;
  plinthHeight?: string;
  wallSurfaceRaw?: string;
  totalPlinthLength?: string;
  lineaireBrut?: string;
  lineaireNet?: string;
  totalPlinthSurface?: string;
  
  // Surfaces calculées
  surfaceNetteSol?: string;
  netWallSurface?: string;
  surfaceNettePlafond?: string;
  surfaceBruteMurs?: string;
  surfaceBrutePlafond?: string;
  
  // Surfaces impactées par les menuiseries
  menuiseriesMursSurface?: string;
  menuiseriesPlafondSurface?: string;
  menuiseriesSolSurface?: string;
  
  // Surfaces impactées par les autres surfaces
  autresSurfacesMurs?: string;
  autresSurfacesPlafond?: string;
  autresSurfacesSol?: string;
}

export interface Menuiserie {
  id: string;
  type: string;
  largeur: string;
  hauteur: string;
  surface: string;
  
  // Propriétés additionnelles utilisées
  surfaceImpactee?: string;
  impactePlinthe?: boolean;
  quantity?: number;
}

export interface AutreSurface {
  id: string;
  designation: string;
  longueur: string;
  hauteur: string;
  surface: string;
  
  // Propriétés additionnelles utilisées
  name?: string;
  type?: string;
  largeur?: number;
  surfaceImpactee?: string;
  estDeduction?: boolean;
  quantity?: number;
}

export interface PropertyType {
  type: string;
  floors: string;
  totalArea: string;
  rooms: string;
  ceilingHeight: string;
}

export interface Travail {
  id: string;
  type: string;
  designation: string;
  unite: string;
  quantite: string;
  prixUnitaire: string;
  prixTotal: string;
  
  // Propriétés utilisées dans le code mais non définies dans l'interface originale
  pieceId: string;
  typeTravauxLabel: string;
  sousTypeLabel: string;
  prixFournitures: string;
  prixMainOeuvre: string;
  tauxTVA: string;
  personnalisation?: string;
}

// Types pour les clients
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  adresse: string;
  tel1: string;
  tel2?: string;
  email?: string;
  typeClient: string;
  autreInfo?: string;
  infosComplementaires?: string;
}

// Types pour les travaux types
export interface TravauxType {
  id: string;
  type: string;
  description: string;
  unite: string;
  prixUnitaire: number;
}

// Types pour le contexte des types de travaux
export interface TypeTravauxItem {
  id: string;
  label: string;
  icon: string;
  sousTypes: SousTypeTravauxItem[];
}

export interface SousTypeTravauxItem {
  id: string;
  label: string;
  unite: string;
  prixUnitaire: string;
  prixFournitures: string;
  prixMainOeuvre: string;
  tauxTVA: string;
  surfaceReference?: string;
  personnalisation?: string;
}

// Types pour les menuiseries types
export interface MenuiserieType {
  id: string;
  type: string;
}

// Version étendue pour TypeMenuiserie
export interface TypeMenuiserie {
  id: string;
  type: string;
  nom: string;
  hauteur: number;
  largeur: number;
  description?: string;
  surfaceReference?: string;
  impactePlinthe: boolean;
}

// Types pour les autres surfaces types
export interface AutreSurfaceType {
  id: string;
  designation: string;
}

// Version étendue pour TypeAutreSurface
export interface TypeAutreSurface {
  id: string;
  designation: string;
  nom: string;
  description?: string;
  surfaceImpacteeParDefaut: string;
  estDeduction: boolean;
}

// Types pour les projets chantier
export interface ProjetChantier {
  id: string;
  clientId: string;
  nomProjet: string;
  descriptionProjet: string;
  adresseChantier: string;
  occupant: string;
  infoComplementaire: string;
  dateCreation: string;
  dateModification: string;
  projectData?: {
    rooms: Room[];
    property: PropertyType;
    travaux: Travail[];
  };
}

// Types pour le hook de stockage IndexedDB
export interface IDBStorageHook<T> {
  isDbAvailable: boolean;
  isLoading: boolean;
  error: Error | null;
  getAllItems: () => Promise<T[]>;
  getItem: (id: string) => Promise<T | null>;
  addItem: (item: T) => Promise<string>;
  updateItem: (id: string, item: T) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearItems: () => Promise<void>;
  runSilently: <R>(operation: () => R | Promise<R>) => Promise<R>;
  setSilentOperation?: (silent: boolean) => void;
}

// Types pour les états des contexts
export interface ClientsState {
  clients: Client[];
  selectedClient: Client | null;
  useIdb?: boolean;
}

export interface ClientsContextType {
  state: ClientsState;
  dispatch: React.Dispatch<ClientsAction>;
  isDbAvailable?: boolean;
  isLoading?: boolean;
}

export type ClientsAction =
  | { type: 'SET_CLIENTS'; payload: Client[] }
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; client: Client } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'SELECT_CLIENT'; payload: string }
  | { type: 'SET_USE_IDB'; payload: boolean }
  | { type: 'RESET_CLIENTS' };
