
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
  
  // Legacy properties needed for compatibility
  typeTravauxId?: string;
  typeTravauxLabel?: string;
  sousTypeId?: string;
  sousTypeLabel?: string;
  prixFournitures?: number;
  prixMainOeuvre?: number;
  unite?: string;
  quantite?: number;
  tauxTVA?: number;
  personnalisation?: string;
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

// Types for AutresSurfacesContext
export interface TypeAutreSurface {
  id: string;
  nom: string;
  surfaceReference: string;
}

export interface AutreSurface {
  id: string;
  type: string;
  typeName?: string;
  largeur: number;
  hauteur: number;
  surface: number;
  pieceId: string;
}

export interface AutresSurfacesState {
  typesAutresSurfaces: TypeAutreSurface[];
}

// Types for ClientsContext
export interface Client {
  id: string;
  nom: string;
  prenom: string;
  adresse: string;
  telephone: string;
  codePostal: string;
  ville: string;
  email: string;
  tel1: string;
  tel2: string;
  typeClient: string;
  autreInfo: string;
  infosComplementaires: string;
}

export interface ClientsState {
  clients: Client[];
}

export type ClientsAction =
  | { type: 'ADD_CLIENT'; payload: Client }
  | { type: 'UPDATE_CLIENT'; payload: { id: string; client: Partial<Client> } }
  | { type: 'DELETE_CLIENT'; payload: string }
  | { type: 'LOAD_CLIENTS'; payload: Client[] }
  | { type: 'RESET_CLIENTS' };

// Types Clients data
export const typesClients = [
  { id: 'particulier', label: 'Particulier' },
  { id: 'professionnel', label: 'Professionnel' },
  { id: 'administration', label: 'Administration' },
  { id: 'autre', label: 'Autre' }
];

// Types for MenuiserieContext
export interface Menuiserie {
  id: string;
  type: string;
  typeName?: string;
  largeur: number;
  hauteur: number;
  surface: number;
  pieceId: string;
}

// Types for ProjetChantierContext
export interface ProjetChantier {
  id: string;
  name: string;
  description?: string;
  clientId?: string;
  address?: string;
  startDate?: string;
  endDate?: string;
  status: 'draft' | 'pending' | 'in_progress' | 'completed' | 'cancelled';
  budget?: number;
  notes?: string;
}

export interface ProjetChantierState {
  projets: ProjetChantier[];
  currentProjet: ProjetChantier | null;
}

export type ProjetChantierAction =
  | { type: 'ADD_PROJET'; payload: ProjetChantier }
  | { type: 'UPDATE_PROJET'; payload: { id: string; projet: Partial<ProjetChantier> } }
  | { type: 'DELETE_PROJET'; payload: string }
  | { type: 'SET_CURRENT_PROJET'; payload: string | null }
  | { type: 'LOAD_PROJETS'; payload: ProjetChantier[] }
  | { type: 'RESET_PROJETS' };

// Types for TravauxTypesContext
export interface TypeTravauxItem {
  id: string;
  name: string;
  description?: string;
}

export interface SousTypeTravauxItem {
  id: string;
  name: string;
  description?: string;
  typeId: string;
  groupId?: string;
}

export interface TravauxType {
  id: string;
  name: string;
  description?: string;
  sousTypes?: SousTypeTravauxItem[];
}

export interface TravauxTypesState {
  travauxTypes: TravauxType[];
}

export type TravauxTypesAction =
  | { type: 'ADD_TYPE_TRAVAUX'; payload: TypeTravauxItem }
  | { type: 'UPDATE_TYPE_TRAVAUX'; payload: { id: string; type: Partial<TypeTravauxItem> } }
  | { type: 'DELETE_TYPE_TRAVAUX'; payload: string }
  | { type: 'ADD_SOUS_TYPE_TRAVAUX'; payload: SousTypeTravauxItem }
  | { type: 'UPDATE_SOUS_TYPE_TRAVAUX'; payload: { id: string; sousType: Partial<SousTypeTravauxItem> } }
  | { type: 'DELETE_SOUS_TYPE_TRAVAUX'; payload: string }
  | { type: 'LOAD_TYPES_TRAVAUX'; payload: TravauxType[] }
  | { type: 'RESET_TYPES_TRAVAUX' };
