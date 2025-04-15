
export interface AutreSurface {
  id: string;
  roomId: string;
  typeId?: string;
  type: string;
  nom: string;
  name: string;
  designation: string;
  largeur: number;
  hauteur: number;
  surface: number;
  quantity: number;
  surfaceImpactee: "mur" | "plafond" | "sol";
  estDeduction: boolean;
  impactePlinthe: boolean;
  description?: string;
  commentaire?: string;
}

export interface TypeAutreSurface {
  id: string;
  nom: string;
  label: string;
  description: string;
  defaultUnit: string;
  estSurfacePlane: boolean;
  surfaceImpacteeParDefaut?: "mur" | "plafond" | "sol";
  estDeduction?: boolean;
  impactePlinthe?: boolean;
  largeur?: number;
  hauteur?: number;
}

export interface AutresSurfacesState {
  typesAutresSurfaces: TypeAutreSurface[];
}
