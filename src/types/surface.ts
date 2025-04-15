
export interface AutreSurface {
  id: string;
  roomId: string;
  typeId: string;
  nom: string;
  longueur: number;
  largeur: number;
  hauteur?: number;
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
}

export interface AutresSurfacesState {
  typesAutresSurfaces: TypeAutreSurface[];
}
