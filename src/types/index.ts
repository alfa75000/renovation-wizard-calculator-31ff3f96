// Type pour un type de menuiserie (utilisé dans le contexte MenuiseriesTypesContext)
export interface TypeMenuiserie {
  id: string;
  nom: string;
  hauteur: number;
  largeur: number;
  surfaceReference: string;
  impactePlinthe: boolean;
  description?: string;
}

// Types pour la structure de l'état du contexte des types de menuiseries
export interface MenuiseriesTypesState {
  typesMenuiseries: TypeMenuiserie[];
}

// Actions possibles pour le contexte des types de menuiseries
export type MenuiseriesTypesAction =
  | { type: 'ADD_TYPE'; payload: TypeMenuiserie }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: Partial<TypeMenuiserie> } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'LOAD_TYPES'; payload: TypeMenuiserie[] }
  | { type: 'RESET_TYPES' };

// Surface de référence pour le calcul des surfaces impactées par les menuiseries
export const surfacesReference = [
  { id: 'SurfaceNetteMurs', label: 'Murs' },
  { id: 'SurfaceNettePlafond', label: 'Plafond' },
  { id: 'SurfaceNetteSol', label: 'Sol' },
  { id: 'Aucune', label: 'Aucune (directe)' }
];

import { SurfaceImpactee } from "./supabase";

export type PropertyType = 'Appartement' | 'Maison';

export interface Property {
  type: PropertyType;
  floors: number;
  totalArea: number;
  rooms: number;
  ceilingHeight: number;
}

export interface Room {
  id: string;
  name: string;
  customName: string;
  type: string;
  length: number;
  width: number;
  height: number;
  surface: number;
  plinthHeight: number;
  wallSurfaceRaw: number;
  menuiseries: any[];
  autresSurfaces: any[];
  totalPlinthLength: number;
  totalPlinthSurface: number;
  menuiseriesMursSurface: number;
  menuiseriesPlafondSurface: number;
  menuiseriesSolSurface: number;
  autresSurfacesMurs: number;
  autresSurfacesPlafond: number;
  autresSurfacesSol: number;
  netWallSurface: number;
  surfaceNetteSol: number;
  surfaceBruteSol: number;
  surfaceNettePlafond: number;
  surfaceBrutePlafond: number;
  surfaceBruteMurs: number;
  surfaceNetteMurs: number;
  surfaceMenuiseries: number;
  totalMenuiserieSurface: number;
  lineaireBrut: number;
  lineaireNet: number;
}

export interface Travail {
  id: string;
  name: string;
  description: string;
  laborPrice: number;
  supplyPrice: number;
  unit: string;
  quantity: number;
  tva: number;
  pieceId: string;
  surfaceImpactee: SurfaceImpactee;
}

export interface ProjectState {
  property: Property;
  rooms: Room[];
  travaux: Travail[];
}

export type ProjectAction =
  | { type: 'UPDATE_PROPERTY'; payload: Partial<Property> }
  | { type: 'ADD_ROOM'; payload: Room }
  | { type: 'UPDATE_ROOM'; payload: { id: string; room: Room } }
  | { type: 'DELETE_ROOM'; payload: string }
  | { type: 'ADD_TRAVAIL'; payload: Travail }
  | { type: 'UPDATE_TRAVAIL'; payload: { id: string; travail: Travail } }
  | { type: 'DELETE_TRAVAIL'; payload: string }
  | { type: 'RESET_PROJECT' }
  | { type: 'LOAD_PROJECT'; payload: ProjectState };
