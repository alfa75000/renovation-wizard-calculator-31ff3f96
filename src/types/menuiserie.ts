
export interface Menuiserie {
  id: string;
  roomId: string;
  typeId?: string;
  type: string;
  nom: string;
  name: string;
  largeur: number;
  hauteur: number;
  surface: number;
  quantity: number;
  quantite: number;
  surfaceImpactee: "mur" | "plafond" | "sol";
  impactePlinthe?: boolean;
  description?: string;
  commentaire?: string;
  menuiserie_type_id?: string;
}

export interface TypeMenuiserie {
  id: string;
  nom: string;
  name?: string;
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
