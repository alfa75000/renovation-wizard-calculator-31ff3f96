
// Types principaux pour l'application de rénovation
import { 
  Property, 
  Project, 
  ProjectState, 
  ProjetChantier, 
  ProjetChantierState, 
  ProjectAction, 
  ProjetChantierAction,
  ProjectMetadata,
  CompanyData
} from './project';

import {
  Room,
  Piece
} from './room';

import {
  Menuiserie,
  TypeMenuiserie
} from './menuiserie';

import {
  AutreSurface,
  TypeAutreSurface,
  surfacesReference,
  surfacesMenuiseries,
  SurfaceImpactee
} from './surface';

import {
  Travail,
  TravauxType,
  TypeTravauxItem,
  SousTypeTravauxItem,
  TravauxTypesState,
  TravauxTypesAction
} from './travaux';

import {
  Client,
  typesClients,
  ClientsState,
  ClientsAction
} from './client';

// Définition for PrintableField
export interface PrintableField {
  id: string;
  name: string;
  enabled: boolean;
  required?: boolean;
  content?: string;
}

// Exports de types avec le mot-clé "type" requis pour 'isolatedModules'
export type { 
  Property, 
  Project, 
  ProjectState, 
  ProjetChantier, 
  ProjetChantierState, 
  ProjectAction, 
  ProjetChantierAction,
  ProjectMetadata,
  CompanyData,
  Room,
  Piece,
  Menuiserie,
  TypeMenuiserie,
  AutreSurface,
  TypeAutreSurface,
  Travail,
  TravauxType,
  TypeTravauxItem,
  SousTypeTravauxItem,
  Client,
  SurfaceImpactee
};

// Exports d'états et d'actions pour les contextes
export type {
  TravauxTypesState,
  TravauxTypesAction,
  ClientsState,
  ClientsAction
};

// Exports de constantes
export {
  surfacesReference,
  surfacesMenuiseries,
  typesClients
};

// Interfaces pour les états
export interface MenuiseriesTypesState {
  typesMenuiseries: TypeMenuiserie[];
}

export interface AutresSurfacesState {
  typesAutresSurfaces: TypeAutreSurface[];
}

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
