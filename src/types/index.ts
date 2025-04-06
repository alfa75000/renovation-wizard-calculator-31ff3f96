
// Types communs utilisés dans toute l'application

export interface PropertyType {
  type: string;
  floors: string;
  totalArea: string;
  rooms: string;
  ceilingHeight: string;
}

export interface Menuiserie {
  id: string;
  type: string;
  name: string;
  largeur: number;
  hauteur: number;
  quantity: number;
  surface: number;
}

export interface Room {
  id: string;
  name: string;
  customName: string;
  type: string;
  length: string;
  width: string;
  height: string;
  surface: string;
  plinthHeight: string;
  wallSurfaceRaw: string;
  menuiseries: Menuiserie[];
  totalPlinthLength: string;
  totalPlinthSurface: string;
  totalMenuiserieSurface: string;
  netWallSurface: string;
  // Propriétés pour les surfaces de référence
  surfaceNetteSol?: string;
  surfaceBruteSol?: string;
  surfaceNettePlafond?: string;
  surfaceBrutePlafond?: string;
  lineaireNet?: string;
  lineaireBrut?: string;
  surfaceNetteMurs?: string; // Équivalent à netWallSurface
  surfaceBruteMurs?: string; // Équivalent à wallSurfaceRaw
  surfaceBruteMenuiseries?: string; // Équivalent à totalMenuiserieSurface
  surfaceMenuiseries?: string; // Équivalent à totalMenuiserieSurface
  volume?: string;
}

export interface Piece {
  id: string;
  name?: string;
  type?: string;
  customName?: string;
  surface?: string;
  // Surfaces pour le calcul automatique
  surfaceNetteSol?: string;
  surfaceNettePlafond?: string;
  surfaceNetteMurs?: string;
  lineaireNet?: string;
  surfaceMenuiseries?: string;
  // Propriétés supplémentaires pour la compatibilité
  netWallSurface?: string;
  totalPlinthLength?: string;
  totalMenuiserieSurface?: string;
}

export interface Travail {
  id: string;
  pieceId: string;
  typeTravaux: string;
  typeTravauxLabel: string;
  sousType: string;
  sousTypeLabel: string;
  quantite: number;
  unite: string;
  tauxTVA: number;
  prixUnitaire: number;
  prixFournitures: number;
  prixMainOeuvre: number;
  personnalisation?: string;
  surfaceReference?: string;
}
