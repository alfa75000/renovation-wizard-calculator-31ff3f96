
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
  name?: string;
  nom?: string;
  largeur: number;
  hauteur: number;
  quantity?: number;
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
}

export interface Travail {
  id: string;
  pieceId: number;
  pieceName: string;
  typeTravauxId: string;
  typeTravauxLabel: string;
  sousTypeId: string;
  sousTypeLabel: string;
  personnalisation: string;
  quantite: number;
  unite: string;
  prixFournitures: number;
  prixMainOeuvre: number;
  prixUnitaire: number;
  tauxTVA: number;
}

export interface Piece {
  id: number | string;
  nom?: string;
  name?: string;
  type?: string;
  customName?: string;
  surface?: number;
  surfaceMurs?: number;
  plinthes?: number;
  surfacePlinthes?: number;
  surfaceMenuiseries?: number;
  surfaceNetMurs?: number;
  menuiseries?: Menuiserie[];
}
