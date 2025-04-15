
// Types pour les travaux et services

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
  surfaceImpactee?: string;
  
  // Propriétés calculées pour les PDF
  prixHT?: number;
  prixUnitaireHT?: number;
  designation?: string;
  nom?: string;
}

// Type de travaux (catalogue)
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

// États du contexte pour les types de travaux
export interface TravauxTypesState {
  types: TravauxType[];
}

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
