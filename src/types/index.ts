// Types principaux pour l'application de rénovation

// Propriété principale
export interface Property {
  type: string;
  floors: number;
  totalArea: number;
  rooms: number;
  ceilingHeight: number;
}

// Pièce à rénover
export interface Room {
  id: string;
  name: string;
  customName?: string;
  type: string;
  width: number;
  length: number;
  height: number;
  surface: number;
  plinthHeight: number;
  typeSol?: string;
  typeMur?: string;
  menuiseries: Menuiserie[];
  autresSurfaces: AutreSurface[];
  
  // Valeurs calculées
  wallSurfaceRaw: number;
  totalPlinthLength: number;
  totalPlinthSurface: number;
  
  // Surfaces d'impact
  menuiseriesMursSurface: number;
  menuiseriesPlafondSurface: number;
  menuiseriesSolSurface: number;
  autresSurfacesMurs: number;
  autresSurfacesPlafond: number;
  autresSurfacesSol: number;
  
  // Surfaces nettes calculées
  netWallSurface: number;
  surfaceNetteMurs: number;
  surfaceNetteSol: number;
  surfaceNettePlafond: number;
  surfaceBruteSol: number;
  surfaceBrutePlafond: number;
  surfaceBruteMurs: number;
  surfaceMenuiseries: number;
  totalMenuiserieSurface: number;
  
  // Linéaires
  lineaireBrut?: number;
  lineaireNet?: number;
}

// Menuiserie (fenêtre, porte, etc.)
export interface Menuiserie {
  id: string;
  type: string;
  name: string;
  largeur: number;
  hauteur: number;
  quantity: number;
  surface: number;
  surfaceImpactee: "mur" | "plafond" | "sol";
  impactePlinthe?: boolean;
}

// Autre surface (pour les ajouts ou déductions)
export interface AutreSurface {
  id: string;
  type: string;
  name: string;
  designation: string;
  largeur: number;
  hauteur: number;
  surface: number;
  quantity: number;
  surfaceImpactee: "mur" | "plafond" | "sol";
  estDeduction: boolean;
}

// Types pour les menuiseries
export interface TypeMenuiserie {
  id: string;
  nom: string;
  description: string;
  hauteur: number;
  largeur: number;
  surfaceReference: string;
  impactePlinthe: boolean;
}

// Types pour les autres surfaces
export interface TypeAutreSurface {
  id: string;
  nom: string;
  description: string;
  surfaceImpacteeParDefaut: "mur" | "plafond" | "sol";
  estDeduction: boolean;
}

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

// Projet Chantier
export interface ProjetChantier {
  id: string;
  nom: string;
  adresse: string;
  codePostal: string;
  ville: string;
  clientId: string;
  dateDebut: string;
  dateFin: string;
  description: string;
  statut: "en_attente" | "en_cours" | "termine";
  montantTotal: number;
  nomProjet?: string;
  dateModification?: string;
  projectData?: any;
  occupant?: string;
  infoComplementaire?: string;
}

// Types pour les travaux
export interface TravauxType {
  id: string;
  nom: string;
  label: string;
  description: string;
  icon: string;
  sousTypes: SousTypeTravauxItem[];
}

export interface TypeTravauxItem {
  id: string;
  nom: string;
  label: string;
  description: string;
  icon?: string;
  sousTypes: SousTypeTravauxItem[];
}

export interface SousTypeTravauxItem {
  id: string;
  typeTravauxId: string;
  nom: string;
  label: string;
  description: string;
  uniteParDefaut: string;
  unite: string;
  prixFournitures: number;
  prixFournituresUnitaire: number;
  prixMainOeuvre: number;
  prixMainOeuvreUnitaire: number;
  prixUnitaire: number;
  tempsMoyenMinutes: number;
  tauxTVA: number;
  surfaceReference?: string;
}

export const surfacesReference = [
  { id: 'murs', label: 'Surface des murs' },
  { id: 'sol', label: 'Surface du sol' },
  { id: 'plafond', label: 'Surface du plafond' },
  { id: 'menuiseries', label: 'Surface des menuiseries' },
  { id: 'plinthes', label: 'Longueur des plinthes' },
  { id: 'perimetre', label: 'Périmètre de la pièce' }
];

export const surfacesMenuiseries = [
  { id: 'mur', label: 'Mur' },
  { id: 'sol', label: 'Sol' },
  { id: 'plafond', label: 'Plafond' }
];

export const typesClients = [
  { id: 'particulier', label: 'Particulier' },
  { id: 'entreprise', label: 'Entreprise' },
  { id: 'collectivite', label: 'Collectivité' },
  { id: 'autre', label: 'Autre' }
];

// Travail associé à une pièce
export interface Travail {
  id: string;
  pieceId: string;
  typeTravauxId: string;
  typeTravauxLabel: string;
  sousTypeId: string;
  sousTypeLabel: string;
  menuiserieId?: string;
  description: string;
  quantite: number;
  unite: string;
  prixFournitures: number;
  prixMainOeuvre: number;
  tauxTVA: number;
  commentaire: string;
  personnalisation?: string;
  typeTravaux?: string;
  sousType?: string;
  surfaceImpactee?: string; // Nouvelle propriété
}

// Type de pièce pour la compatibilité avec les composants
export type Piece = Room;

// États du contexte
export interface ProjectState {
  property: Property;
  rooms: Room[];
  travaux: Travail[];
}

export interface TravauxTypesState {
  types: TravauxType[];
}

export interface MenuiseriesTypesState {
  typesMenuiseries: TypeMenuiserie[];
}

export interface AutresSurfacesState {
  typesAutresSurfaces: TypeAutreSurface[];
}

export interface ClientsState {
  clients: Client[];
}

export interface ProjetChantierState {
  projets: ProjetChantier[];
  projetActif?: ProjetChantier | null;
}

// Actions pour ProjectContext
export type ProjectAction =
  | { type: 'UPDATE_PROPERTY'; payload: Partial<Property> }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: { id: string; room: Room } }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'RESET_PROJECT' }
  | { type: 'LOAD_PROJECT'; payload: ProjectState }
  | { type: 'ADD_TRAVAIL'; payload: Travail }
  | { type: 'UPDATE_TRAVAIL'; payload: { id: string; travail: Travail } }
  | { type: 'DELETE_TRAVAIL'; payload: string };

// Actions pour les types de travaux
export type TravauxTypesAction =
  | { type: 'ADD_TYPE'; payload: TravauxType }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TravauxType } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'ADD_SOUS_TYPE'; payload: { typeId: string; sousType: SousTypeTravauxItem } }
  | { type: 'UPDATE_SOUS_TYPE'; payload: { typeId: string; id: string; sousType: SousTypeTravauxItem } }
  | { type: 'DELETE_SOUS_TYPE'; payload: { typeId: string; id: string } }
  | { type: 'LOAD_TYPES'; payload: TravauxType[] }
  | { type: 'RESET_TYPES' };

// Actions pour les menuiseries
export type MenuiseriesTypesAction =
  | { type: 'ADD_TYPE'; payload: TypeMenuiserie }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeMenuiserie } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'LOAD_TYPES'; payload: TypeMenuiserie[] }
  | { type: 'RESET_TYPES' };

// Actions pour les autres surfaces
export type AutresSurfacesAction =
  | { type: 'ADD_TYPE'; payload: TypeAutreSurface }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeAutreSurface } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'LOAD_TYPES'; payload: TypeAutreSurface[] }
  | { type: 'RESET_TYPES' };

// Actions pour les clients
export type ClientsAction =
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; client: Client } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'LOAD_CLIENTS'; payload: Client[] }
  | { type: 'RESET_CLIENTS' };

// Actions pour les projets chantier
export type ProjetChantierAction =
  | { type: 'ADD_PROJET'; payload: ProjetChantier }
  | { type: 'UPDATE_PROJET'; payload: { id: string; projet: ProjetChantier } }
  | { type: 'DELETE_PROJET'; payload: string }
  | { type: 'SET_PROJET_ACTIF'; payload: string | null }
  | { type: 'LOAD_PROJETS'; payload: ProjetChantier[] }
  | { type: 'RESET_PROJETS' };
