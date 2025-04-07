
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
  surfaceNetteSol: number;
  surfaceNettePlafond: number;
  surfaceBruteSol: number;
  surfaceBrutePlafond: number;
  surfaceBruteMurs: number;
  
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
  surfaceReference: number;
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
}

// Types pour les travaux
export interface TravauxType {
  id: string;
  nom: string;
  description: string;
  sousTypes: SousTypeTravauxItem[];
}

export interface TypeTravauxItem {
  id: string;
  nom: string;
  description: string;
}

export interface SousTypeTravauxItem {
  id: string;
  typeTravauxId: string;
  nom: string;
  description: string;
  uniteParDefaut: string;
  prixFournituresUnitaire: number;
  prixMainOeuvreUnitaire: number;
  tempsMoyenMinutes: number;
  tauxTVA: number;
}

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
}

// Type de pièce pour la compatibilité avec les composants
export type Piece = Room;

// États du contexte
export interface ProjectState {
  property: Property;
  rooms: Room[];
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
}
