
export type TypeAutreSurface = {
  id: string;
  nom: string;
  description: string;
  surfaceImpacteeParDefaut: 'mur' | 'plafond' | 'sol' | 'aucune';
  estDeduction: boolean;
};

export type AutreSurface = {
  id: string;
  type: string;
  name: string;
  designation: string;
  largeur: number;
  hauteur: number;
  quantity: number;
  surfaceImpactee: 'mur' | 'plafond' | 'sol' | 'aucune';
  estDeduction: boolean;
  surface: number;
};

export type RoomCustomItem = {
  id: string;
  roomId: string;
  name: string;
  largeur: number;
  hauteur: number;
  surfaceImpactee: 'mur' | 'plafond' | 'sol' | 'aucune';
  estDeduction: boolean;
  impactePlinthe: boolean;
  quantity: number;
  description: string;
  sourceTypeId?: string;
  surface: number;
};
