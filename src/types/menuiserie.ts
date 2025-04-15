
// Types pour les menuiseries

// Menuiserie (fenêtre, porte, etc.)
export interface Menuiserie {
  id: string;
  type: string;
  name: string;
  largeur: number;
  hauteur: number;
  quantity: number;
  surface: number;
  surfaceImpactee: "mur" | "plafond" | "sol";
  impactePlinthe?: boolean;
}

// Type de menuiserie (catalogue)
export interface TypeMenuiserie {
  id: string;
  nom: string;
  description: string;
  hauteur: number;
  largeur: number;
  surfaceReference: string;
  impactePlinthe: boolean;
}
