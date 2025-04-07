
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
}

export interface Menuiserie {
  id: string;
  type: string;
  largeur: string;
  hauteur: string;
  surface: string;
}

export interface AutreSurface {
  id: string;
  designation: string;
  longueur: string;
  hauteur: string;
  surface: string;
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
