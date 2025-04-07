
export interface Room {
  id: string;
  name: string;
  width: string;
  length: string;
  height: string;
  surface: string;
  typeSol: string;
  typeMur: string;
  menuiseries: Menuiserie[];
  autresSurfaces: AutreSurface[];
  
  // Additional properties used in RenovationEstimator
  type?: string;
  customName?: string;
  plinthHeight?: string;
  wallSurfaceRaw?: string;
  totalPlinthLength?: string;
  totalPlinthSurface?: string;
  totalMenuiserieSurface?: string;
  netWallSurface?: string;
  menuiseriesMursSurface?: string;
  menuiseriesPlafondSurface?: string;
  menuiseriesSolSurface?: string;
  autresSurfacesMurs?: string;
  autresSurfacesPlafond?: string;
  autresSurfacesSol?: string;
  surfaceNetteSol?: string;
  surfaceBruteSol?: string;
  surfaceNettePlafond?: string;
  surfaceBrutePlafond?: string;
  surfaceNetteMurs?: string;
  surfaceBruteMurs?: string;
  lineaireBrut?: string;
  lineaireNet?: string;
  surfaceMenuiseries?: string;
}

export interface Menuiserie {
  id: string;
  type: string;
  largeur: number;
  hauteur: number;
  surface: number;
  name?: string;
  
  // Additional properties used in RenovationEstimator
  quantity?: number;
  surfaceImpactee?: string;
  impactePlinthe?: boolean;
}

export interface AutreSurface {
  id: string;
  designation: string;
  longueur: string;
  hauteur: string;
  surface: number;
  
  // Additional properties used in RenovationEstimator
  type?: string;
  name?: string;
  largeur?: number;
  quantity?: number;
  surfaceImpactee?: string;
  estDeduction?: boolean;
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
  pieceId: string;
  typeTravaux?: string;
  typeTravauxLabel: string;
  sousType?: string;
  sousTypeLabel: string;
  unite: string;
  quantite: number;
  prixUnitaire: number;
  prixTotal?: number;
  prixFournitures: number;
  prixMainOeuvre: number;
  tauxTVA: number;
  personnalisation?: string;
  menuiserieId?: string;
  
  // Propriétés de compatibilité avec l'ancien code
  type?: string;
  designation?: string;
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

// Types pour les types de menuiseries
export interface TypeMenuiserie {
  id: string;
  type: string;
  
  // Additional properties used in the app
  nom?: string;
  description?: string;
  largeur?: number;
  hauteur?: number;
  surfaceReference?: number;
  impactePlinthe?: boolean;
}

// Types pour les types d'autres surfaces
export interface TypeAutreSurface {
  id: string;
  designation: string;
  
  // Additional properties used in the app
  nom?: string;
  surfaceImpacteeParDefaut?: string;
  estDeduction?: boolean;
}

// Types pour les travaux types
export interface TravauxType {
  id: string;
  type: string;
  description: string;
  unite: string;
  prixUnitaire: number;
}

// Types pour les menuiseries types
export interface MenuiserieType {
  id: string;
  type: string;
}

// Types pour les autres surfaces types
export interface AutreSurfaceType {
  id: string;
  designation: string;
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

// Type pour les pièces utilisé dans certains composants
export interface Piece {
  id: string;
  name: string;
  menuiseries?: Menuiserie[];
  surface?: string;
  
  // Additional properties used in the app
  type?: string;
  surfaceNetteSol?: string;
  surfaceNettePlafond?: string;
  surfaceNetteMurs?: string;
  netWallSurface?: string;
  lineaireNet?: string;
  totalPlinthLength?: string;
  surfaceMenuiseries?: string;
  totalMenuiserieSurface?: string;
}
