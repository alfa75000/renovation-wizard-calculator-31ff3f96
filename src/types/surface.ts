
// Types pour les surfaces et autres éléments

// Autre surface (pour les ajouts ou déductions)
export interface AutreSurface {
  id: string;
  type: string;
  name: string;
  designation: string;
  largeur: number;
  hauteur: number;
  surface: number;
  quantity: number;
  surfaceImpactee: "mur" | "plafond" | "sol";
  estDeduction: boolean;
  impactePlinthe: boolean;
  description: string;
}

// Type d'autre surface (catalogue)
export interface TypeAutreSurface {
  id: string;
  nom: string;
  description: string;
  largeur: number;
  hauteur: number;
  surfaceImpacteeParDefaut: "mur" | "plafond" | "sol";
  estDeduction: boolean;
  impactePlinthe: boolean;
}

// Surface impactée type for use in the application
export type SurfaceImpactee = 'Mur' | 'Plafond' | 'Sol' | 'Aucune';

// Constantes pour les surfaces de référence
export const surfacesReference = [
  { id: 'murs', label: 'Surface des murs' },
  { id: 'sol', label: 'Surface du sol' },
  { id: 'plafond', label: 'Surface du plafond' },
  { id: 'menuiseries', label: 'Surface des menuiseries' },
  { id: 'plinthes', label: 'Longueur des plinthes' },
  { id: 'perimetre', label: 'Périmètre de la pièce' }
];

// Constantes pour les types de surfaces impactées par les menuiseries
export const surfacesMenuiseries = [
  { id: 'mur', label: 'Mur' },
  { id: 'sol', label: 'Sol' },
  { id: 'plafond', label: 'Plafond' }
];
