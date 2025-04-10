
// Types pour les pièces et leurs composants

// Pièce à rénover
export interface Room {
  id: string;
  name: string;
  customName?: string;
  type: string;
  width: number;
  length: number;
  height: number;
  surface: number;
  plinthHeight: number;
  typeSol?: string;
  typeMur?: string;
  menuiseries: Menuiserie[];
  autresSurfaces: AutreSurface[];
  
  // Valeurs calculées
  wallSurfaceRaw: number;
  totalPlinthLength: number;
  totalPlinthSurface: number;
  
  // Surfaces d'impact
  menuiseriesMursSurface: number;
  menuiseriesPlafondSurface: number;
  menuiseriesSolSurface: number;
  autresSurfacesMurs: number;
  autresSurfacesPlafond: number;
  autresSurfacesSol: number;
  
  // Surfaces nettes calculées
  netWallSurface: number;
  surfaceNetteMurs: number;
  surfaceNetteSol: number;
  surfaceNettePlafond: number;
  surfaceBruteSol: number;
  surfaceBrutePlafond: number;
  surfaceBruteMurs: number;
  surfaceMenuiseries: number;
  totalMenuiserieSurface: number;
  
  // Linéaires
  lineaireBrut?: number;
  lineaireNet?: number;
}

// Import des types nécessaires pour éviter les références circulaires
import { Menuiserie } from './menuiserie';
import { AutreSurface } from './surface';

// Type de pièce pour la compatibilité avec les composants
export type Piece = Room;
