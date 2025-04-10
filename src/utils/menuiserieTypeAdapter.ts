
import { TypeMenuiserie } from '@/types';
import { MenuiserieType, SurfaceImpactee } from '@/types/supabase';
import { convertDbSurfaceToFrontend, surfaceTypeToDb } from './surfaceTypesAdapter';

/**
 * Converts a MenuiserieType from Supabase to a TypeMenuiserie for the frontend
 */
export function convertToTypeMenuiserie(menuiserieType: MenuiserieType): TypeMenuiserie {
  return {
    id: menuiserieType.id,
    nom: menuiserieType.name,
    description: menuiserieType.description || '',
    hauteur: menuiserieType.hauteur,
    largeur: menuiserieType.largeur,
    surfaceReference: convertDbSurfaceToFrontend(menuiserieType.surface_impactee),
    impactePlinthe: menuiserieType.impacte_plinthe
  };
}

/**
 * Converts a TypeMenuiserie from the frontend to a MenuiserieType for Supabase
 */
export function convertToMenuiserieType(type: Omit<TypeMenuiserie, 'id'>, id?: string): Partial<MenuiserieType> {
  return {
    id: id,
    name: type.nom,
    description: type.description,
    hauteur: type.hauteur,
    largeur: type.largeur,
    surface_impactee: surfaceTypeToDb(type.surfaceReference) as SurfaceImpactee,
    impacte_plinthe: type.impactePlinthe
  };
}

/**
 * Converts an array of MenuiserieType from Supabase to an array of TypeMenuiserie for the frontend
 */
export function convertMenuiserieTypeArray(types: MenuiserieType[]): TypeMenuiserie[] {
  return types.map(convertToTypeMenuiserie);
}
