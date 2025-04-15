
export interface Menuiserie {
  id: string;
  roomId: string;
  typeId: string;
  nom: string;
  largeur: number;
  hauteur: number;
  description?: string;
  quantite: number;
  commentaire?: string;
}

export interface TypeMenuiserie {
  id: string;
  nom: string;
  label: string;
  description: string;
  estUnique: boolean;
}

export interface MenuiseriesTypesState {
  types: TypeMenuiserie[];
}

export type MenuiseriesTypesAction =
  | { type: 'ADD_TYPE'; payload: TypeMenuiserie }
  | { type: 'UPDATE_TYPE'; payload: { id: string; type: TypeMenuiserie } }
  | { type: 'DELETE_TYPE'; payload: string }
  | { type: 'LOAD_TYPES'; payload: TypeMenuiserie[] }
  | { type: 'RESET_TYPES' };
